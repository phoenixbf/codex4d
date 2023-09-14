
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
APP.STATE_LAYER_VISION = 4;


APP.state = APP.STATE_NAV;

// Layers
/*APP.LAYER_RGB = 0;
APP.LAYER_IR1 = 1;
APP.LAYER_IR2 = 2;
APP.LAYER_IR3 = 3;*/
APP.layers=[
    {
        id:0,
        name:"layer_rgb",
        title:"Layer RGB",
        default:true

    },
    {
        id:1,
        name:"layer_ir1",
        title:"Layer IR1",
        depth:0.0

    },
    {
        id:2,
        name:"layer_ir2",
        title:"Layer IR2",
        depth:0.5

    },
    {
        id:3,
        name:"layer_ir3",
        title:"Layer IR3",
        depth:1.0

    }

]
APP.layers.forEach((layer)=>{
    if(layer.default){
        APP.defaultLayer=layer.id
    }
})
APP.currLayer=APP.defaultLayer

// Categories
APP.filterCat = undefined;
APP.raggio_min=0.001
APP.raggio_max=0.15
APP.raggio_ann=0.02
APP.raggio_vision=0.02
APP.activedLens=true
APP.isBlack=false
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
    "#68C3D4",
    "#FF7F11",
    "#79B857"
];

function getDefaultLayer(){
    
    APP.layers.forEach((layer)=>{
        if(layer.default && layer.default==true){
            return layer.id
        }
    })
    
}

APP.init = ()=>{
    ATON.FE.realize();
    //ATON.FE.addBasicLoaderEvents();

    APP.argV   = ATON.FE.urlParams.get('v');
    APP.argP   = ATON.FE.urlParams.get('p');
    APP.argUIP = ATON.FE.urlParams.get('uip');
    
    APP.argBG=ATON.FE.urlParams.get('bg');
    
    APP.linkModelQuery= "https://codex4d.it/"

    if(APP.argV == "0000102297")
    {
        APP.linkModelQuery =  "https://codex4d.it/collezione/de-balneis/";
    }
    if(APP.argV == "0000102213")
    {
        
        APP.linkModelQuery = "https://codex4d.it/collezione/commedia/"
    }
    if(APP.argV == "0000042948")
    {
        
        APP.linkModelQuery = "https://codex4d.it/collezione/libro-dore/"
    }

   
    if(APP.linkModelQuery){
        $(".backTo").click(()=>{
            window.open(APP.linkModelQuery, '_blank')
        })
    }
    
    APP._bPose   = false;
    APP._bAssets = false;

    APP.pathContent = window.location.href.split('?')[0];
    APP.pathContent += "content/";

    APP.plight = undefined;
    APP._bLens = false;

    //ATON.SUI.enableSemIcons();

/*
    APP.UI.init();
    ATON.SUI.showSelector(false);

    APP.setupEvents();
*/
    APP.setupEvents();

    APP.loadConfig(APP.pathConf);

    ATON.addUpdateRoutine( APP.update );
    
    APP.LM.setup();

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
    APP.filterAnnotationsByCat([]);
    APP.bgcol = new THREE.Color(APP.cdata.bgcolor[0],APP.cdata.bgcolor[1],APP.cdata.bgcolor[2]);
   
    if(APP.argBG==0){
        $(".toHideFromCommand").hide()
        ATON.setBackgroundColor( ATON.MatHub.colors.black );
    }
    else{
        ATON.setBackgroundColor( APP.bgcol );
    }


    APP.gBook = ATON.getSceneNode("main");

    if (!APP.plight){
        APP.plight = new THREE.PointLight();
        ATON._rootVisibleGlobal.add(APP.plight);
        APP.plight.intensity = 2.0;
        APP.plight.distance  = 3.0; //2.5;
        APP.plight.decay     = 0.3;
        APP.plight.color     = new THREE.Color(APP.cdata.lightcolor[0],APP.cdata.lightcolor[1],APP.cdata.lightcolor[2]);



        APP.matSpriteL = new THREE.SpriteMaterial({ 
            map: new THREE.TextureLoader().load( APP.pathContent + "plight.jpg" ), 
            color: APP.plight.color,
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

    APP.setLayer(APP.defaultLayer);
    
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

        console.log("DATA", data);

        ATON.fireEvent("APP_ConfigLoaded");
        
    });
};
APP.loadMedia = (mediaSelected=undefined) => {
    if(mediaSelected && mediaSelected.length!=""){
       
        mediaSelected=mediaSelected.split(",")
    }
    /* $.getJSON( ATON.PATH_RESTAPI+"c/media/", ( data )=>{         console.log("media:",data) }; */
    fetch(ATON.PATH_RESTAPI+"c/media", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        
        UI.populateSelect2(data)
        if(mediaSelected){
            $(".js-example-basic-multiple").val(mediaSelected).trigger("change")
        }
        
        /* console.log("media end point:",data) */
    })
    .catch(error => console.error(error))
}



