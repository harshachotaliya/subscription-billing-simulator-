import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
/**
 * Analyze campaign with Gemini
 * @param {string} description
 * @returns {Promise<{tags: string[], summary: string}>}
 */
export async function analyzeCampaign(description) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a helpful assistant for nonprofit campaign classification.
      Task:
      1. Generate a short array of tags (keywords).
      2. Generate a one-sentence summary.

      Campaign: "${description}"
      
      Respond ONLY in valid JSON:
      {
        "tags": ["tag1", "tag2"],
        "summary": "one sentence"
      }
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json|```/g, "").trim();

    // Try parsing JSON
    try {
      return JSON.parse(text);
    } catch (e) {
      console.warn("Failed to parse Gemini response:", text);
      return analyzeCampaignFallback(description);
    }
  } catch (err) {
    console.error("Gemini API error:", err);
    return analyzeCampaignFallback(description);
  }
}

/**
 * Fallback analysis if Gemini API fails
 */
export function analyzeCampaignFallback(description) {
  return {
    tags: ["general", "nonprofit"],
    summary: `Campaign: ${description.substring(0, 50)}...`,
  };
}
