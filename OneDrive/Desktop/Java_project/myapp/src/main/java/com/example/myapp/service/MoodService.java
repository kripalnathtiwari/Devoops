package com.example.myapp.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class MoodService {

    private final List<String> moodHistory = new ArrayList<>();

    public void addMood(String mood) {
        moodHistory.add(mood);
    }

    public List<String> getMoodHistory() {
        return moodHistory;
    }

    public String analyzeMood(String mood) {
        if (mood == null) return "Mood noted.";

        switch (mood.toLowerCase()) {
            case "happy": return "You seem energetic today!";
            case "sad": return "Maybe try some calming activities.";
            case "stressed": return "Meditation may help reduce stress.";
            default: return "Mood noted.";
        }
    }

    public String supportMessage(String mood) {
        if (mood == null) return "Thank you for sharing.";

        switch (mood.toLowerCase()) {
            case "happy": return "Great! Keep enjoying your day.";
            case "sad": return "It's okay to feel sad. You are not alone.";
            case "stressed": return "Deep breaths... We can work through stress together.";
            default: return "Thank you for sharing.";
        }
    }

    public String getQuote() {
        String[] quotes = {
            "You are stronger than you think.",
            "Every day is a second chance.",
            "Your feelings are valid.",
            "Believe in yourself.",
            "Small steps still move you forward."
        };
        return quotes[new Random().nextInt(quotes.length)];
    }
}
