
import { GoogleGenAI } from "@google/genai";
import { TransactionType } from "../types";

/**
 * Initializes the Gemini API client.
 * Using gemini-3-flash-preview as per the world-class senior engineer guidelines.
 */
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Generates a cynical, sociological analysis of a specific gift transaction.
 * It reflects on the "Human Emotion Economy" and Chinese Guanxi dynamics.
 */
export const analyzeTransaction = async (
  person: string,
  amount: number,
  type: TransactionType,
  occasion: string
): Promise<string> => {
  const ai = getAI();
  const prompt = `
    Analyze this Chinese social transaction ("Fenzi Qian") from a cynical, sociological perspective.
    
    Context:
    - User ${type === TransactionType.INCOME ? 'Received' : 'Gave'} a Red Envelope.
    - Person Involved: ${person}
    - Amount: ¥${amount}
    - Occasion: ${occasion}

    Tone:
    - Satirical, sharp, philosophical. 
    - Treat "Renqing" as a soul-crushing debt and "relationships" as a high-stakes poker game.
    - Use terms like "Face Inflation" (Mianzi Tongzhang), "Social Kidney Donation", or "Guanxi Arbitrage".
    - Keep it under 50 words.
    
    Output strictly the analysis text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "The algorithm failed to quantify this emotional void.";
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "The system is too overwhelmed by social debt to analyze this right now.";
  }
};

/**
 * Generates a "Renqing Ranking" based on the user's ledger.
 * This provides the "deep meaning" of their social standing.
 */
export const generateRenqingRanking = async (events: any[]): Promise<{ title: string; analysis: string }> => {
  const ai = getAI();
  const eventsSummary = events.slice(0, 10).map(e => 
    `${e.type === TransactionType.INCOME ? 'Received' : 'Paid'} ¥${e.amount} for ${e.occasion} from/to ${e.person}`
  ).join('\n');

  const prompt = `
    Act as a cynical grandmaster of Chinese etiquette. Evaluate this ledger of social transactions:
    ${eventsSummary}

    1. Assign a satirical Title (e.g., "Professional Wedding Sufferer", "Renqing Vampire", "Social Solvent God").
    2. Provide a 2-sentence biting analysis of their social survival prospects.
    
    Format the output as JSON:
    {
      "title": "The Title",
      "analysis": "The Analysis"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    const result = JSON.parse(response.text || '{"title": "Social Ghost", "analysis": "Unranked."}');
    return result;
  } catch (error) {
    return {
      title: "Ledger Skeptic",
      analysis: "Your social connections are too complex for silicon to calculate."
    };
  }
};
