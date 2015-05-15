var utils = require("./utils");

var SocketData = function( socketId ) {
	var self = this;

	this._socketId      = socketId;
	this._isInitialized = false;	

	this._initialize = function( data ) {
		var request = utils.parseRequest( data );
		var headers = request["headers"];
		if ( !headers ) {
			throw new Error("Bad request");
			return;
		}

		if ( !headers["content-length"] ) {
			throw new Error("No content-length header");
			return;
		}		

		self._contentLength = parseInt( headers["content-length"] );
		self._loadedLength  = request["message"].length;
		self._data          = request["message"]; 
		self._isInitialized = true;
	}

	this.add = function( data ) {
		if ( !self._isInitialized ) {
			self._initialize( data );			
		}
		else {
			self._loadedLength += data.length;
			self._data         += data;
		}

		if ( self._contentLength == self._loadedLength ) {
			return true;
		}
		
		return false;
	},

	this.get = function() {
		return self._data;
	},

	this._set = function( data ) {
		self._data = data;
	}

	this.getSocketId = function() {
		return self._socketId;
	}
}

module.exports.SocketData = SocketData;

module.exports.ConnectionsBuffer = function() {
	var self = this;

	this.initialize = function() {
		self._sockets   = {};
		self._compliteListeners = [];
		self._errorListeners    = [];
	}

	this.receive = function( receiveInfo ) {
		var socketId  = receiveInfo.socketId;
		var data      = utils.arrayBufferToString(receiveInfo.data);

		var isReceiveComplite = false;

		try {
			isReceiveComplite = self._addSocketData( socketId, data );
		}
		catch( e ) {
			console.log(e);
			self._error( socketId, e.toString() );
		}

		if ( isReceiveComplite ) {
			self._complite( socketId );			
		}
	}

	this.hasSocket = function( socketId ) {
		if ( !self._sockets[ socketId ] ) return false;
		return true;
	}

	this._addSocketData = function( socketId, data ) {
		if ( !self.hasSocket( socketId ) ) {
			self._sockets[ socketId ] = new SocketData( socketId );
		}

		var socketData = self._sockets[ socketId ];
		return socketData.add( data );
	}

	this._complite = function( socketId ) {
		var socketData = self._sockets[ socketId ];

		delete self._sockets[ socketId ];

		for( var i in self._compliteListeners ) {
			self._compliteListeners[i]( socketData );
		}
	}

	this.onComplite = function( callback ) {
		self._compliteListeners.push( callback );
	}

	this._error = function( socketId, errorText ) {
		var socketData = self._sockets[ socketId ];
		socketData._set( errorText );

		for( var i in self._errorListeners ) {
			self._errorListeners[i]( socketData );
		}
	}

	this.onError = function( callback ) {
		self._errorListeners.push( callback );
	}

}