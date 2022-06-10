let UI = {};

UI.init = ()=>{
    ATON.FE.uiAddProfile("editor", UI.buildEditor);
    ATON.FE.uiAddProfile("public", UI.buildPublic);

    ATON.FE.uiLoadProfile("public");

    $("#idIRcontrol").val(APP.irValue);

    $("#idIRcontrol").on("input change",()=>{
        let v = parseFloat( $("#idIRcontrol").val() );
        APP.setIRvalue(v);
    });
};

UI.buildPublic = ()=>{   
    
    // Clear
    $("#idTopToolbar").html("");
    $("#idBottomToolbar").html("");

    ATON.FE.uiAddButtonUser("idTopToolbar");
    ATON.FE.uiAddButtonVR("idTopToolbar");
    ATON.FE.uiAddButtonHome("idBottomToolbar");
};

UI.buildEditor = ()=>{
    let html = ""
    html += "<ul style='list-style-type: none;'>"
    html += "<li><button class='aton-BTN-gray' type='button'> <i class='fa fa-plus' style='height: 30px; width: 30px;'></i> </button></li>"
    html += "<li><button class='button' type='button'> <i class='fa fa-minus' style='height: 30px; width: 30px;'></i> </button></li>"
    html += "<li><button class='button' type='button'> <i class='fa fa-arrows-alt' style='height: 30px; width: 30px;'></i> </button></li>"
    html += "<li><button class='button' type='button'> <i class='fa fa-cloud' style='height: 30px; width: 30px;'></i> </button></li>"
    html += "<li><button class='button' type='button'> <i class='fas fa-ruler' style='height: 30px; width: 30px;'></i> </button></li>"
    html += "</ul>"
    // Clear
    $("#idTopToolbar").html("");
    $("#idBottomToolbar").html("");
    $("#idLeftToolbar").html(html);

    
    

    ATON.FE.uiAddButtonHome("idBottomToolbar");
    
    
    



};

UI.toggleSemPanel = (b)=>{
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

/*
    Update UI panel (HTML) from semantic ID (shape)
    Public profile
====================================================*/
UI.updateSemPanel = (semid)=>{
    let pobj = APP.sDB[APP.currPose];
    if (pobj === undefined) return;

    let S = pobj[semid];
    if (S === undefined) return;

    // Generate HTML for panel
    let htmlcode = "";
    htmlcode += "<div class='atonPopupTitle'>";
    //htmlcode += "<div id='idPanelClose' class='atonBTN' style='float:left; margin:0px;'>X</div>"; // background-color: #bf7b37
    htmlcode += S.SOTTOCATEGORIA+"</div>";

    htmlcode += "<div class='atonSidePanelContent' style='height: calc(100% - 50px);'>";
    
    if (S.CATEGORIA) htmlcode += "<b>Categoria</b>: "+S.CATEGORIA+"<br>";
    if (S.LAYER) htmlcode += "<b>Layer</b>: "+S.LAYER+"<br>";
    htmlcode += "<br>";

    if (S.IMMAGINI) htmlcode += "<img src='"+APP.pathContent + S.IMMAGINI+"'>";

    htmlcode += "<div class='descriptionText'>";
    if (S.DESCRIZIONE) htmlcode += S.DESCRIZIONE;
    htmlcode += "</div></div>";

    //htmlcode += "<div id='idPanelClose' class='atonBTN atonBTN-red atonSidePanelCloseBTN' >X</div>";

    ATON.FE.playAudioFromSemanticNode(semid);

    $("#idPanel").html(htmlcode);
    UI.toggleSemPanel(true);
};

/*
    UI form (HTML) with structured data
    Editor profile
====================================================*/

// semtype: ATON.FE.SEMSHAPE_SPHERE | ATON.FE.SEMSHAPE_CONVEX
UI.addAnnotation = (semtype)=>{
    let O = {};
    let semid = ATON.Utils.generateID("ann");

    // TODO: HTML form here > fill O

    APP.addSemanticAnnotation(semid, O, semtype);
};

UI.updateAnnotation = (semid)=>{
    let d = ATON.SceneHub.currData.sem;
    if (d === undefined) return;

    let O = d[semid];
    if (O === undefined) return;

    // TODO: fill HTML form with O data

    APP.updateSemAnnotation(semid, O);
};

UI.deleteAnnotation = (semid)=>{
    // HTML form

    APP.deleteSemAnnotation(semid);
};



export default UI;