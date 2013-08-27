var assert = require('assert'),
    http = require('http'),
    headers = require('./headers.json'),
    options = {
      port: 3000,
      path: '/',
      method: 'GET',
      headers: headers
    };


/**
 * makeRequest function to use for making request
 * @param  {object}   options
 * @param  {Function} cb
 * @api public
 * pass in options and provide an optional callback which accepts request(clientRequest) and response(IncomingMessage)
 */
function makeRequest(options, cb) {
  var args = [].slice.call(arguments),
      request;

 // make an http request with the http module

 // if the args#length is one(1) then handle the request
  if (args.length === 1) {
    request = http.get(options, function (res) {
      res.on('data', function (data) {
        console.log('got response @devcon-jobs');
      });

      res.on('end', function () {
        console.log('response ended @devcon-jobs');
      });
    });

    request.on('error', function (err) {
      assert.ifError(err);
    });
  }
  // allow the caller to use his own function to handle request and response
  else {
    request = http.get(options, function (res) {
      cb(request, res);
    });
  }
}

describe('Server', function () {

  describe('get `/`', function () {
    it('should respond with some data', function (done) {
      makeRequest(options);
      done();
    });
  });

  describe('get `/index` or `/index.html` or `/index.htm` ', function () {
    var optionsTosend = options,
        arrayOfPath = ['/index', '/index.htm', '/index.html'],
        count = 0;

    // this function handles the request to thr arrayOfPath
    // make a request increment the count so the next caller will use url that's next in the arrayOfPath
    /**
     * multiPathHandler
     * @param  {requestObject} req
     * @param  {responseObject} res
     * @api private
     */
    function multiPathHandler(req, res) {
      assert.equal(res.statusCode, 301, 'redirect status code is 301');
      res.on('data', function (data) {
        console.log('got data @devcon-jobs');
      });

      req.end();

      req.on('error', function (err) {
        assert.ifError(err);
      });
      count++;
    }

    /**
     * handler runs async tests fot the arrayOfPath
     * @param  {Function} done async callback
     */
    function handler(done) {
      optionsTosend.path = arrayOfPath[count];
      makeRequest(optionsTosend, multiPathHandler);
      done();
    }

    it('should redirect to `/` when url is index', function (done) {
      handler(done);
    });

    it('should redirect to `/` when url is index.htm', function (done) {
      handler(done);
    });

    it('should redirect to `/` when url is index.html', function (done) {
      handler(done);
    });
  });
});
