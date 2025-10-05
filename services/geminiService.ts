import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, UserRole, ChatMessage, MatchResult, Conversation } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const suggestMatches = async (mentee: UserProfile, mentors: UserProfile[]): Promise<MatchResult[]> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    You are a sophisticated matchmaking AI for an open-source mentorship program called DCODE.
    Your task is to find the best mentor for a student mentee based on their skills, interests, and GitHub profile activity.

    Mentee Profile:
    - Name: ${mentee.name}
    - Skills: ${mentee.skills.join(', ') || 'None specified'}
    - Interests: ${mentee.interests.join(', ') || 'None specified'}
    - Bio: ${mentee.bio}
    - GitHub: ${mentee.githubUrl || 'Not provided'}

    Available Mentors:
    ${mentors.map(m => `
      - Mentor ID: ${m.id}
        - Name: ${m.name}
        - Skills: ${m.skills.join(', ')}
        - Interests: ${m.interests.join(', ')}
        - Bio: ${m.bio}
        - GitHub: ${m.githubUrl || 'Not provided'}
    `).join('')}

    Based on the information provided, suggest the top 2-3 best mentor matches for ${mentee.name}.
    For each suggestion, provide the mentor's ID and a concise, one-sentence reason for the match, focusing on skill overlap, shared interests, and relevant open-source experience visible on GitHub.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                matches: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            mentorId: { type: Type.STRING },
                            reason: { type: Type.STRING }
                        },
                        required: ["mentorId", "reason"]
                    }
                }
            },
            required: ["matches"]
        }
      }
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    return result.matches as MatchResult[];

  } catch (error) {
    console.error("Error calling Gemini API for matching:", error);
    // Fallback to a simple logic if API fails
    return mentors.slice(0, 2).map(m => ({
        mentorId: m.id,
        reason: "Could not generate AI reason. This is a fallback suggestion."
    }));
  }
};


export const generateChatResponse = async (conversation: ChatMessage[], currentUser: UserProfile, otherParticipants: UserProfile[]): Promise<string> => {
  const model = "gemini-2.5-flash";
  const respondingParticipant = otherParticipants[0]; // Simple 1-on-1 for now
  
  const conversationHistory = conversation.map(msg => `${msg.senderName}: ${msg.text}`).join('\n');

  const systemInstruction = `You are ${respondingParticipant.name}, a helpful and encouraging ${respondingParticipant.role} in the DCODE mentorship program. 
  Your expertise includes ${respondingParticipant.skills.join(', ')}. 
  You are chatting with ${currentUser.name}, a ${currentUser.role}.
  Your response should be friendly, supportive, and relevant to the conversation. Keep your response concise, like a real chat message.`;
  
  const prompt = `
    Here is the recent conversation history:
    ---
    ${conversationHistory}
    ---
    Now, provide a response from your perspective as ${respondingParticipant.name}.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        // Disable thinking for low latency chat
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for chat:", error);
    return "Sorry, I'm having trouble connecting right now. Let's try again in a moment.";
  }
};

export const generateIcebreakers = async (mentee: UserProfile, mentor: UserProfile): Promise<string[]> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    You are a helpful assistant for DCODE, a mentorship platform.
    A mentee is starting a conversation with a potential mentor for the first time.
    Generate 3 distinct, friendly, and engaging conversation starters (icebreakers) for the mentee to send.
    The icebreakers should be personalized based on the profiles provided. Refer to the mentor by name, e.g., "Hi ${mentor.name}...".
    Keep them concise, under 25 words each.

    Mentee Profile:
    - Name: ${mentee.name}
    - Skills: ${mentee.skills.join(', ') || 'None specified'}
    - Interests: ${mentee.interests.join(', ') || 'None specified'}

    Mentor Profile:
    - Name: ${mentor.name}
    - Skills: ${mentor.skills.join(', ')}
    - Interests: ${mentor.interests.join(', ')}

    Generate 3 icebreakers.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            icebreakers: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["icebreakers"]
        }
      }
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    return result.icebreakers as string[];

  } catch (error) {
    console.error("Error calling Gemini API for icebreakers:", error);
    // Fallback to generic suggestions
    return [
      `Hi ${mentor.name}! I'm excited to connect. What's one piece of advice you have for someone starting out in your field?`,
      `Hello ${mentor.name}, thanks for matching. I was really impressed by your skills in ${mentor.skills[0] || 'your area of expertise'}.`,
      `Hi ${mentor.name}, I'm hoping to learn more about ${mentor.interests[0] || 'your interests'}. Could you tell me a bit about your journey?`
    ];
  }
};

export const getAIAssistantResponse = async (conversation: ChatMessage[]): Promise<string> => {
  const model = "gemini-2.5-flash";
  
  const conversationHistory = conversation.map(msg => `${msg.senderName}: ${msg.text}`).join('\n');

  const systemInstruction = `You are DCODE AI, a helpful assistant specializing in mentorship and open-source software development best practices. Your goal is to provide clear, encouraging, and actionable advice to both mentors and mentees. Keep your responses concise and friendly.`;
  
  const prompt = `
    Here is the recent conversation history:
    ---
    ${conversationHistory}
    ---
    Now, provide a helpful response as DCODE AI.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for AI assistant:", error);
    return "I'm sorry, I'm encountering a technical issue at the moment. Please try asking again in a little bit.";
  }
};