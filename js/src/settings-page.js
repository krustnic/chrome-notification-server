var utils = require("./utils");

var saveElement = document.querySelector("#save");
var portElement = document.querySelector("#port");

var DEFAULT_PORT = 8989;

chrome.storage.sync.get( "port", function(data) {
  	if ( data && data["port"] ) {
  		portElement.value = data["port"];
  	}
  	else {
  		chrome.storage.sync.set({
	    	port : DEFAULT_PORT
	  	}, function() {
	 		portElement.value = DEFAULT_PORT; 		
	  	});
  	}
});

saveElement.onclick = function() {
	var port    = DEFAULT_PORT;
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