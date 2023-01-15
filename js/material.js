let mat = {};

mat.init = ()=>{

    APP._tWhite = new THREE.DataTexture( new Uint8Array([255,255,255,255]), 1,1 );
    APP._tWhite.needsUpdate = true;

    APP._tPBRbase = new THREE.DataTexture( new Uint8Array([255,255,0,255]), 1,1 );
    APP._tPBRbase.needsUpdate = true;

    APP.matLens = new THREE.ShaderMaterial({

        uniforms: {
            tBase: { type:'t' /*, value: 0*/ },
            tIR: { type:'t' /*, value: 0*/ },
            tAO: { type:'t', value: APP._tWhite },
            tPBR: { type:'t', value: APP._tWhite },
            uLD: { type:'vec3', value: APP._vLight },
            wIR: { type:'vec3', value: new THREE.Vector3(0,1,0) },
            vLens: { type:'vec4', value: new THREE.Vector4(0,0,0, 0.2) },
            vEyeW: { type:'vec3' },
            //time: { type:'float', value: 0.0 },
        },

        vertexShader: ATON.MatHub.getDefVertexShader(),

        fragmentShader:`
        varying vec3 vPositionW;
        varying vec2 vUv;

        varying vec3 vNormalW;
        varying vec3 vNormalV;

        uniform vec3 vEyeW;

        uniform vec4 vLens;
        uniform vec3 uLD;

        //uniform float time;
        uniform sampler2D tBase;
        uniform sampler2D tIR;
        uniform sampler2D tAO;
        uniform sampler2D tPBR;
        uniform vec3 wIR;

        void main(){
            float sedge = 6.0f;

            float d = distance(vPositionW, vLens.xyz);
            float t = d / vLens.w;

            t -= (1.0f - (1.0f/sedge));
            t *= sedge;

            t = clamp(t, 0.0,1.0);

            vec4 frag = texture2D(tBase, vUv);
            vec4 ir   = texture2D(tIR, vUv);
            float ao  = texture2D(tAO, vUv).r;

            float vir = (wIR.x * ir.r) + (wIR.y * ir.g) + (wIR.z * ir.b);

            float dLI = max(0.3, dot(vNormalW, -uLD));

            float sLI = 0.0;

            vec3 F0 = mix(vec3(1,1,1), frag.rgb, 1.0);
            float rou = texture2D(tPBR, vUv).g;
            float rF = (1.0 - rou);
            rF *= rF;
            rF  = 1.0 + (rF * 512.0);
            
            vec3 viewDir    = normalize(cameraPosition - vPositionW);
            vec3 reflectDir = reflect(-uLD, vNormalW);
            
            sLI = (1.0-rou) * pow(max(dot(viewDir, -reflectDir), 0.0), rF);
            vec3 spec = sLI * F0 * 2.0;
            //spec = clamp(spec, vec3(0,0,0),vec3(1,1,1));

            frag.rgb *= (dLI + spec) * 1.5;


            //frag.rgb *= dLI;

            // Lens
            vir *= dLI;
            frag = mix( vec4(vir,vir,vir, 1.0), frag, t);
            //frag.rgb *= ao;

            gl_FragColor = frag;
        }
        `
    });

    // Semantics
    //ATON.MatHub._uSem.tint.value.set(1,1,1,0.2);
    //mat.semidle = ATON.MatHub.materials.semanticShape.clone();

    mat.sems = {};

    mat.sems["Iconologia e Iconografia"] = {
        base: ATON.MatHub.materials.semanticShapeHL.clone(), //ATON.MatHub.materials.defUI.clone(),
        hl: ATON.MatHub.materials.semanticShapeHL.clone()
    };
    mat.sems["Iconologia e Iconografia"].hl.color     = new THREE.Color("#BF2517");
    mat.sems["Iconologia e Iconografia"].hl.opacity   = 0.3;
    mat.sems["Iconologia e Iconografia"].base.color   = mat.sems["Iconologia e Iconografia"].hl.color;
    mat.sems["Iconologia e Iconografia"].base.opacity = 0.1;

    //mat.sems["Iconologia e Iconografia"].base.uniforms.tint.value    = mat.sems["Iconologia e Iconografia"].hl.color;
    //mat.sems["Iconologia e Iconografia"].base.uniforms.opacity.value = 0.0;


    mat.sems["Struttura"] = {
        base: ATON.MatHub.materials.semanticShapeHL.clone(), //ATON.MatHub.materials.defUI.clone(),
        hl: ATON.MatHub.materials.semanticShapeHL.clone()
    };
    mat.sems["Struttura"].hl.color     = new THREE.Color("#2F4689");
    mat.sems["Struttura"].hl.opacity   = 0.3;
    mat.sems["Struttura"].base.color   = mat.sems["Struttura"].hl.color;
    mat.sems["Struttura"].base.opacity = 0.1;


    mat.sems["Conservazione e Restauro"] = {
        base: ATON.MatHub.materials.semanticShapeHL.clone(), //ATON.MatHub.materials.defUI.clone(),
        hl: ATON.MatHub.materials.semanticShapeHL.clone()
    };
    mat.sems["Conservazione e Restauro"].hl.color     = new THREE.Color("#D9A441");
    mat.sems["Conservazione e Restauro"].hl.opacity   = 0.3;
    mat.sems["Conservazione e Restauro"].base.color   = mat.sems["Conservazione e Restauro"].hl.color;
    mat.sems["Conservazione e Restauro"].base.opacity = 0.1;


    mat.sems["Testo e Scrittura"] = {
        base: ATON.MatHub.materials.semanticShapeHL.clone(), //ATON.MatHub.materials.defUI.clone(),
        hl: ATON.MatHub.materials.semanticShapeHL.clone()
    };
    mat.sems["Testo e Scrittura"].hl.color     = new THREE.Color("#E7F0F9");
    mat.sems["Testo e Scrittura"].hl.opacity   = 0.3;
    mat.sems["Testo e Scrittura"].base.color   = mat.sems["Testo e Scrittura"].hl.color;
    mat.sems["Testo e Scrittura"].base.opacity = 0.1;


    mat.sems["Materiali e Tecniche Esecutive"] = {
        base: ATON.MatHub.materials.semanticShapeHL.clone(), //ATON.MatHub.materials.defUI.clone(),
        hl: ATON.MatHub.materials.semanticShapeHL.clone()
    };
    mat.sems["Materiali e Tecniche Esecutive"].hl.color     = new THREE.Color("#422C20");
    mat.sems["Materiali e Tecniche Esecutive"].hl.opacity   = 0.3;
    mat.sems["Materiali e Tecniche Esecutive"].base.color   = mat.sems["Materiali e Tecniche Esecutive"].hl.color;
    mat.sems["Materiali e Tecniche Esecutive"].base.opacity = 0.1;


    mat.sems["Censure"] = {
        base: ATON.MatHub.materials.semanticShapeHL.clone(), //ATON.MatHub.materials.defUI.clone(),
        hl: ATON.MatHub.materials.semanticShapeHL.clone()
    };
    mat.sems["Censure"].hl.color     = new THREE.Color("#FF7F11");
    mat.sems["Censure"].hl.opacity   = 0.3;
    mat.sems["Censure"].base.color   = mat.sems["Censure"].hl.color;
    mat.sems["Censure"].base.opacity = 0.1;


    mat.sems["Notazioni Musicali"] = {
        base: ATON.MatHub.materials.semanticShapeHL.clone(), //ATON.MatHub.materials.defUI.clone(),
        hl: ATON.MatHub.materials.semanticShapeHL.clone()
    };
    mat.sems["Notazioni Musicali"].hl.color     = new THREE.Color("#79b857");
    mat.sems["Notazioni Musicali"].hl.opacity   = 0.3;
    mat.sems["Notazioni Musicali"].base.color   = mat.sems["Notazioni Musicali"].hl.color;
    mat.sems["Notazioni Musicali"].base.opacity = 0.1;
};

