let APP = {};
window.APP = APP;

APP.pathConf = "config.json";
APP.cdata = undefined;

APP.postfixIR = "-ir.jpg";
APP._bLensMatSet = false;

APP.currVolume = undefined;
APP.currPose   = undefined;

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

APP.loadVolumePose = (v,p)=>{
    if (!v) return;
    if (APP.cdata === undefined) return;

    let vol = APP.cdata.volumes[v];
    if (vol === undefined) return;

    //if (!p) // set as first key 

    let sid = vol[p];
    if (sid === undefined) return;

    APP.currVolume = v;
    APP.currPose   = p;

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

		    void main(){
                vec4 frag = texture2D(tBase, vUv);
                vec4 ir   = texture2D(tIR, vUv);

                float d = distance(vPositionW, vLens.xyz);
                float t = d / vLens.w;
                t -= 0.75;
                t *= 4.0;
                
                t = clamp(t, 0.0,1.0);

                frag = mix(ir,frag, t);

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
    else APP.uniforms.vLens.value.w = 0.0;
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
};



// run
window.onload = ()=>{
    APP.init();
};