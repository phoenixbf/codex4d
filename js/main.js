let APP = {};
window.APP = APP;

APP.pathConf = "config/config.json";
APP.cdata = undefined;

APP.postfixIR = "-ir.jpg";
APP._bLensMatSet = false;
APP.irValue = 0; // 0.0 - 1.0

APP.currVolume = undefined;
APP.currPose   = undefined;

APP._bSqueezeHandR = false;
APP._bSqueezeHandL = false;

APP.trackingFreq  = 0.1;
APP.bHandTracking = false;

APP.sDB = {};


APP.init = ()=>{
    ATON.FE.realize();
    ATON.FE.addBasicLoaderEvents();

    APP.argV = ATON.FE.urlParams.get('v');
    APP.argP = ATON.FE.urlParams.get('p');

    APP.setupEvents();

    APP.setupUI();

    APP.loadConfig(APP.pathConf);

    ATON.addUpdateRoutine( APP.update );

    if (APP.bHandTracking && !ATON.device.isMobile) APP.setupTracking();
    
    APP.setupLM();

    APP._tPoint = -1.0;
    APP._reqPointCoords  = [0,0];
    APP._prevPointCoords = [0,0];

    const spreadsheetId = '1JqyuYCDMv9mCq2dLeKgiqHGB0tUHCaAPOwDlNQWQlsM';
    const parser = new PublicGoogleSheetsParser();
    parser.parse(spreadsheetId /*, 'Sheet2'*/).then((items) => {

        // rewrite DB entries
        for (let e in items){
            const row = items[e];
            const sid = row.ID;
            if (sid !== undefined){
                if (APP.sDB[sid] === undefined) APP.sDB[sid] = {};
                for (let f in row) if (f !== "ID") APP.sDB[sid][f] = row[f];
            }
        }

        console.log(APP.sDB)
    })
};