mat.realize = ()=>{
    
    let M = new CustomShaderMaterial({
        baseMaterial: THREE.MeshStandardMaterial,

        uniforms: {
            tBase: { type:'t' },
            tIR: { type:'t' },
            //tAO: { type:'t', value: APP._tWhite },
            tPBR: { type:'t', value: APP._tPBRbase },
            uLD: { type:'vec3', value: APP._vLight },
            wIR: { type:'vec3', value: new THREE.Vector3(0,1,0) },
            vLens: { type:'vec4', value: new THREE.Vector4(0,0,0, 0.2) },
            wLens: { type:'float', value: 1.0 }
            //time: { type:'float', value: 0.0 },
        },

        vertexShader:`
            varying vec3 vPositionW;
            varying vec3 vNormalW;
            varying vec3 vNormalV;

            varying vec2 sUV;

            void main(){
                sUV = uv;

                vPositionW = ( vec4( position, 1.0 ) * modelMatrix).xyz;
                vNormalV   = normalize( vec3( normalMatrix * normal ));
                vNormalW   = (modelMatrix * vec4(normal, 0.0)).xyz;

                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,

        fragmentShader:`
            varying vec3 vPositionW;

            varying vec3 vNormalW;
            varying vec3 vNormalV;
            varying vec2 sUV;

            uniform vec4 vLens;
            uniform vec3 uLD;

            uniform float time;
            uniform sampler2D tBase;
            uniform sampler2D tIR;
            uniform sampler2D tPBR;
            
            uniform vec3 wIR;
            uniform float wLens;

            void main(){
                float sedge = 6.0;

                float d = distance(vPositionW, vLens.xyz);
                float t = d / vLens.w;

                t -= (1.0 - (1.0/sedge));
                t *= sedge;

                t = clamp(t, 0.0,1.0);
                t = max(t, 1.0-wLens);

                vec4 frag = texture2D(tBase, sUV);
                vec4 ir   = texture2D(tIR, sUV);
                
                float ao  = texture2D(tPBR, sUV).r;
                float rou = texture2D(tPBR, sUV).g;
                float met = texture2D(tPBR, sUV).b;

                float vir = (wIR.x * ir.r) + (wIR.y * ir.g) + (wIR.z * ir.b);
                //vir *= frag.r;
                //vir = 1.0 - vir;

                frag = mix( vec4(vir,vir,vir, 1.0), frag, t);

                csm_DiffuseColor = frag * ao;
                csm_Roughness    = mix(1.0, rou, t);
                csm_Metalness    = met * t;
            }
        `
    });

    return M;
};

mat.setupOnLoaded = ()=>{
    let D = ATON.SceneHub.currData;
    if (D === undefined) return;

    if (APP.currMat !== undefined){
        APP.currMat.uniforms.tBase.value.dispose();
        APP.currMat.uniforms.tIR.value.dispose();
        APP.currMat.uniforms.tPBR.value.dispose();
        //APP.currMat.uniforms = null;

        APP.currMat = undefined;
    }

    let urlGLTF = D.scenegraph.nodes.main.urls[0];
    if (urlGLTF === undefined) return;

    let base = ATON.Utils.removeFileExtension(urlGLTF);
    console.log(base)

    let urlBase = ATON.PATH_COLLECTION + base + ".jpg";
    let urlIR   = ATON.PATH_COLLECTION + base + APP.postfixIR;
    let urlAO   = ATON.PATH_COLLECTION + base + "-ao.jpg";
    let urlPBR  = ATON.PATH_COLLECTION + base + "-pbr.jpg";

    APP.currMat = mat.realize();
    //APP.currMat = APP.matLens.clone();

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
    APP.currMat.uniforms.tAO.value = APP._tWhite;
    ATON.Utils.textureLoader.load(urlAO, (tex)=>{
        tex.flipY = false;
        APP.currMat.uniforms.tAO.value = tex;
    },
    undefined,
    (err)=>{
        //APP.currMat.uniforms.tAO.value = ATON.MatHub.colors.red;
        console.log(err)
    });
*/
    APP.currMat.uniforms.tPBR.value = APP._tPBRbase;
    ATON.Utils.textureLoader.load(urlPBR, (tex)=>{
        tex.flipY = false;
        APP.currMat.uniforms.tPBR.value = tex;
    });


/*
    //APP.currMat.roughnessMap = APP._tWhite;
    //APP.currMat.metalness = 0.0;
    ATON.Utils.textureLoader.load(urlPBR, (tex)=>{
        tex.flipY = false;
        //tex.encoding = ATON._stdEncoding;
        APP.currMat.roughnessMap = tex;
        APP.currMat.metalnessMap = tex;
        
        APP.currMat.metalness = 1.0;
        APP.currMat.roughness = 1.0;

        APP.currMat.roughnessMap.needsUpdate = true;
        APP.currMat.metalnessMap.needsUpdate = true;

        APP.currMat.needsUpdate = true;
    });
*/

    let main = ATON.getSceneNode("main");
    if (main === undefined) return;

    main.setMaterial( APP.currMat );

    //APP.currMat.update();

    console.log("Setup lens done")
    APP._bLensMatSet = true;
};

mat.setupOnLoaded2 = ()=>{
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

export default mat;