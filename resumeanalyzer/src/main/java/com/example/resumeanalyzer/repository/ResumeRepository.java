package com.example.resumeanalyzer.repository;

import com.example.resumeanalyzer.model.ResumeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeRepository extends JpaRepository<ResumeEntity, Long> {

}