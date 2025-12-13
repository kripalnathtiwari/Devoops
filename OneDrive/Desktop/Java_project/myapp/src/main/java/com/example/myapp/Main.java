package com.example.myapp;

import java.util.*;

public class Main {

    static List<String> moodHistory = new ArrayList<>();

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("=== Mental Health Simulator ===");
        intro();

        while (true) {
            System.out.println("\n1. Enter Mood");
            System.out.println("2. View Mood History");
            System.out.println("3. Start Calm Activity");
            System.out.println("4. Get Quote");
            System.out.println("5. Exit");
            System.out.print("Select Option: ");

            int choice;
            try {
                choice = scanner.nextInt();
            } catch (Exception e) {
                scanner.nextLine();
                continue;
            }

            switch (choice) {
                case 1:
                    System.out.print("Enter your current mood: ");
                    scanner.nextLine();
                    String mood = scanner.nextLine();
                    addMood(mood);
                    analyzeMood(mood);
                    supportMessage(mood);
                    break;

                case 2:
                    printMoodHistory();
                    break;

                case 3:
                    System.out.println("1. Deep Breathing");
                    System.out.println("2. Meditation");
                    System.out.print("Choose Activity: ");
                    int act = scanner.nextInt();
                    if (act == 1) deepBreathing();
                    else meditation();
                    break;

                case 4:
                    System.out.println("Quote: " + getQuote());
                    break;

                case 5:
                    System.out.println("Exiting... Take care!");
                    return;

                default:
                    System.out.println("Invalid option.");
            }
        }
    }

    static void intro() {
        System.out.println("Welcome to the Mental Health Simulator.");
        System.out.println("I will assist you in tracking your mood and calming activities.");
    }

    static void supportMessage(String mood) {
        System.out.println("\nAssistant Response:");
        switch (mood.toLowerCase()) {
            case "happy":
                System.out.println("Great! Keep enjoying your day.");
                break;
            case "sad":
                System.out.println("It's okay to feel sad. You are not alone.");
                break;
            case "stressed":
                System.out.println("Deep breaths... We can work through stress together.");
                break;
            default:
                System.out.println("Thank you for sharing.");
        }
        System.out.println("Remember: it’s always okay to ask for help.");
    }

    static void deepBreathing() {
        System.out.println("Deep Breathing Activity:");
        try {
            for (int i = 1; i <= 5; i++) {
                System.out.println("Inhale... Exhale...");
                Thread.sleep(1000);
            }
        } catch (Exception ignored) {}
        System.out.println("You should feel calmer now.");
    }

    static void meditation() {
        System.out.println("Meditation Activity:");
        try {
            for (int i = 1; i <= 5; i++) {
                System.out.println("Focus on your breathing...");
                Thread.sleep(1500);
            }
        } catch (Exception ignored) {}
        System.out.println("Meditation complete.");
    }

    static void addMood(String mood) {
        moodHistory.add(mood);
    }

    static void printMoodHistory() {
        System.out.println("\nMood History:");
        if (moodHistory.isEmpty()) {
            System.out.println("No moods recorded.");
            return;
        }
        int count = 1;
        for (String m : moodHistory) {
            System.out.println(count++ + ". " + m);
        }
    }

    static void analyzeMood(String mood) {
        System.out.println("\nMood Analysis:");
        switch (mood.toLowerCase()) {
            case "happy":
                System.out.println("You seem energetic today!");
                break;
            case "sad":
                System.out.println("Maybe try some calming activities.");
                break;
            case "stressed":
                System.out.println("Meditation may help reduce stress.");
                break;
            default:
                System.out.println("Mood noted.");
        }
    }

    static String getQuote() {
        String[] quotes = {
            "You are stronger than you think.",
            "Every day is a second chance.",
            "Your feelings are valid.",
            "Believe in yourself.",
            "Small steps still move you forward."
        };
        Random rand = new Random();
        return quotes[rand.nextInt(quotes.length)];
    }
}
