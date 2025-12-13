package com.example.myapp.controller;

import com.example.myapp.service.MoodService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mood")
public class MoodRestController {

    private final MoodService moodService;

    public MoodRestController(MoodService moodService) {
        this.moodService = moodService;
    }

    @PostMapping("/add")
    public Map<String, String> addMood(@RequestBody Map<String, String> payload) {
        String mood = payload.get("mood");
        moodService.addMood(mood);

        return Map.of(
            "analysis", moodService.analyzeMood(mood),
            "support", moodService.supportMessage(mood)
        );
    }

    @GetMapping("/history")
    public List<String> getHistory() {
        return moodService.getMoodHistory();
    }

    @GetMapping("/quote")
    public Map<String, String> getQuote() {
        return Map.of("quote", moodService.getQuote());
    }
}

