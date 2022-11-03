
import mat from "./material.js";
import UI from "./ui.js";
import LM from "./lm.js";


let APP = {};
window.APP = APP;

APP.UI  = UI;
APP.LM  = LM;
APP.mat = mat;

APP.pathConf    = "config/config.json";
APP.pathContent = "content/";

APP.cdata = undefined;

APP.postfixIR = "-ir.jpg";
APP._bLensMatSet = false;
APP.irValue = 0; // 0.0 - 1.0
APP.LRAD_MIN = 0.005;

APP._vLight = new THREE.Vector3(0,-1,0);

APP.currVolume = undefined;
APP.currPose   = 0;

APP.currMat = undefined;


APP.init = ()=>{
    ATON.FE.realize();
    //ATON.FE.addBasicLoaderEvents();

    APP.argV   = ATON.FE.urlParams.get('v');
    APP.argP   = ATON.FE.urlParams.get('p');
    APP.argUIP = ATON.FE.urlParams.get('uip');


    APP.pathContent = window.location.href.split('?')[0];
    APP.pathContent += "content/";

    APP.plight = undefined;
    APP._bLens = true;

/*
    APP.UI.init();
    ATON.SUI.showSelector(false);

    APP.setupEvents();
*/
    APP.setupEvents();

    APP.loadConfig(APP.pathConf);

    ATON.addUpdateRoutine( APP.update );
    
    //APP.LM.setup();

    APP._tPoint = -1.0;
    APP._reqPointCoords  = [0,0];
    APP._prevPointCoords = [0,0];

    ATON.Nav.setHomePOV( new ATON.POV().setPosition(0,0.4,0.4).setTarget(0,0,0) );
    ATON.Nav.requestHome( 0.5 );

    APP.defLightPos = new THREE.Vector3(0, 0.5, 0);

    // Manuscript material
    APP.mat.init();
};

APP.postPoseLoaded = ()=>{

    APP.bgcol = new THREE.Color(APP.cdata.bgcolor[0],APP.cdata.bgcolor[1],APP.cdata.bgcolor[2]);
    ATON.setBackgroundColor( APP.bgcol );

    APP.gStand = ATON.createSceneNode("stand");
    APP.gStand.attachToRoot();
    
    APP.gStand.load(APP.pathContent + "3D/Leggio.gltf");
    //APP.gStand.disablePicking();

    // Ground
/*
    APP.gGround = ATON.createSceneNode("ground");
    let ground = new THREE.Mesh(
        new THREE.PlaneGeometry( 2,2 ),
        new THREE.MeshStandardMaterial({
            //color: ATON.MatHub.colors.black, // APP.bgcol,
            map: ATON.Utils.textureLoader.load(APP.pathContent + "ground.jpg"),
            blending: THREE.AdditiveBlending
        })
    );

    ground.rotation.set(-1.57079632679,0,0);
    ground.position.set(0,-1.2,0);

    APP.gGround.add(ground);
    APP.gGround.attachToRoot();
    //APP.gGround.disablePicking();
*/

    APP.gBook = ATON.getSceneNode("main");

    //ATON.FX.togglePass(ATON.FX.PASS_AO, true);

    //ATON.FX.togglePass(ATON.FX.PASS_BLOOM, true);
    //ATON.FX.setBloomThreshold(0.2);
    //ATON.FX.setBloomStrength(0.25);

    //APP.setLightDirection(APP._vLight);

    if (!APP.plight){
        APP.plight = new THREE.PointLight();
        ATON._rootVisibleGlobal.add(APP.plight);

/*
        ATON._renderer.physicallyCorrectLights = true;
        ATON.setExposure(3.0);

        ///APP.plight.intensity = 1.0; // candela (cd)
        APP.plight.power     = 4.0; // lumens
        APP.plight.decay     = 1.0;
*/
        // std
        APP.plight.intensity = 1.3;
        APP.plight.distance  = 2.5;
        APP.plight.decay     = 2.0;

/*
        APP.plight.castShadow            = true;
        //APP.plight.shadow.bias           = -0.005;
        APP.plight.shadow.mapSize.width  = 2048;
        APP.plight.shadow.mapSize.height = 2048;
        APP.plight.shadow.camera.near    = 0.02;
        APP.plight.shadow.camera.far     = 1.5;
        ATON._renderer.shadowMap.enabled = true;
        ATON._renderer.shadowMap.type    = THREE.BasicShadowMap;
        //ATON._renderer.shadowMap.type    = THREE.PCFShadowMap;
*/

        APP.matSpriteL = new THREE.SpriteMaterial({ 
            map: new THREE.TextureLoader().load( APP.pathContent + "plight.jpg" ), 
            //color: ATON.MatHub.colors.orange,
            transparent: true,
            opacity: 1.0,
            depthWrite: false, 
            //depthTest: false
            blending: THREE.AdditiveBlending
        });
    
        APP.spriteL = new THREE.Sprite( APP.matSpriteL );
        APP.spriteL.scale.set(0.05,0.05,0.05);

        ATON.getRootUI().add(APP.spriteL);
    }

    ATON.setNeutralAmbientLight(0.3);
    
    APP.setLightPostion(APP.defLightPos);
    
    //ATON.toggleShadows(true);
};

