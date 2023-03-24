let UI = {};
const subCategoryMap = {
  "Iconologia e Iconografia": [
    "Personaggi e Simboli",
    "Stile",
    "Messaggio Ideologico",
    "Fonti e Tradizioni",
    "Datazione e Attribuzione",
    "Confronti Visivi",
    "Ripensamenti",
    "Elementi Ornamentali",
    "Descrizione",
    "Modifiche Successive"
  ],
  "Materiali e Tecniche Esecutive": [
    "Particolarità dei Materiali",
    "Particolarità delle Tecniche Esecutive"
  ],
  "Struttura": [
    "Dimensione",
    "Legatura",
    "Fascicolazione",
    "Impaginazione",
    "Elementi di Riuso",
    "Particolarità di Struttura"
  ],
  "Conservazione e Restauro": [
    "Restauri",
    "Evidenze Biologiche",
    "Evidenze Chimiche",
    "Evidenze Fisiche",
    "Furti E Sottrazioni",
    "Danni"
  ],
  "Testo e Scrittura": [
    "Particolarità di Scrittura",
    "Testo da Lettera Miniata",
    "Trascrizione e Traduzione",
    "Note e Appunti",
    "Modifiche Successive"
  ],
  "Censure": [
    "Censure di Testo",
    "Censure di Immagini"
  ],
  "Notazioni Musicali":[
  ]
};



UI.init = () => {
  UI.formatSelectedCategories()
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

  
  APP.layers.forEach((l,i)=>{
    if(layer==l.id){
      $(`#idImgLayer${i+1}`).attr("src", "assets/active_layer.png");
    }
    else{
      $(`#idImgLayer${i+1}`).attr("src", "assets/layer.png");
    }
  })
  
}
/**
 * Build the left bar HTML.
 * @param {boolean} logged - Indicates if the user is logged in or not.
 */
