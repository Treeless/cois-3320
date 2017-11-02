(function() {
  /*
    Name: Lab2 - Operating Systems - Programming Excercise #2
    Author: Matthew Rowlandson
    Purpose: Simulate jobs in multiple memory page configurations
             * First In First Out
             * Least Frequently Used
  */
  const DataPages = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2]; //Data Pages

  //other constants
  const PAGE_FRAMES_COUNT = 3;

  //VARS
  let removed = {}; //keep track of the indexed values already removed
  let memory = [];

  //NOTE: Final output should show the following:
  /*
    -- Page Fault Percentage
    -- Page Hit Percentage
    -- Page Frame content for each cycle.
    -- For the Least Recently Used ( should also display the final frequency counter for each data page)
  */

  //WORKING
  // First in first out with output
  function firstInFirstOutRunThrough() {
    var pageFault = 0,
      pageHit = 0,
      oldestIndex = 0,
      nextPos = 0;

    reset();
    for (var i = 0; i < DataPages.length; i++) {
      //Got through and check if number is already in the memory, if so its a page hit, other wise its a page fault
      //On a page hit. We don't add the number to memory
      //On a page fault, we do.
      var hit = false;
      for (var j = 0; j < memory.length; j++) {
        if (memory[j] == DataPages[i]) {
          pageHit++;
          hit = true;
          break;
        }
      }

      if (!hit) {
        pageFault++;

        if (memory.length == PAGE_FRAMES_COUNT) {
          //Memory is full, use the oldestIndex
          nextPos = oldestIndex;
          oldestIndex++;
          if (oldestIndex > memory.length - 1) {
            oldestIndex = 0; //Back to start
          }
        }

        memory[nextPos] = DataPages[i];
        nextPos++;
      }

      console.log(memory, ((hit) ? "HIT" : "FAULT"));
    }

    console.log("Number of Page Faults:", pageFault, "(", pageFault / (pageHit + pageFault) * 100, "% )");
    console.log("Number of Page Hits:", pageHit, "(", pageHit / (pageHit + pageFault) * 100, "% )");
  }


  //Not working right...
  // LFU : I couldn't get that second algorithm to work properly. I believe I was missing some logic.. I spent alot of time trying to figure it out but to no avail.
  function leastFrequentlyUsedRunThrough() {
    reset();
    var pageFault = 0,
      pageHit = 0,
      leastUsed = null,
      frequencies = {},
      nextPos = 0;

    //Initialize the frequencies
    for (var i = 0; i < DataPages.length; i++) {
      frequencies[DataPages[i]] = 0;
    };

    //Run through using the LFU mem configuration
    for (var i = 0; i < DataPages.length; i++) {
      var hit = false; //hit or fault? default false

      //Check if the number exists in the current memory
      for (var j = 0; j < memory.length; j++) {
        if (memory[j] == DataPages[i]) {
          pageHit++; //A hit!
          hit = true;
          break;
        }
      }

      //If not a hit, then its a page fault
      if (!hit) {
        pageFault++;

        if (memory.length == PAGE_FRAMES_COUNT) {
          //Memory is full, use the spot with the least frequency
          var leastFrequentlyUsed = 456; //abritray large number
          var leastFrequentlyUsedIndex = null; //in memory

          //Check for the least frequently used
          for (var j = 0; j < memory.length; j++) {
            var frequency = frequencies[memory[j]];
            if (frequency < leastFrequentlyUsed) {
              leastFrequentlyUsed = memory[j];
              leastFrequentlyUsedIndex = j;
            }
          }

          //console.log("LEAST FREQUENTLY USED: ", leastFrequentlyUsed, "with", frequencies[memory[leastFrequentlyUsedIndex]]);

          //Check again for a number with the same frequency
          for (var j = 0; j < memory.length; j++) {
            var frequency = frequencies[memory[j]];
            // If the least frequently used is not the same as the current memory AND they are the same frequencies
            if (leastFrequentlyUsed != memory[j] && frequencies[leastFrequentlyUsed] == frequency) {
              // We need to see which one is the oldest by index in data pages (FIFO)
              //console.log("SAME FREQUENCY:", leastFrequentlyUsed, "of", memory[j]);
              var firstIndex;
              var secondIndex
              for (var k = 0; k < DataPages.length; k++) {
                //find the index position of the two
                if(DataPages[k] == leastFrequentlyUsed){
                  firstIndex = k;
                  continue;
                }
                if(DataPages[k] == memory[j]){
                  secondIndex = k;
                }
              }

              if(firstIndex > secondIndex){
                //least frequently used is good to use, stay as is
              }else {
                leastFrequentlyUsed = memory[j];
                leastFrequentlyUsedIndex = j;
              }
            }
          }


          // console.log(frequencies);
          // console.log("LEAST FREQUENTLY USED: ", leastFrequentlyUsed, "with", frequencies[memory[leastFrequentlyUsedIndex]]);

          //previous value decrement frequency
          frequencies[memory[leastFrequentlyUsedIndex]]--;
          // console.log("Decrement", memory[leastFrequentlyUsedIndex], "to", frequencies[memory[leastFrequentlyUsedIndex]]);

          //Replace it [remove it from dataPages too]
          memory[leastFrequentlyUsedIndex] = DataPages[i];

          frequencies[DataPages[i]]++;
        } else {
          //before memory is filled. Fill it up normally
          memory[nextPos] = DataPages[i];
          frequencies[DataPages[i]]++;
          nextPos++;
          oldest = DataPages[i]; //keep track of the oldest
        }


      } else {
        // increment the frequency of the hit number
        frequencies[DataPages[i]]++;
      }

      console.log(memory, ((hit) ? "HIT" : "FAULT"), "FREQUENCY CHART: ",frequencies);
    };

    console.log("Number of Page Faults:", pageFault, "(", pageFault / (pageHit + pageFault) * 100, "% )");
    console.log("Number of Page Hits:", pageHit, "(", pageHit / (pageHit + pageFault) * 100, "% )");
  }

  function reset() {
    memory = [];
  };


  //Run each instance
  console.log("FIRST IN FIRST OUT MEMORY CONFIG:")
  firstInFirstOutRunThrough();
  console.log();
  console.log("LEAST FREQUENTLY USED MEMORY CONFIG:");
  leastFrequentlyUsedRunThrough();


}());