let UI = {};

UI.init = () => {
  //ATON.FE.uiAddProfile("editor", UI.buildEditor);
  //ATON.FE.uiAddProfile("public", UI.buildPublic);

  if (APP.argUIP !== "editor") APP.setProfilePublic();
  else APP.setProfileEditor();

  $("#idIRcontrol").val(APP.irValue);

  $("#idIRcontrol").on("input change", () => {
    let v = parseFloat($("#idIRcontrol").val());
    APP.setIRvalue(v);
  });
};

UI.setLayer = (layer) => {

  if (layer === APP.LAYER_RGB){
    $("#idImgLayer1").attr("src", "assets/active_layer.png");
    $("#idImgLayer2").attr("src", "assets/layer.png");
    $("#idImgLayer3").attr("src", "assets/layer.png");
    $("#idImgLayer4").attr("src", "assets/layer.png");
  }

  if (layer === APP.LAYER_IR1){
    $("#idImgLayer1").attr("src", "assets/layer.png");
    $("#idImgLayer2").attr("src", "assets/active_layer.png");
    $("#idImgLayer3").attr("src", "assets/layer.png");
    $("#idImgLayer4").attr("src", "assets/layer.png");
  }

  if (layer === APP.LAYER_IR2){
    $("#idImgLayer1").attr("src", "assets/layer.png");
    $("#idImgLayer2").attr("src", "assets/layer.png");
    $("#idImgLayer3").attr("src", "assets/active_layer.png");
    $("#idImgLayer4").attr("src", "assets/layer.png");
  }

  if (layer === APP.LAYER_IR3){
    $("#idImgLayer1").attr("src", "assets/layer.png");
    $("#idImgLayer2").attr("src", "assets/layer.png");
    $("#idImgLayer3").attr("src", "assets/layer.png");
    $("#idImgLayer4").attr("src", "assets/active_layer.png");
  }
}

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
  htmlLeft += "<hr class='hr' />";
  htmlLeft +=
    "<li><button id='idReset' class='toolbarButton' type='button'> <img id='idResetScene' class='toolbarIcon' src='assets/icons/icon_resetvista.png' /> </button></li>";
  htmlLeft += "<hr class='hr' />";
  htmlLeft +=
    "<li><button id='idLayer' class='toolbarButton' type='button'> <img id='idChooseLayer' class='toolbarIcon' src='assets/icons/icon_layer.png' /> </button></li>";
  htmlLeft += "<hr class='hr' />";
  htmlLeft +=
    "<li><button id='idAnnotations' class='toolbarButton' type='button'> <img id='idTurnAnnotations' class='toolbarIcon' src='assets/icons/icon_annotazioni.png' /> </button></li>";
  htmlLeft += "<hr class='hr' />";
  htmlLeft +=
    "<li><button id='idSize' class='toolbarButton' type='button'> <img id='idTurnSize' class='toolbarIcon' src='assets/icons/icon_size_OFF.png' /> </button></li>";
  htmlLeft += "<hr class='hr' />";
  htmlLeft +=
    "<li><button id='idHelp' class='toolbarHelp' type='button'> <img id='idTurnHelp' class='toolbarIcon' src='assets/icons/icon_help.png' /> </button></li>";
  htmlLeft += "<hr class='helpDivider' />";
  htmlLeft += "</ul>";

  $("#idLeftToolbar").html(htmlLeft);

  $("#idFull").on("click", () => {
    if ($("#idFullsize").attr("src") == "assets/icons/icon_fullsize.png") {
      $("#idFullsize").attr("src", "assets/icons/icon_fullsizeON.png");

      $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idTurnAnnotations").attr("src", "assets/icons/icon_annotazioni.png");
      $("#idTurnSize").attr("src", "assets/icons/icon_size_OFF.png");
      $("#idTurnHelp").attr("src", "assets/icons/icon_help.png");
    } else {
      $("#idFullsize").attr("src", "assets/icons/icon_fullsize.png");
    }
  });

  $("#idReset").on("click", () => {
    if ($("#idResetScene").attr("src") == "assets/icons/icon_resetvista.png") {
      $("#idResetScene").attr("src", "assets/icons/icon_resetvistaON.png");
      $("#idFullsize").attr("src", "assets/icons/icon_fullsize.png");
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idTurnAnnotations").attr("src", "assets/icons/icon_annotazioni.png");
      $("#idTurnSize").attr("src", "assets/icons/icon_size_OFF.png");
      $("#idTurnHelp").attr("src", "assets/icons/icon_help.png");
      $("#idSelect").hide();
      $("#idViewControlContainer").hide();
    } else {
      $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
    }
  });

  $("#idLayer").click(() => {
    if ($("#idChooseLayer").attr("src") == "assets/icons/icon_layer.png") {
      $("#idChooseLayer").attr("src", "assets/icons/icon_layerON.png");
      $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
      $("#idFullsize").attr("src", "assets/icons/icon_fullsize.png");
      $("#idTurnAnnotations").attr("src", "assets/icons/icon_annotazioni.png");
      $("#idTurnSize").attr("src", "assets/icons/icon_size_OFF.png");
      $("#idTurnHelp").attr("src", "assets/icons/icon_help.png");
      $("#idViewControlContainer").show();
      $("#idSelect").hide();
    } else {
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idViewControlContainer").hide();
    }
  });

  $("#idAnnotations").click(() => {
    if (
      $("#idTurnAnnotations").attr("src") == "assets/icons/icon_annotazioni.png"
    ) {
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
      $("#idFullsize").attr("src", "assets/icons/icon_fullsize.png");
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idTurnSize").attr("src", "assets/icons/icon_size_OFF.png");
      $("#idTurnHelp").attr("src", "assets/icons/icon_help.png");
      $("#idTurnAnnotations").attr(
        "src",
        "assets/icons/icon_annotazioniON.png"
      );
      $("#idSelect").show();
      $("#idViewControlContainer").hide();
    } else {
      $("#idTurnAnnotations").attr("src", "assets/icons/icon_annotazioni.png");
      $("#idSelect").hide();
      $("#idDropdownToggle").html(
        "Seleziona categoria <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'>"
      );
      $(".selectContainer").css("background-color", "rgb(110, 110, 110)");
    }
  });

  $("#idSize").click(() => {
    if ($("#idTurnSize").attr("src") == "assets/icons/icon_size_OFF.png") {
      $("#idTurnSize").attr("src", "assets/icons/icon_size_ON.png");
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
      $("#idFullsize").attr("src", "assets/icons/icon_fullsize.png");
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idTurnAnnotations").attr("src", "assets/icons/icon_annotazioni.png");
      $("#idTurnHelp").attr("src", "assets/icons/icon_help.png");
      $("#idSelect").hide();
      $("#idViewControlContainer").hide();
    } else {
      $("#idTurnSize").attr("src", "assets/icons/icon_size_OFF.png");
    }
  });

  $("#idHelp").click(() => {
    if ($("#idTurnHelp").attr("src") == "assets/icons/icon_help.png") {
      $("#idTurnHelp").attr("src", "assets/icons/icon_helpON.png");
      $("#idTurnSize").attr("src", "assets/icons/icon_size_OFF.png");
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
      $("#idFullsize").attr("src", "assets/icons/icon_fullsize.png");
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idTurnAnnotations").attr("src", "assets/icons/icon_annotazioni.png");
      $("#idSelect").hide();
      $("#idViewControlContainer").hide();
    } else {
      $("#idTurnHelp").attr("src", "assets/icons/icon_help.png");
    }
  });



  $("#idLogin").hover(
    () => {
      $("#idLoginAction").attr("src", "assets/icons/icon_loginON.png");
      $("#idLogin").attr("color", "rgba(224, 192, 129, 1)");
    },
    function () {
      $("#idLoginAction").attr("src", "assets/icons/icon_login.png");
    }
  );
  $("#idGoToTheWebSite").hover(
    () => {
      $("#idManuscriptDetail").attr(
        "src",
        "assets/icons/Icona_scheda_Aton_ON.png"
      );
    },
    function () {
      $("#idManuscriptDetail").attr(
        "src",
        "assets/icons/Icona_scheda_Aton_OFF.png"
      );
    }
  );

  //Note filtering
  let htmlNotes = "";
  htmlNotes = "<div class='selectContainer'>";
  htmlNotes += "<p class='filterText'> Note </p>";
  htmlNotes +=
    "<button class='dropdown-toggle' id='idDropdownToggle'>Seleziona categoria <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'></button>";
  htmlNotes += "<ul class='dropdown'>";
  htmlNotes +=
    " <li id='idIconologia'><button id='idIconologiaAction' >Iconologia e Iconografia <div class='dot'/> </button></li>";
  htmlNotes += "<hr class='selectHr'/>";
  htmlNotes +=
    "<li id='idStruttura' ><button id='idStrutturaAction'>Struttura <div class='dot4'/> </button></li>";
  htmlNotes += "<hr class='selectHr'/>";
  htmlNotes +=
    "<li id='idConservazione'><button id='idConservazioneAction'> Conservazione e Restauro <div class='dot5'/> </button></li>";
  htmlNotes += "<hr class='selectHr'/>";
  htmlNotes +=
    " <li id='idTesto'><button id='idTestoAction'>Testo e Scrittura <div class='dot6'/> </button></li>";
  htmlNotes += "<hr class='selectHr'/>";
  htmlNotes +=
    "<li id='idMateriali'><button id='idMaterialiAction'>Materiali e Tecniche <div class='dot3'/> </button></li>";
  htmlNotes += "<hr class='selectHr'/>";
  htmlNotes +=
    " <li id='idCensura'><button id='idCensuraAction'>Censure <div class='dot2'/> </button></li>";
  htmlNotes += "<hr class='selectHr'/>";
  htmlNotes +=
    "<li id='idMusica'><button id='idMusicaAction'>Notazioni Musicali <div class='dot7'/> </button></li>";
  htmlNotes += "</ul>";
  htmlNotes += "</div>";
  $(function () {
    // Dropdown toggle
    $(".dropdown-toggle").click(function () {
      $(this).next(".dropdown").slideToggle();
    });

    $(document).click(function (e) {
      $("#idIconologiaAction").click(() => {
        $("#idDropdownToggle").html(
          "Iconologia e Iconografia <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'>"
        );
        $(".selectContainer").css("background-color", "#BF2517B2");

        APP.filterAnnotationsByCat("Iconologia e Iconografia");
      });
      $("#idStrutturaAction").click(() => {
        $("#idDropdownToggle").html(
          "Struttura <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'>"
        );
        $(".selectContainer").css("background-color", "#2F4689");

        APP.filterAnnotationsByCat("Struttura");
      });
      $("#idConservazioneAction").click(() => {
        $("#idDropdownToggle").html(
          "Conservazione e Restauro <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'>"
        );
        $(".selectContainer").css("background-color", "#D9A441");

        APP.filterAnnotationsByCat("Conservazione e Restauro");
      });
      $("#idTestoAction").click(() => {
        $("#idDropdownToggle").html(
          "Testo e Scrittura <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'>"
        );
        $(".selectContainer").css("background-color", "#E7F0F9");
        $(".filterText").css("color", "rgb(110, 110, 110)");

        APP.filterAnnotationsByCat("Testo e Scrittura");
      });
      $("#idMaterialiAction").click(() => {
        $("#idDropdownToggle").html(
          "Materiali e Tecniche <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'>"
        );
        $(".selectContainer").css("background-color", "#422C20");
        APP.filterAnnotationsByCat("Materiali e Tecniche Esecutive");
      });
      $("#idCensuraAction").click(() => {
        $("#idDropdownToggle").html(
          "Censure <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'>"
        );
        $(".selectContainer").css("background-color", "#FF7F11");

        APP.filterAnnotationsByCat("Censure");
      });
      $("#idMusicaAction").click(() => {
        $("#idDropdownToggle").html(
          "Notazioni Musicali <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'>"
        );
        $(".selectContainer").css("background-color", "#79b857");

        APP.filterAnnotationsByCat("Notazioni Musicali");
      });

      var target = e.target;
      if (
        !$(target).is(".dropdown-toggle") &&
        !$(target).parents().is(".dropdown-toggle")
      ) {
        //{ $('.dropdown').hide(); }
        $(".dropdown").slideUp();
      }
    });
    $(".dropdown-toggle").click(() => {
      $("#idSelectArrow").attr("src", "assets/downArrow.png"),
        $("#idSelectArrow").attr("src", "assets/upArrow.png");
    });
  });

  $("#idSelect").html(htmlNotes);

  //bottom toolbar for Public UI to allow navigation through poses
  let htmlBottom = "";
  htmlBottom +=
    "<a href='#'><img class='codexLogo' src='assets/logo.png' /></a>";
  htmlBottom += "<div id='idPoseGallery' class='previewContainer scrollableX'>";
  // htmlBottom += "<div class='posePreview'> </div>";
  // htmlBottom += "<div class='posePreview' > </div>";
  htmlBottom += "</div>";

  $("#idCollapsible").off("click");
  $("#idCollapsible").on("click", () => {
    var initialState = $("#idBottomToolbar").css("height") === "0px";
    console.log(initialState);
    if (initialState) {
      $("#idBottomToolbar").css("height", "100px");
      $("#idArrow").attr("src", "assets/upArrow.png");
      $("#idCollapsible").css("bottom", "80px");
    } else {
      $("#idBottomToolbar").css("height", "0%");
      $("#idArrow").attr("src", "assets/downArrow.png");
      $("#idCollapsible").css("bottom", "0px");
    }
  });

  $("#idBottomToolbar").html(htmlBottom);

  // all the tools to manage the lens, width and depth:
  let htmlView = "";
  htmlView += "<div class='layerSelector'>";
  htmlView +=
    "<button class='layerButton' id='idRgb'><img id='idImgLayer1' class='layer' src='assets/layer.png' alt='layer' /></button>";
  htmlView +=
    "<button class='layerButton' id='idIr1'><img id='idImgLayer2' class='layer' src='assets/layer.png' alt='layer' /></button>";
  htmlView +=
    "<button class='layerButton' id='idIr2'><img id='idImgLayer3' class='layer' src='assets/layer.png' alt='layer' /></button>";
  htmlView +=
    "<button class='layerButton' id='idIr3'><img id='idImgLayer4' class='layer' src='assets/layer.png' alt='layer' /></button>";
  htmlView += "<button class='pause' id='idPauseButton'>";
  htmlView +=
    "<img class='imgPause' id='idImgPause' src='assets/icons/Pausa_OFF.png'>";
  htmlView += "</button>";
  htmlView += " <button class='play' id='idPlayButton'>";
  htmlView +=
    "<img class='imgPlay' id='idImgPlay' src='assets/icons/Play_OFF.png'>";
  htmlView += "</button>";
  htmlView += "</div>";

  //populating the #idViewControl div :
  $("#idViewControl").html(htmlView);
  // method to track slider progression to expand the lens width:
  var isFF = true;
  var addRule = (function (style) {
    var sheet = document.head.appendChild(style).sheet;
    return function (selector, css) {
      if (isFF) {
        if (sheet.cssRules.length > 0) {
          sheet.deleteRule(0);
        }

        try {
          sheet.insertRule(selector + "{" + css + "}", 0);
        } catch (ex) {
          isFF = false;
        }
      }
    };
  })(document.createElement("style"));

  $("#idSliderLens").on("input", function () {
    $(this).css(
      "background",
      "linear-gradient(to right, rgba(198, 150, 59, 1) 0%, rgba(198, 150, 59, 1) " +
        this.value +
        "%, transparent " +
        this.value +
        "%, transparent 100%)"
    );
  });
  $("#idZoom").on("click",
  () => {
if ($("#idZoom").attr("src") == "assets/icons/Zoom_OFF.png"){
  $("#idZoom").attr("src", "assets/icons/Zoom_ON.png")
} else {
  $("#idZoom").attr("src", "assets/iconsgo/Zoom_OFF.png")
}
  })

  // hovering actions on the layer selectors:
  $("#idRgb").click(() => {
    UI.setLayer(APP.LAYER_RGB);
  });
  $("#idIr1").click(() => {
    UI.setLayer(APP.LAYER_IR1);
  });
  $("#idIr2").click(() => {
    UI.setLayer(APP.LAYER_IR2);
  });
  $("#idIr3").click(() => {
    UI.setLayer(APP.LAYER_IR3);
  });

  function loop() {
    setTimeout(() => {
      $("#idImgLayer2").attr("src", "assets/active_layer.png");
      $("#idImgLayer1").attr("src", "assets/layer.png");
      setTimeout(() => {
        $("#idImgLayer2").attr("src", "assets/layer.png");
        $("#idImgLayer3").attr("src", "assets/active_layer.png");
        setTimeout(() => {
          $("#idImgLayer3").attr("src", "assets/layer.png");
          $("#idImgLayer4").attr("src", "assets/active_layer.png");
          setTimeout(() => {
            $("#idImgLayer4").attr("src", "assets/layer.png");
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  }
  // click actions for the play/pause buttons:
  $("#idPauseButton").on("click", () => {
    if ($("#idImgPause").attr("src") == "assets/icons/Pausa_OFF.png") {
      $("#idImgPause").attr("src", "assets/icons/Pausa_ON.png");
      $("#idImgPlay").attr("src", "assets/icons/Play_OFF.png");
    }
  });
  $("#idPlayButton").on("click", () => {
    if ($("#idImgPlay").attr("src") == "assets/icons/Play_OFF.png") {
      $("#idImgPlay").attr("src", "assets/icons/Play_ON.png");
      $("#idImgPause").attr("src", "assets/icons/Pausa_OFF.png");
      $("#idImgLayer1").attr("src", "assets/active_layer.png");
      loop();
    } else {
      $("#idImgPlay").attr("src", "assets/icons/Play_OFF.png");
    }
  });

  //ATON.FE.uiAddButtonVR("idTopToolbar");
};

UI.buildEditor = () => {
  // Clear
  $("#idTopToolbar").html("");
  $("#idBottomToolbar").html("");
  $("#idLeftToolbar").html("");

/*
  TODO: dynamic username (REST API), logout routine

  // changing user avatar
  $("idLogin").html("")

  let htmlUserEditor = ""
  htmlUserEditor = "<button id='idUser' class='user'>"
  htmlUserEditor += "<img id='idUserAction' class='userIcon' src='assets/icons/avatar.png' alt='user'/>"
  htmlUserEditor += "<p id='idLoginActionText' class='userText'> User</p>"
  htmlUserEditor += "</button>"
  htmlUserEditor += "<button id='#idLogout' class='logoutButton'>Pippo</button>"

  $("#idLogin").replaceWith(htmlUserEditor)

  $("#idUser").on("click",
  () => {
$("#idLogout").show()
  })
*/

// $("#idLogin").on("click", 
// () => {
//   console.log("pippo")
// })

  // Note filtering for Editor

  let htmlNotesEditor = "";
  htmlNotesEditor = "<div class='selectContainer'>";
  htmlNotesEditor += "<p class='filterText'> Note </p>";
  htmlNotesEditor +=
    "<button class='dropdown-toggle' id='selezioneCategoria' >Seleziona categoria <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'></button>";
  htmlNotesEditor += "<ul  class='dropdown'>";
  htmlNotesEditor +=
    " <li id='idIconologia'><button id='idIconologiaAction'  >Iconologia e Iconografia</button> <div class='dot'/></li>";
  htmlNotesEditor += "<hr class='selectHr'/>";
  htmlNotesEditor +=
    "<li id='idStruttura' ><button id='idStrutturaAction' >Struttura</button> <div class='dot4'/></li>";
  htmlNotesEditor += "<hr class='selectHr'/>";
  htmlNotesEditor +=
    "<li id='idConservazione'><button id='idConservazioneAction' > Conservazione e Restauro</button> <div class='dot5'/></li>";
  htmlNotesEditor += "<hr class='selectHr'/>";
  htmlNotesEditor +=
    " <li id='idTesto'><button id='idTestoAction'  >Testo e Scrittura</button> <div class='dot6'/></li>";
  htmlNotesEditor += "<hr class='selectHr'/>";
  htmlNotesEditor +=
    "<li id='idMateriali'><button id='idMaterialiAction' >Materiali e Tecniche</button> <div class='dot3'/></li>";
  htmlNotesEditor += "<hr class='selectHr'/>";
  htmlNotesEditor +=
    " <li id='idCensura'><button id='idCensuraAction' >Censura</button> <div class='dot2'/></li>";
  htmlNotesEditor += "<hr class='selectHr'/>";
  htmlNotesEditor +=
    "<li id='idMusica'><button id='idMusicaAction' >Notazioni Musicali</button> <div class='dot7'/></li>";
  htmlNotesEditor += "</ul>";
  htmlNotesEditor += "</div>";
  $(function () {
    // Dropdown toggle
    $(".dropdown-toggle").click(function () {
      $(this).next(".dropdown").slideToggle();
    });

    $(document).click(function (e) {
      $("#idIconologiaAction").click(() => {
        $("#idDropdownToggle").html(
          "Iconologia e Iconografia <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'>"
        );
        $(".selectContainer").css("background-color", "#BF2517B2");

        APP.filterAnnotationsByCat("Iconologia e Iconografia");
      });
      $("#idStrutturaAction").click(() => {
        $("#idDropdownToggle").html(
          "Struttura <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'>"
        );
        $(".selectContainer").css("background-color", "#2F4689");

        APP.filterAnnotationsByCat("Struttura");
      });
      $("#idConservazioneAction").click(() => {
        $("#idDropdownToggle").html(
          "Conservazione e Restauro <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'>"
        );
        $(".selectContainer").css("background-color", "#D9A441");
        APP.filterAnnotationsByCat("Conservazione e Restauro");
      });
      $("#idTestoAction").click(() => {
        $("#idDropdownToggle").html(
          "Testo e Scrittura <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'>"
        );
        $(".selectContainer").css("background-color", "#E7F0F9");
        $(".filterText").css("color", "rgb(110, 110, 110)");

        APP.filterAnnotationsByCat("Testo e Scrittura");
      });
      $("#idMaterialiAction").click(() => {
        $("#idDropdownToggle").html(
          "Materiali e Tecniche <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'>"
        );
        $(".selectContainer").css("background-color", "#422C20");
        APP.filterAnnotationsByCat("Materiali e Tecniche Esecutive");
      });
      $("#idCensuraAction").click(() => {
        $("#idDropdownToggle").html(
          "Censure <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'>"
        );
        $(".selectContainer").css("background-color", "#FF7F11");
        APP.filterAnnotationsByCat("Censure");
      });
      $("#idMusicaAction").click(() => {
        $("#idDropdownToggle").html(
          "Notazioni Musicali <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'>"
        );
        $(".selectContainer").css("background-color", "#79b857");
        APP.filterAnnotationsByCat("Notazioni Musicali");
      });

      var target = e.target;
      if (
        !$(target).is(".dropdown-toggle") &&
        !$(target).parents().is(".dropdown-toggle")
      ) {
        //{ $('.dropdown').hide(); }
        $(".dropdown").slideUp();
      }
    });
    $(".dropdown-toggle").click(() => {
      $("#idSelectArrow").attr("src", "assets/downArrow.png"),
        $("#idSelectArrow").attr("src", "assets/upArrow.png");
    });
  });

  $("#idSelect").html(htmlNotesEditor);

  //Initializing Bottom Toolbar for Editor User
  let htmlBottomEditor = "";
  htmlBottomEditor +=
    "<a href='#'><img class='codexLogo' src='assets/logo.png' /></a>";
  htmlBottomEditor +=
    "<div id='idPoseGallery' class='previewContainer scrollableX'>";

  htmlBottomEditor += "</div>";

  $("#idCollapsible").off("click");
  $("#idCollapsible").on("click", () => {
    var initialState = $("#idBottomToolbar").css("height") === "0px";
    console.log(initialState);
    if (initialState) {
      $("#idBottomToolbar").css("height", "100px");
      $("#idArrow").attr("src", "assets/upArrow.png");
      $("#idCollapsible").css("bottom", "80px");
    } else {
      $("#idBottomToolbar").css("height", "0%");
      $("#idArrow").attr("src", "assets/downArrow.png");
      $("#idCollapsible").css("bottom", "0px");
    }
  });
  $("#idBottomToolbar").html(htmlBottomEditor);

  // all the tools to manage the lens, width and depth:
  let htmlViewEditor = "";
  htmlViewEditor += "<div class='layerSelector'>";
  htmlViewEditor +=
    "<button class='layerButton' id='idRgb'><img id='idImgLayer1' class='layer' src='assets/layer.png' alt='layer' /></button>";
  htmlViewEditor +=
    "<button class='layerButton' id='idIr1'><img id='idImgLayer2' class='layer' src='assets/layer.png' alt='layer' /></button>";
  htmlViewEditor +=
    "<button class='layerButton' id='idIr2'><img id='idImgLayer3' class='layer' src='assets/layer.png' alt='layer' /></button>";
  htmlViewEditor +=
    "<button class='layerButton' id='idIr3'><img id='idImgLayer4' class='layer' src='assets/layer.png' alt='layer' /></button>";
  htmlViewEditor += "<button class='pause' id='idPauseButton'>";
  htmlViewEditor +=
    "<img class='imgPause' id='idImgPause' src='assets/icons/Pausa_OFF.png'>";
  htmlViewEditor += "</button>";
  htmlViewEditor += " <button class='play' id='idPlayButton'>";
  htmlViewEditor +=
    "<img class='imgPlay' id='idImgPlay' src='assets/icons/Play_OFF.png'>";
  htmlViewEditor += "</button>";
  htmlViewEditor += "</div>";

  //populating the #idViewControl div :
  $("#idViewControl").html(htmlViewEditor);
  // method to track slider progression to expand the lens width:
  var isFF = true;
  var addRule = (function (style) {
    var sheet = document.head.appendChild(style).sheet;
    return function (selector, css) {
      if (isFF) {
        if (sheet.cssRules.length > 0) {
          sheet.deleteRule(0);
        }

        try {
          sheet.insertRule(selector + "{" + css + "}", 0);
        } catch (ex) {
          isFF = false;
        }
      }
    };
  })(document.createElement("style"));

  $("#slider").on("input", function () {
    $(this).css(
      "background",
      "linear-gradient(to right, rgba(198, 150, 59, 1) 0%, rgba(198, 150, 59, 1) " +
        this.value +
        "%, transparent " +
        this.value +
        "%, transparent 100%)"
    );
  });

  // hovering actions on the layer selectors:
  $("#idRgb").click(() => {
    UI.setLayer(APP.LAYER_RGB);
  });
  $("#idIr1").click(() => {
    UI.setLayer(APP.LAYER_IR1);
  });
  $("#idIr2").click(() => {
    UI.setLayer(APP.LAYER_IR2);
  });
  $("#idIr3").click(() => {
    UI.setLayer(APP.LAYER_IR3);
  });

  // hovering actions for the play/pause buttons:
  $("#idPauseButton").click(() => {
    $("#idImgPause").attr("src", "assets/icons/Pausa_ON.png");
    $("#idImgPlay").attr("src", "assets/icons/Play_OFF.png");
  });
  $("#idPlayButton").click(() => {
    $("#idImgPlay").attr("src", "assets/icons/Play_ON.png");
    $("#idImgPause").attr("src", "assets/icons/Pausa_OFF.png");
  });

  //Initializing Left Toolbar for Editor User
  let htmlLeftEditor = "";

  htmlLeftEditor += "<ul style='list-style-type: none;'>";

  htmlLeftEditor +=
    "<li><button id='idFull'class='toolbarButton' type='button'> <img id='idFullsize' class='toolbarIcon' src='assets/icons/icon_fullsize.png'> </button></li>";
  htmlLeftEditor += "<hr class='hr' />";
  htmlLeftEditor +=
    "<li><button id='idReset' class='toolbarButton' type='button'> <img id='idResetScene' class='toolbarIcon' src='assets/icons/icon_resetvista.png' /> </button></li>";
  htmlLeftEditor += "<hr class='hr' />";
  htmlLeftEditor +=
    "<li><button id='idLayer' class='toolbarButton' type='button'> <img id='idChooseLayer' class='toolbarIcon' src='assets/icons/icon_layer.png' /> </button></li>";
  htmlLeftEditor += "<hr class='hr' />";
  htmlLeftEditor +=
    "<li><button id='idAnnotations' class='toolbarButton' type='button'> <img id='idTurnAnnotations' class='toolbarIcon' src='assets/icons/icon_annotazioni.png' /> </button></li>";
  htmlLeftEditor += "<hr class='hr' />";
  htmlLeftEditor +=
    "<li><button id='idSize' class='toolbarButton' type='button'> <img id='idTurnSize' class='toolbarIcon' src='assets/icons/icon_size_OFF.png' /> </button></li>";
  htmlLeftEditor += "<hr class='hr' />";
  htmlLeftEditor +=
    "<li><button id='idNote' class='toolbarButton' type='button'><img id='idTurnNote' class='toolbarIcon'src='assets/icons/Icona_Aton_Edit_OFF.png' /> </button></li>";
  htmlLeftEditor +=
    "<li><button id='idHelp' class='toolbarHelp' type='button'> <img id='idTurnHelp' class='toolbarIcon' src='assets/icons/icon_help.png' /> </button></li>";
  htmlLeftEditor += "<hr class='helpDivider' />";
  htmlLeftEditor += "</ul>";

  $("#idLeftToolbar").html(htmlLeftEditor);

  $("#idFull").on("click", () => {
    if ($("#idFullsize").attr("src") == "assets/icons/icon_fullsize.png") {
      $("#idFullsize").attr("src", "assets/icons/icon_fullsizeON.png");

      $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idTurnAnnotations").attr("src", "assets/icons/icon_annotazioni.png");
      $("#idTurnSize").attr("src", "assets/icons/icon_size_OFF.png");
      $("#idTurnHelp").attr("src", "assets/icons/icon_help.png");
    } else {
      $("#idFullsize").attr("src", "assets/icons/icon_fullsize.png");
    }
  });

  $("#idReset").on("click", () => {
    if ($("#idResetScene").attr("src") == "assets/icons/icon_resetvista.png") {
      $("#idResetScene").attr("src", "assets/icons/icon_resetvistaON.png");
      $("#idFullsize").attr("src", "assets/icons/icon_fullsize.png");
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idTurnAnnotations").attr("src", "assets/icons/icon_annotazioni.png");
      $("#idTurnSize").attr("src", "assets/icons/icon_size_OFF.png");
      $("#idTurnHelp").attr("src", "assets/icons/icon_help.png");
      $("#idSelect").hide();
      $("#idViewControlContainer").hide();
    } else {
      $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
    }
  });

  $("#idLayer").click(() => {
    if ($("#idChooseLayer").attr("src") == "assets/icons/icon_layer.png") {
      $("#idChooseLayer").attr("src", "assets/icons/icon_layerON.png");
      $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
      $("#idFullsize").attr("src", "assets/icons/icon_fullsize.png");
      $("#idTurnAnnotations").attr("src", "assets/icons/icon_annotazioni.png");
      $("#idTurnSize").attr("src", "assets/icons/icon_size_OFF.png");
      $("#idTurnHelp").attr("src", "assets/icons/icon_help.png");
      $("#idViewControlContainer").show();
      $("#idSelect").hide();
    } else {
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idViewControlContainer").hide();
    }
  });

  $("#idAnnotations").click(() => {
    if (
      $("#idTurnAnnotations").attr("src") == "assets/icons/icon_annotazioni.png"
    ) {
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
      $("#idFullsize").attr("src", "assets/icons/icon_fullsize.png");
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idTurnSize").attr("src", "assets/icons/icon_size_OFF.png");
      $("#idTurnHelp").attr("src", "assets/icons/icon_help.png");
      $("#idTurnAnnotations").attr(
        "src",
        "assets/icons/icon_annotazioniON.png"
      );
      $("#idSelect").show();
      $("#idViewControlContainer").hide();
    } else {
      $("#idTurnAnnotations").attr("src", "assets/icons/icon_annotazioni.png");
      $("#idSelect").hide();
      $(".selectContainer").css("background-color", "rgb(110, 110, 110)");
    }
  });

  $("#idSize").click(() => {
    if ($("#idTurnSize").attr("src") == "assets/icons/icon_size_OFF.png") {
      $("#idTurnSize").attr("src", "assets/icons/icon_size_ON.png");
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
      $("#idFullsize").attr("src", "assets/icons/icon_fullsize.png");
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idTurnAnnotations").attr("src", "assets/icons/icon_annotazioni.png");
      $("#idTurnHelp").attr("src", "assets/icons/icon_help.png");
      $("#idSelect").hide();
      $("#idViewControlContainer").hide();
    } else {
      $("#idTurnSize").attr("src", "assets/icons/icon_size_OFF.png");
    }
  });

  $("#idHelp").click(() => {
    if ($("#idTurnHelp").attr("src") == "assets/icons/icon_help.png") {
      $("#idTurnHelp").attr("src", "assets/icons/icon_helpON.png");
      $("#idTurnSize").attr("src", "assets/icons/icon_size_OFF.png");
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
      $("#idFullsize").attr("src", "assets/icons/icon_fullsize.png");
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idTurnAnnotations").attr("src", "assets/icons/icon_annotazioni.png");
      $("#idSelect").hide();
      $("#idViewControlContainer").hide();
    } else {
      $("#idTurnHelp").attr("src", "assets/icons/icon_help.png");
    }
  });
  $("#idNote").on("click", () => {
    if (
      $("#idTurnNote").attr("src") == "assets/icons/Icona_Aton_Edit_OFF.png"
    ) {
      $("#idTurnNote").attr("src", "assets/icons/Icona_Aton_Edit_ON.png");
      $("#idTurnHelp").attr("src", "assets/icons/icon_help.png");
      $("#idTurnSize").attr("src", "assets/icons/icon_size_OFF.png");
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
      $("#idFullsize").attr("src", "assets/icons/icon_fullsize.png");
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idTurnAnnotations").attr("src", "assets/icons/icon_annotazioni.png");
      $("#idSelect").hide();
      $("#idViewControlContainer").hide();
    } else {
      $("#idTurnNote").attr("src", "assets/icons/Icona_Aton_Edit_OFF.png");
    }
  });

  $("#idTurnNote").click(() => {
    console.log("cliccato");
    $("#selectAnnType").show();
    /*
    $("#selectAnnType").html("");

    let htmlcode = "";
    htmlcode = "<hr id='idHrNote' />";
    htmlcode = "<ul style='list-style-type: none;'>";

    htmlcode +=
      "<li><button id='sphere' class='toolbarButton' type='button'><img id='idTurnSphere' class='toolbarIcon' src='assets/icons/cerchio_annotazione_OFF.png'></button></li>";
    htmlcode +=
      "<li><button id='free' class='toolbarButton'> <img id='idTurnAreal' class='toolbarIcon' src='assets/icons/Aton_areale_OFF.png'/> </button></li>";
    htmlcode += "</ul>";

    $("#selectAnnType").append(htmlcode);
*/
    $("#sphere").on(
      "click",

      () => {
        if (
          $("#idTurnSphere").attr("src") ==
          "assets/icons/cerchio_annotazione_OFF.png"
        ) {
          $("#idTurnSphere").attr(
            "src",
            "assets/icons/cerchio_annotazione_ON.png"
          );
        } else {
          $("#idTurnSphere").attr(
            "src",
            "assets/icons/cerchio_annotazione_OFF.png"
          );
        }
      }
    );

    $("#free").on("click", () => {
      if ($("#idTurnAreal").attr("src") == "assets/icons/Aton_areale_OFF.png") {
        $("#idTurnAreal").attr("src", "assets/icons/Aton_areale_ON.png");
      } else {
        $("#idTurnAreal").attr("src", "assets/icons/Aton_areale_OFF.png");
      }
    });
    /*
    $("#sphere").click(() => {
      $("#idForm").show();
      //$("#id");
      //UI.addAnnotation(ATON.FE.SEMSHAPE_SPHERE);
    });
*/
  });
  $("#selectAnnType").mouseleave(() => {
    $("#selectAnnType").hide();
  });
};

UI.toggleSemPanel = (b) => {
  if (b) {
    $("#idPanel").show();
    $("#idTopToolbar").hide();
    $("#idBottomToolbar").hide();
    $("#idCollapsible").hide();
    $("#idLeftToolbar").hide();
  } else {
    $("#idPanel").hide();
    $("#idTopToolbar").show();
    $("#idBottomToolbar").show();
    $("#idCollapsible").show();
    $("#idLeftToolbar").show();
  }
};

/*
    Update UI panel (HTML) from semantic ID (shape)
====================================================*/
UI.updateSemPanel = (semid) => {
  let pDB = ATON.SceneHub.currData.sem; //APP.sDB[APP.currPose];
  if (pDB === undefined) return;

  let S = pDB[semid];
  if (S === undefined) return;

  // Generate HTML for panel
  let htmlcode = "";
  htmlcode += "<div class='appPanelHeader'>";
  htmlcode +=
    "<div class='appPanelBTN' onclick='APP.UI.toggleSemPanel(false)'><img src='" +
    ATON.FE.PATH_RES_ICONS +
    "cancel.png'></div>&nbsp;&nbsp;";
  //htmlcode += "<div id='idPanelClose' class='atonBTN' style='float:left; margin:0px;'>X</div>"; // background-color: #bf7b37
  
  if (S.title) htmlcode += S.title;

  if (ATON.SceneHub._bEdit) {
    htmlcode += "<div style='float:right'>";
    htmlcode +=
      "<div class='appPanelBTN'><img src='" +
      ATON.FE.PATH_RES_ICONS +
      "edit.png'></div>";
    htmlcode +=
      "<div class='appPanelBTN' onclick='APP.deleteSemAnnotation(\""+semid+"\")'><img src='" +
      ATON.FE.PATH_RES_ICONS +
      "trash.png'></div></div>";
  }
  htmlcode += "</div>";
 htmlcode += "<div class='layerPanelSelector'>"
 if (S.layer === APP.LAYER_RGB) {
  htmlcode += "<img id='idImgPanelLayer1' class='layerPanel' src='assets/active_layer_panel.png' alt='layer' />"
  htmlcode += "<img id='idImgPanelLayer2' class='layerPanel' src='assets/layer_panel.png' alt='layer' />";
  htmlcode += "<img id='idImgPanelLayer3' class='layerPanel' src='assets/layer_panel.png' alt='layer' />";
  htmlcode += "<img id='idImgPanelLayer4' class='layerPanel' src='assets/layer_panel.png' alt='layer' />"
};
if (S.layer === APP.LAYER_IR1) {
  htmlcode += "<img id='idImgPanelLayer1' class='layerPanel' src='assets/layer_panel.png' alt='layer' />"
  htmlcode += "<img id='idImgPanelLayer2' class='layerPanel' src='assets/active_layer_panel.png' alt='layer' />";
  htmlcode += "<img id='idImgPanelLayer3' class='layerPanel' src='assets/layer_panel.png' alt='layer' />";
  htmlcode += "<img id='idImgPanelLayer4' class='layerPanel' src='assets/layer_panel.png' alt='layer' />"
};
if (S.layer === APP.LAYER_IR2) {
  htmlcode += "<img id='idImgPanelLayer1' class='layerPanel' src='assets/layer_panel.png' alt='layer' />"
  htmlcode += "<img id='idImgPanelLayer2' class='layerPanel' src='assets/layer_panel.png' alt='layer' />";
  htmlcode += "<img id='idImgPanelLayer3' class='layerPanel' src='assets/active_layer_panel.png' alt='layer' />";
  htmlcode += "<img id='idImgPanelLayer4' class='layerPanel' src='assets/layer_panel.png' alt='layer' />"
};
if (S.layer === APP.LAYER_IR3) {
  htmlcode += "<img id='idImgPanelLayer1' class='layerPanel' src='assets/layer_panel.png' alt='layer' />"
  htmlcode += "<img id='idImgPanelLayer2' class='layerPanel' src='assets/layer_panel.png' alt='layer' />";
  htmlcode += "<img id='idImgPanelLayer3' class='layerPanel' src='assets/layer_panel.png' alt='layer' />";
  htmlcode += "<img id='idImgPanelLayer4' class='layerPanel' src='assets/active_layer_panel.png' alt='layer' />"
};

  htmlcode += "</div>"
  htmlcode +=
    "<div class='atonSidePanelContent' style='height: calc(100% - 50px);'>";

  htmlcode += "<div class='appPanelLayer'>";
  if (S.layer === APP.LAYER_RGB) htmlcode += "Livello RGB";
  if (S.layer === APP.LAYER_IR1) htmlcode += "Livello IR 1";
  if (S.layer === APP.LAYER_IR2) htmlcode += "Livello IR 2";
  if (S.layer === APP.LAYER_IR3) htmlcode += "Livello IR 3";
  
  htmlcode += "</div>";
 
  if (S.cat) htmlcode += "<div class='appPanelSub'>" + S.cat + "</div>";
  if (S.subcat) htmlcode += "<b>Sotto-categoria</b>: " + S.subcat + "<br>";
  htmlcode += "<br>";

  if (S.media){
    htmlcode += "<img src='" + S.media + "'><br>";
  }

  htmlcode += "<div class='descriptionText'>";
  if (S.descr) htmlcode += S.descr;
  htmlcode += "</div></div>";

  //htmlcode += "<div id='idPanelClose' class='atonBTN atonBTN-red atonSidePanelCloseBTN' >X</div>";

  ATON.FE.playAudioFromSemanticNode(semid);

  $("#idPanel").html(htmlcode);
  UI.toggleSemPanel(true);
};

UI.setIntroPanel = (content)=>{
  let htmlcode = "";

  htmlcode += "<div class='appPanelHeader'>";
  htmlcode += "<div class='appPanelBTN' onclick='APP.UI.toggleSemPanel(false)'><img src='" +ATON.FE.PATH_RES_ICONS +"cancel.png'></div></div>";
  
  htmlcode += "<div class='atonSidePanelContent' style='height: calc(100% - 50px);'>";
  htmlcode += content;
  htmlcode += "</div>";

  $("#idPanel").html(htmlcode);
  UI.toggleSemPanel(true);
};

/*
    UI form (HTML) with structured data
    Editor profile
====================================================*/

// semtype: ATON.FE.SEMSHAPE_SPHERE | ATON.FE.SEMSHAPE_CONVEX
UI.addAnnotation = (semtype) => {
  ATON._bPauseQuery = true;

  let O = {};
  let semid = ATON.Utils.generateID("ann");

  let htmlcode = "";

  //htmlcode += "<form style='position:relative; top:2%'>";
  htmlcode += "<div class='formTitleContainer'>";
  htmlcode +=
    "<h3 class='formTitle'> Titolo</h3> <input id='idTitle' type='text' class='titleInput' ></input>";
  htmlcode += "</div>";
  htmlcode += "<div class='categoryContainer'>";
  htmlcode +=
    "<h3 class='formTitle'> Categoria</h3> <select id='catSelect' type='select' class='categorySelect'>";
 
  htmlcode +=
    "<option class='catOption' value='Iconologia e Iconografia' >Iconologia e Iconografia</option>";
  htmlcode +=
    "<option class='catOption' value='Materiali e Tecniche Esecutive' >Materiali e Tecniche Esecutive</option>";
  htmlcode += "<option class='catOption' value='Struttura' >Struttura</option>";
  htmlcode +=
    "<option class='catOption' value='Conservazione e Restauro'>Conservazione e Restauro</option>";
  htmlcode +=
    "<option class='catOption' value='Testo e Scrittura'>Testo e Scrittura</option>";
  htmlcode += "<option class='catOption' value='Censure'>Censure</option>";
  htmlcode +=
    "<option class='catOption' value='Notazioni Musicali'>Notazioni Musicali</option>";
  htmlcode += "</select>";
  htmlcode += "</div>";
  htmlcode += "<div id='selectPlace' class='subCatSelectContainer'>";
  htmlcode +=
    "<h3 class='formTitle' > Sottocategoria</h3> <select id='sottoCatSelect' type='select' class='subCategorySelect' >";
    htmlcode +=
    "<option class='catOption' value='Personaggi e Simboli' >Personaggi e Simboli</option>";
  htmlcode += "<option class='catOption' value='Stile' >Stile</option>";
  htmlcode +=
    "<option class='catOption' value='Messaggio Ideologico' >Messaggio Ideologico</option>";
  htmlcode +=
    "<option class='catOption' value='Fonti e Tradizioni'>Fonti e Tradizioni</option>";
  htmlcode +=
    "<option class='catOption' value='Datazione e Attribuzione'>Datazione e Attribuzione</option>";
  htmlcode +=
    "<option class='catOption' value='Confronti Visivi'>Confronti Visivi</option>";
  htmlcode +=
    "<option class='catOption' value='Ripensamenti'>Ripensamenti</option>";
  htmlcode +=
    "<option class='catOption' value='Elementi Ornamentali'>Elementi Ornamentali</option>";
  htmlcode +=
    "<option class='catOption' value='Descrizione'>Descrizione</option>";
  htmlcode +=
    "<option class='catOption' value='Modifiche Successive'>Modifiche Successive</option>";
  htmlcode += "</select>";
  htmlcode += "</div>";
  htmlcode += "<div class='descriptionContainer'>";
  htmlcode +=
    "<h3 class='formTitle' >Descrizione</h3> <textarea class='descriptionInput' type='text' id='idDescription' max-length='500' ></textarea>";
  htmlcode += "</div>";
  htmlcode += "<div style='position:relative; top:5px'>";
  // htmlcode +=
  //   "<span style='position: relative; left: 30px;' id='rchars'>650 </span> <span style='position: relative; left: 30px;'> caratteri rimasti</span>";
  // htmlcode += "</div>";

  htmlcode += "<div class='fileContainer'>";
  htmlcode += "<label for='files' class='formTitle'>File Multimediali </label>";
  htmlcode += "<input class='uploadLink' id='files' type='text'/>"; // <img class='uploadIcon' src='assets/icons/Upload_icon_OFF.png' alt='upload'>
  htmlcode += "</div>";


  htmlcode += "<div class='authorContainer'>";
  htmlcode += "<h3 class='formTitle'>Autore</h3> <input class='authorInput' type='text' ></input>";
  htmlcode += "</div>";
  //htmlcode += "</form>";

  htmlcode += "<button id='idDelete' class='cancelButton'>Annulla</button>";
  htmlcode += "<button id='idOk' class='okButton' >Conferma</button>";
  htmlcode += "</div>";

  $("#idForm").html(htmlcode);

  $("#catSelect").change(function () {
    $("#sottoCatSelect").html("");
    // Setting logic to nest SubCategories in Categories
    if (this.value === "Iconologia e Iconografia") {
      let htmlcode = "";
      htmlcode +=
        "<option class='catOption' value='Personaggi e Simboli' >Personaggi e Simboli</option>";
      htmlcode += "<option class='catOption' value='Stile' >Stile</option>";
      htmlcode +=
        "<option class='catOption' value='Messaggio Ideologico' >Messaggio Ideologico</option>";
      htmlcode +=
        "<option class='catOption' value='Fonti e Tradizioni'>Fonti e Tradizioni</option>";
      htmlcode +=
        "<option class='catOption' value='Datazione e Attribuzione'>Datazione e Attribuzione</option>";
      htmlcode +=
        "<option class='catOption' value='Confronti Visivi'>Confronti Visivi</option>";
      htmlcode +=
        "<option class='catOption' value='Ripensamenti'>Ripensamenti</option>";
      htmlcode +=
        "<option class='catOption' value='Elementi Ornamentali'>Elementi Ornamentali</option>";
      htmlcode +=
        "<option class='catOption' value='Descrizione'>Descrizione</option>";
      htmlcode +=
        "<option class='catOption' value='Modifiche Successive'>Modifiche Successive</option>";

      $("#sottoCatSelect").append(htmlcode);
    } else if (this.value === "Materiali e Tecniche Esecutive") {
      console.log("cliccato", this.value);
      let htmlcode = "";
      htmlcode +=
        "<option class='catOption' value='Particolarità dei Materiali' >Particolarità dei Materiali</option>";
      htmlcode +=
        "<option class='catOption' value='Particolarità delle Tecniche Esecutive' >Particolarità delle Tecniche Esecutive</option>";

      $("#sottoCatSelect").append(htmlcode);
    } else if (this.value === "Struttura") {
      console.log("cliccato", this.value);
      let htmlcode = "";
      htmlcode +=
        "<option class='catOption' value='Dimensione' >Dimensione</option>";
      htmlcode +=
        "<option class='catOption' value='Legatura' >Legatura</option>";
      htmlcode +=
        "<option class='catOption' value='Fascicolazione' >Fascicolazione</option>";
      htmlcode +=
        "<option class='catOption' value='Impaginazione' >Impaginazione</option>";
      htmlcode +=
        "<option class='catOption' value='Elementi di Riuso' >Elementi di Riuso</option>";
      htmlcode +=
        "<option class='catOption' value='Particolarita di Struttura' >Particolarità di Struttura</option>";
      $("#sottoCatSelect").append(htmlcode);
    } else if (this.value === "Conservazione e Restauro") {
      let htmlcode = "";
      htmlcode +=
        "<option class='catOption' value='Restauri' >Restauri</option>";
      htmlcode +=
        "<option class='catOption' value='Evidenze Biologiche' >Evidenze Biologiche</option>";
      htmlcode +=
        "<option class='catOption' value='Evidenze Chimiche' >Evidenze Chimiche</option>";
      htmlcode +=
        "<option class='catOption' value='Evidenze Fisiche' >Evidenze Fisiche</option>";
      htmlcode +=
        "<option class='catOption' value='Furti E Sottrazioni' >Furti E Sottrazioni</option>";
      htmlcode += "<option class='catOption' value='Danni' >Danni</option>";

      $("#sottoCatSelect").append(htmlcode);
      console.log("cliccato", this.value);
    } else if (this.value === "Testo e Scrittura") {
      let htmlcode = "";
      htmlcode +=
        "<option class='catOption' value='Particolarità di Scrittura' >Particolarità di Scrittura</option>";
      htmlcode +=
        "<option class='catOption' value='Testo da Lettera Miniata' >Testo da Lettera Miniata</option>";
      htmlcode +=
        "<option class='catOption' value='Trascrizione e Traduzione' >Trascrizione e Traduzione</option>";
      htmlcode +=
        "<option class='catOption' value='Note e Appunti' >Note e Appunti</option>";
      htmlcode +=
        "<option class='catOption' value='Modifiche Successive' >Modifiche Successive</option>";

      $("#sottoCatSelect").append(htmlcode);

      console.log("cliccato", this.value);
    } else if (this.value === "Censure") {
      let htmlcode = "";
      htmlcode +=
        "<option class='catOption' value='Censure di Testo' >Censure di Testo</option>";
      htmlcode +=
        "<option class='catOption' value='Censure di Immagini' >Censure di Immagini</option>";

      $("#sottoCatSelect").append(htmlcode);

      console.log("cliccato", this.value);
    } else if (this.value === "Notazioni Musicali") {
      let htmlcode = "";
      $("selectPlace").append(htmlcode);
    } else if (this.value === " ") {
      console.log("cliccato niente");
      alert(
        "È necessario selezionare una categoria per procedere alla compilazione del form"
      );
    }
  });

/*
  $("#image").change(function () {
    if (this.files.length > 3) {
      alert("Limite massimo di immagini superato");
      $("#image").val("");
    }
  });
*/

  // setting count limit for characters in the description
  var maxLength = 650;
  $("#idDescription").keyup(function () {
    var textlen = maxLength - $(this).val().length;
    $("#rchars").text(textlen);
  });

  $("#idDelete").click(() => {
    $("#idForm").hide();
    ATON._bPauseQuery = false;
  });

  $("#idOk").click(() => {
    $("#idForm").hide();

    let title = $("#idTitle").val();
    if (title) title.trim();

    let descr = $("#idDescription").val();
    if (descr) descr.trim();

    let cat = $("#catSelect").val();
    let subcat = $("#sottoCatSelect").val();

    let files = $("#files").val();
    if (files) files = files.trim();

    let O = {};
    if (title) O.title = title;
    if (descr) O.descr = descr;
    if (cat) O.cat = cat;
    if (subcat) O.subcat = subcat;

    if (files) O.media = files;

    O.layer = APP.currLayer;

    APP.addSemanticAnnotation(semid, O, semtype);

    ATON._bPauseQuery = false;
  });
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