UI.buildLeftBar = (logged) => {


  let htmlLeft = "";
  htmlLeft += "<div class='leftListMobile' >";
  htmlLeft += "<div id='idOpenList' class='openListButton' type='button'><img class='openClose imgScaled' src='assets/icons/arrow-down.png' ></div>";
  htmlLeft += "<div id='idList'class='leftList' style='display: none;'>";
  htmlLeft +="<button id='idFull'class='toolbarButton toggleFull' type='button'> <img id='idFullsize' class='toolbarIcon toggleFullImg' src='assets/icons/maximize.png'> </button>";
  
  htmlLeft +=
    "<button id='idReset' class='toolbarButton toggleReset' type='button'> <img id='idResetScene' class='toolbarIcon' src='assets/icons/icon_resetvista.png' /> </button>";
  
  htmlLeft +=
    "<button id='idLayer' class='toolbarButton toggleLayer' type='button'> <img id='idChooseLayer' class='toolbarIcon toggleLayerImg' src='assets/icons/icon_layer.png' /> </button>";
  
    htmlLeft +=
    "<button id='idAnnotations' class='toolbarButton toggleAnnotation' type='button'> <img id='idTurnAnnotations' class='toolbarIcon toggleAnnotationImg' src='assets/icons/icon_annotazioni.png' /> <div id='idSelect' class='filterContainer' style='display:none'></div> </button>";
 
  htmlLeft +=
    "<button id='idSize' class='toolbarButton toggleSize' type='button'> <img id='idTurnSize' class='toolbarIcon toggleSizeImg' src='assets/icons/icon_size_OFF.png' /> </button>";
  
  if(logged){
    htmlLeft+="<button id='idNote' class='toolbarButton toggleNote' type='button'><img id='idTurnNote' class='toolbarIcon toggleNoteImg'src='assets/icons/Icona_Aton_Edit_OFF.png' />"+
    '<div id="selectAnnType" class="sidebar left selectAnnType">'+
      "<div id='sphere' class='sphereNote noting'><img id='idTurnSphere ' class='toolbarIcon sphereNoteImg' src='assets/icons/cerchio_annotazione_OFF.png'></div>"+
      "<div id='free' class='freeNote noting'><img id='idTurnAreal' class='toolbarIcon freeNoteImg' src='assets/icons/Aton_areale_OFF.png'/></div>"+
    "</div>"+ 
    
  "</button>";
  }
  

  
  htmlLeft +=
    "<button id='idHelp' class='toolbarButton toggleHelp' type='button'> <img id='idTurnHelp'  class='toolbarIcon toggleHelpImg' src='assets/icons/icon_help.png' /> </button>";
  htmlLeft += "</div>";
  htmlLeft += "</div>";
  $("#idLeftToolbarMobile").html(htmlLeft);

  let listVisible = false; // Variabile che indica se la lista è visibile o meno
  $("#idOpenList").click(() => {
    if (listVisible) {
      UI.closeLeftToolbarMobile()
      
      
    } else {
      UI.openLeftToolbarMobile()
      

    }
    listVisible = !listVisible; // Cambia lo stato della variabile
  });


  htmlLeft = "";
  htmlLeft += "<div class='leftList' >";
  
  htmlLeft +="<button id='idFull'class='toolbarButton toggleFull' type='button'> <img id='idFullsize' class='toolbarIcon toggleFullImg' src='assets/icons/maximize.png'> </button>";
  
  htmlLeft +=
    "<button id='idReset' class='toolbarButton toggleReset' type='button'> <img id='idResetScene' class='toolbarIcon' src='assets/icons/icon_resetvista.png' /> </button>";
  
  htmlLeft +=
    "<button id='idLayer' class='toolbarButton toggleLayer'  type='button'> <img id='idChooseLayer' class='toolbarIcon toggleLayerImg' src='assets/icons/icon_layer.png' /> </button>";
  
  htmlLeft +=
    "<button id='idAnnotations' class='toolbarButton toggleAnnotation' type='button'> <img id='idTurnAnnotations' class='toolbarIcon toggleAnnotationImg' src='assets/icons/icon_annotazioni.png' /> <div id='idSelect' class='filterContainer' style='display:none'></div> </button>";
 
  htmlLeft +=
    "<button id='idSize' class='toolbarButton toggleSize' type='button'> <img id='idTurnSize' class='toolbarIcon toggleSizeImg' src='assets/icons/icon_size_OFF.png' /> </button>";
  
  if(logged){
    htmlLeft+="<button id='idNote' class='toolbarButton toggleNote' type='button'><img id='idTurnNote' class='toolbarIcon toggleNoteImg'src='assets/icons/Icona_Aton_Edit_OFF.png' />"+
    '<div id="selectAnnType" class="sidebar left selectAnnType">'+
      "<div id='sphere' class='sphereNote noting'><img id='idTurnSphere ' class='toolbarIcon sphereNoteImg' src='assets/icons/cerchio_annotazione_OFF.png'></div>"+
      "<div id='free' class='freeNote noting'><img id='idTurnAreal' class='toolbarIcon freeNoteImg' src='assets/icons/Aton_areale_OFF.png'/></div>"+
      
    "</div>"+ 
  "</button>";
    
  }
  

  
  htmlLeft +=
    "<button id='idHelp' class='toolbarButton toggleHelp' style='' type='button'> <img id='idTurnHelp'  class='toolbarIcon toggleHelpImg' src='assets/icons/icon_help.png' /> </button>";
  htmlLeft += "</div>";
  $("#idLeftToolbar").html(htmlLeft);



  $(".toggleFull").on("click", () => {
    if($(".toggleFull").hasClass("full")){
      $(".toggleFull").removeClass("full")
      $(".toggleFullImg").attr("src", "assets/icons/maximize.png")
    }
    else{
      $(".toggleFull").addClass("full")
      $(".toggleFullImg").attr("src", "assets/icons/minimize.png")
    }
  });

  $(".toggleLayer").click(() => {
    UI.disableIcon()
    if (!$(".toggleLayer").hasClass("clicked")) {
      $(".clicked").removeClass("clicked")
      $(".toggleLayer").addClass("clicked")

      $(".toggleLayerImg").attr("src", "assets/icons/icon_layerON.png");
      $(".toggleAnnotationImg").attr("src", "assets/icons/icon_annotazioni.png");
      $(".toggleSizeImg").attr("src", "assets/icons/icon_size_OFF.png");
      $(".toggleHelpImg").attr("src", "assets/icons/icon_help.png");
      
      $("#idViewControlContainer").show();
      $(".filterContainer").hide();
      $(".toggleNoteImg").attr("src", "assets/icons/Icona_Aton_Edit_OFF.png");
      $(".selectAnnType").removeClass("visible")
      $(".sliderBack").addClass("visible")
      let htmlCodeSlider=''
        htmlCodeSlider+='<img src="assets/icons/layers.png"/>'
        htmlCodeSlider+='<select class="layerSelectionMenu">'
        
        APP.layers.forEach((layer)=>{
          htmlCodeSlider += `<option class='layerOption layer' value='${layer.name}'>${layer.title}</option>`;
        })
        htmlCodeSlider+='</select>'
        htmlCodeSlider += "<img src='assets/icons/Play_OFF.png' class='playPause play btn'>"
        htmlCodeSlider+='<img src="assets/icons/zoom-out.png"/><input type="range" min="0" value="50" max="100" id="idSliderLens" class="sliderAnn noting" /><img src="assets/icons/zoom-in.png"/>'
        
        
        $(".sliderBack").html(htmlCodeSlider)
        let r = parseFloat( $("#idSliderLens").val() )
        let raggio = APP.mapRange(r, 0,100, APP.raggio_min, APP.raggio_max);
        APP.setLensRadius(raggio);
        APP.raggio_vision=raggio
        $("#idSliderLens").off("input change").on("input change",function (){
          $(this).css(
            "background",
            "linear-gradient(to right, rgba(198, 150, 59, 1) 0%, rgba(198, 150, 59, 1) " +
              this.value +
              "%, transparent " +
              this.value +
              "%, transparent 100%)"
          );
          let r = parseFloat( $("#idSliderLens").val() )
          let raggio = APP.mapRange(r, 0,100, APP.raggio_min, APP.raggio_max);
          APP.setLensRadius(raggio);
          APP.raggio_vision=raggio
        });
        // click actions for the play/pause buttons:
        $(".playPause").on("click",()=>{
          if($(".playPause").hasClass("play")){
            playInterval()
          }
          else{
            pauseInterval()
          }
        })
        $(".layerSelectionMenu").on("change",()=>{
          APP.layers.forEach((layer)=>{
            if(layer.name===$(".layerSelectionMenu").val())
            APP.setLayer(layer.id)
          })
        })
    } 
    else {
      
      $(".toggleLayer").removeClass("clicked")
      $(".toggleLayerImg").attr("src", "assets/icons/icon_layer.png");
      UI.stopLens();
      $(".sliderBack").removeClass("visible")
    }
  });
  $(".toggleAnnotation").click((e) => {
    UI.disableIcon()
    if (!$(".toggleAnnotation").hasClass("clicked")) {
      $(".clicked").removeClass("clicked")
      $(".toggleAnnotation").addClass("clicked")
      APP.goToMode(APP.STATE_NAV)
      $("#idChooseLayer").attr("src", "assets/icons/icon_layer.png");
      $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
      $(".toggleLayerImg").attr("src", "assets/icons/icon_layer.png");
      $(".toggleSizeImg").attr("src", "assets/icons/icon_size_OFF.png");
      $(".toggleHelpImg").attr("src", "assets/icons/icon_help.png");
      $(".toggleAnnotationImg").attr("src","assets/icons/icon_annotazioniON.png");
      $(".filterContainer").show();
      $(".toggleNoteImg").attr("src", "assets/icons/Icona_Aton_Edit_OFF.png");
      $(".selectAnnType").removeClass("visible")
      $(".sliderBack").removeClass("visible")
      UI.stopLens();
    } else if(!$(e.target).closest(".filterContainer").length) {
      $(".toggleAnnotationImg").attr("src", "assets/icons/icon_annotazioni.png");
      
      $(".filterContainer").addClass("closeFilterContainer").on("animationend", function() {
        $(this).off("animationend")
        $(".filterContainer").removeClass("closeFilterContainer");
        $(".filterContainer").hide()
        $(".toggleAnnotation").removeClass("clicked")
      });
      $(".selectContainer").css("background-color", "rgb(110, 110, 110)");
    }
  });
  $(".toggleSize").click(() => {
    UI.disableIcon()
    if (!$(".toggleSize").hasClass("clicked")) {
      
      $(".clicked").removeClass("clicked")
      $(".toggleSize").addClass("clicked")
      $(".toggleSizeImg").attr("src", "assets/icons/icon_size_ON.png");
      $(".toggleLayerImg").attr("src", "assets/icons/icon_layer.png");
      $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
      $(".toggleAnnotationImg").attr("src", "assets/icons/icon_annotazioni.png");
      $(".toggleHelpImg").attr("src", "assets/icons/icon_help.png");
      $(".filterContainer").hide();
      $(".toggleNoteImg").attr("src", "assets/icons/Icona_Aton_Edit_OFF.png");
      $(".selectAnnType").removeClass("visible")
      $(".sliderBack").removeClass("visible")
      UI.stopLens()
    } else {
      $(".toggleSize").removeClass("clicked")
      $(".toggleSizeImg").attr("src", "assets/icons/icon_size_OFF.png");
    }
  });
  $(".toggleHelp").click(() => {
    UI.disableIcon()
    if (!$(".toggleHelp").hasClass("clicked")) {
      UI.disableIcon()
      APP.goToMode(APP.STATE_NAV)
      $(".clicked").removeClass("clicked")
      $(".toggleHelp").addClass("clicked")
      $(".helperPopup").show()
      $(".toggleHelpImg").attr("src", "assets/icons/icon_helpON.png");
      $(".toggleSizeImg").attr("src", "assets/icons/icon_size_OFF.png");
      $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
      $(".toggleLayerImg").attr("src", "assets/icons/icon_layer.png");
      $(".toggleAnnotationImg").attr("src", "assets/icons/icon_annotazioni.png");
      $(".filterContainer").hide();
      $(".toggleNoteImg").attr("src", "assets/icons/Icona_Aton_Edit_OFF.png");
      $(".selectAnnType").removeClass("visible")
      $(".sliderBack").removeClass("visible")
      
      UI.stopLens()
    } else {
      $(".helperPopup").hide()
      $(".toggleHelp").removeClass("clicked")
      $(".toggleHelpImg").attr("src", "assets/icons/icon_help.png");
    }
  });
  if(logged){

    $(".toggleNote").on("click", (e) => {
      
      if (!$(".toggleNote").hasClass("clicked") ) {
        APP.goToMode(APP.STATE_NAV);
        $(".clicked").removeClass("clicked")
        $(".toggleNote").addClass("clicked")
        $(".toggleNoteImg").attr("src", "assets/icons/Icona_Aton_Edit_ON.png");
        $(".toggleHelpImg").attr("src", "assets/icons/icon_help.png");
        $(".toggleSizeImg").attr("src", "assets/icons/icon_size_OFF.png");
        $("#idResetScene").attr("src", "assets/icons/icon_resetvista.png");
        $(".toggleLayerImg").attr("src", "assets/icons/icon_layer.png");
        $(".toggleAnnotationImg").attr("src", "assets/icons/icon_annotazioni.png");
        $(".filterContainer").hide();
        UI.stopLens()
        $(".selectAnnType").addClass("visible")
        $(".sliderBack").removeClass("visible")
        
        /* $("#selectAnnType").show(); */
      }
       else if($(".toggleNote").hasClass("clicked")&&!$(e.target).closest(".noting").length) {
        APP.goToMode(APP.STATE_NAV);
        if($(".sphereNoteImg").hasClass("clicked")){
          $(".sphereNoteImg").removeClass("clicked")
          $(".sphereNoteImg").attr("src", "assets/icons/cerchio_annotazione_OFF.png");
        }
         if($(".freeNoteImg").hasClass("clicked")){
          $(".freeNoteImg").removeClass("clicked")
          $(".freeNoteImg").attr("src", "assets/icons/Aton_areale_OFF.png");
        }
        $(".toggleNote").removeClass("clicked")
        $(".toggleNoteImg").attr("src", "assets/icons/Icona_Aton_Edit_OFF.png");
        $(".selectAnnType").removeClass("visible")
        $(".sliderBack").removeClass("visible")
      }
      
    });



    $(".sphereNoteImg").on("click",() => {
      UI.disableIcon()
      $(".sliderBack").removeClass("visible")
      if($(".freeNoteImg").hasClass("clicked")){
        $(".freeNoteImg").removeClass("clicked")
        $(".freeNoteImg").attr("src", "assets/icons/Aton_areale_OFF.png");
      }
      if($(".sphereNoteImg").hasClass("clicked")){
        
        $(".sphereNoteImg").attr("src","assets/icons/cerchio_annotazione_OFF.png")
        $(".sphereNoteImg").removeClass("clicked")
        APP.goToMode(APP.STATE_NAV);
      }
      else{
        UI.goToModeANN_basic()
        
        
        $(".sphereNoteImg").attr("src","assets/icons/cerchio_annotazione_ON.png")
        $(".sphereNoteImg").addClass("clicked")
        APP.goToMode(APP.STATE_ANN_BASIC);
      }
    });

    $(".freeNoteImg").on("click", () => {
      UI.disableIcon()
      $(".sliderBack").removeClass("visible")
      if($(".sphereNoteImg").hasClass("clicked")){
        $(".sphereNoteImg").removeClass("clicked")
        $(".sphereNoteImg").attr("src", "assets/icons/cerchio_annotazione_OFF.png");
      }
      if($(".freeNoteImg").hasClass("clicked")){
        $(".freeNoteImg").removeClass("clicked")
        $(".freeNoteImg").attr("src", "assets/icons/Aton_areale_OFF.png");
        APP.goToMode(APP.STATE_NAV);
      }
      else{
        UI.goToModeANN_free()
        $(".freeNoteImg").attr("src","assets/icons/Aton_areale_ON.png")
        $(".freeNoteImg").addClass("clicked")
        
        APP.goToMode(APP.STATE_ANN_FREE);
      }
    });
  }
  $(document).click(function (e) {
    if(!$(e.target).closest(".helperPopup").length &&!$(e.target).hasClass("toggleHelp")&& !$(e.target).hasClass("toggleHelpImg") ){
      $(".helperPopup").hide()
      $(".toggleHelp").removeClass("clicked")
      $(".toggleHelpImg").attr("src", "assets/icons/icon_help.png");
    }
  });
}
UI.goToModeANN_basic=()=>{
  let htmlCodeSlider=''
  htmlCodeSlider+='<img src="assets/icons/layers.png"/>'
  htmlCodeSlider+='<select class="layerSelectionMenu">'
  
  APP.layers.forEach((layer)=>{
    htmlCodeSlider += `<option class='layerOption' value='${layer.name}'>${layer.title}</option>`;
  })
  
  htmlCodeSlider+='</select><img src="assets/icons/zoom-out.png"/><input type="range" min="0" value="50" max="100" id="idSliderLensAnn" class="sliderAnn noting" /><img src="assets/icons/zoom-in.png"/>'
  $(".sliderBack").html(htmlCodeSlider)
  let r = parseFloat( $("#idSliderLensAnn").val() )
  let raggio = APP.mapRange(r, 0,100, APP.raggio_min, APP.raggio_max);
  APP.setLensRadius(raggio);
  APP.raggio_ann=raggio
  $("#idSliderLensAnn").off("input change").on("input change",function (){
    $(this).css(
      "background",
      "linear-gradient(to right, rgba(198, 150, 59, 1) 0%, rgba(198, 150, 59, 1) " +
        this.value +
        "%, transparent " +
        this.value +
        "%, transparent 100%)"
    );
    let r = parseFloat( $("#idSliderLensAnn").val() )
    let raggio = APP.mapRange(r, 0,100, APP.raggio_min, APP.raggio_max);
    APP.setLensRadius(raggio);
    APP.raggio_ann=raggio
  });
  $(".layerSelectionMenu").off("change").on("change",()=>{
    APP.layers.forEach((layer)=>{
      if(layer.name===$(".layerSelectionMenu").val())
      APP.setLayer(layer.id)
    })
  })
  $(".sliderBack").addClass("visible")
}

