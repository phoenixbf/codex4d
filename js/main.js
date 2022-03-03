let APP = {};
window.APP = APP;

APP.init = ()=>{
    ATON.FE.realize();
    ATON.FE.addBasicLoaderEvents();

    
};


// run
window.onload = ()=>{
    APP.init();
};