// If pose p is not defined/valid, open first available pose
APP.loadVolumePose = (v,p)=>{
    if (!v) v = Object.keys(APP.cdata.volumes)[0];
    if (APP.cdata === undefined) return;

    ATON.SceneHub.clear();
    APP._bLensMatSet = false;

    let vol = APP.cdata.volumes[v];
    if(vol.layers){
        APP.layers=vol.layers
        const defl=getDefaultLayer()
        
        if(defl){
            APP.defaultLayer=defl
            APP.currLayer=defl
        }else{
            APP.defaultLayer=0
            APP.currLayer=0
        }
        
    }
    
    
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

    if (pose.descr){
        APP.UI.setIntroPanel(pose.descr);
    }
    else APP.UI.toggleSemPanel(false);

    //ATON.SceneHub.clear();
    ATON.SUI.clearMeasurements();

    ATON.FE.loadSceneID( sid )

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


    let nextp = (APP.currPose + 1) % vol.poses.length;

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

    APP.currLayer = APP.defaultLayer;
};

APP.invertIR = ()=>{
    if (!APP.currMat) return;

    let v = APP.currMat.uniforms.bInv.value;

    if (v > 0.0) APP.currMat.uniforms.bInv.value = 0.0;
    else APP.currMat.uniforms.bInv.value = 1.0;
};

// 0.0 - 1.0
APP.setDiscoveryDepth = (v)=>{
    if (APP.currMat === undefined) return;

    if (v < 0.0) v = 0.0;
    if (v > 1.0) v = 1.0;

    APP.irValue = v;
    $("#idIRcontrol").val(APP.irValue);

    // extremes
    if (v <= 0.0){
        APP.currMat.uniforms.vDisc.value.set(1,0,0);
        return;
    }
    if (v >= 1.0){
        APP.currMat.uniforms.vDisc.value.set(0,0,1);
        return;
    }

    // intermediate interpolation
    if (v <= 0.5){
        let a = v/0.5;
        let b = 1.0 - a;

        APP.currMat.uniforms.vDisc.value.set(b,a,0);
    }
    else {
        let a = (v-0.5)/0.5;
        let b = 1.0 - a;

        APP.currMat.uniforms.vDisc.value.set(0,b,a);
    }
};

APP.setLensRadius = (v)=>{
    ATON.SUI.setSelectorRadius(v);
};

// Set current APP layer 
APP.setLayer = (L)=>{
    APP.UI.setLayer(L);
    APP.currLayer = L;

    APP.filterAnnotationsUsingSelector();

    if (L === APP.defaultLayer){
        APP.disableLens();
        return;
    }

    APP.enableLens();
    APP.layers.forEach((l)=>{
        if(L===l.id){
            APP.setDiscoveryDepth(l.depth );  
        }
    })
    /* if (L === APP.LAYER_IR1) APP.setDiscoveryDepth( 0.0 );
    if (L === APP.LAYER_IR2) APP.setDiscoveryDepth( 0.5 );
    if (L === APP.LAYER_IR3) APP.setDiscoveryDepth( 1.0 ); */
    
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

        APP.filterAnnotationsUsingSelector();
    }

    // VR
    if (!ATON.XR._bPresenting) return;

    let v = ATON.XR.getAxisValue(ATON.XR.HAND_R);
    let s = ATON.SUI._selectorRad;
    s += (v.y * 0.01);
    if (s > 0.001) ATON.SUI.setSelectorRadius(s);

    let a = ATON.XR.getAxisValue(ATON.XR.HAND_L);
    APP.setDiscoveryDepth( APP.irValue + (a.y * 0.01) );

    if (APP._bSqueezeHandL){
        APP.setLightPostion( ATON.XR.controller1pos );
    }
    
};