UI.goToModeANN_free=()=>{
  ATON.fireEvent("goToModeANN_free")

  let htmlCodeSlider=''
  htmlCodeSlider+='<div class="monoLayer">'
  htmlCodeSlider+='<img src="assets/icons/layers.png"/>'
  htmlCodeSlider+='<select class="layerSelectionMenu">'
  
  APP.layers.forEach((layer)=>{
    htmlCodeSlider += `<option class='layerOption' value='${layer.name}'>${layer.title}</option>`;
  })
  htmlCodeSlider+='</select>'
  
  htmlCodeSlider+='</div>'
  htmlCodeSlider+='<img class="cancelAnn btn" src="assets/icons/cancel.png"/><img class="acceptAnn btn" src="assets/icons/accept.png"/>'
  $(".sliderBack").html(htmlCodeSlider)
  $(".layerSelectionMenu").off("change").on("change",()=>{
    APP.layers.forEach((layer)=>{
      if(layer.name===$(".layerSelectionMenu").val())
      APP.setLayer(layer.id)
    })
  })
  
  $(".cancelAnn").off("click").on("click",()=>{
    APP.cancelCurrentTask();
  })
  $(".acceptAnn").off("click").on("click",()=>{
    APP.finalizeSemanticShape();
  })
  $(".sliderBack").addClass("visible")
}
UI.disableIcon=()=>{
  $(".sphereNoteImg").attr("src", "assets/icons/cerchio_annotazione_OFF.png");
  $(".freeNoteImg").attr("src", "assets/icons/Aton_areale_OFF.png");
}
UI.openLeftToolbarMobile=()=>{
  $("#idList").show(); // Mostra la lista
  $(".openClose").attr("src","assets/icons/arrow-up.png") // Cambia il testo del pulsante
  $(".leftToolbarMobile").addClass("extend")
  $(".leftToolbarMobile").removeClass("close")
  $(".leftToolbarMobile").addClass("open")
}
UI.closeLeftToolbarMobile=()=>{
  $("#idList").hide(); // Nascondi la lista
  $(".openClose").attr("src","assets/icons/arrow-down.png") // Cambia il testo del pulsante
  $(".leftToolbarMobile").removeClass("extend")
  $(".leftToolbarMobile").addClass("close")
  $(".leftListMobile").addClass("close")
  $(".leftToolbarMobile").removeClass("open")
}
/**
 * Build the help popup HTML.
 * @param {boolean} logged - Indicates if the user is logged in or not.
 */
