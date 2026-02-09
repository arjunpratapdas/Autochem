
export interface Reactant {
  name: string;
  smiles?: string;
}

export interface PredictionRequest {
  reactantA: Reactant;
  reactantB?: Reactant;
  solvent: string;
  temperature: number;
  catalyst?: string;
  additives?: string;
  pressure?: number;
  protectedGroups?: string;
}

export interface Overview {
  productName: string;
  smiles: string;
  yield: number;
  confidence: number;
  time: string;
  reactionType: string;
}

export interface MechanismStep {
  step: number;
  title: string;
  description: string;
  intermediate?: string;
}

export interface OptimizationMetric {
  label: string;
  value: string;
  subtext: string;
  improvement: string;
  type: 'yield' | 'cost' | 'time' | 'green';
}

export interface SafetyHazard {
  type: string;
  level: 'Low' | 'Moderate' | 'High';
  score: string;
  description: string;
}

export interface PredictionResult {
  id: string;
  timestamp: number;
  inputs: PredictionRequest;
  overview: Overview;
  mechanism: MechanismStep[];
  optimization: {
    metrics: OptimizationMetric[];
    comparisonTable: Array<{
      parameter: string;
      original: string;
      optimized: string;
      improvement: string;
    }>;
  };
  safety: {
    overallRisk: 'Low' | 'Moderate' | 'High';
    hazards: SafetyHazard[];
    reagents: Array<{
      name: string;
      hCodes: string;
      precautions: string;
      ppe: string[];
    }>;
    emergency: {
      skin: string;
      eye: string;
      inhalation: string;
      ingestion: string;
    };
    scaleUp: string[];
  };
}
