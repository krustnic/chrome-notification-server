var utils  = require("./utils");
var buffer = require("./buffer");
var ConnectionsBuffer = buffer.ConnectionsBuffer;
var SocketData        = buffer.SocketData;

describe( "ConnectionsBuffer", function() {
	it( "Simple case", function( done ) {
		var connectionsBuffer = new ConnectionsBuffer();
		connectionsBuffer.initialize();

		connectionsBuffer.onComplite( function( socketData ) {
			expect( socketData.get() ).toEqual( "1234567890" );	
			done();
		} );

		connectionsBuffer.receive({
			socketId : 1,
			data     : utils.stringToUint8Array("Content-Length: 10\r\n\r\n1234567890")
		});
	} );

	it( "Multiple requests", function( done ) {
		var connectionsBuffer = new ConnectionsBuffer();
		connectionsBuffer.initialize();

		connectionsBuffer.onComplite( function( socketData ) {
			expect( socketData.get() ).toEqual( "1234567890" );	
			expect( connectionsBuffer.hasSocket( socketData._socketId ) ).toEqual( false );
			done();
		} );

		connectionsBuffer.receive({
			socketId : 1,
			data     : utils.stringToUint8Array("Content-Length: 10\r\n\r\n123")
		});

		connectionsBuffer.receive({
			socketId : 1,
			data     : utils.stringToUint8Array("456")
		});

		connectionsBuffer.receive({
			socketId : 1,
			data     : utils.stringToUint8Array("7890")
		});
	} );

	it( "Multiple sockets", function( done ) {
		var connectionsBuffer = new ConnectionsBuffer();
		connectionsBuffer.initialize();
		
		connectionsBuffer.onComplite( function( socketData ) {
			if ( socketData._socketId == 1 ) expect( socketData.get() ).toEqual( "111" );	
			if ( socketData._socketId == 2 ) expect( socketData.get() ).toEqual( "222" );	
			if ( socketData._socketId == 3 ) expect( socketData.get() ).toEqual( "333" );	

			expect( connectionsBuffer.hasSocket( socketData._socketId ) ).toEqual( false );
			done();
		} );

		connectionsBuffer.receive({
			socketId : 1,
			data     : utils.stringToUint8Array("Content-Length: 3\r\n\r\n11")
		});

		connectionsBuffer.receive({
			socketId : 2,
			data     : utils.stringToUint8Array("Content-Length: 3\r\n\r\n22")
		});

		connectionsBuffer.receive({
			socketId : 3,
			data     : utils.stringToUint8Array("Content-Length: 3\r\n\r\n33")
		});

		connectionsBuffer.receive({
			socketId : 1,
			data     : utils.stringToUint8Array("1")
		});

		connectionsBuffer.receive({
			socketId : 2,
			data     : utils.stringToUint8Array("2")
		});

		connectionsBuffer.receive({
			socketId : 3,
			data     : utils.stringToUint8Array("3")
		});

	} );
} );