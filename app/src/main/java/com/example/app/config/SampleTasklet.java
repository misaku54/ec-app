//package com.example.app.config;
//
//import org.springframework.batch.core.StepContribution;
//import org.springframework.batch.core.scope.context.ChunkContext;
//import org.springframework.batch.core.step.tasklet.Tasklet;
//import org.springframework.batch.repeat.RepeatStatus;
//
//public class SampleTasklet implements Tasklet {
//  @Override
//  public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) {
//    System.out.println("tasklet");
//    return RepeatStatus.FINISHED;
//  }
//}
