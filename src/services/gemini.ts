import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface StoryResult {
  paragraph: string;
  mood: string;
  sceneDescription: string;
}

export async function generateStoryFromImage(base64Image: string, mimeType: string): Promise<StoryResult> {
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `Analyze this image and provide:
1. A brief description of the scene.
2. The overall mood or atmosphere.
3. A compelling opening paragraph (about 100-150 words) for a story set in this world. 

Return the result as a JSON object with keys: "sceneDescription", "mood", and "paragraph".`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { data: base64Image, mimeType } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
    }
  });

  const result = JSON.parse(response.text || "{}");
  return {
    paragraph: result.paragraph || "",
    mood: result.mood || "",
    sceneDescription: result.sceneDescription || "",
  };
}

export async function textToSpeech(text: string): Promise<string> {
  const model = "gemini-2.5-flash-preview-tts";
  
  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: `Read this story opening with an expressive, atmospheric voice: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Kore' is often good for storytelling
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("Failed to generate audio");
  }
  
  return base64Audio;
}
