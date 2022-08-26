

import UI from "./ui.js";
import LM from "./lm.js";


let APP = {};
window.APP = APP;

APP.UI = UI;
APP.LM = LM;

APP.pathConf    = "config/config.json";
APP.pathContent = "content/";

APP.cdata = undefined;

APP.postfixIR = "-ir.jpg";
APP._bLensMatSet = false;
APP.irValue = 0; // 0.0 - 1.0
APP.LRAD_MIN = 0.005;

APP.currVolume = undefined;
APP.currPose   = undefined;

APP.currMat = undefined;

APP._bSqueezeHandR = false;
APP._bSqueezeHandL = false;

APP.trackingFreq  = 0.1;
APP.bHandTracking = false;

APP.sDB = {};
APP.gsheetID = '1zRS2Dy-p-1G9_7STZFVd4rUs0KwZ34T4L_pFk4wO2Bc';


APP.init = ()=>{
    ATON.FE.realize();
    ATON.FE.addBasicLoaderEvents();

    APP.argV   = ATON.FE.urlParams.get('v');
    APP.argP   = ATON.FE.urlParams.get('p');
    APP.argUIP = ATON.FE.urlParams.get('uip');

    APP.setupEvents();

    APP.UI.init();
    ATON.SUI.showSelector(false);

    APP.loadConfig(APP.pathConf);

    ATON.addUpdateRoutine( APP.update );

    //if (APP.bHandTracking && !ATON.device.isMobile) APP.setupTracking();
    
    APP.LM.setup();

    APP._tPoint = -1.0;
    APP._reqPointCoords  = [0,0];
    APP._prevPointCoords = [0,0];

    ATON.Nav.setHomePOV( new ATON.POV().setPosition(0,0.4,0.4).setTarget(0,0,0) );

    // Lens Mat
    APP.matLens = new THREE.ShaderMaterial({
        //uniforms: APP.uniforms,
        uniforms: {
            tBase: { type:'t' /*, value: 0*/ },
            tIR: { type:'t' /*, value: 0*/ },
            tAO: { type:'t' },
            wIR: { type:'vec3', value: new THREE.Vector3(0,1,0) },
            vLens: { type:'vec4', value: new THREE.Vector4(0,0,0, 0.2) },
            time: { type:'float', value: 0.0 },
        },

        vertexShader: ATON.MatHub.getDefVertexShader(),

        fragmentShader:`
            varying vec3 vPositionW;
            varying vec2 vUv;

            uniform vec4 vLens;

            uniform float time;
            uniform sampler2D tBase;
            uniform sampler2D tIR;
            uniform sampler2D tAO;
            uniform vec3 wIR;
            //uniform sampler2D tHeight;

		    void main(){
                float sedge = 6.0f;

                float d = distance(vPositionW, vLens.xyz);
                float t = d / vLens.w;

                t -= (1.0f - (1.0f/sedge));
                t *= sedge;

                t = clamp(t, 0.0,1.0);

                vec4 frag = texture2D(tBase, vUv);
                vec4 ir   = texture2D(tIR, vUv);
                vec4 ao   = texture2D(tAO, vUv);

                float vir = (wIR.x * ir.r) + (wIR.y * ir.g) + (wIR.z * ir.b);

                frag = mix( vec4(vir,vir,vir, 1.0), frag, t);

                //frag *= ao;

                gl_FragColor = frag;
		    }
        `
    });
};

APP.postPoseLoaded = ()=>{
	APP.gStand = ATON.createSceneNode("stand");
	APP.gStand.attachToRoot();

    let base = window.location.href.split('?')[0];

    APP.gStand.load(base + "content/3D/Leggio.gltf");
    //APP.gStand.disablePicking();

    ATON.setBackgroundColor( ATON.MatHub.colors.black );

    ATON.FX.togglePass(ATON.FX.PASS_AO, true);
/*
    ATON.FX.togglePass(ATON.FX.PASS_BLOOM, true);
    ATON.FX.setBloomThreshold(0.2);
    ATON.FX.setBloomStrength(0.25);
*/
    APP._vLight = new THREE.Vector3(0,-1,0);
    ATON.setMainLightDirection(APP._vLight);
};

