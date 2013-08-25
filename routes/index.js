
/*
 * GET home page.
 */
exports.init = function(app) {
	// Setup index route
	app.get('/', function(req, res){
		res.render('index', { title: 'Express' });
	});
}