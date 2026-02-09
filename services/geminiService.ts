
import { GoogleGenAI, Type } from "@google/genai";
import { PredictionRequest, PredictionResult } from "../types";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    overview: {
      type: Type.OBJECT,
      properties: {
        productName: { type: Type.STRING, description: "Common chemical name of the major product" },
        smiles: { type: Type.STRING, description: "SMILES string of the major product" },
        yield: { type: Type.NUMBER, description: "Estimated percentage yield (0-100)" },
        confidence: { type: Type.NUMBER, description: "Model confidence score (0-1)" },
        time: { type: Type.STRING, description: "Estimated reaction duration (e.g., '4h', '24h')" },
        reactionType: { type: Type.STRING, description: "Type of reaction (e.g., 'Nucleophilic Substitution', 'Suzuki Coupling')" },
      },
      required: ["productName", "smiles", "yield", "confidence", "time", "reactionType"],
    },
    mechanism: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.NUMBER },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          intermediate: { type: Type.STRING, description: "SMILES or name of the intermediate in this step" },
        },
        required: ["step", "title", "description"],
      },
    },
    optimization: {
      type: Type.OBJECT,
      properties: {
        metrics: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              value: { type: Type.STRING },
              subtext: { type: Type.STRING },
              improvement: { type: Type.STRING, description: "e.g., '+15%'" },
              type: { type: Type.STRING, enum: ["yield", "cost", "time", "green"] },
            },
            required: ["label", "value", "type"],
          },
        },
        comparisonTable: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              parameter: { type: Type.STRING },
              original: { type: Type.STRING },
              optimized: { type: Type.STRING },
              improvement: { type: Type.STRING },
            },
            required: ["parameter", "original", "optimized", "improvement"],
          },
        },
      },
      required: ["metrics", "comparisonTable"],
    },
    safety: {
      type: Type.OBJECT,
      properties: {
        overallRisk: { type: Type.STRING, enum: ["Low", "Moderate", "High"] },
        hazards: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              level: { type: Type.STRING, enum: ["Low", "Moderate", "High"] },
              score: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ["type", "level", "score", "description"],
          },
        },
        reagents: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              hCodes: { type: Type.STRING, description: "GHS Hazard statements (H-codes)" },
              precautions: { type: Type.STRING },
              ppe: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["name", "hCodes", "precautions", "ppe"],
          },
        },
        emergency: {
          type: Type.OBJECT,
          properties: {
            skin: { type: Type.STRING },
            eye: { type: Type.STRING },
            inhalation: { type: Type.STRING },
            ingestion: { type: Type.STRING },
          },
          required: ["skin", "eye", "inhalation", "ingestion"],
        },
        scaleUp: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Considerations for larger scale production" },
      },
      required: ["overallRisk", "hazards", "reagents", "emergency", "scaleUp"],
    },
  },
  required: ["overview", "mechanism", "optimization", "safety"],
};

export async function predictReaction(inputs: PredictionRequest): Promise<PredictionResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    System Context: You are a PhD Computational Chemist expert in mechanistic organic chemistry and reaction engineering.
    Task: Perform a deep structural and kinetic analysis of the following proposed reaction.
    
    Proposed Input Parameters:
    - Primary Reactant A: ${inputs.reactantA.name} ${inputs.reactantA.smiles ? `(SMILES: ${inputs.reactantA.smiles})` : ''}
    - Secondary Reactant B: ${inputs.reactantB?.name || 'N/A'} ${inputs.reactantB?.smiles ? `(SMILES: ${inputs.reactantB?.smiles})` : ''}
    - Reaction Matrix (Solvent): ${inputs.solvent}
    - Thermal Envelope: ${inputs.temperature}°C
    - Catalytic System: ${inputs.catalyst || "None"}
    - Chemical Additives: ${inputs.additives || "None"}
    - Barometric Pressure: ${inputs.pressure || 1} atm
    - Protected Functionality: ${inputs.protectedGroups || "None"}

    Analytical Requirements:
    1. Identify the most probable major product and its IUPAC name.
    2. Provide a step-by-step electronic mechanism (at least 4 steps) including arrows or description of electron flow.
    3. Generate 4 optimization metrics focused on yield, cost, time, and green chemistry.
    4. Assess safety using GHS standards and overall risk.
    5. Return EVERYTHING strictly in the provided JSON schema. Ensure scientific accuracy.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema as any,
        temperature: 0.15, 
      },
    });

    const result = JSON.parse(response.text || "{}");
    return {
      id: `RXN-${Date.now().toString().slice(-6)}`,
      timestamp: Date.now(),
      inputs,
      ...result,
    };
  } catch (error) {
    console.error("Gemini Analytical Error:", error);
    throw new Error("Simulation engine failed to converge. Please verify molecular structure inputs.");
  }
}
