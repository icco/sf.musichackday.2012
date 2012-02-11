/*
 * mixboard-app.js
 * reed morse, nat welch
 * 
 * You should include this app last (models and UI need to load first).
 * 
 */

var soundManager;
var octopus = new Octopus();

// This gets called to start everything up
function main() {
  // Start up JQuery
  $(function() {
    // Start up Sound Manager
    console.log("soundmanager: ");
    console.log(soundManager);
    soundManager.url = '/javascripts/soundmanager2/swf/'; // directory where SM2 .SWFs live
    soundManager.debugMode = false;
    soundManager.debugFlash = false;
    soundManager.multiShot = true; // multiple instances of a playing song

    soundManager.onready(function() {
      run();
    });
    
    soundManager.ontimeout(function() {
      error("Couldn't load soundmanager.");
    });
  });
}

// Stuff loaded, lets get goin'
function run() {
    console.log(welcome());

    UI.bind();

    //octopus.add(new Sound('s0001'));
    //octopus.add(new Sound('s0002'));

    UI.mainLoop();
}



/* Helpers */
function error(string) {
    alert("ERROR: " + string + " Handle errors better.");
}
function welcome() {
    return '\n \
                  .---.         ,, \n \
       ,,        /     \\       ;,,\' \n \
      ;, ;      (  o  o )      ; ;  mxb.fm\n \
        ;,\';,,,  \\     /      ,; ;   \n \
     ,,,  ;,,,,;;,`   \'-,;\'\'\'\',,,\' \n \
    ;,, ;,, ,,,,   ,;  ,,,\'\';;,,;\'\'\'; \n \
       ;,,,;    ~~\'  \'\';,,\'\'\',,;\'\'\'\' \n \
                          \'\'\' \n \
    ';
}
