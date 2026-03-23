export interface QueryInput {
  smiles: string
  drugName?: string
}

export interface ProToxPrediction {
  endpoint: string
  value: string | number | boolean
  confidence?: number
  unit?: string
}

export interface ProToxResponse {
  smiles: string
  predictions: ProToxPrediction[]
  rawCsv?: string
}

export interface EvidenceItem {
  id: string
  category:
    | 'primary_target'
    | 'off_target'
    | 'tox_mechanism'
    | 'pathway'
    | 'organ_system'
    | 'adverse_event'
    | 'risk_modifier'
  label: string
  evidenceLevel: 'low' | 'medium' | 'high'
  sourceType?: 'manual_curation' | 'llm_extraction' | 'database'
  confidence?: number
  note?: string
}

export interface InterpretabilityRule {
  id: string
  triggerType: 'target' | 'off_target' | 'mechanism' | 'pathway'
  triggerValue: string
  outputRisk: string
  explanation: string
  severity?: 'low' | 'medium' | 'high'
}

export interface MechanisticFlag {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  triggeredBy: string[]
  supportingEvidenceIds: string[]
  confidence?: number
}

export interface MechanismRecord {
  drugId: string
  drugName: string
  primaryTargets: string[]
  offTargets: string[]
  toxMechanisms: string[]
  pathways: string[]
  organSystems: string[]
  adverseEvents: string[]
  riskModifiers: string[]
  evidenceLevel: 'low' | 'medium' | 'high'
}

export interface ExplainabilityResult {
  input: QueryInput
  protox: ProToxResponse
  curatedMechanism?: MechanismRecord
  evidence: EvidenceItem[]
  flags: MechanisticFlag[]
  summary: string
}
export interface EndpointRisk {
  name: string
  score: number
  risk: 'high' | 'moderate' | 'low'
}

export interface MechanisticRisk {
  id: string
  type: string
  severity: 'high' | 'moderate' | 'low'
  description: string
  confidence: number
  triggeredBy: string[]
  supportStatus: 'strong' | 'moderate' | 'emerging'
  relatedTargets: string[]
  relatedOffTargets: string[]
  relatedMechanisms: string[]
  relatedPathways: string[]
}

export interface TargetRecord {
  name: string
  interaction: string
  confidence: number
  provenance: 'curated' | 'database' | 'llm'
}

export interface TextEvidenceRecord {
  text: string
  provenance: 'curated' | 'database' | 'llm'
}

export interface AdverseEventRecord {
  event: string
  frequency: string
  evidence: string
  provenance: 'curated' | 'database' | 'llm'
}

export interface ConfidenceMetrics {
  modelConfidence: number
  mechanisticSupport: number
  evidenceStrength: number
}

export interface ResultsPageData {
  smiles: string
  toxicityClass: string
  overallScore: number
  endpoints: EndpointRisk[]
  mechanisticRisks: MechanisticRisk[]
  primaryTargets: TargetRecord[]
  offTargets: TargetRecord[]
  mechanisms: TextEvidenceRecord[]
  pathways: TextEvidenceRecord[]
  adverseEvents: AdverseEventRecord[]
  confidence: ConfidenceMetrics
}