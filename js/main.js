
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
APP.irValue  = 0; // 0.0 - 1.0
APP.LRAD_MIN = 0.0; //0.005;

APP._vLight = new THREE.Vector3(0,-1,0);

APP.currVolume = undefined;
APP.currPose   = 0;

APP.currMat = undefined;

// App states
APP.STATE_NAV       = 0;
APP.STATE_MEASURE   = 1;
APP.STATE_ANN_BASIC = 2;
APP.STATE_ANN_FREE  = 3;

APP.state = APP.STATE_NAV;

// Layers
APP.LAYER_RGB = 0;
APP.LAYER_IR1 = 1;
APP.LAYER_IR2 = 2;
APP.LAYER_IR3 = 3;

APP.currLayer = APP.LAYER_RGB

// Categories
APP.filterCat = undefined;

APP.cats = [
    "Iconologia e Iconografia",
    "Struttura",
    "Conservazione e Restauro",
    "Testo e Scrittura",
    "Materiali e Tecniche Esecutive",
    "Censure",
    "Notazioni Musicali"
];

APP.catsColors = [
    "#BF2517",
    "#2F4689",
    "#D9A441",
    "#E7F0F9",
    "#422C20",
    "#FF7F11",
    "#79B857"
];


APP.init = ()=>{
    ATON.FE.realize();
    //ATON.FE.addBasicLoaderEvents();

    APP.argV   = ATON.FE.urlParams.get('v');
    APP.argP   = ATON.FE.urlParams.get('p');
    APP.argUIP = ATON.FE.urlParams.get('uip');

    APP._bPose   = false;
    APP._bAssets = false;

    APP.pathContent = window.location.href.split('?')[0];
    APP.pathContent += "content/";

    APP.plight = undefined;
    APP._bLens = true;

    //ATON.SUI.enableSemIcons();

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

/*
    APP.gStand = ATON.createSceneNode("stand");
    APP.gStand.attachToRoot();
    
    APP.gStand.load(APP.pathContent + "3D/Leggio.gltf");
    //APP.gStand.disablePicking();
*/

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

    // For cached poses
    /*if (ATON._numReqLoad <= 0)*/ APP.mat.setupOnLoaded();
    APP.semVisitor();

    APP.setLayer(APP.LAYER_RGB);
};

APP.setState = (s)=>{
    APP.state = s;
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
    ATON.SUI.clearMeasurements();

    ATON.FE.loadSceneID( sid );

    //APP.loadAndParseSheet();
    APP.updatePoseGallery(v);
};

