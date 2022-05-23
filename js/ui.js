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
    // Clear
    $("#idTopToolbar").html("");
    $("#idBottomToolbar").html("");


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

export default UI;