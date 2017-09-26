(function() {
  // Matthew Rowlandson { http://www.github.com/Treeless }
  // Date: 9/26/2017
  // Lab 1 - Memory Management
  // Purpose: Simulate a given set of jobs using a fixed partition memory scheme using a Best-Fit allocation method.
  //          Creating an even-driven simulation that waits until all jobs have been executed with the memory as is.
  //          Job sizes are in order of bytes
  //
  // Assumptions: - Best fit allocation method means the algorithm will go through and find the closest sized memory block that matches the jobsize requirements.
  //              - Fixed partition memory scheme means that the memory blocks cannot be altered in any way and are as is.
  //              - We don't do the smart thing and pick another memory block if the best one for the job is busy. We wait. (I assummed this because of the output example having a waiting job)
  //
  // DEFINITIONS: Best fit: The allocator places a process in the smallest block of unallocated memory in which it will fit.

  //Note: This is coded using JavaScript and NodeJS v8.1.3. I use a data.json file that holds the information for the simulation to run off of.

  const DATA = require('./data.json'); //Data for the job simulation

  const App = function() {
    var self = this; //reference to this (used in asyncronous or nested functions)

    this.memoryBlocks = []; //Where we keep track of our memory blocks
    this.jobsList = []; //List of jobs
    this.queue = []; //Queue for jobs
    this.quickLookup = {}; //For each job id, points to which queue object it is associated with

    //This function starts the memory manager and begins/manages the job processing
    this.start = function() {
      this.memoryBlocks = DATA.memoryList;
      this.jobsList = DATA.jobList;
      this.queueJobs(); //queue the jobs to the proper memory blocks
      this.startProcessing(); //start processing the jobs in the memory blocks

      this.currentStatusOutput();
    }

    //Goes through the job queue and starts each job in each memory block
    this.startProcessing = function() {

    };

    //This function queues up the jobs in a data structure that points to the best fitting memory block
    this.queueJobs = function() {
      //first, populate the queue object with the memory properties
      this.initQueue();
      this.sortQueueByMemorySize(); //This will make allocating jobs to a memory block much easier

      //Now, going through the list of jobs. Allocate the best memory block to use for each job and queue them up for that memory block (This is under the assumption that we don't pick another block if one is busy)
      // Please note: The queue is sorted from smallest to largest memory block. So it can find the best fit easiest.
      var jobNumbers = Object.keys(this.jobsList);
      for (var i = 0; i < jobNumbers.length; i++) {
        var jobSize = this.jobsList[jobNumbers[i]].jobSize; //size of the job

        var foundSpot = false;
        for (var k = 0; k < this.queue.length; k++) {
          if (this.queue[k].size >= jobSize) {
            //Use this memory block. It fits best.
            this.queue[k].jobsQueued.push({ jobNum: jobNumbers[i], "jobSize": jobSize, "runTime": this.jobsList[jobNumbers[i]].time, "jobStatus": 'new', waitTime: 0, completionTime: 0 });
            this.quickLookup[jobNumbers[i]] = { queueIndex: k, jobsQueuedIndex: this.queue[k].jobsQueued.length - 1 };
            foundSpot = true;
            break;
          } else {
            continue; //next
          }
        }

        if (!foundSpot) {
          console.log("WARNING - UNALLOCATED JOB NUMBER: ", jobNumbers[i]);
        }

        //remove the job from the list, its been assigned
        jobNumbers.shift();
        i--;
      }
    };

    //Sort the queue to be organized by memory size. Smallest to largest. Makes it easier to allocate jobs to the appropriate memory block
    this.sortQueueByMemorySize = function() {
      this.queue.sort(function(a, b) {
        if (a.size > b.size) {
          return 1;
        } else if (a.size < b.size) {
          return -1;
        } else {
          return 0;
        }
      });
    };

    //Sets up the jobs queue for each memory block based on their associated size.
    this.initQueue = function() {
      var memoryBlockNumbers = Object.keys(this.memoryBlocks);
      for (var i = 0; i < memoryBlockNumbers.length; i++) {
        var blockNum = memoryBlockNumbers[i];
        this.queue.push({ "blockNum": blockNum, "size": this.memoryBlocks[blockNum].size, jobsQueued: [] });
      }
    };

    //This function outputs the current status of the jobs
    this.currentStatusOutput = function() {
      process.stdout.write('\033c');
      console.log("Job Number", "Run Time", "Job Size", "Job Status", "Wait Time", "Completion Time");
      // var keys = Object.keys(this.quickLookup);
      // for (var i = 0; i < keys.length; i++) {
      //   var jobNum = keys[i];
      //   var queueIndex = this.quickLookup[jobNum].queueIndex;
      //   var jobsQueueIndex = this.quickLookup[jobNum].jobsQueuedIndex;
      //   console.table(this.queue[queueIndex].jobsQueued[jobsQueueIndex]);
      // }
      console.table
      //todo
    }
  };

  let app = new App(); //extantion of the process
  app.start(); //starting the memory manager

}());

//I might have made this lab more complicated then it needed to be. Oh well...