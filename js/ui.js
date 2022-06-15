let UI = {};

UI.init = () => {
  ATON.FE.uiAddProfile("editor", UI.buildEditor);
  ATON.FE.uiAddProfile("public", UI.buildPublic);

  ATON.FE.uiLoadProfile("public");

  $("#idIRcontrol").val(APP.irValue);

  $("#idIRcontrol").on("input change", () => {
    let v = parseFloat($("#idIRcontrol").val());
    APP.setIRvalue(v);
  });
};

UI.buildPublic = () => {
  // Clear
  $("#idTopToolbar").html("");
  $("#idBottomToolbar").html("");

  ATON.FE.uiAddButtonUser("idTopToolbar");
  ATON.FE.uiAddButtonVR("idTopToolbar");
  ATON.FE.uiAddButtonHome("idBottomToolbar");
};

UI.buildEditor = () => {
  let html = "";
  html += "<ul style='list-style-type: none;'>";
  html +=
    "<li><button class='atonBTN' type='button' title='zoom in' > <img class='atonSmallIcon' src='" +
    ATON.PATH_RES +
    "icons/add.png'> </button></li>";
  html +=
    "<li><button class='atonBTN' type='button'> <i class='fa fa-minus' style='height: 30px; width: 30px;'></i> </button></li>";
  html +=
    "<li><button class='atonBTN' type='button'> <img class='atonSmallIcon' src='" +
    ATON.PATH_RES +
    "icons/fullscreen.png'> </button></li>";
  html +=
    "<li><button class='atonBTN' type='button'> <img class='atonSmallIcon' src='" +
    ATON.PATH_RES +
    "icons/layers.png'></button></li>";
  html +=
    "<li><button class='atonBTN' type='button' id='annSphere'> <img class='atonSmallIcon' src='" +
    ATON.PATH_RES +
    "icons/edit.png'></button></li>";
  html +=
    "<li><button class='atonBTN' type='button'> <i class='fas fa-ruler' style='height: 30px; width: 30px;'></i> </button></li>";
  html += "</ul>";
  // Clear
  $("#idTopToolbar").html("");
  $("#idBottomToolbar").html("");
  $("#idLeftToolbar").html(html);

  $("#annSphere").click(() => {
    UI.addAnnotation(ATON.FE.SEMSHAPE_SPHERE);
  });

  ATON.FE.uiAddButtonHome("idBottomToolbar");
};

UI.toggleSemPanel = (b) => {
  if (b) {
    $("#idPanel").show();
    $("#idTopToolbar").hide();
    $("#idBottomToolbar").hide();
  } else {
    $("#idPanel").hide();
    $("#idTopToolbar").show();
    $("#idBottomToolbar").show();
  }
};

