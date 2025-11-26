import { GoogleGenAI } from "@google/genai";

// Initialize the client strictly according to guidelines.
// The API key is injected by Vite at build time via the 'define' config in vite.config.ts
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSampleImage = async (prompt: string): Promise<string> => {
  try {
    // Using gemini-2.5-flash-image for speed or gemini-3-pro-image-preview for quality
    // The prompt requests "preset samples", so quality is good, but speed is better for browsing.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        // Square aspect ratio for the sample preview card
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    // Iterate to find the image part
    if (response.candidates && response.candidates[0].content.parts) {
       for (const part of response.candidates[0].content.parts) {
         if (part.inlineData) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
         }
       }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw error;
  }
};