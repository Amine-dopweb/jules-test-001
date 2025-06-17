
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';
import { ParsedAgendaInfo } from "../types";

let ai: GoogleGenAI | null = null;
let geminiAvailable = false;

if (process.env.API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    geminiAvailable = true;
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    ai = null; // Ensure ai is null if initialization fails
    geminiAvailable = false;
  }
} else {
    console.warn("Gemini API key not found in process.env.API_KEY. AI features will be disabled.");
    geminiAvailable = false;
}

export const isGeminiAvailable = (): boolean => geminiAvailable;

const parseJsonFromText = (text: string): ParsedAgendaInfo | null => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s; // Matches ```json ... ``` or ``` ... ```
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }

  try {
    const parsed = JSON.parse(jsonStr);
    // Basic validation of expected structure
    if (typeof parsed === 'object' && parsed !== null) {
        // Ensure all expected fields are strings, or undefined if not present.
        const result: ParsedAgendaInfo = {};
        if (typeof parsed.title === 'string') result.title = parsed.title;
        if (typeof parsed.description === 'string') result.description = parsed.description;
        if (typeof parsed.date === 'string') result.date = parsed.date;
        if (typeof parsed.time === 'string') result.time = parsed.time;
        
        // Return object only if it has at least one relevant field extracted
        if (Object.keys(result).length > 0 && result.title) { // Title is mandatory for a useful item
            return result;
        }
    }
    return null; // Return null if parsing doesn't yield a valid structure or if title is missing
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini:", e, "Raw text:", text);
    return null;
  }
};


export const parseNaturalLanguageForAgenda = async (naturalLanguageInput: string): Promise<ParsedAgendaInfo | null> => {
  if (!ai) {
    throw new Error("Gemini AI service is not available. API key might be missing or invalid.");
  }

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const systemInstruction = `You are an intelligent assistant that helps parse user input into structured agenda items.
Extract the following information:
1. title (a concise summary of the event/task, this is mandatory)
2. description (any additional details, if provided)
3. date (in YYYY-MM-DD format. If the user says "today", use ${today.toISOString().split('T')[0]}. If the user says "tomorrow", use ${tomorrow.toISOString().split('T')[0]}. If only time is mentioned, assume today's date. If no date is mentioned, provide an empty string.)
4. time (in HH:MM 24-hour format. If no time is mentioned, provide an empty string.)

Respond ONLY with a JSON object in the format:
{
  "title": "extracted title",
  "description": "extracted description or empty string",
  "date": "YYYY-MM-DD or empty string",
  "time": "HH:MM or empty string"
}

If you cannot confidently extract a title, or if the input is too vague, you can return a JSON with empty strings, but strive to extract a title if at all possible.
Do not add any explanations or introductory text outside the JSON object. The response must be pure JSON.
The user input is: "${naturalLanguageInput}"`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: systemInstruction, // Using the full prompt as contents as per guidelines
      config: {
        responseMimeType: "application/json", // Hint to the model
        temperature: 0.3, // Lower temperature for more factual parsing
      },
    });
    
    const textResponse = response.text;
    if (!textResponse) {
        console.error("Gemini response was empty.");
        return null;
    }
    return parseJsonFromText(textResponse);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with Gemini API.");
  }
};
    