/*
    Update UI panel (HTML) from semantic ID (shape)
    Public profile
====================================================*/
UI.updateSemPanel = (semid) => {
  let pobj = APP.sDB[APP.currPose];
  if (pobj === undefined) return;

  let S = pobj[semid];
  if (S === undefined) return;

  // Generate HTML for panel
  let htmlcode = "";
  htmlcode += "<div class='atonPopupTitle'>";
  //htmlcode += "<div id='idPanelClose' class='atonBTN' style='float:left; margin:0px;'>X</div>"; // background-color: #bf7b37
  htmlcode += S.SOTTOCATEGORIA + "</div>";

  htmlcode +=
    "<div class='atonSidePanelContent' style='height: calc(100% - 50px);'>";

  if (S.CATEGORIA) htmlcode += "<b>Categoria</b>: " + S.CATEGORIA + "<br>";
  if (S.LAYER) htmlcode += "<b>Layer</b>: " + S.LAYER + "<br>";
  htmlcode += "<br>";

  if (S.IMMAGINI)
    htmlcode += "<img src='" + APP.pathContent + S.IMMAGINI + "'>";

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
UI.addAnnotation = (semtype) => {
  let O = {};
  let semid = ATON.Utils.generateID("ann");

  // TODO: HTML form here > fill O
  let htmlcode = "<div class='atonPopupTitle' >Aggiungi Annotazione</div>";
  htmlcode += "<div>";
  htmlcode += "<div style='justify-content: space-evenly'>";
  htmlcode += "<p>Inserire l'annotazione compilando i campi correttamente</p>";
  htmlcode += "</div>";
  htmlcode += "<form style='display: grid; justify-content: space-evenly'>";
  htmlcode += "<div style='position: relative; align-content: center'>";
  htmlcode +=
    "<h3 style='display: inline;' > Layer</h3> <select type='select' class='formSelect' id='select' />";
  htmlcode +=
    "<option value='' selected='selected' name='Selezionare un layer'>Selezionare un layer...</option>";
  htmlcode += "<option value='RGB' name='RGB'>RGB</option>";
  htmlcode += "<option value='IR-1 name='IR-1'>IR-1</option>";
  htmlcode += "<option value='IR-2' name='IR-2'>IR-2</option>";
  htmlcode += "<option value='IR-3' name='IR-3'>IR-3</option>";
  htmlcode += "</select>";
  htmlcode += "</div>";
  htmlcode += "<div style='position: relative; align-content: center' >";
  htmlcode +=
    "<h3 style='display: inline;'> Areale</h3> <input type='text' style='display: inline; width: 200px;'></input>";
  htmlcode += "</div>";
  htmlcode += "<div>";
  htmlcode +=
    "<h3 style=' display: inline;'> Categoria</h3> <select id='catSelect' type='select' class='formSelect'>";
  htmlcode += "<option value='' >Selezionare una categoria</option>";
  htmlcode +=
    "<option value='Iconologia e Iconografia' >Iconologia e Iconografia</option>";
  htmlcode +=
    "<option value='Materiali e Tecniche Esecutive' >Materiali e Tecniche Esecutive</option>";
  htmlcode += "<option value='Struttura' >Struttura</option>";
  htmlcode +=
    "<option value='Conservazione e Restauro'>Conservazione e Restauro</option>";
  htmlcode += "<option value='Testo e Scrittura'>Testo e Scrittura</option>";
  htmlcode += "<option value='Censure'>Censure</option>";
  htmlcode += "<option value='Notazioni Musicali'>Notazioni Musicali</option>";
  htmlcode += "</select>";
  htmlcode += "</div>";
  htmlcode += "<div>";
  htmlcode +=
    "<h3 style=' display: inline;'> Sottocategoria</h3> <select id='sottoCatSelect' type='select' class='formSelect'>";
  htmlcode +=
    "<option value='' disabled selected>Selezionare una sottocategoria</option>";
  htmlcode += "</select>";
  htmlcode += "</div>";
  htmlcode += "</form>";
  htmlcode += "</div>";

  if (!ATON.FE.popupShow(htmlcode)) return;

  $("#catSelect").change(function () {
    $("#sottoCatSelect").html("");
    // Setting logic to nest SubCategories in Categories

  if (this.value === "Iconologia e Iconografia") {
     $("#sottoCatSelect").append("<option value='Personaggi e Simboli' >Personaggi e Simboli</option>")
     $("#sottoCatSelect").append("<option value='Stile' >Stile</option>")
     $("#sottoCatSelect").append("<option value='Messaggio Ideologico' >Messaggio Ideologico</option>")
     $("#sottoCatSelect").append("<option value='Fonti e Tradizioni'>Fonti e Tradizioni</option>")
     $("#sottoCatSelect").append("<option value='Datazione e Attribuzione'>Datazione e Attribuzione</option>")
     $('#sottoCatSelect').append("<option value='Confronti Visivi'>Confronti Visivi</option>")
     $("#sottoCatSelect").append("<option value='Ripensamenti'>Ripensamenti</option>")
     $("#sottoCatSelect").append("<option value='Elementi Ornamentali'>Elementi Ornamentali</option>")
     $("#sottoCatSelect").append("<option value='Descrizione'>Descrizione</option>")
     $("#sottoCatSelect").append("<option value='Modifiche Successive'>Modifiche Successive</option>")
    
  } else if (this.value === "Materiali e Tecniche Esecutive") {
    console.log("cliccato", this.value);
    
  $('#sottoCatSelect').append("<option value='Particolarità dei Materiali' >Particolarità dei Materiali</option>")
  $('#sottoCatSelect').append("<option value='Particolarità delle Tecniche Esecutive' >Particolarità delle Tecniche Esecutive</option>")

  } else if (this.value === "Struttura") {
    console.log("cliccato", this.value);
  } else if (this.value === "Conservazione e Restauro") {
    console.log("cliccato", this.value);
  } else if (this.value === "Testo e Scrittura") {
    console.log("cliccato", this.value);
  } else if (this.value === "Censure") {
    console.log("cliccato", this.value);
  } else if (this.value === "Notazioni Musicali") {
    console.log("cliccato", this.value);
  } else {
    console.log("cliccato niente");
  }
});

  //APP.addSemanticAnnotation(semid, O, semtype);
};

UI.updateAnnotation = (semid) => {
  let d = ATON.SceneHub.currData.sem;
  if (d === undefined) return;

  let O = d[semid];
  if (O === undefined) return;

  // TODO: fill HTML form with O data

  APP.updateSemAnnotation(semid, O);
};

UI.deleteAnnotation = (semid) => {
  // HTML form

  APP.deleteSemAnnotation(semid);
};

export default UI;