APP.loadAndParseSheet = ()=>{
    if (APP.currPose === undefined) return;
    
    APP.sDB[APP.currPose] = {};

    if (APP.gsheetParser === undefined) APP.gsheetParser = new PublicGoogleSheetsParser();

    let pobj = APP.sDB[APP.currPose];

    APP.gsheetParser.parse( APP.gsheetID /*, APP.currPose*/ ).then((items) => {

        console.log(items)

        // rewrite DB entries
        for (let e in items){
            const row = items[e];
            const sid = row.ID;
            if (sid !== undefined){
                if (pobj[sid] === undefined) pobj[sid] = {};
                for (let f in row) if (f !== "ID") pobj[sid][f] = row[f];
            }
        }

        console.log(APP.sDB)
    });
};

APP.setupTracking = ()=>{
    APP._trackModel = undefined;

    const defaultParams = {
        flipHorizontal: true,
        //outputStride: 16,
        imageScaleFactor: 0.5,
        maxNumBoxes: 2,
        iouThreshold: 0.5,
        scoreThreshold: 0.8,
        modelType: "ssd320fpnlite",
        modelSize: "small",
        basePath: "vendors/model/",
        //bboxLineWidth: "2",
        //fontSize: 17,
    };

    handTrack.load(defaultParams).then((model)=>{
        console.log("Tracking model loaded");

        APP._trackVidEl = document.getElementById('idVidTrack');
        handTrack.startVideo( APP._trackVidEl );

        APP._trackModel = model;

        APP._trackVidEl.addEventListener('loadeddata', (event) => {
            window.setInterval(()=>{
                //if (APP._trackModel === undefined) return;
            
                //console.log(APP._trackModel)
            
                APP._trackModel.detect(APP._trackVidEl).then((preds)=>{
                    for (let p in preds){
                        const P = preds[p];
                        if (P.class === 2 && P.label === "closed"){
                            //console.log(P)
                            let x = P.bbox[0] / APP._trackVidEl.width;
                            let y = 1.0 - (P.bbox[1] / APP._trackVidEl.height);

                            x -= 0.5;
                            y -= 0.5;
        
                            APP.requestScreenPointer(x * 2.0, y * 2.0);
        
                            //console.log(x,y)
                        }
                    }
                });
        
            }, APP.trackingFreq * 1000.0);
        });
    });
};

// Config
APP.loadConfig = (path)=>{
    return $.getJSON( path, ( data )=>{
        //console.log(data);
        console.log("Loaded config: "+path);

        APP.cdata = data;

        ATON.fireEvent("APP_ConfigLoaded");
    });
};

// If pose p is not defined/valid, open first available pose
APP.loadVolumePose = (v,p)=>{
    if (!v) return;
    if (APP.cdata === undefined) return;

    ATON.SceneHub.clear();
    APP._bLensMatSet = false;

    let vol = APP.cdata.volumes[v];
    if (vol === undefined) return;

    let sid = undefined;
    if (!p) p = Object.keys(vol)[0];
    sid = vol[p];

    if (sid === undefined) return;

    APP.currVolume = v;
    APP.currPose   = p;

    $("#idVolume").html(v);
    $("#idPose").html(p);

    //ATON.SceneHub.clear();

    ATON.FE.loadSceneID( sid );

    //APP.loadAndParseSheet();
};

APP.getNextPose = ()=>{
    let vol = APP.cdata.volumes[APP.currVolume];

    let A = Object.keys(vol);
    let i = A.indexOf(APP.currPose);

    i = (i+1) % A.length;

    return A[i];
};

APP.loadNextPose = ()=>{
    APP.loadVolumePose(APP.currVolume, APP.getNextPose());
};

