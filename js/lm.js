/*
    Codex4D Leap Motion control
    author: bruno.fanini_AT_gmail.com

===========================================================*/
let LM = {};

LM.setup = ()=>{

    LM.ws = undefined;
    LM.focusListener;
    LM.blurListener;
    LM.bLMpaused = false;
    LM.frame = undefined;
    LM.bTrackingHand = false;

    // Create and open the socket
    LM.ws = new WebSocket("ws://localhost:6437/v7.json");

    // On successful connection
    LM.ws.onopen = function(event) {
        LM.ws.send(JSON.stringify({focused: true})); // claim focus

        LM.focusListener = window.addEventListener('focus', function(e) {
            LM.ws.send(JSON.stringify({focused: true})); // claim focus
        });

        LM.blurListener = window.addEventListener('blur', function(e) {
            LM.ws.send(JSON.stringify({focused: false})); // relinquish focus
        });
    };

    // On message received
    LM.ws.onmessage = function(event) {
        if (!LM.bLMpaused){
            LM.frame = JSON.parse(event.data);
            //var str = JSON.stringify(obj, undefined, 2);

            let hands = LM.frame.hands;

            if (!hands || hands.length<1){
                if (LM.bTrackingHand) ATON.SUI.setSelectorRadius(APP.LRAD_MIN);
                LM.bTrackingHand = false;
                return;
            }

            LM.bTrackingHand = true;

            for (let i = 0; i<hands.length; i++){
                let h = hands[i];

                if (h.type === "left"){
                    /*
                    let x = h.palmPosition[0] * 0.001;
                    let y = (h.palmPosition[1] * 0.001) - 0.1;
                    let z = h.palmPosition[2] * 0.001;
    
                    APP.uniforms.vLens.value.x = ATON.bounds.center.x + x;
                    APP.uniforms.vLens.value.y = ATON.bounds.center.y - y;
                    APP.uniforms.vLens.value.z = ATON.bounds.center.z - z;
                    */

                    let x = h.palmPosition[0] * 0.005;
                    let y = (h.palmPosition[1] * 0.005) - 1.0;
                    //let z = (100.0 - h.palmPosition[2]) * 0.002;
                    let z = (h.palmPosition[2]+50.0) * 0.01;
                    //console.log(z)

                    ATON._screenPointerCoords.x = x;
                    ATON._screenPointerCoords.y = y;

                    //if (z > 0.0) ATON.SUI.setSelectorRadius(z);
                    //else ATON.SUI.setSelectorRadius(0.0);

                    //APP.setIRvalue(z);
                }
                else {
                    let z = (100.0 - h.palmPosition[2]) * 0.002;

                    if (h.grabStrength > 0.5){
                        if (z > 0.0) ATON.SUI.setSelectorRadius(z);
                        //else ATON.SUI.setSelectorRadius(APP.LRAD_MIN);
                    }
                    //let z = (h.palmPosition[2]+50.0) * 0.01;
                    //APP.setIRvalue(z);
                }
            }

            //console.log(LM.frame);
/*
            if(!LM.frame.hasOwnProperty("timestamp")){
                //console.log(str);
            } else{
                //console.log(str);
            }
*/
        }
    };
    
    // On socket close
    LM.ws.onclose = function(event) {
        LM.ws = null;
        window.removeEventListener("focus", LM.focusListener);
        window.removeEventListener("blur", LM.blurListener);
    }

    // On socket error
    LM.ws.onerror = function(event) {
        console.log("Received error");
    };
};

export default LM;