APP.goToMode=(idMode)=>{ 
    APP.cancelCurrentTask();   
    ATON.SUI.clearMeasurements();
    
    APP.setLayer(APP.defaultLayer)
    APP.setState(idMode)
    ATON.SUI.showSelector(false);
    
    if(idMode===APP.STATE_ANN_BASIC || idMode===APP.STATE_ANN_FREE){
        APP.setLensRadius(APP.raggio_ann);
    }
    if(idMode===APP.STATE_LAYER_VISION ||idMode===APP.STATE_ANN_BASIC ){
        ATON.SUI.showSelector(true);
    }

    if(idMode===APP.STATE_LAYER_VISION ){        
        APP.setLayer(APP.defaultLayer)
        APP.setLensRadius(APP.raggio_vision);
    }
    
    

}
// Attach UI routines
APP._attachUI = ()=>{
    $(".toggleFull").click(()=>{
        ATON.toggleFullScreen();
    });
    $(".toggleReset").click(()=>{
        ATON.Nav.requestHomePOV();
    });

 
    $(".toggleSize").click(()=>{
        if (APP.state !== APP.STATE_MEASURE) APP.goToMode(APP.STATE_MEASURE);
        else {
            APP.goToMode(APP.STATE_NAV);
        }
    });

   
    $(".toggleLayer").click(()=>{
        
        if(APP.state!==APP.STATE_LAYER_VISION){
            APP.goToMode(APP.STATE_LAYER_VISION)
        }
        else{
            APP.goToMode(APP.STATE_NAV)
        }
        
        
    });
    $(".toggleHelp").click(()=>{
    })
    

    APP.mapRange=(value, fromLow, fromHigh, toLow, toHigh)=> {
      return (toLow + (toHigh - toLow) * ((value - fromLow) / (fromHigh - fromLow)));
    }
    $("#idSliderLens").on("input change",()=>{
        let r = parseFloat( $("#idSliderLens").val() )
        let raggio = mapRange(r, 0,100, APP.raggio_min, APP.raggio_max);
        APP.setLensRadius(raggio);
        APP.raggio_vision=raggio
    });
   
    

    // Layers
    /*$("#idRgb").click(()=>{
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
    });*/

    // Editor
    $("#idLogin").click(()=>{
        ATON.FE.popupUser();
    });

    
    $(".annotation").click(()=>{
        
    })
    
};

