var commandName = "notification";

module.exports = function( data, callback ) {

	if ( data && !data["iconUrl"] ) {
		data["iconUrl"] = chrome.runtime.getURL( "/images/icon128x128.png" );
	}

	chrome.notifications.create( data, function() {
		if ( chrome.runtime.lastError ) {
			callback( chrome.runtime.lastError["message"], 400 );
			return;
		}
		
		callback( "OK" );
		return;		
	} );
}