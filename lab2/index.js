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


  function leastFrequentlyUsedRunThrough() {
    reset();
    var pageFault = 0,
      pageHit = 0,
      leastUsed = null,
      frequencies = {},
      nextPos = 0; //Object

    //Initialize the frequencies
    for (var i = 0; i < DataPages.length; i++) {
      frequencies[DataPages[i]] = 0;
    };

    //Run through using the mem configuration
    for (var i = 0; i < DataPages.length; i++) {
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

        //when memory is kinda full
        if (memory.length == PAGE_FRAMES_COUNT) {
          //Memory is full, use the spot with the least frequency
          var leastFrequentlyUsed = 456; //abritray large number
          var leastFrequentlyUsedIndex = null; //in memory
          for (var j = 0; j < memory.length; j++) {
            var frequency = frequencies[memory[j]];
            if (frequency < leastFrequentlyUsed) {
              leastFrequentlyUsed = memory[j];
              leastFrequentlyUsedIndex = j;
            }
          }
          console.log(frequencies);
          console.log("LEAST FREQUENTLY USED: ", leastFrequentlyUsed, "with", frequencies[memory[leastFrequentlyUsedIndex]]);

          //previous value decrement frequency
          frequencies[memory[leastFrequentlyUsedIndex]]--;
          console.log("Decrement", memory[leastFrequentlyUsedIndex], "to", frequencies[memory[leastFrequentlyUsedIndex]]);

          //Replace it
          memory[leastFrequentlyUsedIndex] = DataPages[i];
          frequencies[DataPages[i]]++;
        } else {
          //before memory is filled
          memory[nextPos] = DataPages[i];
          frequencies[DataPages[i]]++;
          nextPos++;
        }


      }

      console.log(memory, ((hit) ? "HIT" : "FAULT"));
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