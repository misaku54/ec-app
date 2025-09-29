package com.example.app.config;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@RequiredArgsConstructor
@Configuration
public class BatchConfig {
  private final SampleTasklet sampleTasklet;

  @Bean
  public Job sampleJob(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
    System.out.println("startJob");
    return new JobBuilder("sampleJob", jobRepository)
      .start(sampleStep(jobRepository, transactionManager))
      .build();
  }

  @Bean
  public Step sampleStep(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
    System.out.println("startStep");
    return new StepBuilder("sampleStep", jobRepository)
      .tasklet(sampleTasklet, transactionManager)
      .build();
  }
}
