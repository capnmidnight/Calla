(function(){

function setVolume(user, volume){
  var id = "#participant_" + user + " audio",
    audio = document.querySelector(id);
  if(audio){
    audio.volume = volume;
  }
  else{
    console.warn("Could not find audio element for user " + user);
  }
}

var commands = {
  _setVolume: function(evt){
    setVolume(evt.user, evt.volume);
  }
}

addEventListener("message", function(evt) {
  if(evt.origin === "http://localhost"
    || evt.origin === "https://localhost"
    || evt.origin.startsWith("http://localhost:")
    || evt.origin.startsWith("https://localhost:")
    || evt.origin === "https://meet.primrosevr.com")
    try{
      var data = JSON.parse(evt.data);
      if(data.hax === "jitsi") {
	 var commandID = "_" + data.command;
         if(commands[commandID]){
           commands[commandID](data);
	 }
      }
    }
    catch(exp){
      console.error(exp);
    }
});
})();
