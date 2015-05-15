var utils = require("./utils");

var saveElement = document.querySelector("#save");
var portElement = document.querySelector("#port");

chrome.storage.sync.get( "port", function(data) {
  	if ( data && data["port"] ) {
  		portElement.value = data["port"];
  	}
});

saveElement.onclick = function() {
	var port    = 8989;
	var rawPort = portElement.value;

	if ( utils.validatePort( rawPort ) ) {
		port = rawPort;

		chrome.storage.sync.set({
	    	port : port
	  	}, function() {	  		
	  		window.close();
	  	});
	}
	else {
		if ( portElement.className.indexOf("bad-port") == -1 ) {
			portElement.className += " bad-port";
		}
	}	
}