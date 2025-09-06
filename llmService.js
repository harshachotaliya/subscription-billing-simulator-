import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyzes a campaign description using LLM to extract tags and create a summary
 * @param {string} campaignDescription - The campaign description to analyze
 * @returns {Promise<{tags: string[], summary: string}>} - Object containing tags and summary
 */
export async function analyzeCampaign(campaignDescription) {
  try {
    const prompt = `
Analyze the following campaign description and provide:
1. 2-4 relevant tags (e.g., "disaster relief", "Nepal", "education", "healthcare")
2. A one-sentence summary

Campaign Description: "${campaignDescription}"

Please respond in the following JSON format:
{
  "tags": ["tag1", "tag2", "tag3"],
  "summary": "One sentence summary of the campaign"
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing charitable campaigns and extracting relevant tags and summaries. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    });

    const response = completion.choices[0].message.content;
    
    // Parse the JSON response
    const parsedResponse = JSON.parse(response);
    
    return {
      tags: parsedResponse.tags || [],
      summary: parsedResponse.summary || "Campaign summary not available"
    };

  } catch (error) {
    console.error('Error analyzing campaign with LLM:', error);
    
    // Fallback response if LLM call fails
    return {
      tags: ["general"],
      summary: "Campaign analysis unavailable"
    };
  }
}

/**
 * Fallback function for when LLM is not available
 * @param {string} campaignDescription - The campaign description
 * @returns {{tags: string[], summary: string}} - Basic tags and summary
 */
export function analyzeCampaignFallback(campaignDescription) {
  // Simple keyword-based tagging as fallback
  const keywords = campaignDescription.toLowerCase();
  const tags = [];
  
  if (keywords.includes('disaster') || keywords.includes('relief') || keywords.includes('emergency')) {
    tags.push('disaster relief');
  }
  if (keywords.includes('education') || keywords.includes('school') || keywords.includes('learning')) {
    tags.push('education');
  }
  if (keywords.includes('health') || keywords.includes('medical') || keywords.includes('hospital')) {
    tags.push('healthcare');
  }
  if (keywords.includes('nepal') || keywords.includes('india') || keywords.includes('africa')) {
    tags.push(keywords.match(/(nepal|india|africa|asia|europe|america)/i)?.[0] || 'international');
  }
  
  if (tags.length === 0) {
    tags.push('general');
  }
  
  return {
    tags,
    summary: campaignDescription.length > 100 
      ? campaignDescription.substring(0, 100) + '...' 
      : campaignDescription
  };
}