// IR Lensing
APP.setupLensing2 = ()=>{
    let main = ATON.getSceneNode("main");
    if (main === undefined) return;

    main.traverse( ( o ) => {
		if (o.material && o.material.map){
			let tex  = o.material.map;
			let name = tex.name;

            console.log(name)
        }
    });
};

APP.setupLensing = ()=>{
    let D = ATON.SceneHub.currData;
    if (D === undefined) return;

    let urlGLTF = D.scenegraph.nodes.main.urls[0];
    if (urlGLTF === undefined) return;

    let base = ATON.Utils.removeFileExtension(urlGLTF);
    console.log(base)

    let urlBase = ATON.PATH_COLLECTION + base + ".jpg";
    let urlIR   = ATON.PATH_COLLECTION + base + APP.postfixIR;
    let urlAO   = ATON.PATH_COLLECTION + base + "-ao.jpg";

    APP.currMat = APP.matLens.clone();
    //APP.currMat.uniforms.tAO.value = new THREE.Vector4(1,0,0, 0);

    ATON.Utils.textureLoader.load(urlBase, (tex)=>{
        tex.flipY = false;
        APP.currMat.uniforms.tBase.value = tex;
    });

    ATON.Utils.textureLoader.load(urlIR, (tex)=>{
        tex.flipY = false;
        //APP.matLens.needsUpdate = true;
        APP.currMat.uniforms.tIR.value  = tex;
    });
/*
    ATON.Utils.textureLoader.load(urlAO, (tex)=>{
        tex.flipY = false;
        APP.currMat.uniforms.tAO.value = tex;
    },
    undefined,
    (err)=>{
        APP.currMat.uniforms.tAO.value = ATON.MatHub.colors.red;
        console.log(err)
    });
*/
    let main = ATON.getSceneNode("main");
    if (main === undefined) return;

    main.setMaterial( APP.currMat );

    console.log("Setup lens done")
    APP._bLensMatSet = true;
};

// 0.0 - 1.0
APP.setIRvalue = (v)=>{
    if (v < 0.0) v = 0.0;
    if (v > 1.0) v = 1.0;

    APP.irValue = v;
    $("#idIRcontrol").val(APP.irValue);

    if (!APP.currMat) return;

    // extremes
    if (v <= 0.0){
        APP.currMat.uniforms.wIR.value.set(1,0,0);
        return;
    }
    if (v >= 1.0){
        APP.currMat.uniforms.wIR.value.set(0,0,1);
        return;
    }

    // intermediate interpolation
    if (v <= 0.5){
        let a = v/0.5;
        let b = 1.0 - a;

        APP.currMat.uniforms.wIR.value.set(b,a,0);
    }
    else {
        let a = (v-0.5)/0.5;
        let b = 1.0 - a;

        APP.currMat.uniforms.wIR.value.set(0,b,a);
    }
};

APP.setLensRadius = (v)=>{
    ATON.SUI.setSelectorRadius(v);
};

APP.requestScreenPointer = (x,y)=>{
    APP._tPoint = ATON._clock.elapsedTime;

    APP._reqPointCoords  = [x,y];
    APP._prevPointCoords = [ATON._screenPointerCoords.x,ATON._screenPointerCoords.y];
};

APP.handleScreenPointer = ()=>{
    if (ATON.XR._bPresenting) return;
    if (APP._tPoint < 0.0) return;

    const t = (ATON._clock.elapsedTime - APP._tPoint) / APP.trackingFreq;

    if (t >= 1.0){
        ATON._screenPointerCoords.x = APP._reqPointCoords[0];
        ATON._screenPointerCoords.y = APP._reqPointCoords[1];
        APP._tPoint = -1.0;

        return;
    }

    ATON._screenPointerCoords.x = THREE.MathUtils.lerp(APP._prevPointCoords[0], APP._reqPointCoords[0], t);
    ATON._screenPointerCoords.y = THREE.MathUtils.lerp(APP._prevPointCoords[1], APP._reqPointCoords[1], t);
};

