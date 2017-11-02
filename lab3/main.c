/*
  Author: Matthew Rowlandson
  Name: Shortest JOb Next Lab - Operating Systems Fundamentals
  DEscription: Simulation for running jobs using the shortest job next algorithm.
  Language: C
*/

#include <stdio.h>

const int NUMBER_OF_J = 10; //Number of jobs

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
  while(jobsDone < NUMBER_OF_J){
    //If no job running
    if(jobPosition == -1){
      int smallestBurst = 5115; //big number to specify the smallestBurst
      //Has a job arrived?
      for(int j = 0; j < NUMBER_OF_J; j++){
        Job job = jobs[j];
        if(job.arrivalTime <= cpuCycleCount && job.done != 1){
          //arrived
          //Does it have the shortest burst cpu cycles?
          if(job.cpuCycles < smallestBurst){
            //Specify the job we are running
            jobPosition = j; 
            smallestBurst = job.cpuCycles;
          }
        }
      }
    }

    //process the current job.
    jobs[jobPosition].cpuCycles--;

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
    }

    cpuCycleCount++; //number of cpu cycles completed 
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