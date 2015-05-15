var Buffer     = require("./buffer");
var Controller = require("./controller");
var utils      = require("./utils");

var connectionsBuffer = new Buffer.ConnectionsBuffer();
var controller        = new Controller();

var tcpServer = chrome.sockets.tcpServer;
var tcpSocket = chrome.sockets.tcp;

var serverSocketId;

tcpServer.onAccept.addListener( onAccept );
tcpSocket.onReceive.addListener( connectionsBuffer.receive );

chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('/html/settings.html', {		
		innerBounds: {
			width: 300,
			height: 300
    	},
    	resizable : false
  	});
});

function showErrorWindow() {
	chrome.app.window.create('/html/error.html', {		
		innerBounds: {
			width: 400,
			height: 200
    	},
    	resizable : false
  	});
};

function onAccept( acceptInfo ) {
    tcpSocket.setPaused(acceptInfo.clientSocketId, false);

    if (acceptInfo.socketId != serverSocketId) {
        return;
    }    
};

function sendReplyToSocket( socketId, responseObject ) {
	var buffer = utils.createHttpResponse( responseObject );

	// verify that socket is still connected before trying to send data
	tcpSocket.getInfo( socketId, function( socketInfo ) {
		if ( !socketInfo || !socketInfo.connected ) {
			destroySocketById( socketId );
			return;
		}

		tcpSocket.send( socketId, buffer, function( writeInfo ) {			
			destroySocketById( socketId );			
		});
		
	});
};

function destroySocketById( socketId, callback ) {
	tcpSocket.disconnect( socketId, function() {
		tcpSocket.close( socketId );

		if ( callback ) callback();
	});
};

function createNotificationServer( port ) {
	tcpServer.create( {}, function( socketInfo ) {
		serverSocketId = socketInfo.socketId;

		connectionsBuffer.initialize();

		connectionsBuffer.onComplite( function( socketData ) {		
			controller.execute( socketData.get(), function( responseObj ) {
				sendReplyToSocket( socketData.getSocketId(), responseObj );	
			});		
		} );

		connectionsBuffer.onError( function( socketData ) {
			sendReplyToSocket( socketData.getSocketId(), {
				"response"   : socketData.get(),
				"statusCode" : 400
			});				
		} );

		console.log("Starting server on port: ", port);
		tcpServer.listen( serverSocketId, "127.0.0.1", port, 10, function(result) {		
			if ( chrome.runtime.lastError ) {				
				console.log( chrome.runtime.lastError["message"] );		
				showErrorWindow();		
				return; 
			}
			
			console.log("Notification server started.");
	    });
	});	
};

function restartNotificationServer( port ) {
	if ( serverSocketId ) {
		console.log( "Destroy socket: ", serverSocketId );
		tcpServer.disconnect( serverSocketId, function() {
			tcpServer.close( serverSocketId, function() {
				createNotificationServer( port );
			} );						
		} );
	}
	else {
		createNotificationServer( port );		
	}	
};

chrome.storage.sync.get( "port", function(data) {
	var port = 8989;
  	if ( data && data["port"] ) {
  		port = parseInt( data["port"] );
  	}

  	createNotificationServer( port );
});

/**
 * Restart Notification Server on different port if user change it
 */
chrome.storage.onChanged.addListener(function(changes, namespace) {
	if ( changes["port"] ) {
		var port = parseInt( changes["port"]["newValue"] );

		restartNotificationServer( port );		
	}
});