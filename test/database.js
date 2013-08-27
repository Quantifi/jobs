var mongoose=require('mongoose'),
    assert = require('assert'),
    databaseURI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL  || 'mongodb://localhost/devcon-jobs';

describe('Database', function () {
  it('should be able to connect to database', function (done) {
    mongoose.connect(databaseURI, function (err, conn) {
      assert.ifError(err);
      console.log('successfully connected to database @devcon-jobs');
      done();
    });
  });
});
