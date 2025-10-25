import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: __dirname + '/../.env' });

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Comprehensive disease database
const diseaseDatabase = {
  fever: { diseases: ['Common Cold', 'Flu', 'COVID-19', 'Dengue', 'Malaria'], severity: 'medium' },
  cough: { diseases: ['Common Cold', 'Flu', 'COVID-19', 'Bronchitis', 'Asthma'], severity: 'medium' },
  headache: { diseases: ['Migraine', 'Tension Headache', 'Flu', 'Dehydration', 'Sinusitis'], severity: 'low' },
  fatigue: { diseases: ['Anemia', 'Thyroid Issues', 'Depression', 'Sleep Apnea', 'Chronic Fatigue Syndrome'], severity: 'medium' },
  'sore throat': { diseases: ['Common Cold', 'Flu', 'Strep Throat', 'Tonsillitis'], severity: 'low' },
  'body ache': { diseases: ['Flu', 'Viral Infection', 'Fibromyalgia', 'Overexertion'], severity: 'low' },
  nausea: { diseases: ['Food Poisoning', 'Gastroenteritis', 'Migraine', 'Motion Sickness'], severity: 'medium' },
  diarrhea: { diseases: ['Food Poisoning', 'Gastroenteritis', 'IBS', 'Lactose Intolerance'], severity: 'medium' },
  'chest pain': { diseases: ['Heart Attack', 'Angina', 'Panic Attack', 'Acid Reflux'], severity: 'high' },
  'shortness of breath': { diseases: ['Asthma', 'Pneumonia', 'Heart Disease', 'Anxiety'], severity: 'high' },
  dizziness: { diseases: ['Vertigo', 'Low Blood Pressure', 'Dehydration', 'Inner Ear Problem'], severity: 'medium' },
  'abdominal pain': { diseases: ['Gastritis', 'Appendicitis', 'IBS', 'Food Poisoning'], severity: 'medium' },
  rash: { diseases: ['Allergic Reaction', 'Eczema', 'Psoriasis', 'Contact Dermatitis'], severity: 'low' },
  'joint pain': { diseases: ['Arthritis', 'Gout', 'Lupus', 'Injury'], severity: 'medium' },
  vomiting: { diseases: ['Food Poisoning', 'Gastroenteritis', 'Migraine', 'Pregnancy'], severity: 'medium' },
  'runny nose': { diseases: ['Common Cold', 'Allergies', 'Sinusitis', 'Flu'], severity: 'low' },
  sneezing: { diseases: ['Allergies', 'Common Cold', 'Sinusitis'], severity: 'low' },
  chills: { diseases: ['Flu', 'Malaria', 'Pneumonia', 'Sepsis'], severity: 'medium' },
  'night sweats': { diseases: ['Menopause', 'Tuberculosis', 'Lymphoma', 'Hyperthyroidism'], severity: 'medium' },
  'weight loss': { diseases: ['Diabetes', 'Hyperthyroidism', 'Cancer', 'Depression'], severity: 'high' }
};

export const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one symptom' });
    }

    console.log('📋 Analyzing symptoms:', symptoms);

    // Match symptoms with diseases
    const matchedDiseases = {};
    const symptomList = symptoms.map(s => s.toLowerCase());

    symptomList.forEach(symptom => {
      if (diseaseDatabase[symptom]) {
        diseaseDatabase[symptom].diseases.forEach(disease => {
          matchedDiseases[disease] = (matchedDiseases[disease] || 0) + 1;
        });
      }
    });

    // Sort diseases by match count
    const sortedDiseases = Object.entries(matchedDiseases)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([disease, count]) => ({
        name: disease,
        matchCount: count,
        confidence: Math.min((count / symptoms.length) * 100, 100).toFixed(0)
      }));

    // Get severity level
    const severities = symptomList.map(s => diseaseDatabase[s]?.severity).filter(Boolean);
    const hasCritical = severities.includes('high');
    const overallSeverity = hasCritical ? 'high' : severities.includes('medium') ? 'medium' : 'low';

    // Use Gemini for detailed analysis
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: "gemini-2.0-flash",
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
          }
        });

        const prompt = `You are a medical AI assistant. Analyze these symptoms and provide helpful advice. Be empathetic and clear.

Symptoms: ${symptoms.join(', ')}

Possible conditions based on symptom matching: ${sortedDiseases.map(d => d.name).join(', ')}

Provide:
1. Brief overview of what these symptoms might indicate
2. Self-care tips and home remedies
3. When to see a doctor (if severity is high, emphasize urgency)
4. Lifestyle recommendations

Keep response concise (5-6 sentences) and use a caring tone. Use bullet points where appropriate.`;

        const result = await model.generateContent(prompt);
        const aiAdvice = result.response.text();

        console.log('✅ Gemini analysis complete');

        return res.json({
          symptoms: symptomList,
          possibleDiseases: sortedDiseases,
          severity: overallSeverity,
          aiAdvice: aiAdvice,
          disclaimer: '⚠️ This is not a medical diagnosis. Please consult a healthcare professional for accurate diagnosis and treatment.'
        });

      } catch (aiError) {
        console.error('Gemini error, using fallback:', aiError.message);
      }
    }

    // Fallback response if Gemini fails
    const fallbackAdvice = getFallbackAdvice(symptomList, overallSeverity, sortedDiseases);

    res.json({
      symptoms: symptomList,
      possibleDiseases: sortedDiseases,
      severity: overallSeverity,
      advice: fallbackAdvice,
      disclaimer: '⚠️ This is not a medical diagnosis. Please consult a healthcare professional for accurate diagnosis and treatment.'
    });

  } catch (error) {
    console.error('❌ Symptom analysis error:', error);
    res.status(500).json({ message: 'Failed to analyze symptoms. Please try again.' });
  }
};

function getFallbackAdvice(symptoms, severity, diseases) {
  let advice = '';

  if (severity === 'high') {
    advice = `🚨 **Urgent**: Your symptoms (${symptoms.join(', ')}) may indicate a serious condition. **Seek immediate medical attention**.\n\n`;
  } else if (severity === 'medium') {
    advice = `⚠️ Your symptoms suggest you should **see a doctor within 24-48 hours**.\n\n`;
  } else {
    advice = `💊 Your symptoms are likely mild, but monitor them closely.\n\n`;
  }

  advice += `**Possible conditions**: ${diseases.slice(0, 3).map(d => d.name).join(', ')}\n\n`;
  
  advice += `**Self-care tips**:\n`;
  advice += `• Get plenty of rest and stay hydrated\n`;
  advice += `• Take over-the-counter medication if needed\n`;
  advice += `• Monitor your symptoms closely\n`;
  advice += `• Maintain good hygiene\n\n`;

  advice += `**See a doctor if**:\n`;
  advice += `• Symptoms worsen or don't improve in 3-5 days\n`;
  advice += `• You develop new symptoms\n`;
  advice += `• You have difficulty breathing or chest pain\n`;

  return advice;
}