APP.setLightPostion = (p)=>{
    APP.plight.position.copy(p);
    APP.spriteL.position.copy(p);
};

APP.setLightDirection = (v)=>{
    ATON.setMainLightDirection(APP._vLight);
    if (APP.currMat) APP.currMat.uniforms.uLD.value = APP._vLight;

    //ATON._dMainL.intensity = 1.2;
    ATON.setNeutralAmbientLight(0.3);
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
    if (!v) v = Object.keys(APP.cdata.volumes)[0];
    if (APP.cdata === undefined) return;

    ATON.SceneHub.clear();
    APP._bLensMatSet = false;

    let vol = APP.cdata.volumes[v];
    if (vol === undefined) return;

    let sid = undefined;

    if (p === undefined || p === null) p = 0;

    let pose = vol.poses[p];

    sid = "codex4d/"+ v + "-p"+p; //pose.sid;

    //if (!p) p = Object.keys(vol)[0];
    //sid = vol[p];

    if (sid === undefined) return;

    APP.currVolume = v;
    APP.currPose   = p;

    $("#idVolume").html(vol.title);
    $("#idPose").html(pose.title);

    //ATON.SceneHub.clear();

    ATON.FE.loadSceneID( sid );

    //APP.loadAndParseSheet();
};

APP.getNextPose = ()=>{
    let vol = APP.cdata.volumes[APP.currVolume];

    //let A = Object.keys(vol);
    //let i = A.indexOf(APP.currPose);
    //i = (i+1) % A.length;

    //return A[i];

    //console.log(APP.currPose)
    let nextp = (APP.currPose + 1) % vol.poses.length;
    //console.log(nextp)

    return nextp;
};

APP.loadNextPose = ()=>{
    APP.loadVolumePose(APP.currVolume, APP.getNextPose());
};

// IR Lens
//==============================
APP.enableLens = ()=>{
    APP._bLens = true;
};

APP.disableLens = ()=>{
    APP._bLens = false;
    if (APP.currMat) APP.currMat.uniforms.vLens.value.w = 0.0;
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
//===============================================
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

    if (APP.currMat && APP._bLens){
        APP.currMat.uniforms.vLens.value = p;

        if (ATON._queryDataScene) APP.currMat.uniforms.vLens.value.w = ATON.SUI._selectorRad;
        else if (APP.currMat.uniforms.vLens.value.w > APP.LRAD_MIN) APP.currMat.uniforms.vLens.value.w *= 0.9;
    }

    // VR
    if (!ATON.XR._bPresenting) return;

    let v = ATON.XR.getAxisValue(ATON.XR.HAND_R);
    let s = ATON.SUI._selectorRad;
    s += (v.y * 0.01);
    if (s > 0.001) ATON.SUI.setSelectorRadius(s);

    let a = ATON.XR.getAxisValue(ATON.XR.HAND_L);
    APP.setIRvalue( APP.irValue + (a.y * 0.01) );

    if (APP._bSqueezeHandL){
        APP.setLightPostion( ATON.XR.controller1pos );
    }
    
};

