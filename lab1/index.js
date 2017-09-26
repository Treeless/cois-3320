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
    var timer = null;

    //This function starts the memory manager and begins/manages the job processing
    this.start = function() {
      this.memoryBlocks = DATA.memoryList;
      this.jobsList = DATA.jobList;
      this.queueJobs(); //queue the jobs to the proper memory blocks (initially)

      timer = setInterval(function() {
        self.processing(); //start processing the jobs in the memory blocks and manage them
      }, 1000);
    }

    //Goes through the job queue and starts each job in each memory block
    this.processing = function() {
      var jobIds = Object.keys(this.jobsList);
      //Go through each job (if running, increment completion time)
      for (var i = 0; i < jobIds.length; i++) {
        var job = this.jobsList[jobIds[i]];
        if (job.status == "r") {
          this.jobsList[jobIds[i]].completionTime++;
          if (job.completionTime >= job.time) {
            console.log("JOB IS DONE");
            //JOB IS DONE
            //Tell the memory block to empty itself
            this.memoryBlocks[job.memoryBlock].status = "e";
            delete this.jobsList[jobIds[i]]["memoryBlock"];

            //Set the job as finished
            this.jobsList[jobIds[i]].status = "d";
            //Tally up the final completion time by adding in the wait time to it
            this.jobsList[jobIds[i]].completionTime += this.jobsList[jobIds[i]].waitTime;

            //Now its time to queue another job
            this.queueJobs();
          }
        } else if (job.status == "w") {
          this.jobsList[jobIds[i]].waitTime++;
        }
      }
      this.currentStatusOutput();
    };

    //This function queues up the jobs in a data structure that points to the best fitting memory block
    // This only happens initially. The processing function handles the rest
    this.queueJobs = function() {
      var keys = Object.keys(this.jobsList);
      for (var i = 0; i < keys.length; i++) {
        var job = this.jobsList[keys[i]];
        if (job.status != "d") {
          var memoryBlockReady = this.findBestFit(job);
          if (memoryBlockReady != null && memoryBlockReady != -1) {
            //Okay, start the job now
            console.log("STARTING THE JOB IN:", memoryBlockReady);
            this.memoryBlocks[memoryBlockReady].status = "f"; //full
            this.jobsList[keys[i]].status = "r"; //running
            this.jobsList[keys[i]].memoryBlock = memoryBlockReady;
          } else if (memoryBlockReady == -1) {
            //job is just waiting
            this.jobsList[keys[i]].status = "w"; //waiting
          } else {
            //Memory block is busy
          }
        }
      };
    };

    this.findBestFit = function(job) {
      var incorrectSize = false;
      var bestFitMemoryBlockNum = null;
      //Go through the memory blocks, and find the best fitting memory block (if all are busy. the job is considered waiting)
      for (var i = 0; i < Object.keys(this.memoryBlocks).length; i++) {
        incorrectSize = false; //reset
        var block = this.memoryBlocks[Object.keys(this.memoryBlocks)[i]];
        if (block.status == 'e' && block.size <= job.size) {
          //The memory block is empty and fits snugly specify it as the current best fit
          if (!bestFitMemoryBlockNum) {
            bestFitMemoryBlockNum = Object.keys(this.memoryBlocks)[i];
            continue;
          } else {
            //We already have a best fit. Compare the two, is one more 'snug' then the other?
            if (block.size < this.memoryBlocks[bestFitMemoryBlockNum].size) {
              //we found our new snugly fitting memory block
              bestFitMemoryBlockNum = Object.keys(this.memoryBlocks)[i];
            } else {
              continue; //Next loop
            }
          }
        } else {
          //Check if block is empty and size was wrong fit
          if (block.status == "e" && block.size > job.size) {
            incorrectSize = true;
          }
        }
      }
      if (incorrectSize) {
        return -1; //meaning the job is waiting
      } else {
        return bestFitMemoryBlockNum;
      }
    };

    //This function outputs the current status of the jobs
    this.currentStatusOutput = function() {
      process.stdout.write('\033c');
      console.log("Job Number", "Run Time", "Job Size", "Job Status", "Wait Time", "Completion Time");
      var keys = Object.keys(this.jobsList);
      for (var i = 0; i < keys.length; i++) {
        var jobNum = keys[i];
        var job = this.jobsList[jobNum];
        console.log(jobNum, job.time, job.size, job.status, job.waitTime, job.completionTime);
      }
    }
  };

  let app = new App(); //extantion of the process
  app.start(); //starting the memory manager

}());

//I might have made this lab more complicated then it needed to be. Oh well...