APP.setupLM = ()=>{

    APP.LM = {};

    APP.LM.ws = undefined;
    APP.LM.focusListener;
    APP.LM.blurListener;
    APP.LM.bLMpaused = false;
    APP.LM.frame = undefined;
    APP.LM.bTrackingHand = false;

    // Create and open the socket
    APP.LM.ws = new WebSocket("ws://localhost:6437/v7.json");

    // On successful connection
    APP.LM.ws.onopen = function(event) {
        APP.LM.ws.send(JSON.stringify({focused: true})); // claim focus

        APP.LM.focusListener = window.addEventListener('focus', function(e) {
            APP.LM.ws.send(JSON.stringify({focused: true})); // claim focus
        });

        APP.LM.blurListener = window.addEventListener('blur', function(e) {
            APP.LM.ws.send(JSON.stringify({focused: false})); // relinquish focus
        });
    };

    // On message received
    APP.LM.ws.onmessage = function(event) {
        if (!APP.LM.bLMpaused){
            APP.LM.frame = JSON.parse(event.data);
            //var str = JSON.stringify(obj, undefined, 2);

            let hands = APP.LM.frame.hands;

            if (!hands || hands.length<1){
                if (APP.LM.bTrackingHand) ATON.SUI.setSelectorRadius(0.0);
                APP.LM.bTrackingHand = false;
                return;
            }

            APP.LM.bTrackingHand = true;

            for (let i = 0; i<hands.length; i++){
                let h = hands[i];

                if (h.type === "left"){
                    /*
                    let x = h.palmPosition[0] * 0.001;
                    let y = (h.palmPosition[1] * 0.001) - 0.1;
                    let z = h.palmPosition[2] * 0.001;
    
                    APP.uniforms.vLens.value.x = ATON.bounds.center.x + x;
                    APP.uniforms.vLens.value.y = ATON.bounds.center.y - y;
                    APP.uniforms.vLens.value.z = ATON.bounds.center.z - z;
                    */

                    let x = h.palmPosition[0] * 0.005;
                    let y = (h.palmPosition[1] * 0.005) - 1.0;
                    let z = (100.0 - h.palmPosition[2]) * 0.002;
                    //console.log(z)

                    ATON._screenPointerCoords.x = x;
                    ATON._screenPointerCoords.y = y;

                    if (z > 0.0) ATON.SUI.setSelectorRadius(z);
                    else ATON.SUI.setSelectorRadius(0.0);
                }
                else {
                    let z = (h.palmPosition[2]+50.0) * 0.01;

                    APP.setIRvalue(z);
                }
            }

            //console.log(APP.LM.frame);
/*
            if(!APP.LM.frame.hasOwnProperty("timestamp")){
                //console.log(str);
            } else{
                //console.log(str);
            }
*/
        }
    };
    
    // On socket close
    APP.LM.ws.onclose = function(event) {
        APP.LM.ws = null;
        window.removeEventListener("focus", APP.LM.focusListener);
        window.removeEventListener("blur", APP.LM.blurListener);
    }

    // On socket error
    APP.LM.ws.onerror = function(event) {
        console.log("Received error");
    };
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

APP.setupUI = ()=>{
    //ATON.FE.useMouseWheelToScaleSelector();

    ATON.FE.uiAddButtonVR("idTopToolbar");
    ATON.FE.uiAddButtonHome("idBottomToolbar");

    $("#idIRcontrol").val(APP.irValue);

    $("#idIRcontrol").on("input change",()=>{
        let v = parseFloat( $("#idIRcontrol").val() );
        APP.setIRvalue(v);
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

    let vol = APP.cdata.volumes[v];
    if (vol === undefined) return;

    let sid = undefined;
    if (!p) p = Object.keys(vol)[0];
    sid = vol[p];

    if (sid === undefined) return;

    APP.currVolume = v;
    APP.currPose   = p;

    ATON.SceneHub.clear();

    ATON.FE.loadSceneID( sid );
};

// IR Lensing
APP.setupLensing = ()=>{
    let D = ATON.SceneHub.currData;
    if (D === undefined) return;

    let urlGLTF = D.scenegraph.nodes.main.urls[0];
    if (urlGLTF === undefined) return;

    let base = ATON.Utils.removeFileExtension(urlGLTF);
    console.log(base)

    let urlBase = ATON.PATH_COLLECTION + base + ".jpg";
    let urlIR   = ATON.PATH_COLLECTION + base + APP.postfixIR;

    APP.uniforms = {
        tBase: { type:'t' /*, value: 0*/ },
        tIR: { type:'t' /*, value: 0*/ },
        wIR: { type:'vec3', value: new THREE.Vector3(0,1,0) },
        vLens: { type:'vec4', value: new THREE.Vector4(0,0,0, 0.2) },
        time: { type:'float', value: 0.0 },
    };

    APP.matLens = new THREE.ShaderMaterial({
        uniforms: APP.uniforms,

        vertexShader:`
            varying vec3 vPositionW;
            varying vec2 vUv;

            void main(){
                vUv = uv;
                vUv.y = 1.0-vUv.y;

                vPositionW = vec3( vec4( position, 1.0 ) * modelMatrix);

                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,

        fragmentShader:`
            varying vec3 vPositionW;
            varying vec2 vUv;

            uniform vec4 vLens;

            uniform float time;
            uniform sampler2D tBase;
            uniform sampler2D tIR;
            uniform vec3 wIR;
            //uniform sampler2D tHeight;

		    void main(){
                float sedge = 8.0f;

                float d = distance(vPositionW, vLens.xyz);
                float t = d / vLens.w;

                t -= (1.0f - (1.0f/sedge));
                t *= sedge;

                t = clamp(t, 0.0,1.0);

                vec4 frag = texture2D(tBase, vUv);
                vec4 ir   = texture2D(tIR, vUv);

                float vir = (wIR.x * ir.r) + (wIR.y * ir.g) + (wIR.z * ir.b);

                frag = mix( vec4(vir,vir,vir, 1.0), frag, t);

                gl_FragColor = frag;
		    }
        `
    });

    ATON.Utils.textureLoader.load(urlBase, (tex)=>{
        APP.matLens.needsUpdate = true;
        APP.uniforms.tBase.value = tex;
    });

    ATON.Utils.textureLoader.load(urlIR, (tex)=>{
        APP.matLens.needsUpdate = true;
        APP.uniforms.tIR.value = tex;
    });

    let main = ATON.getSceneNode("main");
    if (main === undefined) return;

    main.setMaterial( APP.matLens );

    APP._bLensMatSet = true;
};

// 0.0 - 1.0
APP.setIRvalue = (v)=>{
    if (v < 0.0) v = 0.0;
    if (v > 1.0) v = 1.0;

    APP.irValue = v;
    $("#idIRcontrol").val(APP.irValue);

    // extremes
    if (v <= 0.0){
        APP.uniforms.wIR.value.set(1,0,0);
        return;
    }
    if (v >= 1.0){
        APP.uniforms.wIR.value.set(0,0,1);
        return;
    }

    // intermediate interpolation
    if (v <= 0.5){
        let a = v/0.5;
        let b = 1.0 - a;

        APP.uniforms.wIR.value.set(b,a,0);
    }
    else {
        let a = (v-0.5)/0.5;
        let b = 1.0 - a;

        APP.uniforms.wIR.value.set(0,b,a);
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
    ATON.SUI.mainSelector.visible = false;

    if (!APP._bLensMatSet) return;

    // Handle req screen pointer
    APP.handleScreenPointer();

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
    APP.uniforms.vLens.value.x = p.x;
    APP.uniforms.vLens.value.y = -p.y;
    APP.uniforms.vLens.value.z = -p.z;

    if (ATON._queryDataScene) APP.uniforms.vLens.value.w = ATON.SUI._selectorRad;
    else APP.uniforms.vLens.value.w *= 0.9;

    // VR
    if (!ATON.XR._bPresenting) return;

    let a = ATON.XR.getAxisValue(ATON.XR.HAND_L);
    APP.setIRvalue( APP.irValue + (a.y * 0.01) );
};

// Events
APP.setupEvents = ()=>{
    ATON.on("APP_ConfigLoaded", ()=>{
        APP.loadVolumePose( APP.argV, APP.argP );
    });

    ATON.on("AllNodeRequestsCompleted", ()=>{
        APP.setupLensing();

        APP.setLensRadius(0.05);
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
    });

    ATON.on("KeyUp",(k)=>{
        if (k==="Shift") ATON.Nav.setUserControl(true);
        if (k==="Control") ATON.Nav.setUserControl(true);
    });

    ATON.on("Tap", (e)=>{
        if (ATON._hoveredSemNode) APP.updateSemPanel(ATON._hoveredSemNode);
        else APP.toggleInfoPanel(false);
    });

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
};

// Semantics
APP.toggleInfoPanel = (b)=>{
    if (b){
        $("#idPanel").show();
        $("#idTopToolbar").hide();
        $("#idBottomToolbar").hide();
    }
    else {
        $("#idPanel").hide();
        $("#idTopToolbar").show();
        $("#idBottomToolbar").show();
    }
};

APP.updateSemPanel = (semid)=>{
    let S = ATON.getSemanticNode(semid);
    if (S === undefined) return;

    let descr = S.getDescription();
    if (descr) descr = JSON.parse(descr);

    let htmlcode = "";
    htmlcode += "<div class='atonPopupTitle'>";
    //htmlcode += "<div id='idPanelClose' class='atonBTN' style='float:left; margin:0px;'>X</div>"; // background-color: #bf7b37
    htmlcode += semid+"</div>";

    htmlcode += "<div class='atonSidePanelContent' style='height: calc(100% - 50px);'>";
    if (descr) htmlcode += "<div class='descriptionText'>"+descr+"</div>";
    htmlcode += "</div>";

    //htmlcode += "<div id='idPanelClose' class='atonBTN atonBTN-red atonSidePanelCloseBTN' >X</div>";

    ATON.FE.playAudioFromSemanticNode(semid);

    $("#idPanel").html(htmlcode);
    APP.toggleInfoPanel(true);
};


// run
window.onload = ()=>{
    APP.init();
};