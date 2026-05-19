export type IdeaCategory =
  | "b2b_saas"
  | "consumer_app"
  | "marketplace"
  | "ecommerce"
  | "creator_tool"
  | "info_product"
  | "local_service"
  | "other";

export type ActionStatus = "locked" | "todo" | "in_progress" | "completed" | "failed";

export type ActionCard = {
  id: string;
  day: number;
  title: string;
  objective: string;
  targetSite: {
    name: string;
    url: string;
  };
  estimatedMinutes: number;
  steps: string[];
  searchQueries: string[];
  copyTexts: {
    label: string;
    text: string;
  }[];
  successCriteria: string[];
  failureSignals: string[];
  requiredInputs: {
    key: string;
    label: string;
    type: "text" | "number" | "url" | "boolean";
    required: boolean;
  }[];
  status: ActionStatus;
  
  // User input states
  evidence?: Record<string, any>;
};

export type PivotOption = {
  id: string;
  title: string;
  reason: string;
  newTargetCustomer: string;
  strongerPainPoint: string;
  monetizationPath: string;
  firstValidationAction: string;
  difficulty: "low" | "medium" | "high";
  firstRevenuePotential: number; // 0-100
};

export type FirstRevenueScore = {
  problemEvidence: number;
  customerAccess: number;
  willingnessToPay: number;
  competitorGap: number;
  executionSpeed: number;
  distributionPotential: number;
  total: number;
  verdict: "kill" | "pivot" | "validate_more" | "build";
};

export type BuildGateStatus = {
  problemEvidence: boolean;
  competitorResearch: boolean;
  landingPageCreated: boolean;
  outreachCompleted: boolean;
  positiveSignalReceived: boolean;
  paymentTested: boolean;
  canBuild: boolean;
};

export type AIValidationResult = {
  idea: {
    rawInput: string;
    refinedOneLiner: string;
    category: IdeaCategory;
    targetCustomer: string;
  };
  ruthlessVerdict: {
    score: number;
    verdict: "kill" | "pivot" | "validate_more" | "build";
    summary: string;
    brutalTruth: string;
  };
  scores: {
    marketDemand: number;
    willingnessToPay: number;
    executionFeasibility: number;
    differentiation: number;
    distribution: number;
    firstRevenueProbability: number;
  };
  fatalRisks: {
    title: string;
    explanation: string;
    severity: "low" | "medium" | "high";
  }[];
  hooks: {
    name: string;
    psychologicalPrinciple: string;
    implementation: string;
  }[];
  executionPlan: ActionCard[];
  pivots: PivotOption[];
};
