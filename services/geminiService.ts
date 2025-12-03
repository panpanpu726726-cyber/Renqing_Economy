import { GoogleGenAI } from "@google/genai";
import { TransactionType } from "../types";

const apiKey = process.env.API_KEY || '';
// Initialize conditionally to prevent crashes if key is missing during dev (though required by prompt)
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Generates a cynical, sociological analysis of a specific gift transaction.
 * It reflects on the "Human Emotion Economy".
 */
export const analyzeTransaction = async (
  person: string,
  amount: number,
  type: TransactionType,
  occasion: string
): Promise<string> => {
  if (!ai) return "AI Configuration Missing. Unable to compute cynical reality.";

  const prompt = `
    Analyze this Chinese social transaction ("Fenzi Qian") from a cynical, sociological perspective.
    
    Context:
    - User ${type === TransactionType.INCOME ? 'Received' : 'Gave'} a Red Envelope.
    - Person Involved: ${person}
    - Amount: ¥${amount}
    - Occasion: ${occasion}

    Tone:
    - Satirical, critical, philosophical.
    - Treat "affection" (Renqing) as a currency and "relationships" as debt.
    - Reference concepts like "Moral Kidnapping" (Daode Bangjia), "Social Investment", or "Emotional Debt".
    - Keep it under 60 words.
    
    Output strictly the analysis text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "The system is too overwhelmed by social debt to analyze this right now.";
  }
};

/**
 * Generates a summary of the user's "Emotional Ledger" based on recent events.
 */
export const generateLedgerSummary = async (events: any[]): Promise<string> => {
  if (!ai) return "AI Configuration Missing.";

  const eventsSummary = events.map(e => 
    `${e.type} of ¥${e.amount} for ${e.occasion} with ${e.person}`
  ).join('; ');

  const prompt = `
    You are a harsh accountant of the human soul. Analyze this list of social transactions:
    ${eventsSummary}

    Provide a brief status report (max 3 sentences) on whether this user is "socially solvent" or "emotionally bankrupt". 
    Are they a net creditor or debtor in the game of Guanxi?
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Calculation error.";
  } catch (error) {
    return "Social calculation timed out.";
  }
};