UI.buildHelp=(logged)=>{
  let icons=['assets/icons/maximize.png','assets/icons/minimize.png','assets/icons/icon_resetvista.png','assets/icons/icon_layer.png','assets/icons/icon_annotazioni.png','assets/icons/icon_size_OFF.png']
  let phrases=['massimizza','minimizza','riposiziona','cambio layer','filtro annotazioni','misure']
  if(logged){
    icons.push('assets/icons/Icona_Aton_Edit_OFF.png')
    icons.push('assets/icons/cerchio_annotazione_ON.png')
    icons.push('assets/icons/Aton_areale_ON.png')
    phrases.push('aggiunta note')
    phrases.push('annotazione semplice')
    phrases.push('annotazione libera')
    
  }
  let htmlCode="<div class='legend'>"
  htmlCode+="<div class=closeLegendBtn ><span>Legenda</span><img style='cursor: pointer;width:1em; height:fit-content;' src='assets/icons/Chiudi_finestra.png'></div>"
  icons.forEach((el,i)=>{
    if(i<=icons.length-4){
      if(i%2==0){
        htmlCode+='<div class=row><div class="mono"><img src='+el+' /><span>'+phrases[i]+'</span></div>'
      }
      else{
        htmlCode+='<div class="mono"><img src='+el+' /><span>'+phrases[i]+'</span></div></div>'
      }
    }
    else{
      if(i%2!=0){
        htmlCode+='<div class=row><div class="mono"><img src='+el+' /><span>'+phrases[i]+'</span></div>'
      }
      else{
        htmlCode+='<div class="mono"><img src='+el+' /><span>'+phrases[i]+'</span></div></div>'
      }
      
    }
  })
  
  htmlCode+="</div>"
  $(".helperPopup").html(htmlCode)
  $(".closeLegendBtn img").click(()=>{
    $(".helperPopup").hide()
    $(".toggleHelp").removeClass("clicked")
    $(".toggleHelpImg").attr("src", "assets/icons/icon_help.png");

  })
}
UI.buildPublic = () => {
  // Clear
  $("#idTopToolbar").html("");
  $("#idBottomToolbar").html("");
  $("#idLeftToolbar").html("");
  $(".sliderBack").removeClass("visible")
  //left toolbar for Public UI
  UI.buildLeftBar(false)
  UI.buildHelp(false)

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
  UI.buildSelectContainer()
  
  //bottom toolbar for Public UI to allow navigation through poses
  let htmlBottom = "";
  
  htmlBottom += "<div id='idPoseGallery' class='previewContainer scrollableX'>";
  // htmlBottom += "<div class='posePreview'> </div>";
  // htmlBottom += "<div class='posePreview' > </div>";
  htmlBottom += "</div>";

  $("#idCollapsible").off("click");
  $("#idCollapsible").on("click", () => {
    var initialState = !$(".collapsible").hasClass("openBottomBar")
    if (initialState) {
      $("#idBottomToolbar").css("height", "100px");
      $("#idArrow").attr("src", "assets/icons/arrow-down.png");
      /* $("#idCollapsible").css("bottom", "80px"); */
      $(".collapsible").addClass("openBottomBar")
    } else {
      $("#idBottomToolbar").css("height", "0%");
      $("#idArrow").attr("src", "assets/icons/arrow-up.png");
      /* $("#idCollapsible").css("bottom", "0px"); */
      $(".collapsible").removeClass("openBottomBar")
    }
  });

  $("#idBottomToolbar").html(htmlBottom);
  UI.buildLens()
  
  
};
UI.buildLens=()=>{


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
  
  htmlView += "<img src='assets/icons/Play_OFF.png' class='playPause play'>"
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
  
  $("#idZoom").on("click",() => {
    if ($("#idZoom").attr("src") == "assets/icons/Zoom_OFF.png"){
      $("#idZoom").attr("src", "assets/icons/Zoom_ON.png")
    } else {
      $("#idZoom").attr("src", "assets/icons/Zoom_OFF.png")
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
  // click actions for the play/pause buttons:
  $(".playPause").on("click",()=>{
    if($(".playPause").hasClass("play")){
      playInterval()
    }
    else{
      pauseInterval()
    }
  })

}
function playInterval(){
  $(".playPause").addClass("pause")
  $(".playPause").removeClass("play")
  $(".playPause").attr("src","assets/icons/Pausa_OFF.png")
  UI.interval=loop();
}
function pauseInterval(){
  $(".playPause").addClass("play")
  $(".playPause").removeClass("pause")
  $(".playPause").attr("src","assets/icons/Play_OFF.png")
  if(UI.interval){
    clearInterval(UI.interval)
    UI.interval=undefined
  }
  
}
function loop() {
  let index = 0;
  const layers=$(".layer")
  return setInterval(() => {
    $(layers).attr("src","assets/layer.png")
    $(layers[index]).attr("src", "assets/active_layer.png");
    console.log("quindi?",index)
    APP.setLayer(index);
    APP.layers.forEach((layer)=>{
      if(layer.id==index){
        $(".layerSelectionMenu").val(layer.name)
      }
    })
    
    index++;
    if (index == layers.length) {
      index=0
    }
   
  }, 1000);
}


UI.buildEditor = () => {
  // Clear
  $("#idTopToolbar").html("");
  $("#idBottomToolbar").html("");
  $("#idLeftToolbar").html("");
  $(".sliderBack").removeClass("visible")

  UI.buildLeftBar(true)
  UI.buildHelp(true)
  // Note filtering for Editor
  UI.buildSelectContainer()
   


  //Initializing Bottom Toolbar for Editor User
  let htmlBottomEditor = "";
  
  htmlBottomEditor +=
    "<div id='idPoseGallery' class='previewContainer scrollableX'>";

  htmlBottomEditor += "</div>";

  $("#idCollapsible").off("click");
  $("#idCollapsible").on("click", () => {
    var initialState = !$(".collapsible").hasClass("openBottomBar")
    if (initialState) {
      $("#idBottomToolbar").css("height", "100px");
      $("#idArrow").attr("src", "assets/icons/arrow-down.png");
      /* $("#idCollapsible").css("bottom", "80px"); */
      $(".collapsible").addClass("openBottomBar")
    } else {
      $("#idBottomToolbar").css("height", "0%");
      $("#idArrow").attr("src", "assets/icons/arrow-up.png");
      /* $("#idCollapsible").css("bottom", "0px"); */
      $(".collapsible").removeClass("openBottomBar")
    }
  });
  $("#idBottomToolbar").html(htmlBottomEditor);
  UI.buildLens()
};

UI.formatSelectedCategories=()=>{
  UI.selectedCategories=[]
  for (const category in subCategoryMap) {
    UI.selectedCategories.push(category)
  }
}
UI.buildSelectContainer=()=>{
  
  
  const colors=["#BF2517B2","#2F4689","#D9A441","#E7F0F9","#422C20","#FF7F11","#79b857"]
  
  let htmlNotes="<div class='selectContainer'>";
  htmlNotes +="<div class=gray-pill>"
  htmlNotes += "<p class='filterText'> Note </p>";
  htmlNotes +=
    "<button class='dropdown-toggle' id='idDropdownToggle'><span class='selectCatText'>Seleziona categoria</span> <img id='idSelectArrow' src='assets/upArrow.png' class='arrow'></button>";
  let tutteLeCategorie="Seleziona tutte le categorie"
  htmlNotes += "<ul class='dropdown'>";
  htmlNotes+="<li class=tutte-categorie><label style='cursor:pointer;'><input type='checkbox' class='seleziona-tutte-categorieCheckbox check'>"+tutteLeCategorie+"</label></li>"
  for(let i=0;i<APP.cats.length;i++){
    let title=APP.cats[i]
    let tmpTitle=title.split(" ")
    tmpTitle=tmpTitle[0]
    htmlNotes+="<li class="+tmpTitle+"><label style='cursor:pointer;'><input type='checkbox' class='"+tmpTitle+"Checkbox check tocheck dot"+i+"' style='border:3px solid "+colors[i]+";'>"+title+"</label></li>"
    
  }
  htmlNotes += "</ul>";
  htmlNotes += "</div>";
  htmlNotes+='</div>'
  $(function () {
    $(".dropdown-toggle").click(function () {
      
      $(this).next(".dropdown").slideToggle();
      
      if(!$(".dropdown-toggle").hasClass("openDropdownToggle"))
        {
          $(".dropdown-toggle").addClass("openDropdownToggle")
          $("#idSelectArrow").attr("src", "assets/upArrow.png");
        }
        else{
          $("#idSelectArrow").attr("src", "assets/downArrow.png")
          $(".dropdown-toggle").removeClass("openDropdownToggle")
          
        }
      
    });
    
    $(document).click(function (e) {
      for(let i=0;i<APP.cats.length;i++){
        let title=APP.cats[i]
        let tmpTitle=title.split(" ")
        tmpTitle=tmpTitle[0]
        
        $(".check").off("change").change(()=>{
          let both_class=e.target.classList[e.target.classList.length-1]
          console.log(e.target===$("."+both_class)[0],e.target===$("."+both_class)[1])
          if(e.target===$("."+both_class)[0]){
            $("."+both_class)[1].checked=$("."+both_class)[0].checked
          }
          else if(e.target===$("."+both_class)[1]){
            
            $("."+both_class)[0].checked=$("."+both_class)[1].checked
          }
          if(e.target===$(".seleziona-tutte-categorieCheckbox")[0]){
            $(".seleziona-tutte-categorieCheckbox")[1].checked=$(".seleziona-tutte-categorieCheckbox")[0].checked
          }
          else if(e.target===$(".seleziona-tutte-categorieCheckbox")[1]){
            $(".seleziona-tutte-categorieCheckbox")[0].checked=$(".seleziona-tutte-categorieCheckbox")[1].checked
          }
          if(e.target===$(".seleziona-tutte-categorieCheckbox")[0] || e.target===$(".seleziona-tutte-categorieCheckbox")[1]){
            if($(".seleziona-tutte-categorieCheckbox")[0].checked && $(".seleziona-tutte-categorieCheckbox")[1].checked){
              colors.forEach((col,i)=>{
                $(".dot"+i)[0].checked=true
                $(".dot"+i)[1].checked=true
              })
            }
            else{
              colors.forEach((col,i)=>{
                $(".dot"+i)[0].checked=false
                $(".dot"+i)[1].checked=false
              })
              
            }
          }
          else{
           
            if($(".tocheck:checked").length/2===colors.length){
              $(".seleziona-tutte-categorieCheckbox")[0].checked=true
              $(".seleziona-tutte-categorieCheckbox")[1].checked=true
            }
            else {
              $(".seleziona-tutte-categorieCheckbox")[0].checked=false
              $(".seleziona-tutte-categorieCheckbox")[1].checked=false
            }
          }
          
          UI.selectedCategories=[];
          $(".dropdown input:checked").each(function() {
            let cat=$(this).parent().text().trim()
            if(!UI.selectedCategories.includes(cat)){
              console.log(cat)
              UI.selectedCategories.push(cat);
            }
            
          });
          
          if(UI.selectedCategories.length===1){
            $(".selectCatText").html(
              "<span>"+UI.selectedCategories+"</span>"
            );
          }else if(UI.selectedCategories.length>1){
            let moreCategories="Più categorie selezionate"
            let span="<span>"+moreCategories+"</span>"
            $(".selectCatText").html(
              span
            );
          }
           else {
            let selectCat="Seleziona categoria"
            let span="<span>"+selectCat+"</span>"
             $(".selectCatText").html(
              span
            );
          }
          let selectedColor = $(".dropdown input:checked").closest("li").find(".dot").css("background-color");
          $(".selectContainer").css("background-color", selectedColor);
          
          APP.filterAnnotationsByCat(UI.selectedCategories);

        })
      }
      var target = e.target;
      if (!$(target).is(".dropdown-toggle") &&
          !$(target).parents().is(".dropdown-toggle") &&
          !$(target).is(":checkbox") &&
          !$(target).parents().is(":checkbox")&&
          !$(target).is("label")&&
          !$(target).is(".dropdown")
        ) 
      {
        $(".dropdown").slideUp();
        if (!$(".dropdown-toggle").hasClass("openDropdownToggle")) {
          $(".dropdown-toggle").addClass("openDropdownToggle")
          $("#idSelectArrow").attr("src", "assets/upArrow.png");
        }
      }
    
      // Esegui la chiusura della dropdown
      
    
    });
  }); 
  
  
  $(".filterContainer").html(htmlNotes);  
  
  
  
  UI.selectedCategories.forEach((el)=>{
    let text=el.split(" ")
    let classe=text[0]
    $("."+classe+"Checkbox")[0].checked=true
    $("."+classe+"Checkbox")[1].checked=true
  })
  console.log(UI.selectedCategories.length-1,colors.length)
  if(UI.selectedCategories.length===colors.length){
    $(".seleziona-tutte-categorieCheckbox")[0].checked=true
    $(".seleziona-tutte-categorieCheckbox")[1].checked=true
  }
  let text=""
  if(UI.selectedCategories.length>1){
    text="Più categorie selezionate"
   
  }
  else{
    text="Seleziona categoria"
  }
  let span="<span>"+text+"</span>"
  $(".selectCatText").html(
    span
  );
}

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
 console.log(pDB)
  // Generate HTML for panel
  let htmlcode = "";
  htmlcode += "<div class='appPanelHeader'>";
  htmlcode +=
    "<div class='appPanelBTN closeAnn'><img src='" +
    ATON.FE.PATH_RES_ICONS +
    "cancel.png'></div>&nbsp;&nbsp;";
  
  if (S.title) htmlcode += S.title;

  if (ATON.SceneHub._bEdit) {
    htmlcode += "<div style='float:right'>";
    htmlcode +=
      "<div class='appPanelBTN updateAnn'><img src='" +
      ATON.FE.PATH_RES_ICONS +
      "edit.png'></div>";
    htmlcode +=
      "<div class='appPanelBTN ' onclick='APP.deleteSemAnnotation(\""+semid+"\")'><img src='" +
      ATON.FE.PATH_RES_ICONS +
      "trash.png'></div></div>";
  }
  htmlcode += "</div>";
 
  htmlcode +=
    "<div class='atonSidePanelContent' style='height: calc(100% - 50px);'>";

  htmlcode += "<div class='appPanelLayer'>";
  htmlcode+="<span>"
  if (S.layer === APP.LAYER_RGB) htmlcode += "Livello RGB";
  if (S.layer === APP.LAYER_IR1) htmlcode += "Livello IR 1";
  if (S.layer === APP.LAYER_IR2) htmlcode += "Livello IR 2";
  if (S.layer === APP.LAYER_IR3) htmlcode += "Livello IR 3";
  console.log("layer:",S.layer)
  htmlcode+="</span>"
  htmlcode += "<div class='layerPanelSelector'>"
  if (S.layer === APP.LAYER_RGB) {
    htmlcode += "<img id='idImgPanelLayer1' class='layerPanel' src='assets/active_layer_panel.png' alt='layer' />"
    htmlcode += "<img id='idImgPanelLayer2' class='layerPanel cross' src='assets/layer_panel.png' alt='layer' />";
    htmlcode += "<img id='idImgPanelLayer3' class='layerPanel cross' src='assets/layer_panel.png' alt='layer' />";
    htmlcode += "<img id='idImgPanelLayer4' class='layerPanel cross' src='assets/layer_panel.png' alt='layer' />"
  };
  if (S.layer === APP.LAYER_IR1) {
    htmlcode += "<img id='idImgPanelLayer1' class='layerPanel' src='assets/layer_panel.png' alt='layer' />"
    htmlcode += "<img id='idImgPanelLayer2' class='layerPanel cross' src='assets/active_layer_panel.png' alt='layer' />";
    htmlcode += "<img id='idImgPanelLayer3' class='layerPanel cross' src='assets/layer_panel.png' alt='layer' />";
    htmlcode += "<img id='idImgPanelLayer4' class='layerPanel cross' src='assets/layer_panel.png' alt='layer' />"
  };
  if (S.layer === APP.LAYER_IR2) {
    htmlcode += "<img id='idImgPanelLayer1' class='layerPanel' src='assets/layer_panel.png' alt='layer' />"
    htmlcode += "<img id='idImgPanelLayer2' class='layerPanel cross' src='assets/layer_panel.png' alt='layer' />";
    htmlcode += "<img id='idImgPanelLayer3' class='layerPanel cross' src='assets/active_layer_panel.png' alt='layer' />";
    htmlcode += "<img id='idImgPanelLayer4' class='layerPanel cross' src='assets/layer_panel.png' alt='layer' />"
  };
  if (S.layer === APP.LAYER_IR3) {
    htmlcode += "<img id='idImgPanelLayer1' class='layerPanel' src='assets/layer_panel.png' alt='layer' />"
    htmlcode += "<img id='idImgPanelLayer2' class='layerPanel cross' src='assets/layer_panel.png' alt='layer' />";
    htmlcode += "<img id='idImgPanelLayer3' class='layerPanel cross' src='assets/layer_panel.png' alt='layer' />";
    htmlcode += "<img id='idImgPanelLayer4' class='layerPanel cross' src='assets/active_layer_panel.png' alt='layer' />"
  };

  htmlcode += "</div>"
  htmlcode += "</div>";
 
  if (S.cat) htmlcode += "<div class='appPanelSub'>" + S.cat + "</div>";
  if (S.subcat) htmlcode += "<b>Sotto-categoria</b>: " + S.subcat + "<br>";
  htmlcode += "<br>";

  if (S.media && S.media!=" " ){
    let medias= S.media.split("\n" )
    medias.forEach((el)=>{
      
      
      let path="/collections/"+el
      htmlcode += "<img src='" + path+ "'><br>";
    })
    
  }

  htmlcode += "<div class='descriptionText'>";
  if (S.descr) htmlcode += S.descr;
  htmlcode += "</div></div>";


  ATON.FE.playAudioFromSemanticNode(semid);

  $("#idPanel").html(htmlcode);
  UI.toggleSemPanel(true);
  $(".updateAnn").click(()=>{
    UI.updateAnnotation(semid)
  })
  $(".closeAnn").click(()=>{
    $("#idPanel").hide();
    if(APP.argBG!=0)
    {APP.UI.toggleSemPanel(false);}
  })
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
UI.createAnnForm=()=>{
  let htmlcode = "";
  htmlcode += "<div class='formTitleContainer'>";
  htmlcode +=
    "<h3 class='formTitle'> Titolo</h3> <input id='idTitle' type='text' class='titleInput' ></input>";
  htmlcode += "</div>";
  htmlcode +="<div class='first_row'>"
  htmlcode += "<div class='categoryContainer'>";
  htmlcode +=
    "<h3 class='formTitle'> Categoria</h3> <select id='catSelect' type='select' class='categorySelect'>";
 
  
  for (const category in subCategoryMap) {
    htmlcode += `<option class='catOption' value='${category}'>${category}</option>`;
  }

  htmlcode += "</select></div>";
  htmlcode += "<div id='selectPlace' class='subCatSelectContainer'>";
  htmlcode +=
    "<h3 class='formTitle' > Sottocategoria</h3> <select id='sottoCatSelect' type='select' class='subCategorySelect' >";
  subCategoryMap[Object.keys(subCategoryMap)[0]].forEach((value)=>{
    htmlcode+="<option class='catOption' value="+value+">"+value+"</option>";
  })
  htmlcode += "</select>";
  htmlcode += "</div>";
  htmlcode+= '</div>';
  htmlcode+='<div class="second_row">';
  htmlcode+='<h3 class="formTitle">Layer</h3>'
  htmlcode+='<select id="idLayerSelect" type=select class="layerSelect">'
  APP.layers.forEach((el)=>{
    htmlcode+="<option class='layerOption' value="+el.name+">"+el.title+"</option>";
  })
  htmlcode+='</select>'
  htmlcode+='</div>';
  htmlcode += "<div class='descriptionContainer'>";
  htmlcode +=
    "<h3 class='formTitle' >Descrizione</h3> <textarea class='descriptionInput' type='text' id='idDescription' max-length='500' ></textarea>";
  htmlcode += "</div>";
  htmlcode += "<div class='third_row'>";
  
  htmlcode += "<div class='fileContainer'>";
  htmlcode += "<span for='files' class='formTitle'>File Multimediali </span>";
  htmlcode += "<textArea class='uploadLink' id='files' type='text'/> </textarea>"; 
  htmlcode += "</div>";


  htmlcode += "<div class='authorContainer'>";
  htmlcode += "<span class='formTitle'>Autore</span> <input class='authorInput' type='text' ></input>";
  htmlcode += "</div>";
  htmlcode += "</div>";
  htmlcode += "<div class='fourth_row'>";
  htmlcode += "<button id='idDelete' class='cancelButton'>Annulla</button>";
  htmlcode += "<button id='idOk' class='okButton' >Conferma</button>";
  htmlcode += "</div>";
  return htmlcode;
}
UI.addAnnotation = (semtype) => {
  ATON._bPauseQuery = true;

  let O = {};
  let semid = ATON.Utils.generateID("ann");

  let htmlcode = UI.createAnnForm()

  

  $("#idForm").html(htmlcode);
  APP.layers.forEach((layer)=>{
    if(layer.id==APP.currLayer)
    $(".layerSelect").val(layer.name)
  })
  
  //crea il form di compilazioni delle note delle categorie e sotto categorie
  $('#catSelect').on('change', function() {
    const subCategories = subCategoryMap[this.value];
    let htmlcode = '';
    subCategories.forEach((subCategory) => {
      htmlcode += `<option class="catOption" value="${subCategory}">${subCategory}</option>`;
    });
    $("#sottoCatSelect").html(htmlcode);
  });
  APP.loadMedia()
  
  
  
  // setting count limit for characters in the description
  /*var maxLength = 650;
  $("#idDescription").keyup(function () {
    var textlen = maxLength - $(this).val().length;
    $("#rchars").text(textlen);
  });*/

  $(".cancelButton").off("click").click(() => {
    $("#idForm").hide();
    ATON._bPauseQuery = false;
    if($(".sphereNoteImg").hasClass("clicked")){
      APP.goToMode(APP.STATE_ANN_BASIC)
    }
    else if($(".freeNoteImg").hasClass("clicked")){
      APP.goToMode(APP.STATE_ANN_FREE)
    }

  });

  $(".okButton").off("click").click(() => {
    $("#idForm").hide();

    let title = $("#idTitle").val();
    if (title) title.trim();

    let descr = $("#idDescription").val();
    if (descr) descr.trim();

    let cat = $("#catSelect").val();
    let subcat = $("#sottoCatSelect").val();

    
    
    let layer;
    
    APP.layers.forEach((l)=>{
      if(l.name===$(".layerSelect").val()){
        layer=l.id
        console.log(layer)
      }
    })

    let media=$(".uploadLink").val()
    let O = {};
    if (title) O.title = title;
    if (descr) O.descr = descr;
    if (cat) O.cat = cat;
    if (subcat) O.subcat = subcat;
    if (layer !=undefined ) O.layer=layer;
    
    
    if(media) O.media=media.trim();
    APP.addSemanticAnnotation(semid, O, semtype);

    ATON._bPauseQuery = false;
  });
};

UI.updateAnnotation = (semid) => {
  ATON._bPauseQuery = true;
  UI.toggleSemPanel(false)
  let d = ATON.SceneHub.currData.sem;
  if (d === undefined) return;

  let O = d[semid];
  if (O === undefined) return;

  // TODO: fill HTML form with O data
  let htmlcode = UI.createAnnForm()
  console.log(O.layer)
  
  $("#idUpdateAnn").html(htmlcode);

  APP.layers.forEach((layer)=>{
    console.log(layer.id,O.layer)
    if(layer.id==O.layer)
    {
      $(".layerSelect").val(layer.name)
      console.log(layer.name)
    }
  })
  const subCategories = subCategoryMap[O.cat];
  let subCatCode = '';
  subCategories.forEach((subCategory) => {
    subCatCode += `<option class="catOption" value="${subCategory}">${subCategory}</option>`;
  });
  $("#sottoCatSelect").html(subCatCode);

  $(".titleInput").val(O.title)
  $(".descriptionInput").val(O.descr)
  $(".categorySelect").val(O.cat)
  $(".uploadLink").val(O.media)
  
  if($(".subCategorySelect")[0].children.length===0){
    $(".subCategorySelect").val();
  }
  else{
    $(".subCategorySelect").val(O.subcat);
  }
  $("#idUpdateAnn").show();
  //crea il form di compilazioni delle note delle categorie e sotto categorie
  
  // setting count limit for characters in the description
  /*var maxLength = 650;
  $("#idDescription").keyup(function () {
    var textlen = maxLength - $(this).val().length;
    $("#rchars").text(textlen);
  });*/
  $(".categorySelect").on('change', function() {
    const subCategories = subCategoryMap[this.value];
    let htmlcode = '';
    subCategories.forEach((subCategory) => {
      htmlcode += `<option class="catOption" value="${subCategory}">${subCategory}</option>`;
    });
    $(".subCategorySelect").html(htmlcode);
  });
  $(".cancelButton").off("click").click(() => {
    $("#idUpdateAnn").hide();
    ATON._bPauseQuery = false;

  });
  $(".okButton").off("click").click(() => {
    console.log("clicco ok")
    $("#idUpdateAnn").hide();

    let title = $(".titleInput").val();
    if (title) title.trim();

    let descr = $(".descriptionInput").val();
    if (descr) descr.trim();

    let cat = $(".categorySelect").val();
    let subcat = $(".subCategorySelect").val();

    
    let layer;
    APP.layers.forEach((l)=>{
      if(l.name===$(".layerSelect").val()){
        console.log("layerSettato",l.id)
        layer=l.id
      }
    })
    let media=$(".uploadLink").val()
    

    if (title) O.title = title;
    if (descr) O.descr = descr;
    if (cat) O.cat = cat;
    
    if (subcat) {O.subcat = subcat;}
    else{O.subcat=''}
    if (layer !=undefined ) O.layer=layer;
    if(media) O.media=media.trim();
    APP.updateSemAnnotation(semid, O);
    ATON._bPauseQuery = false;
    
    
  });


  
};

UI.deleteAnnotation = (semid) => {
  // HTML form

  APP.deleteSemAnnotation(semid);
};
UI.stopLens=()=>{
  pauseInterval()
  $("#idViewControlContainer").hide();
}

export default UI;
