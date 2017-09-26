(function() {
  // Matthew Rowlandson { http://www.github.com/Treeless }
  // Date: 9/26/2017
  // Lab 1 - Memory Management
  // Purpose: Simulate a given set of jobs using a fixed partition memory scheme using a Best-Fit allocation method.
  //          Creating an even-driven simulation that waits until all jobs have been executed with the memory as is.
  //          Job sizes are in order of bytes

  //Note: This is coded using JavaScript and NodeJS v8.1.3. I use a data.json file that holds the information for the simulation to run off of.

  const DATA = require('./data.json'); //Data for the job simulation

  const App = function() {
    var self = this; //reference to this (used in asyncronous or nested functions)
    this.memoryBlocks = null; //Where we keep track of our memory blocks
    this.jobsList = null; //List of jobs and their statuses

    //This function starts the memory manager and begins the job processing
    this.start = function() {
      console.log("Starting the memory manager...");
      console.log("Allocating memory blocks...");
      //todo
    }

    //This function outputs the current status of the jobs
    this.currentStatusOutput() {
      console.API.clear(); //Clear the previous output
      console.log("Job Number", "Run Time", "Job Size", "Job Status", "Wait Time", "Completion Time");
      //todo
    }
  };

  let app = new App(); //extantion of the process
  app.start(); //starting the memory manager

}());