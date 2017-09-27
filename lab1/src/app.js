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

  //Memory block flags
  const BUSY_FLAG = -1;
  const FAILED_FLAG = -2;

  //Memory block statuses
  const MEMBLOCK_EMPTY = "empty"; //if you change this, change in data.json
  const MEMBLOCK_FULL = "full";

  //Job statuses
  const NEW_JOB = "new"; //if you change this, change in data.json
  const FAILED_JOB = "failed";
  const DONE_JOB = "done";
  const WAITING_JOB = "waiting";
  const RUNNING_JOB = "running";

  //Application
  const App = function() {
    var self = this; //reference to this (used in asyncronous or nested functions)

    this.memoryBlocks = DATA.memoryList; //Where we keep track of our memory blocks
    this.jobsList = DATA.jobList; //List of jobs
    var timer = null;
    this.jobsCompleted = 0;

    //This function starts the memory manager and begins/manages the job processing
    this.start = function() {
      this.queueJobs(); //queue the jobs to the proper memory blocks (initially)

      timer = setInterval(function() {
        self.processing(); //start processing the jobs in the memory blocks and manage them
        if (self.jobsCompleted >= Object.keys(self.jobsList).length) {
          console.log("System finished.");
          clearInterval(timer);
          timer = null;
        }
      }, 1000);
    }

    //Goes through the job queue and starts each job in each memory block
    this.processing = function() {
      var jobIds = Object.keys(this.jobsList);
      //Go through each job (if running, increment completion time)
      for (var i = 0; i < jobIds.length; i++) {
        var job = this.jobsList[jobIds[i]];
        if (job.status == RUNNING_JOB) {
          this.jobsList[jobIds[i]].completionTime++;
          if (job.completionTime >= job.time) {
            //JOB IS DONE
            //Tell the memory block to empty itself
            this.memoryBlocks[job.memoryBlock].status = MEMBLOCK_EMPTY;
            delete this.jobsList[jobIds[i]]["memoryBlock"];

            //Set the job as finished
            this.jobsList[jobIds[i]].status = DONE_JOB;
            this.jobsCompleted++;
            //Tally up the final completion time by adding in the wait time to it
            this.jobsList[jobIds[i]].completionTime += this.jobsList[jobIds[i]].waitTime;

            //Now its time to queue another job
            this.queueJobs(); //Queue the next job in the list
          }
        } else if (job.status == WAITING_JOB) {
          this.jobsList[jobIds[i]].waitTime++;

          //Check if we can add this waiting job to a memory block
          this.queueJob(jobIds[i], this.jobsList[jobIds[i]]);
        }
      }
      this.currentStatusOutput();
    };

    //Queues the given individual job if possible
    this.queueJob = function(jobId, job) {
      var queued = false;
      if (job.status == NEW_JOB || job.status == WAITING_JOB) {
        var memoryBlockReady = this.findBestFit(job);
        if (memoryBlockReady != null && memoryBlockReady > 0) {
          //Okay, start the job now
          // console.log("STARTING THE JOB", keys[i], "IN:", memoryBlockReady);
          this.memoryBlocks[memoryBlockReady].status = MEMBLOCK_FULL; //full
          this.jobsList[jobId].status = RUNNING_JOB; //running
          this.jobsList[jobId].memoryBlock = memoryBlockReady;
          queued = true;
        } else if (memoryBlockReady == BUSY_FLAG) {
          //job is just waiting
          // console.log("JOB IS WAITING")
          this.jobsList[jobId].status = WAITING_JOB; //waiting
          queued = false;
        } else if (memoryBlockReady == FAILED_FLAG) {
          //No memory block is large enough to take the job
          this.jobsList[jobId].status = FAILED_JOB;
          this.jobsCompleted++; //although its not complete we need to tell the program to be done
          queued = false;
        } else {
          //Memory block is busy
          queued = false;
        }
      }
      return queued;
    };

    //This function queues up the jobs in a data structure that points to the best fitting memory block
    this.queueJobs = function() {
      var keys = Object.keys(this.jobsList);
      for (var i = 0; i < keys.length; i++) {
        var job = this.jobsList[keys[i]];
        this.queueJob(keys[i], job);
      };
    };

    this.findBestFit = function(job) {
      var maxSize = null; //used to check the largest memory block was have
      var incorrectSize = false;
      var bestFitMemoryBlockNum = null;
      //Go through the memory blocks, and find the best fitting memory block (if all are busy. the job is considered waiting)
      var keys = Object.keys(this.memoryBlocks); // all the memory block numbers (see data.json)
      for (var i = 0; i < keys.length; i++) {
        var block = this.memoryBlocks[keys[i]]; // access the block via its value in the key
        //set the max size var to check for out of bounds memory
        if (block.size > maxSize) {
          maxSize = block.size;
        }

        if (block.status == MEMBLOCK_EMPTY) {
          //If the memory block size is large enough to hold the job
          if (block.size >= job.size) {
            incorrectSize = false; //reset
            //The memory block is empty and fits snugly specify it as the current best fit
            if (!bestFitMemoryBlockNum) {
              bestFitMemoryBlockNum = keys[i];
              continue;
            } else {
              //We already have a best fit. Compare the two, is one more 'snug' then the other?
              if (block.size < this.memoryBlocks[bestFitMemoryBlockNum].size) {
                //we found our new snugly fitting memory block
                bestFitMemoryBlockNum = keys[i];
              } else {
                continue; //Next loop
              }
            }
            //If the memory block is empty but too small
          } else if (block.size < job.size) {
            incorrectSize = true; //its possible
          }
        }
      }

      //Single case check (is job too large for any memory block?)
      if (job.size > maxSize) {
        //Job can never be run
        return FAILED_FLAG;
      }

      //If we don't
      if (!bestFitMemoryBlockNum && incorrectSize) {
        return BUSY_FLAG; //meaning the job is set to waiting for a memory block
      } else {
        return bestFitMemoryBlockNum;
      }
    };

    //This function outputs the current status of the jobs
    this.currentStatusOutput = function() {
      process.stdout.write('\033c');
      console.log("MEMORY: id, size, status");
      var keys = Object.keys(this.memoryBlocks);
      for (var i = 0; i < keys.length; i++) {
        var memory = this.memoryBlocks[keys[i]];
        console.log(Object.keys(this.memoryBlocks)[i], memory.size, memory.status);
      }

      console.log("jobNumber, runTime, size, jobStatus, waitTime, completionTime, memoryBlock");
      var keys = Object.keys(this.jobsList);
      for (i = 0; i < keys.length; i++) {
        var jobNum = keys[i];
        var job = this.jobsList[jobNum];
        console.log(jobNum, job.time, job.size, job.status, job.waitTime, job.completionTime, job.memoryBlock || "-");
      }
    }
  };

  module.exports = App;
}());

//I might have made this lab more complicated then it needed to be. Oh well... I had fun with it.