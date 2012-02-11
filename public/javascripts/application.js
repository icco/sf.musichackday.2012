// Put your application scripts here
function main() {
  console.log(welcome());
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
