import { GoogleGenAI, Type } from "@google/genai";
import type { MeetingNotes } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove the data:mime/type;base64, prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const meetingNotesSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise summary of the key decisions, outcomes, and main topics of the meeting.",
    },
    actionItems: {
      type: Type.ARRAY,
      description: "A list of clear action items from the meeting.",
      items: {
        type: Type.OBJECT,
        properties: {
          task: {
            type: Type.STRING,
            description: "The specific action or task that needs to be completed.",
          },
          owner: {
            type: Type.STRING,
            description: "The person, team, or speaker label (e.g., 'Speaker 1') assigned to the task. If not mentioned, state 'Unassigned'.",
          },
        },
        required: ["task", "owner"]
      },
    },
    discussionPoints: {
      type: Type.ARRAY,
      description: "A list of the main topics or questions that were discussed.",
      items: {
        type: Type.STRING,
      },
    },
    transcription: {
      type: Type.ARRAY,
      description: "Full and accurate transcription of the meeting audio. Each part of the dialogue should be an object with a speaker label (e.g., 'Speaker 1', 'Speaker 2') and their corresponding quote.",
      items: {
        type: Type.OBJECT,
        properties: {
          speaker: {
            type: Type.STRING,
            description: "The identified speaker label (e.g., 'Speaker 1', 'Speaker 2', or a person's name if identifiable)."
          },
          quote: {
            type: Type.STRING,
            description: "The transcribed text spoken by the speaker."
          }
        },
        required: ["speaker", "quote"]
      }
    },
  },
  required: ["summary", "actionItems", "discussionPoints", "transcription"],
};


export const generateMeetingNotes = async (file: File): Promise<MeetingNotes> => {
  const base64Data = await fileToBase64(file);
  const mimeType = file.type;

  if (!mimeType.startsWith('audio/') && !mimeType.startsWith('video/')) {
    throw new Error('Unsupported file type. Please upload an audio or video file.');
  }

  const prompt = `You are an expert meeting assistant. Please analyze the provided meeting recording and provide the output in the specified JSON format.
    1.  **Transcription**: Transcribe the audio accurately. You MUST identify and differentiate between speakers, labeling them sequentially as 'Speaker 1', 'Speaker 2', and so on. The transcription must be an array of objects, where each object contains a 'speaker' and a 'quote'.
    2.  **Summary**: Write a concise summary of the key decisions, outcomes, and main topics.
    3.  **Action Items**: List all clear action items. For each item, identify the task and the owner. The owner can be a specific name or a speaker label (e.g., 'Speaker 1'). If no one is assigned, use 'Unassigned'.
    4.  **Discussion Points**: List the main topics or questions that were discussed.`;

  const filePart = {
    inlineData: {
      mimeType: mimeType,
      data: base64Data,
    },
  };

  const textPart = {
    text: prompt,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [filePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: meetingNotesSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);

    // Validate the structure to ensure it matches MeetingNotes
    if (
      !parsedJson.summary || 
      !Array.isArray(parsedJson.actionItems) || 
      !Array.isArray(parsedJson.discussionPoints) ||
      !Array.isArray(parsedJson.transcription)
    ) {
      throw new Error("AI response is missing required fields.");
    }
    
    return parsedJson as MeetingNotes;

  } catch (error) {
    console.error("Error generating meeting notes from Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate notes: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while calling the AI model.");
  }
};