// Main update routine
APP.update = ()=>{
    //if (!APP._bLensMatSet) return;

    // Handle req screen pointer
    //APP.handleScreenPointer();

    let p = ATON.SUI.mainSelector.position;
/*
    if (APP.LM.bTrackingHand){

    }
    else {
        APP.uniforms.vLens.value.x = p.x;
        APP.uniforms.vLens.value.y = -p.y;
        APP.uniforms.vLens.value.z = -p.z;
    }
*/
/*
    APP.uniforms.vLens.value.x = p.x;
    APP.uniforms.vLens.value.y = p.y;
    APP.uniforms.vLens.value.z = p.z;

    if (ATON._queryDataScene) APP.uniforms.vLens.value.w = ATON.SUI._selectorRad;
    else if (APP.uniforms.vLens.value.w > APP.LRAD_MIN) APP.uniforms.vLens.value.w *= 0.9;
*/

    if (APP.currMat){
        APP.currMat.uniforms.vLens.value = p;

        if (ATON._queryDataScene) APP.currMat.uniforms.vLens.value.w = ATON.SUI._selectorRad;
        else if (APP.currMat.uniforms.vLens.value.w > APP.LRAD_MIN) APP.currMat.uniforms.vLens.value.w *= 0.9;
    }

    // VR
    if (!ATON.XR._bPresenting) return;

    //let a = ATON.XR.getAxisValue(ATON.XR.HAND_L);
    //APP.setIRvalue( APP.irValue + (a.y * 0.01) );
};

// Events
APP.setupEvents = ()=>{
    ATON.on("APP_ConfigLoaded", ()=>{
        APP.loadVolumePose( APP.argV, APP.argP );
    });

    ATON.on("SceneJSONLoaded",()=>{
        //APP.setupLensing();
        console.log("Pose loaded.");

        APP.postPoseLoaded();
    });

    ATON.on("AllNodeRequestsCompleted", ()=>{
        APP.setupLensing();

        APP.setLensRadius(APP.LRAD_MIN);
    });

    ATON.on("MouseWheel", (d)=>{

        if (ATON._kModCtrl){
            let v = APP.irValue;
            v -= (d * 0.0005);

            APP.setIRvalue( v );
            return;
        }

        if (ATON._kModShift){
            let r = ATON.SUI.mainSelector.scale.x;

            if (d > 0.0) r *= 0.9;
            else r /= 0.9;

            if (r < ATON.FE._selRanges[0]) r = ATON.FE._selRanges[0];
            if (r > ATON.FE._selRanges[1]) r = ATON.FE._selRanges[1];

            ATON.SUI.setSelectorRadius(r);
            return;
        }
    });

    // Keyboard
    ATON.on("KeyPress", (k)=>{
        // Modifiers
        if (k ==="Shift")  ATON.Nav.setUserControl(false);
        if (k==="Control") ATON.Nav.setUserControl(false);

        if (k==='ArrowRight') APP.loadNextPose();
        //if (k==='ArrowLeft') 
    });

    ATON.on("KeyUp",(k)=>{
        if (k==="Shift") ATON.Nav.setUserControl(true);
        if (k==="Control") ATON.Nav.setUserControl(true);
    });

    // Semantic
    ATON.clearEventHandlers("SemanticNodeHover");
    ATON.clearEventHandlers("SemanticNodeLeave");

    ATON.on("SemanticNodeHover", (semid)=>{
        let S = ATON.getSemanticNode(semid);
        if (S === undefined) return;

        APP.toggleHoverLabel(true, semid);

        S.highlight();
        //$('canvas').css({ cursor: 'crosshair' });

        if (ATON.SUI.gSemIcons) ATON.SUI.gSemIcons.hide();
    });
    ATON.on("SemanticNodeLeave", (semid)=>{
        let S = ATON.getSemanticNode(semid);
        if (S === undefined) return;

        APP.toggleHoverLabel(false);

        S.restoreDefaultMaterial();
        //$('canvas').css({ cursor: 'grab' });

        if (ATON.SUI.gSemIcons) ATON.SUI.gSemIcons.show();
    });

    ATON.on("Tap", (e)=>{
        if (ATON._hoveredSemNode) APP.UI.updateSemPanel(ATON._hoveredSemNode);
        else APP.UI.toggleSemPanel(false);
    });

    // XR
    ATON.clearEventHandlers("XRsqueezeStart");
    ATON.clearEventHandlers("XRsqueezeEnd");

    ATON.on("XRsqueezeStart", (c)=>{
        if (c === XR.HAND_R){
            APP._bSqueezeHandR = true;
        }
        else {
            APP._bSqueezeHandL = true;
        }
    });

    ATON.on("Login", (d)=>{
        console.log("Editor login");
        ATON.FE.uiLoadProfile("editor");
    });
    ATON.on("Logout", ()=>{
        console.log("Editor logout");
        ATON.FE.uiLoadProfile("public");
    });
};

