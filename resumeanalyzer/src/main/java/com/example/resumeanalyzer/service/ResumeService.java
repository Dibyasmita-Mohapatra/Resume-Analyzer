package com.example.resumeanalyzer.service;

import com.example.resumeanalyzer.model.ResumeEntity;
import com.example.resumeanalyzer.model.ResumeResult;
import com.example.resumeanalyzer.repository.ResumeRepository;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.HashMap;
import com.example.resumeanalyzer.model.ResumeEntity;

@Service
public class ResumeService {

    @Autowired
    ResumeRepository resumeRepository;

    // Main analyze method
    public ResumeResult analyze(MultipartFile file) {

        String text = extractText(file);

        List<String> skills = Arrays.asList(
                "java","spring","mysql","react","javascript","python","docker","aws"
        );


        for(String skill : skills){

            if(text.toLowerCase().contains(skill)){
            }

        }

        List<String> foundSkills = extractSkillsNLP(text);
        List<String> suggestions = getSuggestions(foundSkills);

        int score = foundSkills.size() * 10;

        // SAVE TO DATABASE
        ResumeEntity entity = new ResumeEntity();

        entity.setResumeName(file.getOriginalFilename());
        entity.setScore(score);
        entity.setSkills(foundSkills.toString());

        resumeRepository.save(entity);

        // RETURN RESULT
        ResumeResult result = new ResumeResult();
        result.setScore(score);
        result.setSkills(foundSkills);
        result.setSuggestions(suggestions);

        return result;
    }

    public List<ResumeEntity> getAllResumes() {
        return resumeRepository.findAll();
    }

    public int calculateMatch(String resumeText, String jobDescription){

        String[] words = jobDescription.toLowerCase().split(" ");

        int match = 0;

        for(String word : words){
            if(resumeText.toLowerCase().contains(word)){
                match++;
            }
        }

        return (match * 100) / words.length;
    }

    private String extractText(MultipartFile file){

        try{

            PDDocument document = PDDocument.load(file.getInputStream());

            PDFTextStripper stripper = new PDFTextStripper();

            String text = stripper.getText(document);

            document.close();

            return text;

        }catch(Exception e){
            e.printStackTrace();
        }

        return "";
    }

    public List<String> getSuggestions(List<String> foundSkills){

        List<String> suggestions = new ArrayList<>();

        if(!foundSkills.contains("java")){
            suggestions.add("Add Java projects to your resume");
        }

        if(!foundSkills.contains("spring")){
            suggestions.add("Mention Spring Boot experience");
        }

        if(!foundSkills.contains("mysql")){
            suggestions.add("Include database skills like MySQL");
        }

        if(!foundSkills.contains("react")){
            suggestions.add("Add frontend skills like React");
        }

        return suggestions;
    }

    public List<String> extractSkillsNLP(String resumeText) {
        // split resume text into words
        String[] words = resumeText.toLowerCase().split("\\W+");

        // common programming/tech keywords (you can add more)
        List<String> keywords = Arrays.asList(
                "java","spring","mysql","react","javascript",
                "python","docker","aws","html","css","c++","nodejs","angular"
        );

        List<String> foundSkills = new ArrayList<>();

        for (String word : words) {
            if (keywords.contains(word) && !foundSkills.contains(word)) {
                foundSkills.add(word);
            }
        }

        return foundSkills;
    }

}