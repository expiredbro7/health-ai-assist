import { mutation } from "./_generated/server";

// Seed initial data for the application
export const seedInitialData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingDiseases = await ctx.db.query("diseases").collect();
    if (existingDiseases.length > 0) {
      return "Data already seeded";
    }

    // Seed diseases
    const diseases = [
      {
        name: "Common Cold",
        description: "A viral infection of the upper respiratory tract",
        symptoms: ["runny nose", "sneezing", "cough", "sore throat", "mild fever"],
        severity: "low" as const,
        preventionTips: ["Wash hands frequently", "Avoid close contact with sick people", "Get adequate rest"],
        treatmentInfo: "Rest, fluids, and over-the-counter medications for symptom relief",
        isActive: true,
      },
      {
        name: "Influenza (Flu)",
        description: "A viral infection that attacks the respiratory system",
        symptoms: ["high fever", "body aches", "fatigue", "cough", "headache", "chills"],
        severity: "moderate" as const,
        preventionTips: ["Get annual flu vaccine", "Wash hands regularly", "Avoid touching face"],
        treatmentInfo: "Antiviral medications if caught early, rest, and fluids",
        isActive: true,
      },
      {
        name: "COVID-19",
        description: "Coronavirus disease caused by SARS-CoV-2",
        symptoms: ["fever", "cough", "shortness of breath", "loss of taste", "loss of smell", "fatigue"],
        severity: "high" as const,
        preventionTips: ["Get vaccinated", "Wear masks", "Maintain social distance", "Wash hands"],
        treatmentInfo: "Consult healthcare provider, isolation, supportive care",
        isActive: true,
      },
      {
        name: "Dengue Fever",
        description: "Mosquito-borne viral infection",
        symptoms: ["high fever", "severe headache", "eye pain", "muscle pain", "rash", "nausea"],
        severity: "high" as const,
        preventionTips: ["Eliminate standing water", "Use mosquito repellent", "Wear protective clothing"],
        treatmentInfo: "No specific treatment, supportive care, monitor for complications",
        isActive: true,
      },
      {
        name: "Malaria",
        description: "Parasitic infection transmitted by mosquitoes",
        symptoms: ["fever", "chills", "headache", "nausea", "vomiting", "fatigue"],
        severity: "high" as const,
        preventionTips: ["Use bed nets", "Take antimalarial medication", "Use insect repellent"],
        treatmentInfo: "Antimalarial medications, immediate medical attention required",
        isActive: true,
      },
    ];

    const diseaseIds = [];
    for (const disease of diseases) {
      const id = await ctx.db.insert("diseases", disease);
      diseaseIds.push(id);
    }

    // Seed sample outbreaks
    const outbreaks = [
      {
        diseaseId: diseaseIds[2], // COVID-19
        location: {
          latitude: 28.6139,
          longitude: 77.2090,
          city: "New Delhi",
          country: "India",
          radius: 50,
        },
        severity: "moderate" as const,
        casesReported: 150,
        description: "Increased COVID-19 cases in central Delhi area",
        alertLevel: "warning" as const,
        isActive: true,
        startDate: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
      },
      {
        diseaseId: diseaseIds[3], // Dengue
        location: {
          latitude: 19.0760,
          longitude: 72.8777,
          city: "Mumbai",
          country: "India",
          radius: 30,
        },
        severity: "high" as const,
        casesReported: 89,
        description: "Dengue outbreak in monsoon season",
        alertLevel: "critical" as const,
        isActive: true,
        startDate: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
      },
    ];

    for (const outbreak of outbreaks) {
      await ctx.db.insert("outbreaks", outbreak);
    }

    // Seed healthcare resources
    const resources = [
      {
        name: "All India Institute of Medical Sciences",
        type: "hospital" as const,
        address: "Ansari Nagar, New Delhi, 110029",
        location: {
          latitude: 28.5672,
          longitude: 77.2100,
          city: "New Delhi",
          country: "India",
        },
        phone: "+91-11-26588500",
        website: "https://www.aiims.edu",
        services: ["Emergency Care", "General Medicine", "Surgery", "Cardiology"],
        rating: 4.5,
        isActive: true,
      },
      {
        name: "Apollo Hospital",
        type: "hospital" as const,
        address: "Sarita Vihar, New Delhi, 110076",
        location: {
          latitude: 28.5355,
          longitude: 77.2910,
          city: "New Delhi",
          country: "India",
        },
        phone: "+91-11-26925858",
        website: "https://www.apollohospitals.com",
        services: ["Emergency Care", "Cardiology", "Oncology", "Neurology"],
        rating: 4.3,
        isActive: true,
      },
      {
        name: "MedPlus Pharmacy",
        type: "pharmacy" as const,
        address: "Connaught Place, New Delhi, 110001",
        location: {
          latitude: 28.6315,
          longitude: 77.2167,
          city: "New Delhi",
          country: "India",
        },
        phone: "+91-11-23341234",
        services: ["Prescription Medicines", "OTC Drugs", "Health Supplements"],
        rating: 4.0,
        isActive: true,
      },
    ];

    for (const resource of resources) {
      await ctx.db.insert("healthcareResources", resource);
    }

    // Seed quiz questions
    const quizQuestions = [
      {
        question: "What is the most effective way to prevent the spread of respiratory infections?",
        options: ["Taking antibiotics", "Washing hands frequently", "Drinking hot water", "Avoiding exercise"],
        correctAnswer: 1,
        category: "Prevention",
        difficulty: "easy" as const,
        points: 10,
        explanation: "Regular handwashing with soap and water for at least 20 seconds is one of the most effective ways to prevent respiratory infections.",
        isActive: true,
      },
      {
        question: "Which of the following is NOT a common symptom of dengue fever?",
        options: ["High fever", "Severe headache", "Persistent cough", "Muscle pain"],
        correctAnswer: 2,
        category: "Symptoms",
        difficulty: "medium" as const,
        points: 15,
        explanation: "Persistent cough is not typically associated with dengue fever. Dengue usually presents with high fever, severe headache, eye pain, and muscle pain.",
        isActive: true,
      },
      {
        question: "What should you do if you experience severe chest pain and difficulty breathing?",
        options: ["Wait and see if it improves", "Take over-the-counter pain medication", "Seek emergency medical care immediately", "Drink warm water"],
        correctAnswer: 2,
        category: "Emergency",
        difficulty: "easy" as const,
        points: 20,
        explanation: "Severe chest pain and difficulty breathing can be signs of serious conditions like heart attack or pulmonary embolism. Immediate medical attention is crucial.",
        isActive: true,
      },
    ];

    for (const question of quizQuestions) {
      await ctx.db.insert("quizQuestions", question);
    }

    return "Initial data seeded successfully";
  },
});
