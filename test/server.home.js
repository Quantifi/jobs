// In the first tests that I(https://github.com/ngenerio) wrote I realiased when I shut down the server
// the tests still passed so had to rewrite it to get the desired result

var http = require('http'),
    domain = require('domain'),
    assert = require('assert'),
    headers = require('./headers.json'),
    ifError = assert.ifError,
    options = {
      host: 'localhost',
      port: 4400,
      path: '/',
      method: 'GET',
      headers: headers
    };

/**
 * assert.ifError
 * @param  {object} err
 * @throw err;
* function ifError(err) {
*  if (err) {
*    throw err;
*  }
* }
*/

var temporaryArray = [],
    temporaryObject = {},
    slice = temporaryArray.slice,
    toString = temporaryObject.toString;

/**
 * server - make a request
 * @param  {object}   options
 *  eg. options = {
      host: 'localhost',
      port: 4400,
      path: '/',
      method: 'GET',
      headers: headers,
      expected: {
        status: 500,
        headers: {
          'content-type': 'application'/json
        }
      }
    };
 * @param  {Function} callback
 */
function server(options, callback) {
  var args = slice.call(arguments), req, domainHandler, status, prop, headers, ondone;

  if (args.length === 1) {
    // the toString method of Object:: ({}.prototype) provides a finer grain of the type of an object
    // you can't trust javascript typeof
    // this is from Javascript garden (https://bonsaiden.github.com/Javascript-Garden)
    /*
      "foo" String string
      new String("foo") String object
      1.2 Number number
      new Number(1.2) Number object
      true Boolean boolean
      new Boolean(true) Boolean object
      new Date() Date object
      new Error() Error object
      [1,2,3] Array object
      new Array(1, 2, 3) Array object
      new Function("") Function function
      /abc/g RegExp object
      new RegExp("meow") RegExp object
      {} Object object
      new Object() Object object
    */
    if ('expected' in options && toString.call(options.expected).slice(8, -1).toLowerCase() === 'object') {
      status = options.expected.status;
      headers = options.expected.headers;
      delete options.expected;
    }
    if ('done' in options) {
      ondone = options.done;
      delete options.done;
    }

    // using the domain module helps with handling unhandled errors
    domainHandler = domain.create();
    domainHandler.on('error', ifError);

    domainHandler.run(function () {
      req = http[options['method'].toLowerCase()](options, function (res) {
        assert.equal(res.statusCode, status);

        for (prop in headers) {
          if (headers.hasOwnProperty(prop) && (prop in res.headers)) {
            assert.equal(res.headers[prop], headers[prop]);
          }
        }

        res.on('data', function (data) {
          console.log('we yeah! :)-@devcon-jobs')
        });

        req.end();
        ondone && ondone();
      });
    });
  }
  // if a calback function is provided, the normal flow would be like the express way (app.get('/', function (req, res)))
  else {
    req = http[options['method'].toLowerCase()](options);

    req.on('response', function (res) {
      cb(req, res);
    });
  }
}

describe('Server', function () {

  describe('request to ', function () {
    it('`/` should respond with response', function (done) {
      var optionsToSend = options;
      optionsToSend.expected = {
        status: 200
      };
      optionsToSend.done = done;
      server(optionsToSend);
    });
  });

  describe('redirection should work', function () {
    var arrayOfPath = ['/index', '/index.htm', '/index.html'],
        count = 0,
        optionsToSend = options;

    // this handler function makes testing the three urls a ease
    // follows the same logic like the rest
    // make a request and increment the count
    function handler(done) {
      optionsToSend.path = arrayOfPath[count];
      optionsToSend.expected = {
        status: 301
      };
      optionsToSend.done = done;
      server(optionsToSend);
      count++;
    }

    it('when url is `/index`', function (done) {
      handler(done);
      console.log(arrayOfPath[count]);
    });

    it('when url is `/index.htm`', function (done) {
      handler(done);
    });

    it('when url is `/index.html`', function (done) {
      handler(done);
    });
  });

});
