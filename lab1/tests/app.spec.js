(function() {
  const App = require('../src/app.js');
  let app;

  var assert = require('chai').assert;

  describe('Lab1App', function() {
    //Before each text, reset the app instance
    beforeEach(function() {
      app = new App();
    });

    afterEach(function() {
      //reset the memory blocks
      var keys = Object.keys(app.memoryBlocks);
      for (var i = 0; i < keys.length; i++) {
        app.memoryBlocks[keys[i]].status = "empty";
      }

      //Reset the jobs
      var jobs = Object.keys(app.jobsList);
      for (var i = 0; i < jobs.length; i++) {
        app.jobsList[jobs[i]].status = "new";
        if (app.jobsList[jobs[i]].memoryBlock)
          delete app.jobsList[jobs[i]]['memoryBlock']
      }
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

      it("return null if all memory blocks are full", function() {
        var keys = Object.keys(app.memoryBlocks);
        for (var i = 0; i < keys.length; i++) {
          app.memoryBlocks[keys[i]].status = "full"; //optimal memory block is busy
        }

        var memBlock = app.findBestFit(app.jobsList['14']);
        assert.equal(memBlock, null);
      });

      it('picks the next best fit, if there is an open memory block', function() {
        app.memoryBlocks["10"].status = "full";
        var memBlock = app.findBestFit(app.jobsList['14']);
        memBlock.should.equal('7');
      });
    });

    describe('#queueJob', function() {
      it('given a job, add it to a memory block to be processed', function() {
        app.queueJob("1", app.jobsList["1"]).should.equal(true);
      });

      it('given a waiting job, add it to a memory block to be processed', function() {
        app.jobsList["1"].status = "waiting";
        app.queueJob("1", app.jobsList["1"]).should.equal(true);
      });

      it('given an already finished job, dont add it to a memory block', function() {
        app.jobsList["1"].status = "done";
        app.queueJob("1", app.jobsList["1"]).should.equal(false);
      });
    });
  });
}());