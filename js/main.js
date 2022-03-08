let APP = {};
window.APP = APP;

APP.pathConf = "config.json";
APP.cdata = undefined;

APP.postfixIR = "-ir.jpg";
APP._bLensMatSet = false;
APP.irValue = 0; // 0.0 - 1.0

APP.currVolume = undefined;
APP.currPose   = undefined;

APP._bSqueezeHandR = false;
APP._bSqueezeHandL = false;


APP.init = ()=>{
    ATON.FE.realize();
    ATON.FE.addBasicLoaderEvents();

    APP.argV = ATON.FE.urlParams.get('v');
    APP.argP = ATON.FE.urlParams.get('p');

    APP.setupEvents();

    APP.setupUI();

    APP.loadConfig(APP.pathConf);

    ATON.addUpdateRoutine( APP.update );
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

    ATON.FE.loadSceneID( sid, ()=>{
        ATON.SceneHub.clear();

        // common scene setup here
    });
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

// Main update routine
APP.update = ()=>{
    ATON.SUI.mainSelector.visible = false;

    if (!APP._bLensMatSet) return;

    let p = ATON.SUI.mainSelector.position;

    APP.uniforms.vLens.value.x = p.x;
    APP.uniforms.vLens.value.y = -p.y;
    APP.uniforms.vLens.value.z = -p.z;

    if (ATON._queryDataScene) APP.uniforms.vLens.value.w = ATON.SUI._selectorRad;
    else APP.uniforms.vLens.value.w *= 0.9;

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

            if (r < ATON.FE._selRanges[0]) r = FE._selRanges[0];
            if (r > ATON.FE._selRanges[1]) r = FE._selRanges[1];

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



// run
window.onload = ()=>{
    APP.init();
};