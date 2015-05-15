/** 
 * Copyright (c) 2015 Aleksandr Mityakov
 * Licensed under the MIT license.
 */
'use strict';

var platform = require("./chrome-notifications");

var options  = {
	port    : 8989,
	type    : "basic",
	title   : "Note!",
	message : "Hello world"
}

platform.supported( options, function( isSupported ) {

	if ( isSupported ) {
		platform.notify( options, function() {
			console.log( "Notification done" );
		} );
	}
	else {
		console.log( "Chrome Notification Server is not available." );
	}

} );