// Events
APP.setupEvents = ()=>{
    ATON.on("APP_ConfigLoaded", ()=>{
        APP.UI.init();
        ATON.SUI.showSelector(false);

        APP.loadVolumePose( APP.argV, APP.argP );
    });

    ATON.on("SceneJSONLoaded",()=>{
        console.log("Pose loaded.");

        APP.postPoseLoaded();
    });

    ATON.on("AllNodeRequestsCompleted", ()=>{
        //APP.UI.init();

        APP.mat.setupOnLoaded();

        APP.setLensRadius(APP.LRAD_MIN);
/*
        APP.gBook.traverse( c => {
            if ( c.isMesh ){
                c.castShadow    = true;
                c.receiveShadow = true;
            }
        });
*/

        // Persistent modifications
        if (ATON.FE.getCurrentUIP() === "editor") ATON.SceneHub.setEditMode(true);
        else ATON.SceneHub.setEditMode(false);
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

        if (k==='a'){
            APP.addSemanticAnnotation("test", { title: "test test" }, ATON.FE.SEMSHAPE_SPHERE);
        }

        if (k==='r'){
            if (APP.gBook) APP.gBook.rotation.x += 0.1;
            console.log(APP.gBook);
        }

        if (k==='1') APP.setIRvalue( 0.0 );
        if (k==='2') APP.setIRvalue( 0.5 );
        if (k==='3') APP.setIRvalue( 1.0 );
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
        if (ATON._hoveredSemNode){
            APP.UI.updateSemPanel(ATON._hoveredSemNode);
        }
        else {
            APP.UI.toggleSemPanel(false);
        }
    });

    // XR
    ATON.on("XRmode", (b)=>{
        if (b) ATON.setBackgroundColor( ATON.MatHub.colors.black );
        else ATON.setBackgroundColor( APP.bgcol );
    });

    ATON.clearEventHandlers("XRsqueezeStart");
    ATON.clearEventHandlers("XRsqueezeEnd");

    ATON.on("XRsqueezeStart", (c)=>{
        if (c === ATON.XR.HAND_R){
            APP._bSqueezeHandR = true;

            ATON.XR.controller0.add( APP.gBook );

            APP.gBook.setRotation(0.0,-0.9,1.7); // local book orient
            APP.disableLens();
        }
        else {
            APP._bSqueezeHandL = true;
            //APP.loadNextPose();
        }
    });
    ATON.on("XRsqueezeEnd", (c)=>{
        if (c === ATON.XR.HAND_R){
            APP._bSqueezeHandR = false;

            APP.gBook.attachToRoot();
            APP.gBook.setRotation(0,0,0); // reset book orient
            APP.enableLens();
        }
        else {
            APP._bSqueezeHandL = false;
            APP.setLightPostion(APP.defLightPos);
        }
    });

    ATON.on("Login", (d)=>{
        console.log("Editor login");
        APP.setProfileEditor();
    });
    ATON.on("Logout", ()=>{
        console.log("Editor logout");
        APP.setProfilePublic();
    });
};

// Profiles
APP.setProfilePublic = ()=>{
    ATON.SceneHub.setEditMode(false);
    ATON.FE.uiLoadProfile("public");
};

APP.setProfileEditor = ()=>{
    ATON.SceneHub.setEditMode(true);
    ATON.FE.uiLoadProfile("editor");
};

APP.toggleHoverLabel = (b, semid)=>{
    if (!b){
        ATON.FE.hideSemLabel();
        ATON.FE._bSem = false;
        return;
    }

    // FIXME:
/*
    let pobj = APP.sDB[APP.currPose];
    if (pobj === undefined) return;

    let S = pobj[semid];
    if (S === undefined) return;

    ATON.FE.showSemLabel(S.AREALE);
*/
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