// Name: Round Robin Lab
// Description: Simulation showcasing the memory paging using the algorithm round robin
// Language: C
// Date: November 11/14/2017

#include <stdio.h>

const int NUMBER_OF_J = 10; //Number of jobs
const int TIME_QUANTUM = 5;

//Structure for each job
typedef struct Job {
  char name;
  int arrivalTime;
  int waitingTime;
  int turnaroundTime;
  int cpuCycles; //burst count
  int finishTime;
  int done;
}Job;

const char names[] = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'};
const int arrivalTimes[] = {0, 3, 5, 9, 10, 12, 14, 16, 17, 19};
const int cpuCycles[] = {16, 2, 11, 6, 1, 9, 4, 14, 1, 8};

int main(){
  //VARS
  float avgTurnaroundTime, avgWaitingTime;
  int totalWait = 0, totalTurnaround = 0;
  char jobFinishOrder[NUMBER_OF_J]; //Spot for the jobs when they finish

  //Create the jobs in the job structure
  Job jobs[NUMBER_OF_J]; //10 jobs

  //Setup all the jobs
  for(int i = 0; i< NUMBER_OF_J; i++){
    jobs[i].name = names[i];
    jobs[i].arrivalTime = arrivalTimes[i];
    jobs[i].cpuCycles = cpuCycles[i];
  }

  //Compute the jobs
  int cpuCycleCount = 0;
  int jobPosition = -1; //nothing
  int jobsDone = 0;

  //Each iteration cycle is a cpu cycle
  int remainingTimeQuantum = TIME_QUANTUM;
  int lastJobPos = -1;
  while(jobsDone < NUMBER_OF_J){
    //If no job running
    if(jobPosition == -1){
      //Select the job todo (round robin algorithm)
      int j = 0;
      if(lastJobPos != -1){
        //Set next job to go as lastJobPos++
        if(lastJobPos+1 > NUMBER_OF_J-1){
          //Reached end. Start at 0
          j = 0;
        }else{
          lastJobPos++;
          j = lastJobPos; //new start position for loop
        }
      }
      //For each job, starting at lastJobPos
      for(j; j < NUMBER_OF_J; j++){
        Job job = jobs[j];

        //Is the job done? has the job arrived?
        if(job.done != 1 && job.arrivalTime <= cpuCycleCount){
          //Not finished and Arrived
          //Give the job
          //Specify the job we are running
          jobPosition = j;
          lastJobPos = j;
          break;
        }
      }
    }

    //process the current job.
    jobs[jobPosition].cpuCycles--;
    remainingTimeQuantum--;
    cpuCycleCount++; //number of cpu cycles completed

    //is the job done?
    if(jobs[jobPosition].cpuCycles == 0) {
      jobs[jobPosition].done = 1;

      jobs[jobPosition].finishTime = cpuCycleCount;
      jobs[jobPosition].turnaroundTime = cpuCycleCount - jobs[jobPosition].arrivalTime;
      jobs[jobPosition].waitingTime = jobs[jobPosition].turnaroundTime - cpuCycles[jobPosition];

      //Add to total wait and total turn
      totalWait += jobs[jobPosition].waitingTime;
      totalTurnaround += jobs[jobPosition].turnaroundTime;

      jobFinishOrder[jobsDone] = jobs[jobPosition].name;

      jobsDone++;
      jobPosition = -1; //The job is complete
      remainingTimeQuantum = TIME_QUANTUM; //Reset Time Quantum
    }else{
      //Is the time quantum done for the current job??
      if(remainingTimeQuantum == 0){
        jobPosition = -1; //Select a new Job on next iteration
        remainingTimeQuantum = TIME_QUANTUM; //Reset Time Quantum
      }
    }
  }

  //Calculate avgWait and avgTurnaround
  avgWaitingTime = (float)totalWait/NUMBER_OF_J;
  avgTurnaroundTime = (float)totalTurnaround/NUMBER_OF_J;

  printf("Job Name\tArrival Time\tBurst Time\tWait Time\tTurn Around Time\n");
  printf("-----------------------------------------\n");
  //print out jobs
  for(int k =0; k < NUMBER_OF_J; k++){
    printf("%c\t\t%d\t\t%d\t\t%d\t\t%d\n", jobs[k].name, jobs[k].arrivalTime, cpuCycles[k], jobs[k].waitingTime, jobs[k].turnaroundTime);
  }
   printf("-----------------------------------------\n");

  //print out stats
  printf("AverageWaitingTime: %.2f", avgWaitingTime);
  printf(" AverageTurnaroundTime: %.2f\n", avgTurnaroundTime);

  printf("Job Order: ");
  for(int j=0; j < NUMBER_OF_J; j++){
    printf("%c ", jobFinishOrder[j]);
  }
}
