let UI = {};

UI.init = () => {
  ATON.FE.uiAddProfile("editor", UI.buildEditor);
  ATON.FE.uiAddProfile("public", UI.buildPublic);

  if (APP.argUIP !== "editor") APP.setProfilePublic();
  else APP.setProfileEditor();

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
  $("#idLeftToolbar").html("");

  //left toolbar for Public UI
  let htmlLeft = "";
  htmlLeft += "<ul style='list-style-type: none;'>";
  htmlLeft +=
  "<li><button id='idFull'class='toolbarButton' type='button'> <img id='idFullsize' class='toolbarIcon' src='assets/icons/icon_fullsize.png'> </button></li>";
  htmlLeft += "<hr class='hr' />"
  htmlLeft +=
  "<li><button id='idReset' class='toolbarButton' type='button'> <img id='idResetScene' class='toolbarIcon' src='assets/icons/icon_resetvista.png' /> </button></li>";
  htmlLeft += "<hr class='hr' />"
  htmlLeft +=
  "<li><button id='idLayer' class='toolbarButton' type='button'> <img id='idChooseLayer' class='toolbarIcon' src='assets/icons/icon_layer.png' /> </button></li>";
  htmlLeft += "<hr class='hr' />"
  htmlLeft +=
  "<li><button id='idAnnotations' class='toolbarButton' type='button'> <img id='idTurnAnnotations' class='toolbarIcon' src='assets/icons/icon_annotazioni.png' /> </button></li>";
  htmlLeft += "<hr class='hr' />"
  htmlLeft +=
  "<li><button id='idSize' class='toolbarButton' type='button'> <img id='idTurnSize' class='toolbarIcon' src='assets/icons/icon_size_OFF.png' /> </button></li>";
  htmlLeft += "<hr class='hr' />"
  htmlLeft +=
  "<li><button id='idHelp' class='toolbarHelp' type='button'> <img id='idTurnHelp' class='toolbarIcon' src='assets/icons/icon_help.png' /> </button></li>";
  htmlLeft += "<hr class='helpDivider' />"
  htmlLeft += "</ul>";

  $("#idLeftToolbar").html(htmlLeft);

  $("#idFull").hover(function(){
    $("#idFullsize").attr("src","assets/icons/icon_fullsizeON.png");
  }, function() {
    $( "#idFullsize" ).attr("src","assets/icons/icon_fullsize.png");
  });

  $("#idReset").hover(function(){
    $("#idResetScene").attr("src","assets/icons/icon_resetvistaON.png");
  }, function() {
    $( "#idResetScene" ).attr("src","assets/icons/icon_resetvista.png");
  });

  $("#idLayer").hover(function(){
    $("#idChooseLayer").attr("src","assets/icons/icon_layerON.png");
  }, function() {
    $( "#idChooseLayer" ).attr("src","assets/icons/icon_layer.png");
  });

  $("#idAnnotations").hover(function(){
    $("#idTurnAnnotations").attr("src","assets/icons/icon_annotazioniON.png");
  }, function() {
    $( "#idTurnAnnotations" ).attr("src","assets/icons/icon_annotazioni.png");
  });

  $("#idSize").hover(function(){
    $("#idTurnSize").attr("src","assets/icons/icon_size_ON.png");
  }, function() {
    $( "#idTurnSize" ).attr("src","assets/icons/icon_size_OFF.png");
  });

  $("#idHelp").hover(function(){
    $("#idTurnHelp").attr("src","assets/icons/icon_helpON.png");
  }, function() {
    $( "#idTurnHelp" ).attr("src","assets/icons/icon_help.png");
  });

  
  

  //top toolbar for Public UI to allow Login
  let htmlTop = "";
  htmlTop += "<button id='idLogin' class='login'> <img id='idLoginAction' class='loginIcon' src='assets/icons/icon_login.png' /><p id='idLoginActionText' class='loginText'> Login</p></button>";
  htmlTop +="<div class='selectContainer'>"
  htmlTop += "<p class='filterText'> Note </p>"
  htmlTop += "<select class='filterAnnotation'>";
  htmlTop +=
    "<option  class='filterOption' value='Iconologia e Iconografia' >Iconologia e Iconografia  &nbsp; &nbsp; &nbsp; &nbsp; <p class='iconColor'>&#x25EF</p></option> ";
    htmlTop += "<option class='selectHr' disabled>────────────────────</option>"
  htmlTop +=
    "<option class='filterOption' value='Materiali e Tecniche Esecutive' >Materiali e Tecniche &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <p class='iconColor'>&#x25EF</p> </option>";
    htmlTop += "<option class='selectHr' disabled>────────────────────</option>"
  htmlTop += "<option class='filterOption' value='Struttura' >Struttura &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <p class='iconColor'>&#x25EF</p></option>";
  htmlTop += "<option class='selectHr' disabled>────────────────────</option>"
  htmlTop +=
    "<option class='filterOption' value='Conservazione e Restauro'>Conservazione e Restauro &nbsp; <p class='iconColor'>&#x25EF</p></option>";
    htmlTop += "<option class='selectHr' disabled>────────────────────</option>"
  htmlTop += "<option class='filterOption' value='Testo e Scrittura'>Testo e Scrittura  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p class='iconColor'>&#x25EF</p></option>";
  htmlTop += "<option class='selectHr' disabled>────────────────────</option>"
  htmlTop += "<option class='filterOption' value='Censure'>Censure &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p class='iconColor'>&#x25EF</p></option>";
  htmlTop += "<option class='selectHr' disabled>────────────────────</option>"
  htmlTop += "<option class='filterOption' value='Notazioni Musicali'>Notazioni Musicali  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p class='iconColor'>&#x25EF</p></option>";
  htmlTop += "</select>";
  htmlTop += "</div";
  
  $("#idTopToolbar").html(htmlTop);

  $("#idLogin").hover(function(){
    $("#idLoginAction").attr("src","assets/icons/icon_loginON.png");
    $("idLogin").attr("color", "rgba(224, 192, 129, 1)")
  }, function() {
    $( "#idLoginAction" ).attr("src","assets/icons/icon_login.png");
  });

  

  //bottom toolbar for Public UI to allow navigation through poses
  let htmlBottom = "";
  htmlBottom += "<a href='#'><img class='codexLogo' src='assets/logo.png' /></a>";
  htmlBottom += "<div class='previewContainer'>"
  htmlBottom += "<div class='posePreview'> </div>"
  htmlBottom += "<div class='posePreview' > </div>"
  htmlBottom +="</div>"
  
  $("#idCollapsible").on('click', () => {
    var initialState = ($("#idBottomToolbar").css("height") ==="0px")
    console.log(initialState)
    if (initialState) {
      $("#idBottomToolbar").css("height", "118px");
      $("#idArrow").attr("src", "assets/upArrow.png");
      $("#idCollapsible").css("top","620px");
    } else {
      $("#idBottomToolbar").css("height", "0px");
      $("#idArrow").attr("src", "assets/downArrow.png");
      $("#idCollapsible").css("top","730px");
    }
    
  });
  


  $("#idBottomToolbar").html(htmlBottom);
  
  // range input to manage the lens
let htmlView = "";
htmlView += "<input type='range' min='0' value='50' max='100' id='slider' class='slider' />";


$('#idViewControl').html(htmlView);
// method to track slider progression
var isFF = true;
var addRule = (function (style) {
  var sheet = document.head.appendChild(style).sheet;
  return function (selector, css) {
    if ( isFF ) {
      if ( sheet.cssRules.length > 0 ) {
        sheet.deleteRule( 0 );
      }
    
      try {
        sheet.insertRule(selector + "{" + css + "}", 0);
      } catch ( ex ) {
        isFF = false;
      }
    }    
  };
})(document.createElement("style"));

$( '#slider' ).on( 'input', function( ) {
  $( this ).css( 'background', 'linear-gradient(to right, rgba(198, 150, 59, 1) 0%, rgba(198, 150, 59, 1) '+this.value +'%, transparent ' + this.value + '%, transparent 100%)' );
} );

  ATON.FE.uiAddButtonVR("idTopToolbar");
};

