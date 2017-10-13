(function() {
  /*
    Name: Lab2 - Operating Systems - Programming Excercise #2
    Author: Matthew Rowlandson
    Purpose: Simulate jobs in multiple memory page configurations
             * First In First Out
             * Least Frequently Used
  */
  const DataPages = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2]; //Data Pages

  //Memory Replacement Algorithms Types
  const FIRST_IN_FIRST_OUT = 'fifo'; //constant type to refer to
  const LEAST_FREQUENTLY_USED = 'lfu'; //constant type to refer to

  //other constants
  const PAGE_FRAMES_COUNT = 3;

  //VARS
  let memory = [];

  //NOTE: Final output should show the following:
  /*
    -- Page Fault Percentage
    -- Page Hit Percentage
    -- Page Frame content for each cycle.
    -- For the Least Recently Used ( should also display the final frequency counter for each data page)
  */

  function firstInFirstOutRunThrough() {}


  function leastFrequentlyUsedRunThrough() {}

  function reset() {
    memory = [];
  };



  firstInFirstOutRunThrough(); //Run each instance
  reset(); //reset vars
  leastFrequentlyUsedRunThrough();
}());