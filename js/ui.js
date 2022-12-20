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

  $("#idFull").hover(
    () => {
      $("#idFullsize").attr("src", "assets/icons/icon_fullsizeON.png");
    },
    () => {
      $("#idFullsize").attr("src", "assets/icons/icon_fullsize.png");
    }
  );

  $("#idReset").hover(
    () => {
      $("#idResetScene").attr("src", "assets/icons/icon_resetvistaON.png");
    },
    () => {
      $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
    }
  );

  $("#idLayer").hover(
    () => {
      $("#idChooseLayer").attr("src", "assets/icons/icon_layerON.png");
    },
    () => {
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
    }
  );

  $("#idAnnotations").hover(
    () => {
      $("#idTurnAnnotations").attr(
        "src",
        "assets/icons/icon_annotazioniON.png"
      );
    },
    () => {
      $("#idTurnAnnotations").attr("src", "assets/icons/icon_annotazioni.png");
    }
  );

  $("#idSize").hover(
    () => {
      $("#idTurnSize").attr("src", "assets/icons/icon_size_ON.png");
    },
    () => {
      $("#idTurnSize").attr("src", "assets/icons/icon_size_OFF.png");
    }
  );

  $("#idHelp").hover(
    () => {
      $("#idTurnHelp").attr("src", "assets/icons/icon_helpON.png");
    },
    () => {
      $("#idTurnHelp").attr("src", "assets/icons/icon_help.png");
    }
  );

  //top toolbar for Public UI to allow Login
  let htmlTop = "<div>";
  htmlTop +=
    "<button id='idLogin' class='login'> <img id='idLoginAction' class='loginIcon' src='assets/icons/icon_login.png' /><p id='idLoginActionText' class='loginText'> Login</p></button>";
  htmlTop += "</div>";

  $("#idTopToolbar").html(htmlTop);

  $("#idLogin").hover(
    () => {
      $("#idLoginAction").attr("src", "assets/icons/icon_loginON.png");
      $("#idLogin").attr("color", "rgba(224, 192, 129, 1)");
    },
    function () {
      $("#idLoginAction").attr("src", "assets/icons/icon_login.png");
    }
  );

  //Note filtering
  let htmlNotes = "";
  htmlNotes += "<p class='filterText'> Note </p>";
  htmlNotes += "<div id='nav'>";
  htmlNotes +=
    "<a class='dropdown-toggle' href='#'>Seleziona categoria <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'></a>";
  htmlNotes += "<ul class='dropdown'>";
  htmlNotes +=
    " <li><a href='#' >Iconologia e Iconografia</a> <div class='dot'/></li>";
  htmlNotes += "<hr class='selectHr'/>";
  htmlNotes += "<li><a href='#' >Struttura</a> <div class='dot4'/></li>";
  htmlNotes += "<hr class='selectHr'/>";
  htmlNotes +=
    "<li><a href='#'> Conservazione e Restauro</a> <div class='dot5'/></li>";
  htmlNotes += "<hr class='selectHr'/>";
  htmlNotes +=
    " <li><a href='#' >Testo e Scrittura</a> <div class='dot6'/></li>";
  htmlNotes += "<hr class='selectHr'/>";
  htmlNotes +=
    "<li><a href='#'>Materiali e Tecniche</a> <div class='dot3'/></li>";
  htmlNotes += "<hr class='selectHr'/>";
  htmlNotes += " <li><a href='#' >Censura</a> <div class='dot2'/></li>";
  htmlNotes += "<hr class='selectHr'/>";
  htmlNotes +=
    "<li><a href='#' >Notazioni Musicali</a> <div class='dot7'/></li>";
  htmlNotes += "</ul>";
  htmlNotes += "</div>";
  $(function () {
    // Dropdown toggle
    $(".dropdown-toggle").click(function () {
      $(this).next(".dropdown").slideToggle();
    });

    $(document).click(function (e) {
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
      $("#idSelectArrow").attr("src", "assets/downArrow.png")
    ,
  $("#idSelectArrow").attr("src", "assets/upArrow.png")})
  });


  $("#idSelect").html(htmlNotes);

  //bottom toolbar for Public UI to allow navigation through poses
  let htmlBottom = "";
  htmlBottom +=
    "<a href='#'><img class='codexLogo' src='assets/logo.png' /></a>";
  htmlBottom += "<div class='previewContainer scrollableX'>";
  htmlBottom += "<div class='posePreview'> </div>";
  htmlBottom += "<div class='posePreview' > </div>";
  htmlBottom += "</div>";

  $("#idCollapsible").on("click", () => {
    var initialState = $("#idBottomToolbar").css("height") === "0px";
    console.log(initialState);
    if (initialState) {
      $("#idBottomToolbar").css("height", "12%");
      $("#idArrow").attr("src", "assets/upArrow.png");
      $("#idCollapsible").css("top", "83%");
    } else {
      $("#idBottomToolbar").css("height", "0%");
      $("#idArrow").attr("src", "assets/downArrow.png");
      $("#idCollapsible").css("top", "96%");
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
  $("#idRgb").hover(
    () => {
      $("#idImgLayer1").attr("src", "assets/active_layer.png");
    },
    () => {
      $("#idImgLayer1").attr("src", "assets/layer.png");
    }
  );
  $("#idIr1").hover(
    () => {
      $("#idImgLayer2").attr("src", "assets/active_layer.png");
    },
    () => {
      $("#idImgLayer2").attr("src", "assets/layer.png");
    }
  );
  $("#idIr2").hover(
    () => {
      $("#idImgLayer3").attr("src", "assets/active_layer.png");
    },
    () => {
      $("#idImgLayer3").attr("src", "assets/layer.png");
    }
  );
  $("#idIr3").hover(
    () => {
      $("#idImgLayer4").attr("src", "assets/active_layer.png");
    },
    () => {
      $("#idImgLayer4").attr("src", "assets/layer.png");
    }
  );

  // hovering actions for the play/pause buttons:
  $("#idPauseButton").hover(
    () => {
      $("#idImgPause").attr("src", "assets/icons/Pausa_ON.png");
    },
    () => {
      $("#idImgPause").attr("src", "assets/icons/Pausa_OFF.png");
    }
  );
  $("#idPlayButton").hover(
    () => {
      $("#idImgPlay").attr("src", "assets/icons/Play_ON.png");
    },
    () => {
      $("#idImgPlay").attr("src", "assets/icons/Play_OFF.png");
    }
  );

  //ATON.FE.uiAddButtonVR("idTopToolbar");
};

UI.buildEditor = () => {
  // Clear
  $("#idTopToolbar").html("");
  $("#idBottomToolbar").html("");
  $("#idLeftToolbar").html("");

  // Initializing top toolbar for Editor User
  let htmlTopEditor = "";
  // htmlTopEditor += "<button id='idLogin' class='login'> <img id='idLoginAction' class='loginIcon' src='assets/icons/icon_login.png' /><p id='idLoginActionText' class='loginText'> Login</p></button>";

  // Clear
  $("#idTopToolbar").html(htmlTopEditor);

  // Note filtering for Editor

  let htmlNotesEditor = "";
  htmlNotesEditor += "<p class='filterText'> Note </p>";
  htmlNotesEditor += "<div id='nav'>";
  htmlNotesEditor +=
    "<a class='dropdown-toggle' href='#'>Seleziona categoria <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'></a>";
  htmlNotesEditor += "<ul class='dropdown'>";
  htmlNotesEditor +=
    " <li><a href='#' >Iconologia e Iconografia</a> <div class='dot'/></li>";
  htmlNotesEditor += "<hr class='selectHr'/>";
  htmlNotesEditor += "<li><a href='#' >Struttura</a> <div class='dot4'/></li>";
  htmlNotesEditor += "<hr class='selectHr'/>";
  htmlNotesEditor +=
    "<li><a href='#'> Conservazione e Restauro</a> <div class='dot5'/></li>";
  htmlNotesEditor += "<hr class='selectHr'/>";
  htmlNotesEditor +=
    " <li><a href='#' >Testo e Scrittura</a> <div class='dot6'/></li>";
  htmlNotesEditor += "<hr class='selectHr'/>";
  htmlNotesEditor +=
    "<li><a href='#'>Materiali e Tecniche</a> <div class='dot3'/></li>";
  htmlNotesEditor += "<hr class='selectHr'/>";
  htmlNotesEditor += " <li><a href='#' >Censura</a> <div class='dot2'/></li>";
  htmlNotesEditor += "<hr class='selectHr'/>";
  htmlNotesEditor +=
    "<li><a href='#' >Notazioni Musicali</a> <div class='dot7'/></li>";
  htmlNotesEditor += "</ul>";
  htmlNotesEditor += "</div>";
  $(function () {
    // Dropdown toggle
    $(".dropdown-toggle").click(function () {
      $(this).next(".dropdown").slideToggle();
    });

    $(document).click(function (e) {
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
      $("#idSelectArrow").attr("src", "assets/downArrow.png")
    ,
  $("#idSelectArrow").attr("src", "assets/upArrow.png")})
  });

  $("#idSelect").html(htmlNotesEditor);

  //Initializing Bottom Toolbar for Editor User
  let htmlBottomEditor = "";
  htmlBottomEditor +=
    "<a href='#'><img class='codexLogo' src='assets/logo.png' /></a>";
  htmlBottomEditor += "<div class='previewContainer'>";
  htmlBottomEditor += "<div class='posePreview'> </div>";
  htmlBottomEditor += "<div class='posePreview' > </div>";
  htmlBottomEditor += "</div>";

  $("#idCollapsible").on("click", () => {
    var initialState = $("#idBottomToolbar").css("height") === "0px";
    console.log(initialState);
    if (initialState) {
      $("#idBottomToolbar").css("height", "12%");
      $("#idArrow").attr("src", "assets/upArrow.png");
      $("#idCollapsible").css("top", "83%");
    } else {
      $("#idBottomToolbar").css("height", "0%");
      $("#idArrow").attr("src", "assets/downArrow.png");
      $("#idCollapsible").css("top", "96%");
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
  $("#idRgb").hover(
    () => {
      $("#idImgLayer1").attr("src", "assets/active_layer.png");
    },
    () => {
      $("#idImgLayer1").attr("src", "assets/layer.png");
    }
  );
  $("#idIr1").hover(
    () => {
      $("#idImgLayer2").attr("src", "assets/active_layer.png");
    },
    () => {
      $("#idImgLayer2").attr("src", "assets/layer.png");
    }
  );
  $("#idIr2").hover(
    () => {
      $("#idImgLayer3").attr("src", "assets/active_layer.png");
    },
    () => {
      $("#idImgLayer3").attr("src", "assets/layer.png");
    }
  );
  $("#idIr3").hover(
    () => {
      $("#idImgLayer4").attr("src", "assets/active_layer.png");
    },
    () => {
      $("#idImgLayer4").attr("src", "assets/layer.png");
    }
  );

  // hovering actions for the play/pause buttons:
  $("#idPauseButton").hover(
    () => {
      $("#idImgPause").attr("src", "assets/icons/Pausa_ON.png");
    },
    () => {
      $("#idImgPause").attr("src", "assets/icons/Pausa_OFF.png");
    }
  );
  $("#idPlayButton").hover(
    () => {
      $("#idImgPlay").attr("src", "assets/icons/Play_ON.png");
    },
    () => {
      $("#idImgPlay").attr("src", "assets/icons/Play_OFF.png");
    }
  );

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

  $("#idFull").hover(
    function () {
      $("#idFullsize").attr("src", "assets/icons/icon_fullsizeON.png");
    },
    function () {
      $("#idFullsize").attr("src", "assets/icons/icon_fullsize.png");
    }
  );

  $("#idReset").hover(
    function () {
      $("#idResetScene").attr("src", "assets/icons/icon_resetvistaON.png");
    },
    function () {
      $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
    }
  );

  $("#idLayer").hover(
    function () {
      $("#idChooseLayer").attr("src", "assets/icons/icon_layerON.png");
    },
    function () {
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
    }
  );

  $("#idAnnotations").hover(
    function () {
      $("#idTurnAnnotations").attr(
        "src",
        "assets/icons/icon_annotazioniON.png"
      );
    },
    function () {
      $("#idTurnAnnotations").attr("src", "assets/icons/icon_annotazioni.png");
    }
  );

  $("#idSize").hover(
    function () {
      $("#idTurnSize").attr("src", "assets/icons/icon_size_ON.png");
    },
    function () {
      $("#idTurnSize").attr("src", "assets/icons/icon_size_OFF.png");
    }
  );
  $("#idNote").hover(
    function () {
      $("#idTurnNote").attr("src", "assets/icons/Icona_Aton_Edit_ON.png");
    },
    function () {
      $("#idTurnNote").attr("src", "assets/icons/Icona_Aton_Edit_OFF.png");
    }
  );

  $("#idHelp").hover(
    function () {
      $("#idTurnHelp").attr("src", "assets/icons/icon_helpON.png");
    },
    function () {
      $("#idTurnHelp").attr("src", "assets/icons/icon_help.png");
    }
  );

  $("#idTurnNote").click(() => {
    $("#selectAnnType").show();

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

    $("#sphere").hover(
      function () {
        $("#idTurnSphere").attr(
          "src",
          "assets/icons/cerchio_annotazione_ON.png"
        );
      },
      function () {
        $("#idTurnSphere").attr(
          "src",
          "assets/icons/cerchio_annotazione_OFF.png"
        );
      }
    );

    $("#free").hover(
      function () {
        $("#idTurnAreal").attr("src", "assets/icons/Aton_areale_ON.png");
      },
      function () {
        $("#idTurnAreal").attr("src", "assets/icons/Aton_areale_OFF.png");
      }
    );

    $("#sphere").click(() => {
      $("#idForm").show();
      $("#id");
      UI.addAnnotation(ATON.FE.SEMSHAPE_SPHERE);
    });
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
  let htmlcode = "";
  htmlcode += "<form style='position:relative; top:2%'>";
  htmlcode += "<div class='formTitleContainer'>";
  htmlcode +=
    "<h3 id='idTitle' class='formTitle'> Titolo</h3> <input type='text' class='titleInput' ></input>";
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
  htmlcode +=
    "<input class='uploadLink' id='files' type='text'/> <img class='uploadIcon' src='assets/icons/Upload_icon_OFF.png' alt='upload'>";
  htmlcode += "</div>";
  htmlcode += "<div class='authorContainer'>";
  htmlcode +=
    "<h3 class='formTitle'>Autore</h3> <input class='authorInput' type='text' ></input>";
  htmlcode += "</div>";
  htmlcode += "</form>";
  htmlcode +=
    "<button id='idDelete' type='submit' class='cancelButton'>Annulla</button>";
  htmlcode +=
    "<button id='idOk' type='submit' class='okButton' >Conferma</button>";
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

  $("#image").change(function () {
    if (this.files.length > 3) {
      alert("Limite massimo di immagini superato");
      $("#image").val("");
    }
  });
  // setting count limit for characters in the description
  var maxLength = 650;
  $("#idDescription").keyup(function () {
    var textlen = maxLength - $(this).val().length;
    $("#rchars").text(textlen);
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