UI.buildEditor = () => {
  // Clear
  $("#idTopToolbar").html("");
  $("#idBottomToolbar").html("");
  $("#idLeftToolbar").html("")

  // Initializing top toolbar for Editor User
  let htmlTopEditor = "";
  // htmlTopEditor += "<button id='idLogin' class='login'> <img id='idLoginAction' class='loginIcon' src='assets/icons/icon_login.png' /><p id='idLoginActionText' class='loginText'> Login</p></button>";
  htmlTopEditor +="<div class='selectContainer'>"
  htmlTopEditor += "<p class='filterText'> Note </p>"
  htmlTopEditor += "<select class='filterAnnotation'>";
  htmlTopEditor +=
    "<option  class='filterOption' value='Iconologia e Iconografia' >Iconologia e Iconografia  &nbsp; &nbsp; &nbsp; &nbsp; <p class='iconColor'>&#x25EF</p></option> ";
    htmlTopEditor += "<option class='selectHr' disabled>────────────────────</option>"
  htmlTopEditor +=
    "<option class='filterOption' value='Materiali e Tecniche Esecutive' >Materiali e Tecniche &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <p class='iconColor'>&#x25EF</p> </option>";
    htmlTopEditor += "<option class='selectHr' disabled>────────────────────</option>"
  htmlTopEditor += "<option class='filterOption' value='Struttura' >Struttura &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <p class='iconColor'>&#x25EF</p></option>";
  htmlTopEditor += "<option class='selectHr' disabled>────────────────────</option>"
  htmlTopEditor +=
    "<option class='filterOption' value='Conservazione e Restauro'>Conservazione e Restauro &nbsp; <p class='iconColor'>&#x25EF</p></option>";
    htmlTopEditor += "<option class='selectHr' disabled>────────────────────</option>"
  htmlTopEditor += "<option class='filterOption' value='Testo e Scrittura'>Testo e Scrittura  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p class='iconColor'>&#x25EF</p></option>";
  htmlTopEditor += "<option class='selectHr' disabled>────────────────────</option>"
  htmlTopEditor += "<option class='filterOption' value='Censure'>Censure &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p class='iconColor'>&#x25EF</p></option>";
  htmlTopEditor += "<option class='selectHr' disabled>────────────────────</option>"
  htmlTopEditor += "<option class='filterOption' value='Notazioni Musicali'>Notazioni Musicali  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p class='iconColor'>&#x25EF</p></option>";
  htmlTopEditor += "</select>";
  htmlTopEditor += "</div";
  // Clear
  $("#idTopToolbar").html(htmlTopEditor);

  //Initializing Bottom Toolbar for Editor User
  let htmlBottomEditor = "";
  htmlBottomEditor += "<a href='#'><img class='codexLogo' src='assets/logo.png' /></a>";
  htmlBottomEditor += "<div class='previewContainer'>"
  htmlBottomEditor += "<div class='posePreview'> </div>"
  htmlBottomEditor += "<div class='posePreview' > </div>"
  htmlBottomEditor +="</div>"
  $("#idBottomToolbar").html(htmlBottomEditor);

  //Initializing Left Toolbar for Editor User
  let htmlLeftEditor = "";
  htmlLeftEditor += "<ul style='list-style-type: none;'>";
  htmlLeftEditor +=
  "<li><button id='idFull'class='toolbarButton' type='button'> <img id='idFullsize' class='toolbarIcon' src='assets/icons/icon_fullsize.png'> </button></li>";
  htmlLeftEditor += "<hr class='hr' />"
  htmlLeftEditor +=
  "<li><button id='idReset' class='toolbarButton' type='button'> <img id='idResetScene' class='toolbarIcon' src='assets/icons/icon_resetvista.png' /> </button></li>";
  htmlLeftEditor += "<hr class='hr' />"
  htmlLeftEditor +=
  "<li><button id='idLayer' class='toolbarButton' type='button'> <img id='idChooseLayer' class='toolbarIcon' src='assets/icons/icon_layer.png' /> </button></li>";
  htmlLeftEditor += "<hr class='hr' />"
  htmlLeftEditor +=
  "<li><button id='idAnnotations' class='toolbarButton' type='button'> <img id='idTurnAnnotations' class='toolbarIcon' src='assets/icons/icon_annotazioni.png' /> </button></li>";
  htmlLeftEditor += "<hr class='hr' />"
  htmlLeftEditor +=
  "<li><button id='idSize' class='toolbarButton' type='button'> <img id='idTurnSize' class='toolbarIcon' src='assets/icons/icon_size_OFF.png' /> </button></li>";
  htmlLeftEditor += "<hr class='hr' />"
  htmlLeftEditor +=
  "<li><button id='idHelp' class='toolbarHelp' type='button'> <img id='idTurnHelp' class='toolbarIcon' src='assets/icons/icon_help.png' /> </button></li>";
  htmlLeftEditor += "<hr class='helpDivider' />"
  htmlLeftEditor += "</ul>";

  $("#idLeftToolbar").html(htmlLeftEditor);

  $("#idFull").hover(function(){
    $("#idFullsize").attr("src","assets/icons/icon_fullsizeON.png");
  }, function() {
    $( "#idFullsize" ).attr("src","assets/icons/icon_fullsize.png");
  });

  $("#idReset").hover(function(){
    $("#idResetScene").attr("src","assets/icons/icon_resetvistaON.png");
  }, function() {
    $( "#idResetScene" ).attr("src","assets/icons/icon_resetvista.png");
  });

  $("#idLayer").hover(function(){
    $("#idChooseLayer").attr("src","assets/icons/icon_layerON.png");
  }, function() {
    $( "#idChooseLayer" ).attr("src","assets/icons/icon_layer.png");
  });

  $("#idAnnotations").hover(function(){
    $("#idTurnAnnotations").attr("src","assets/icons/icon_annotazioniON.png");
  }, function() {
    $( "#idTurnAnnotations" ).attr("src","assets/icons/icon_annotazioni.png");
  });

  $("#idSize").hover(function(){
    $("#idTurnSize").attr("src","assets/icons/icon_size_ON.png");
  }, function() {
    $( "#idTurnSize" ).attr("src","assets/icons/icon_size_OFF.png");
  });

  $("#idHelp").hover(function(){
    $("#idTurnHelp").attr("src","assets/icons/icon_helpON.png");
  }, function() {
    $( "#idTurnHelp" ).attr("src","assets/icons/icon_help.png");
  });


  $('#annotation').click(() => {
    $('#selectAnnType').show();
    $("#selectAnnType").html("");
    
    let htmlcode = "";
    htmlcode = "<ul style='list-style-type: none;'>"
    htmlcode += "<li><button id='sphere'>Sphere </button></li>"
    htmlcode += "<li><button id='free'> Free </button></li>"
    htmlcode += "</ul>"

    $("#selectAnnType").append(htmlcode)

    $("#sphere").click(() => {
      UI.addAnnotation(ATON.FE.SEMSHAPE_SPHERE);
    })

  })

  $('#annotation').mouseleave(() => {
    ('#selectAnnType').hide()
  })

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
  let pDB = ATON.SceneHub.currData.sem; //APP.sDB[APP.currPose];
  if (pDB === undefined) return;

  let S = pDB[semid];
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
  let htmlcode = "<div class='atonPopupTitle' style='width: 400px;'>Aggiungi Annotazione</div>";
  htmlcode += "<div>";
  htmlcode += "<div>";
  htmlcode += "<p style='justify-content: space-evenly'>Inserire l'annotazione compilando i campi correttamente</p>";
  htmlcode += "</div>";
  htmlcode += "<form style='display: grid; justify-content: space-evenly'>";
  htmlcode += "<div style='position: relative'>";
  htmlcode +=
    "<h3 style='display: inline; position: relative; left: 5px' > Layer</h3> <select type='select' class='formSelect' id='select' style='position: relative; left: 47px' />";
  htmlcode +=
    "<option value='' selected='selected' name='Selezionare un layer'>Selezionare un layer...</option>";
  htmlcode += "<option value='RGB' name='RGB'>RGB</option>";
  htmlcode += "<option value='IR-1 name='IR-1'>IR-1</option>";
  htmlcode += "<option value='IR-2' name='IR-2'>IR-2</option>";
  htmlcode += "<option value='IR-3' name='IR-3'>IR-3</option>";
  htmlcode += "</select>";
  htmlcode += "</div>";
  htmlcode += "<div style='display: inline; position: relative; left: 5px' >";
  htmlcode +=
    "<h3 style='display: inline; position: relative; left: 3px'> Areale</h3> <input type='text' style='display: inline; width: 200px; position: relative; left: 40px'></input>";
  htmlcode += "</div>";
  htmlcode += "<div>";
  htmlcode +=
    "<h3 style='display: inline; position: relative; left: 3px'> Categoria</h3> <select id='catSelect' type='select' class='formSelect' style='position: relative; left: 35px'>";
  htmlcode += "<option value='' >Selezionare categoria</option>";
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
  htmlcode += "<div id='selectPlace' style='position:relative; top:5px'>";
  htmlcode +=
    "<h3 style='display: inline; position: relative; left: 0px'> Sottocategoria</h3> <select id='sottoCatSelect' type='select' class='formSelect' style='display: inline; position: relative; left: 18px'>";
  htmlcode +=
    "<option value='' disabled selected>Selezionare sottocategoria</option>";
  htmlcode += "</select>";
  htmlcode += "</div>";
  htmlcode += "<div style='position:relative; top:5px'>";
  htmlcode += "<h3 style='display: inline; position: relative; left: 5px' >Descrizione</h3> <textarea type='text' id='idDescription' max-length='500' style='display: inline; width: 200px; height: 100px; position: relative; left: 30px; top: 5px; border-radius: 5px'></textarea>"
  htmlcode += "</div>";
  htmlcode += "<div style='position:relative; top:5px'>";
  htmlcode += "<span style='position: relative; left: 30px;' id='rchars'>500 </span> <span style='position: relative; left: 30px;'> caratteri rimasti</span>"
  htmlcode += "</div>";
  htmlcode += "<div style='position:relative; top:5px'>";
  htmlcode += "<h3 style='display: inline;' >Immagini</h3> <input id='image' type='file' accept='.jpeg' style='display: inline; width: 200px;  position: relative; left: 35px' multiple></input>"
  htmlcode += "</div>";
  htmlcode += "<div style='position:relative; top:5px'>";
  htmlcode += "<h3 style='display: inline;' >Video</h3> <input id='video' type='file' accept='.mp4' style='display: inline; width: 200px;  position: relative; left: 47px'></input>"
  htmlcode += "</div>";
  htmlcode += "<div style='position:relative; top:5px'>"
  htmlcode +=
    "<h3 style='display: inline;'>Bibliografia</h3> <input type='text' style='display: inline; width: 200px; position: relative; left: 30px'></input>";
  htmlcode += "</div>"
  htmlcode += "</form>";
  htmlcode += "<div class='atonBTN atonBTN-green atonBTN-text atonBTN-horizontal' type='submit'> Completa annotazione </div>"
  htmlcode += "<div class='atonBTN atonBTN-red atonBTN-text atonBTN-horizontal' type> Annulla </div>"
  htmlcode += "</div>";

  if (!ATON.FE.popupShow(htmlcode)) return;

  $("#catSelect").change(function () {
    $("#sottoCatSelect").html("");

    // Setting logic to nest SubCategories in Categories

  if (this.value === "Iconologia e Iconografia") {
    let htmlcode = "";
    htmlcode +=
    "<option value='' disabled selected>Selezionare sottocategoria</option>";
    htmlcode += "<option value='Personaggi e Simboli' >Personaggi e Simboli</option>";
    htmlcode += "<option value='Stile' >Stile</option>";
    htmlcode += "<option value='Messaggio Ideologico' >Messaggio Ideologico</option>";
    htmlcode += "<option value='Fonti e Tradizioni'>Fonti e Tradizioni</option>";
    htmlcode += "<option value='Datazione e Attribuzione'>Datazione e Attribuzione</option>";
    htmlcode += "<option value='Confronti Visivi'>Confronti Visivi</option>";
    htmlcode += "<option value='Ripensamenti'>Ripensamenti</option>";
    htmlcode += "<option value='Elementi Ornamentali'>Elementi Ornamentali</option>";
    htmlcode += "<option value='Descrizione'>Descrizione</option>";
    htmlcode += "<option value='Modifiche Successive'>Modifiche Successive</option>";

     $("#sottoCatSelect").append(htmlcode);
    
    
  } else if (this.value === "Materiali e Tecniche Esecutive") {
    console.log("cliccato", this.value);
    let htmlcode = "";
    htmlcode +=
    "<option value='' disabled selected>Selezionare sottocategoria</option>";
    htmlcode += "<option value='Particolarità dei Materiali' >Particolarità dei Materiali</option>";
    htmlcode += "<option value='Particolarità delle Tecniche Esecutive' >Particolarità delle Tecniche Esecutive</option>";

  $('#sottoCatSelect').append(htmlcode);
  
  } else if (this.value === "Struttura") {
    console.log("cliccato", this.value);
    let htmlcode = "";
    htmlcode +=
    "<option value='' disabled selected>Selezionare sottocategoria</option>";
    htmlcode += "<option value='Dimensione' >Dimensione</option>";
    htmlcode += "<option value='Legatura' >Legatura</option>";
    htmlcode += "<option value='Fascicolazione' >Fascicolazione</option>";
    htmlcode += "<option value='Impaginazione' >Impaginazione</option>";
    htmlcode += "<option value='Elementi di Riuso' >Elementi di Riuso</option>";
    htmlcode += "<option value='Particolarita di Struttura' >Particolarità di Struttura</option>";
    $("#sottoCatSelect").append(htmlcode)
    
  } else if (this.value === "Conservazione e Restauro") {
    let htmlcode = "";
    htmlcode +=
    "<option value='' disabled selected>Selezionare sottocategoria</option>";
    htmlcode +=
    "<option value='Restauri' >Restauri</option>";
    htmlcode +=
    "<option value='Evidenze Biologiche' >Evidenze Biologiche</option>";
    htmlcode +=
    "<option value='Evidenze Chimiche' >Evidenze Chimiche</option>";
    htmlcode +=
    "<option value='Evidenze Fisiche' >Evidenze Fisiche</option>";
    htmlcode +=
    "<option value='Furti E Sottrazioni' >Furti E Sottrazioni</option>";
    htmlcode +=
    "<option value='Danni' >Danni</option>";
    
    $("#sottoCatSelect").append(htmlcode)
    console.log("cliccato", this.value);
  } else if (this.value === "Testo e Scrittura") {
    let htmlcode = "";
    htmlcode +=
    "<option value='' disabled selected>Selezionare sottocategoria</option>";
    htmlcode +=
    "<option value='Particolarità di Scrittura' >Particolarità di Scrittura</option>";
    htmlcode +=
    "<option value='Testo da Lettera Miniata' >Testo da Lettera Miniata</option>";
    htmlcode +=
    "<option value='Trascrizione e Traduzione' >Trascrizione e Traduzione</option>";
    htmlcode +=
    "<option value='Note e Appunti' >Note e Appunti</option>";
    htmlcode +=
    "<option value='Modifiche Successive' >Modifiche Successive</option>";

    $("#sottoCatSelect").append(htmlcode);
    
    console.log("cliccato", this.value);
  } else if (this.value === "Censure") {
    let htmlcode = "";
    htmlcode +=
    "<option value='' disabled selected>Selezionare sottocategoria</option>";
    htmlcode +=
    "<option value='Censure di Testo' >Censure di Testo</option>";
    htmlcode +=
    "<option value='Censure di Immagini' >Censure di Immagini</option>";

    $("#sottoCatSelect").append(htmlcode);

    console.log("cliccato", this.value);
  } else if (this.value === "Notazioni Musicali") {
    $("#selectPlace").remove()
    console.log("cliccato", this.value);
  } else if (this.value === " "){
    console.log("cliccato niente");
    alert('È necessario selezionare una categoria per procedere alla compilazione del form')
  }
});

$('#image').change(function() {
  if(this.files.length > 3) {
    alert('Limite massimo di immagini superato')
    $('#image').val('')
  }
})
// setting count limit for characters in the description
var maxLength = 500
$('#idDescription').keyup(function(){
  var textlen = maxLength - $(this).val().length;
  $('#rchars').text(textlen)
})

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