APP.toggleHoverLabel = (b, semid)=>{
    if (!b){
        ATON.FE.hideSemLabel();
        ATON.FE._bSem = false;
        return;
    }

    let pobj = APP.sDB[APP.currPose];
    if (pobj === undefined) return;

    let S = pobj[semid];
    if (S === undefined) return;

    ATON.FE.showSemLabel(S.AREALE);
    ATON.FE._bSem = true;
};

// Editor routines
//==================================================
APP.addSemanticAnnotation = (semid, O, semtype)=>{
    if (semid === undefined) return;
    if (O === undefined) return;

    let S = undefined;

    if (semtype === ATON.FE.SEMSHAPE_SPHERE) S = ATON.SemFactory.createSurfaceSphere(semid);
    if (semtype === ATON.FE.SEMSHAPE_CONVEX) S = ATON.SemFactory.completeConvexShape(semid);
    if (S === undefined) return;

    ATON.getRootSemantics().add(S);

    let E = {};

    E.sem = {};
    E.sem[semid] = O;

    E.semanticgraph = {};
    E.semanticgraph.nodes = {};
    E.semanticgraph.nodes[semid] = {};

    if (semtype === ATON.FE.SEMSHAPE_SPHERE) E.semanticgraph.nodes[semid].spheres = ATON.SceneHub.getJSONsemanticSpheresList(semid);
    if (semtype === ATON.FE.SEMSHAPE_CONVEX) E.semanticgraph.nodes[semid].convexshapes = ATON.SceneHub.getJSONsemanticConvexShapes(semid);

    E.semanticgraph.edges = ATON.SceneHub.getJSONgraphEdges(ATON.NTYPES.SEM);

    ATON.SceneHub.sendEdit( E, ATON.SceneHub.MODE_ADD);
    console.log("Annotation "+semid+" added.");
};

APP.updateSemAnnotation = (semid, O)=>{
    if (semid === undefined) return;
    if (O === undefined) return;

    let E = {};

    E.sem = {};
    E.sem[semid] = O;

    ATON.SceneHub.sendEdit( E, ATON.SceneHub.MODE_ADD);
    console.log("Annotation "+semid+" updated.");
};

APP.deleteSemAnnotation = (semid)=>{
    if (ATON.SemFactory.deleteSemanticNode(semid)){

        let E = {};
        E.semanticgraph = {};
        E.semanticgraph.nodes = {};
        E.semanticgraph.nodes[semid] = {};

        E.sem = {};
        E.sem[semid] = {};

        //console.log(E);

        ATON.SceneHub.sendEdit( E, ATON.SceneHub.MODE_DEL);
        console.log("Annotation "+semid+" deleted.");
    }
};

// run
window.onload = ()=>{
    APP.init();
};