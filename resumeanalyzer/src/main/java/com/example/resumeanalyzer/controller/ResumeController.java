package com.example.resumeanalyzer.controller;

import com.example.resumeanalyzer.model.ResumeResult;
import com.example.resumeanalyzer.service.ResumeService;
import com.example.resumeanalyzer.model.ResumeEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ResumeController {

    @Autowired
    ResumeService resumeService;

    @PostMapping("/analyze")
    public List<Map<String, Object>> analyzeResumes(@RequestParam("file") List<MultipartFile> files) {
        List<Map<String, Object>> allResults = new ArrayList<>();

        for (MultipartFile file : files) {
            // Analyze each file
            ResumeResult result = resumeService.analyze(file);
            List<String> suggestions = resumeService.getSuggestions(result.getSkills());

            // Prepare map for this resume
            Map<String, Object> response = new HashMap<>();
            response.put("resumeName", file.getOriginalFilename());
            response.put("score", result.getScore());
            response.put("skills", result.getSkills());
            response.put("suggestions", suggestions);

            allResults.add(response);
        }

        return allResults;
    }
    @GetMapping("/resumes")
    public List<ResumeEntity> getAllResumes(){
        return resumeService.getAllResumes();
    }

    @PostMapping("/match")
    public int matchResume(@RequestParam String resumeText,
                           @RequestParam String jobDescription) {

        return resumeService.calculateMatch(resumeText, jobDescription);
    }
}