APP.updatePoseGallery = (v)=>{
    if (!APP.cdata) return;
    $("#idPoseGallery").html("");
    
    let vol = APP.cdata.volumes[v];
    if (!vol) return;

    for (let p in vol.poses){
        let P = vol.poses[p];
        let sid = v + "-p"+p;

        //console.log(sid)

        $("#idPoseGallery").append("<div class='posesContainer'><img class='poseIMG' src='"+ATON.PATH_RESTAPI+"cover/codex4d/"+sid+"' onclick='APP.loadPose("+p+")'><br>"+P.title+"</div>");
    }
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

APP.loadPose = (p)=>{
    if (p === APP.currPose) return;

    APP.loadVolumePose(APP.currVolume, p);
};

APP.loadNextPose = ()=>{
    APP.loadPose( APP.getNextPose() );
};

// IR Lens
//==============================
APP.enableLens = ()=>{
    APP._bLens = true;
    if (APP.currMat) APP.currMat.uniforms.wLens.value = 1.0;
};

APP.disableLens = ()=>{
    APP._bLens = false;
    //if (APP.currMat) APP.currMat.uniforms.vLens.value.w = 0.0;
    if (APP.currMat) APP.currMat.uniforms.wLens.value = 0.0;

    APP.currLayer = APP.LAYER_RGB;
};

APP.invertIR = ()=>{
    if (!APP.currMat) return;

    let v = APP.currMat.uniforms.bInvIR.value;

    if (v > 0.0) APP.currMat.uniforms.bInvIR.value = 0.0;
    else APP.currMat.uniforms.bInvIR.value = 1.0;
};

// 0.0 - 1.0
APP.setIRvalue = (v)=>{
    if (APP.currMat === undefined) return;

    if (v < 0.0) v = 0.0;
    if (v > 1.0) v = 1.0;

    APP.irValue = v;
    $("#idIRcontrol").val(APP.irValue);

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

// Set current APP layer 
APP.setLayer = (L)=>{
    APP.UI.setLayer(L);

    if (L === APP.LAYER_RGB){
        APP.disableLens();
        return;
    }

    APP.enableLens();
    
    if (L === APP.LAYER_IR1) APP.setIRvalue( 0.0 );
    if (L === APP.LAYER_IR2) APP.setIRvalue( 0.5 );
    if (L === APP.LAYER_IR3) APP.setIRvalue( 1.0 );
    
    APP.currLayer = L;
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

/*
    if (APP._bPose && APP._bAssets){
        APP.mat.setupOnLoaded();
        APP.semVisitor();

        APP.postPoseLoaded();

        APP._bPose   = false;
        APP._bAssets = false;
        console.log("x")
    }
*/

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

// Attach UI routines
APP._attachUI = ()=>{
    $("#idFull").click(()=>{
        ATON.toggleFullScreen();
    });
    $("#idReset").click(()=>{
        ATON.Nav.requestHomePOV();
    });

    $("#idSize").click(()=>{
        console.log("xx")

        if (APP.state !== APP.STATE_MEASURE) APP.setState(APP.STATE_MEASURE);
        else {
            ATON.SUI.clearMeasurements();
            APP.setState(APP.STATE_NAV);
        }
    });

    $("#idSliderLens").on("input change",()=>{
        let r = parseFloat( $("#idSliderLens").val() )
        
        APP.setLensRadius(r * 0.002);
    });

    // Layers
    $("#idRgb").click(()=>{
        APP.setLayer(APP.LAYER_RGB);
    });
    $("#idIr1").click(()=>{
        APP.setLayer(APP.LAYER_IR1);
    });
    $("#idIr2").click(()=>{
        APP.setLayer(APP.LAYER_IR2);
    });
    $("#idIr3").click(()=>{
        APP.setLayer(APP.LAYER_IR3);
    });

    // Editor
    $("#idLogin").click(()=>{
        ATON.FE.popupUser();
    });

    $("#sphere").click(()=>{
        APP.setState(APP.STATE_ANN_BASIC);
    });
};

// Events
APP.setupEvents = ()=>{
    ATON.on("APP_ConfigLoaded", ()=>{
        APP.UI.init();

        APP.loadVolumePose( APP.argV, APP.argP );

        // Attach UI events
        APP._attachUI();

        ATON.checkAuth((r)=>{
            APP.setProfileEditor();
            $("#idLoginActionText").html(r.username);
        }, undefined);
    });

    ATON.on("Logout",()=>{
        APP.setProfilePublic();
        //APP.updatePoseGallery(APP.currVolume);
        $("#idLoginActionText").html("Login");
        APP._attachUI();
    });

    ATON.on("Login",(r)=>{
        APP.setProfileEditor();
        //APP.updatePoseGallery(APP.currVolume);
        $("#idLoginActionText").html(r.username);
        APP._attachUI();
    });

    ATON.on("Tap",(e)=>{
        if (APP.state === APP.STATE_MEASURE){
            let M = APP.measure();

            //if (!M) return;
            //APP.setState(APP.STATE_NAV);
            return;
        }

        if (APP.state === APP.STATE_ANN_BASIC){
            APP.setState(APP.STATE_NAV);

            $("#idForm").show();
            APP.UI.addAnnotation(ATON.FE.SEMSHAPE_SPHERE);
            return;
        }
    });

    ATON.on("SceneJSONLoaded",()=>{
        console.log("Pose loaded.");

        APP._bPose = true;
        APP.postPoseLoaded();
    });

    ATON.on("AllNodeRequestsCompleted", ()=>{
        //APP.UI.init();

        APP._bAssets = true;

        APP.mat.setupOnLoaded();
        APP.semVisitor();
/*
        APP.gBook.traverse( c => {
            if ( c.isMesh ){
                c.castShadow    = true;
                c.receiveShadow = true;
            }
        });
*/

        APP.setLensRadius(0.02);
        APP.setLayer(APP.LAYER_RGB);
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

            if (r < 0.0005) r = 0.0005;
            if (r > ATON.FE._selRanges[1]) r = ATON.FE._selRanges[1];

            ATON.SUI.setSelectorRadius(r);
            return;
        }
    });

    // Keyboard
    ATON.on("KeyPress", (k)=>{
        if ($("#idForm").is(":visible")) return;

        // Modifiers
        if (k ==="Shift")  ATON.Nav.setUserControl(false);
        if (k==="Control") ATON.Nav.setUserControl(false);

        if (k==='ArrowRight') APP.loadNextPose();
        //if (k==='ArrowLeft') 

        // Basic annotation
        if (k==='a'){
            if (!ATON.SceneHub._bEdit) return;

            $("#idForm").show();
            APP.UI.addAnnotation(ATON.FE.SEMSHAPE_SPHERE);
        }
        // TODO: Convex annotation + ENTER to finalize
        if (k==='s'){
            if (!ATON.SceneHub._bEdit) return;

            ATON.SemFactory.addSurfaceConvexPoint();
            //console.log(ATON.SemFactory.convexPoints)
        }
        if (k === 'Enter')  APP.finalizeSemanticShape();

        if (k === 'Escape') APP.cancelCurrentTask();
        if (k === 'Delete') APP.deleteSemAnnotation(ATON._hoveredSemNode);

        if (k==='r'){
            if (APP.gBook) APP.gBook.rotation.x += 0.1;
            console.log(APP.gBook);
        }

        if (k==='0') APP.setLayer(APP.LAYER_RGB);
        if (k==='1') APP.setLayer(APP.LAYER_IR1);
        if (k==='2') APP.setLayer(APP.LAYER_IR2);
        if (k==='3') APP.setLayer(APP.LAYER_IR3);

        if (k==='i') APP.invertIR();
    });

    ATON.on("KeyUp",(k)=>{
        if ($("#idForm").is(":visible")) return;

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
};

// Profiles
APP.setProfilePublic = ()=>{
    ATON.SceneHub.setEditMode(false);
    //ATON.FE.uiLoadProfile("public");
    APP.UI.buildPublic();

    ATON.SUI.showSelector(false);

    //APP._attachUI();
    APP.updatePoseGallery(APP.currVolume);
};

APP.setProfileEditor = ()=>{
    ATON.SceneHub.setEditMode(true);
    //ATON.FE.uiLoadProfile("editor");
    APP.UI.buildEditor();

    ATON.SUI.showSelector(true);

    //APP._attachUI();
    APP.updatePoseGallery(APP.currVolume);
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

// Tools
//=============================================
APP.measure = ()=>{
    let P = ATON.getSceneQueriedPoint();
    let M = ATON.SUI.addMeasurementPoint( P );

    console.log(M);
    return M;
};

// Editor routines
//==================================================
APP.cancelCurrentTask = ()=>{
    if (ATON.SemFactory.isBuildingShape()){
        ATON.SemFactory.stopCurrentConvex();
    }
};

APP.finalizeSemanticShape = ()=>{
    if (ATON.SemFactory.isBuildingShape()){
        $("#idForm").show();
        APP.UI.addAnnotation(ATON.FE.SEMSHAPE_CONVEX);
    }
};

APP.addSemanticAnnotation = (semid, O, semtype)=>{
    if (semid === undefined) return;
    if (O === undefined) return;

    let S = undefined;

    if (semtype === ATON.FE.SEMSHAPE_SPHERE) S = ATON.SemFactory.createSurfaceSphere(semid);
    if (semtype === ATON.FE.SEMSHAPE_CONVEX) S = ATON.SemFactory.completeConvexShape(semid);
    if (S === undefined) return;

    ATON.getRootSemantics().add(S);

    let pDB = ATON.SceneHub.currData.sem;
    if (pDB && O && O.cat){
        let M = APP.mat.sems[O.cat];

        S.setDefaultAndHighlightMaterials(M.base, M.hl);
        S.setMaterial(M.base);
    }

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

    APP.semVisitor();
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
    if (semid === undefined) return;

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

    APP.UI.toggleSemPanel(false);
};

APP.getCatName = (i)=>{
    if (!APP.cdata) return;

    return APP.cdata.categories[i].name;
};

APP.filterAnnotationsByCat = (cat)=>{
    let pDB = ATON.SceneHub.currData.sem;

    if (cat === undefined) cat = APP.filterCat;
    else APP.filterCat = cat;

    for (let s in ATON.semnodes){
        if (s!==ATON.ROOT_NID){
            let S = ATON.semnodes[s];
            let e = pDB[s];
            
            if (e !== undefined){
                if (e.cat !== cat) S.hide();
                else S.show();
            }
        }
    }
};

APP.semVisitor = ()=>{
    let pDB = ATON.SceneHub.currData.sem;

    if (!pDB) return;

    for (let s in ATON.semnodes){
        if (s!==ATON.ROOT_NID){
            let S = ATON.semnodes[s];
            let e = pDB[s];

            if (S && e){
                let M = mat.sems[e.cat];
                if (M){
                    S.setDefaultAndHighlightMaterials(M.base, M.hl);
                    S.setMaterial(M.base);
                }

                //console.log("x");
            }
        }
    }
};



// run
window.onload = ()=>{
    APP.init();
};