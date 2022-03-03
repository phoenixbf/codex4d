let APP = {};
window.APP = APP;

APP.pathConf = "config.json";
APP.cdata = undefined;

APP.currVolume = undefined;
APP.currPose   = undefined;

APP.init = ()=>{
    ATON.FE.realize();
    ATON.FE.addBasicLoaderEvents();

    APP.argV = ATON.FE.urlParams.get('v');
    APP.argP = ATON.FE.urlParams.get('p');

    APP.setupEvents();

    APP.loadConfig(APP.pathConf);
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

// Events
APP.setupEvents = ()=>{
    ATON.on("APP_ConfigLoaded", ()=>{
        APP.loadVolumePose( APP.argV, APP.argP );
    });
};

// run
window.onload = ()=>{
    APP.init();
};