// Events
APP.setupEvents = ()=>{
    ATON.on("APP_ConfigLoaded", ()=>{
        APP.UI.init();

        APP.loadVolumePose( APP.argV, APP.argP );

        // Attach UI events
        APP._attachUI();

        ATON.checkAuth((r)=>{
            ATON.fireEvent("Login",r)
        }, undefined);
        
    });

    ATON.on("Logout",()=>{
       
        APP.setProfilePublic();
        //APP.updatePoseGallery(APP.currVolume);
        $("#idLoginActionText").html("Login");
        APP._attachUI();
        UI.stopLens()        
        APP.goToMode(APP.STATE_NAV)
        
        
    });

    ATON.on("Login",(r)=>{
        
        APP.setProfileEditor();
        //APP.updatePoseGallery(APP.currVolume);
        $("#idLoginActionText").html(r.username);
        APP._attachUI();
        UI.stopLens()
        APP.goToMode(APP.STATE_NAV)
        
        

    });
    ATON.on("goToModeANN_free",()=>{
        APP.setState(APP.STATE_ANN_FREE)
      })
    ATON.on("exitFromModeANN_free",()=>{
        APP.setState(APP.STATE_NAV)
    })

    ATON.on("Tap",(e)=>{
        if (APP.state === APP.STATE_MEASURE){
            let M = APP.measure();

           
            
            return;
        }

        else if (APP.state === APP.STATE_ANN_BASIC){
            //APP.setState(APP.STATE_NAV);

            $("#idForm").show();
            APP.UI.addAnnotation(ATON.FE.SEMSHAPE_SPHERE);
            return;
        }
        else if(APP.state===APP.STATE_ANN_FREE){
            if (!ATON.SceneHub._bEdit ||ATON._hoveredSemNode) return;
            ATON.SemFactory.addSurfaceConvexPoint(0.01);
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
        APP.setLayer(APP.defaultLayer);
    });

    ATON.on("MouseWheel", (d)=>{

        if (ATON._kModCtrl){
            let v = APP.irValue;
            v -= (d * 0.0005);

            APP.setDiscoveryDepth( v );
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
        if($("#idUpdateAnn").is(":visible")) return;
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

            ATON.SemFactory.addSurfaceConvexPoint(0.01);
            //console.log(ATON.SemFactory.convexPoints)
        }
        if (k === 'Enter')  APP.finalizeSemanticShape();

        if (k === 'Escape') APP.cancelCurrentTask();
        if (k === 'Delete') APP.deleteSemAnnotation(ATON._hoveredSemNode);

        if (k==='r'){
            if (APP.gBook) APP.gBook.rotation.x += 0.1;
            console.log(APP.gBook);
        }
        APP.layers.forEach((layer)=>{
            if(layer.id===k){
                APP.setLayer(layer.id)
            }
        })
        /*if (k==='0') APP.setLayer(APP.LAYER_RGB);
        if (k==='1') APP.setLayer(APP.LAYER_IR1);
        if (k==='2') APP.setLayer(APP.LAYER_IR2);
        if (k==='3') APP.setLayer(APP.LAYER_IR3);
        */
        if (k==='i') APP.invertIR();

        if (k==='l'){
            let e = ATON.Nav.getCurrentEyeLocation();
            APP.setLightPostion(e);
        }
        
        if(k=== 'm' ){

            console.log(APP.activedLens)
        
            ATON.SUI.showSelector(APP.activedLens);
            APP.activedLens=!APP.activedLens;
        }
        if(k=== 'h' ){

            if(!APP.isBlack){
                $(".toHideFromCommand").hide()
                ATON.setBackgroundColor( ATON.MatHub.colors.black );
                APP.isBlack=!APP.isBlack
            }
            else{

                $(".toHideFromCommand").show()
                ATON.setBackgroundColor( APP.bgcol );
                APP.isBlack=!APP.isBlack
            }
            
        }
        
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
            if(APP.argBG!=0)
            {APP.UI.toggleSemPanel(false);}
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

    //mostra la pallina di selezione
   /*  ATON.SUI.showSelector(true); */

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
//problema aggiornamento parte 2: 
//in questa funzione passo, l'id della semAnnotation e il nuovo json modificato
APP.updateSemAnnotation = (semid, O)=>{
    if (semid === undefined) return;
    if (O === undefined) return;

    let E = {};
    let pDB = ATON.SceneHub.currData.sem;
    E.sem = {};
    E.sem[semid] = O;
    let S = ATON.semnodes[semid];
    let e = pDB[semid];

    if (S && e){
       
        let M = mat.sems[e.cat];
        if (M){
            S.setDefaultAndHighlightMaterials(M.base, M.hl);
            S.setMaterial(M.base);
        }

    }
    //funzione che dovrebbe aggiornare l'annotazione
    ATON.SceneHub.sendEdit( E, ATON.SceneHub.MODE_ADD);
    pDB = ATON.SceneHub.currData.sem;
  
};
APP.retrieveInfo=(semid)=>{
    let pDB = ATON.SceneHub.currData.sem; //APP.sDB[APP.currPose];
    let S = pDB[semid];
  }
APP.deleteSemAnnotation = (semid)=>{
    
    if (semid === undefined) return;
    
   
    if(!confirm("Sei sicuro di voler procedere con l'eliminazione dell'annotazione?")) return;

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
    if(APP.argBG!=0){
        APP.UI.toggleSemPanel(false);
    }
    
};

APP.getCatName = (i)=>{
    if (!APP.cdata) return;

    return APP.cdata.categories[i].name;
};

APP.filterAnnotationsByCat = (cat)=>{

    let pDB = ATON.SceneHub.currData.sem;
    if (cat === undefined) cat = APP.filterCat;
    else APP.filterCat = cat;
  
    
    for (let s in ATON.semnodes){//segnalo ATON.semnodes carica semnodes ormai cancellati
        if (s!==ATON.ROOT_NID){
            let S = ATON.semnodes[s];
            let e = pDB[s];
            

            if(e){
                if(!cat.includes(e.cat)){
                    S.hide();
                    UI.removeSemId(s);
                }
                else{
                    S.show();
                    UI.addSemId(s)
                }
            }
            
        }
    }
    APP.filterAnnotationsUsingSelector();

};

APP.filterAnnotationsUsingSelector = ()=>{
    if (!ATON.SceneHub.currData) return;
    
    let p = ATON.SUI.mainSelector.position;
    let r = ATON.SUI._selectorRad;

    let sbs = ATON.SUI.mainSelector.getBound();

    let pDB = ATON.SceneHub.currData.sem;

    //for (let s in ATON.semnodes){
        //if (s!==ATON.ROOT_NID){
        for (let fs in UI.SelectedSemId){
            let s = UI.SelectedSemId[fs];
            
            let S = ATON.semnodes[s];
            let e = pDB[s];

            if (e && e.layer !== undefined){
                let bs = S.getBound();

                //console.log(e)

                // No active lens (RGB)
                if (e.layer !== APP.defaultLayer) S.hide();
                else S.show();

                // Using lens (discovery layer)
                if (APP.currLayer !== APP.defaultLayer){
                    if (bs.containsPoint(p) || sbs.containsPoint(bs.center)){
                        if (e.layer !== APP.defaultLayer) S.show();
                        else S.hide();
                    }
                }
            }
        //}
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