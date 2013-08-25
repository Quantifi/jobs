/*
* Module Dependencies
*/
var mongoose 		= 		require('mongoose'),
	moment 			= 		require('moment'),
	Schema 			= 		mongoose.Schema;

// Select Database (local/prod - based on context)
var dbUriString = 	process.env.MONGOLAB_URI || process.env.MONGOHQ_URL  || 'mongodb://localhost/devcon-jobs';

// Connect to the db
mongoose.connect(dbUriString, function (err, conn) {
	if (err) { 
		console.log ('ERROR connecting to: ' + dbUriString + '. ' + err);
	} else {
		console.log ('Successfully connected to: ' + dbUriString);
	}
});