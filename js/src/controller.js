var utils = require("./utils");
var commands = {
	"ping"          : require("./commands/ping"),
	"notification"  : require("./commands/notification")
};

module.exports = function Controller() {

	var self = this;	

	this.execute = function( dataString, callback ) {
		try {  
			var request = this._parseRequest( dataString );
			var command = request["command"];
			var data    = request["data"];
		}
		catch( e ) {			
			callback( self._createResponse( e.toString(), 400 ) );
			return;
		}		

		if ( command in commands ) {
			commands[command]( data, function( response, httpCode ) {
				httpCode = httpCode || 200;
				callback( self._createResponse( response ), httpCode );
			} );
			return;
		}

		callback( self._createResponse( "Unknown command" ), 400 );		
	}

	this._parseRequest = function( data ) {
		var request = null;

		try {
			request = JSON.parse( data );
		}
		catch ( e ) {
			throw new Error( "Bad JSON syntax" );
		} 

		if ( (typeof request != "object") || !("command" in request) || !("data" in request) ) {
			throw new Error( "Field 'command' or 'data' doesn't exist" );	
		}

		return request;
	}

	this._createResponse = function( dataString, statusCode ) {
		return {
			"response"   : dataString,
			"statusCode" : statusCode
		}
	}
		
}