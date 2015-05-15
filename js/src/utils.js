module.exports.arrayBufferToString = function( buffer ) {
	var str = "";
	var uArrayVal = new Uint8Array(buffer);
	for (var s = 0; s < uArrayVal.length; s++) {
	    str += String.fromCharCode(uArrayVal[s]);
	}
	return str;
};

module.exports.stringToUint8Array = function( string ) {
    var buffer = new ArrayBuffer(string.length);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < string.length; i++) {
      view[i] = string.charCodeAt(i);
    }
    return view;
};

var methods = {
	"GET"     : true,
	"POST"    : true,
	"PUT"     : true,
	"HEAD"    : true,
	"DELETE"  : true,
	"OPTIONS" : true,
	"PATCH"   : true,
	"TRACE"   : true,
	"CONNECT" : true
};

module.exports.parseRequest = function( response ) {
	var request = {};
	request["headers"] = null;
	request["message"] = null;

	// Remove first line with HTTP method name
	if ( response.substring(0, response.indexOf(' ') ) in methods ) {
		response = response.substring( response.indexOf('\n') );
	}

	var httpParts = response.split("\r\n\r\n");
	if ( httpParts.length != 2 ) {
		return request;
	}

	var headersBlock = httpParts[0];
	var parts = headersBlock.split("\n");

	var headers = {};
	for( var i in parts ) {
		var headerString = parts[i];
		var headerParts  = headerString.split(":");

		if ( headerParts[1] == undefined ) continue;

		headers[ headerParts[0].toLowerCase() ] = headerParts[1].trim();
	}

	request["headers"] = headers;
	request["message"] = httpParts[1];

	return request;
}

module.exports.createHttpResponse = function( response ) {
	var dataString = response["response"];
	var statusCode = response["statusCode"] || 200;

	var contentType   = "application/json";
    var contentLength = dataString.length;    

    var lines = [
      "HTTP/1.0 " + statusCode + " OK",
      "Content-length: " + contentLength,
      "Content-type:"    + contentType      
    ];	    

    var response = lines.join("\n");
    response += "\n\n" + dataString;

    var responseArray = module.exports.stringToUint8Array( response );	    
    var outputBuffer = new ArrayBuffer(responseArray.byteLength);

	var view = new Uint8Array(outputBuffer);
    view.set(responseArray, 0);

    return outputBuffer;
}

module.exports.validatePort = function( input ) {
	input += "";
	var min = 1;
	var max = 65535;
    var num = +input;
    return num >= min && num <= max && input === num.toString() && input.indexOf(".") == -1;
}
