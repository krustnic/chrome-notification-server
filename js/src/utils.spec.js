var utils = require("./utils");

describe( "parseRequest", function() {
	it( "Empty string", function() {
		expect( utils.parseRequest( "" ) ).toEqual( {
			headers : null,
			message : null
		} );
	});

	it( "Without message body", function() {
		var headers = "content-length: 10";
		expect( utils.parseRequest( headers )["headers"] ).toEqual( null );
	});

	it( "Single header", function() {
		var headers = "content-length: 10\r\n\r\n0123456789";
		expect( utils.parseRequest( headers )["headers"] ).toEqual( {
			"content-length" : "10"
		} );
	});

	it( "Full request", function() {
		var headers = "POST http://www.site.ru/news.html HTTP/1.0\r\nHost: www.site.ru\r\nReferer: http://www.site.ru/index.html\r\nCookie: income=1\r\nContent-Type: application/x-www-form-urlencoded\r\nContent-Length: 35\r\n\r\nlogin=Petya%20Vasechkin&password=qq";
		
		expect( utils.parseRequest( headers )["headers"] ).toEqual( {
			"host"           : "www.site.ru",
			"referer"        : "http",
			"cookie"         : "income=1",
			"content-type"   : "application/x-www-form-urlencoded",
			"content-length" : "35"
		} );
	});

	it( "Wrong http", function() {
		var headers = "123";
		expect( utils.parseRequest( headers ) ).toEqual( {
			headers : null,
			message : null
		} );
	});
});

describe( "validatePort", function() {
	it( "Port should be between 1 and 65535", function() {
		expect( utils.validatePort( "1" ) ).toBe( true );
		expect( utils.validatePort( "65535" ) ).toBe( true );
		expect( utils.validatePort( 8989 ) ).toBe( true );		
	});

	it( "Should not be float", function() {
		expect( utils.validatePort( "12.12" ) ).toBe( false );
	});
});