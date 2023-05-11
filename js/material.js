let mat = {};

mat.init = ()=>{

    mat._baseName = undefined;

    APP._tWhite = new THREE.DataTexture( new Uint8Array([255,255,255,255]), 1,1 );
    APP._tWhite.needsUpdate = true;

    APP._tORMbase = new THREE.DataTexture( new Uint8Array([255,255,0,255]), 1,1 );
    APP._tORMbase.needsUpdate = true;

/*
    APP.matLens = new THREE.ShaderMaterial({

        uniforms: {
            tBase: { type:'t' },
            tDisc: { type:'t' },
            tAO: { type:'t', value: APP._tWhite },
            tORM: { type:'t', value: APP._tWhite },
            uLD: { type:'vec3', value: APP._vLight },
            vDisc: { type:'vec3', value: new THREE.Vector3(0,1,0) },
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
        uniform sampler2D tDisc;
        uniform sampler2D tAO;
        uniform sampler2D tORM;
        uniform vec3 vDisc;

        void main(){
            float sedge = 6.0f;

            float d = distance(vPositionW, vLens.xyz);
            float t = d / vLens.w;

            t -= (1.0f - (1.0f/sedge));
            t *= sedge;

            t = clamp(t, 0.0,1.0);

            vec4 frag = texture2D(tBase, vUv);
            vec4 ir   = texture2D(tDisc, vUv);
            float ao  = texture2D(tAO, vUv).r;

            float vir = (vDisc.x * ir.r) + (vDisc.y * ir.g) + (vDisc.z * ir.b);

            float dLI = max(0.3, dot(vNormalW, -uLD));

            float sLI = 0.0;

            vec3 F0 = mix(vec3(1,1,1), frag.rgb, 1.0);
            float rou = texture2D(tORM, vUv).g;
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
*/

    // Semantics
    //ATON.MatHub._uSem.tint.value.set(1,1,1,0.2);
    //mat.semidle = ATON.MatHub.materials.semanticShape.clone();

    mat.sems = {};

    for (let i in APP.cats){
        let c = APP.cats[i];

        mat.sems[c] = {};

        // ATON.MatHub.materials.semanticShapeHL.clone(), //ATON.MatHub.materials.defUI.clone(),
        mat.sems[c].base         = ATON.MatHub.materials.defUI.clone(); //ATON.MatHub.materials.semanticShapeHL.clone();
        //mat.sems[c].base.color   = new THREE.Color(APP.catsColors[i]);
        //mat.sems[c].base.opacity = 0.1;
        mat.sems[c].base.uniforms.tint.value = new THREE.Color(APP.catsColors[i]);
        mat.sems[c].base.uniforms.opacity.value = 0.35;

        mat.sems[c].hl           = ATON.MatHub.materials.semanticShapeHL.clone();
        mat.sems[c].hl.color     = mat.sems[c].base.uniforms.tint.value; //mat.sems[c].base.color;
        mat.sems[c].hl.opacity   = 0.5;
    }

    console.log(mat.sems)
};

mat.realize = ()=>{
    
    let M = new CustomShaderMaterial({
        baseMaterial: THREE.MeshStandardMaterial,

        uniforms: {
            tBase: { type:'t' },
            tDisc: { type:'t' },
            //tAO: { type:'t', value: APP._tWhite },
            tORM: { type:'t', value: APP._tORMbase },
            vDisc: { type:'vec3', value: new THREE.Vector3(0,1,0) },
            vLens: { type:'vec4', value: new THREE.Vector4(0,0,0, 0.2) },
            wLens: { type:'float', value: 1.0 },
            bInv: { type:'float', value: 0.0 }
            //time: { type:'float', value: 0.0 },
        },

        vertexShader:`
            varying vec3 vPositionW;
            varying vec3 vNormalW;
            varying vec3 vNormalV;

            varying vec2 sUV;

            void main(){
                sUV = uv;

                vPositionW = ( modelMatrix * vec4( position, 1.0 )).xyz;
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

            uniform float time;
            uniform sampler2D tBase;
            uniform sampler2D tDisc;
            uniform sampler2D tORM;
            
            uniform vec3 vDisc;
            uniform float wLens;
            uniform float bInv;

            void main(){
                float sedge = 6.0;

                float d = distance(vPositionW, vLens.xyz);
                float t = d / vLens.w;

                t -= (1.0 - (1.0/sedge));
                t *= sedge;

                t = clamp(t, 0.0,1.0);
                t = max(t, 1.0-wLens);

                vec4 frag = texture2D(tBase, sUV);
                vec4 ir   = texture2D(tDisc, sUV);
                
                float ao  = texture2D(tORM, sUV).r;
                float rou = texture2D(tORM, sUV).g;
                float met = texture2D(tORM, sUV).b;

                float vir = (vDisc.x * ir.r) + (vDisc.y * ir.g) + (vDisc.z * ir.b);
                //vir *= frag.r;
                //vir = 1.0 - vir;

                vir = abs(vir - bInv);

                frag = mix( vec4(vir,vir,vir, 1.0), frag, t);

                // Border
/*
                float bd = abs(vLens.w - d);
                bd *= 1000.0;
                bd = clamp(bd, 0.1,1.0);
                frag = mix( vec4(0.87,0.75,0.5, 1.0), frag, bd);
*/
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

    if (APP.currMat !== undefined && APP.currMat.uniforms !== undefined){
        if (APP.currMat.uniforms.tBase.value) APP.currMat.uniforms.tBase.value.dispose();
        if (APP.currMat.uniforms.tDisc.value)   APP.currMat.uniforms.tDisc.value.dispose();
        if (APP.currMat.uniforms.tORM.value)  APP.currMat.uniforms.tORM.value.dispose();
        //APP.currMat.uniforms = null;

        APP.currMat = undefined;
    }

    let urlGLTF = D.scenegraph.nodes.main.urls[0];
    if (urlGLTF === undefined) return;

    let base = ATON.Utils.removeFileExtension(urlGLTF);
    console.log(base)

    mat._baseName = ATON.PATH_COLLECTION + base;

    let urlBase = mat._baseName + ".jpg";
    let urlDisc = mat._baseName + APP.postfixIR;
    let urlORM  = mat._baseName + "-pbr.jpg";

    APP.currMat = mat.realize();
    //APP.currMat = APP.matLens.clone();

    ATON.Utils.textureLoader.load(urlBase, (tex)=>{
        tex.flipY = false;
        APP.currMat.uniforms.tBase.value = tex;

        APP.currMat.needsUpdate = true;
    });

    APP.currMat.uniforms.tORM.value = APP._tORMbase;
    ATON.Utils.textureLoader.load(urlORM, (tex)=>{
        tex.flipY = false;
        APP.currMat.uniforms.tORM.value = tex;

        APP.currMat.needsUpdate = true;
    });

    ATON.Utils.textureLoader.load(urlDisc, (tex)=>{
        tex.flipY = false;
        //APP.matLens.needsUpdate = true;
        APP.currMat.uniforms.tDisc.value  = tex;

        APP.currMat.needsUpdate = true;
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

// Load another discovery layer
mat.setDiscoveryLayer = (postfix)=>{
    if (!APP.currMat) return;
    if (!mat._baseName) return;

    let urlLayer = mat._baseName + postfix;

    ATON.Utils.textureLoader.load(urlLayer, (tex)=>{
        tex.flipY = false;
        APP.currMat.uniforms.tDisc.value = tex;

        APP.currMat.needsUpdate = true;
    });
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