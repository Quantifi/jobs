
/*
 * GET home page.
 */

/**
 * homePageHandler
 * @param  {object} app
 */
function homePageHandler(app) {

  app.get('/', function (req, res) {
    res.set({
      'content-type': 'text/html',
      'cache-control': 'no-cache, max-age=0, must-revalidate'
    });
    res.render('index', { title: 'DevCongress Jobs' });
  });

  // added this so that any request with the urls ['/index', '/index.htm', '/index.html']
  // would be redirected to /

  app.get(/\/index(\.(html|htm))?$/, function (req, res) {
    res.redirect(301, '/');
  });

}

exports.init = homePageHandler;
