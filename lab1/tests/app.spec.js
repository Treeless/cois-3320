(function() {
  const App = require('../app.js');
  let app;

  describe('Lab1App', function() {
    //Before each text, reset the app instance
    beforeEach(function() {
      app = new App();
    });

    //Method testings
    describe('#findBestFit', function() {
      it('Return the proper memory block for the smallest job', function() {
        var memBlock = app.findBestFit({ size: 250 });
        memBlock.should.equal("10"); //10 is 500bytes the snuggiest of the snug
      });

      it('return -2 if the job cannot ever be allocated', function() {
        var memBlock = app.findBestFit({ size: 10000 });
        memBlock.should.equal(-2);
      });

      it('returns the expected value', function() {
        var memBlock = app.findBestFit(app.jobsList["1"]);
        memBlock.should.equal('2');
      });

      it('returns another expected value', function() {
        var memBlock = app.findBestFit(app.jobsList['14']);
        memBlock.should.equal('10');
      });

      it("return -1 if the job has no free memory block to use", function() {

      });

      it.skip('return null if all memory blocks are full', function() {});
      it.skip('return the snuggest memory block for the job', function() {});
    });

    describe('#queueJob', function() {
      it('given a job, add it to a memory block to be processed', function() {
        app.queueJob("1", app.jobsList["1"]).should.equal(true);
      });
      it.skip('given a waiting job, add it to a memory block to be processed', function() {});
      it.skip('given an already finished job, dont add it to a memory block', function() {});
    });
  });
}());