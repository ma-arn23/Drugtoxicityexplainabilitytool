import type {
  QueryInput,
  ProToxPrediction,
  ProToxResponse,
  MechanismRecord,
  EvidenceItem,
  InterpretabilityRule,
  MechanisticFlag,
  ExplainabilityResult,
} from '../types/explainability';
import type { ResultsPageData } from '../types/explainability';
import { useNavigate, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import {
  ArrowLeft,
  AlertTriangle,
  Activity,
  Heart,
  Pill,
  Target,
  Workflow,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Info,
  Link2,
  Database,
  Sparkles,
  FileText,
} from 'lucide-react';


// Mock data generator based on SMILES
const generateMockResults = (smiles: string): ResultsPageData => {
  return {
    smiles,
    toxicityClass: 'Moderate Risk',
    overallScore: 0.62,
    endpoints: [
      { name: 'Cardiotoxicity', score: 0.71, risk: 'high' },
      { name: 'Hepatotoxicity', score: 0.58, risk: 'moderate' },
      { name: 'Nephrotoxicity', score: 0.34, risk: 'low' },
      { name: 'Neurotoxicity', score: 0.45, risk: 'moderate' },
    ],
    mechanisticRisks: [
      {
        id: 'qt-risk',
        type: 'QT Prolongation Risk',
        severity: 'high',
        description: 'hERG inhibition may delay cardiac repolarization.',
        confidence: 0.87,
        triggeredBy: ['hERG (KCNH2) inhibition', 'Cardiac ion channel disruption'],
        supportStatus: 'strong',
        relatedTargets: ['hERG (KCNH2)'],
        relatedOffTargets: [],
        relatedMechanisms: ['Ion channel blockade'],
        relatedPathways: ['Cardiac action potential regulation'],
      },
      {
        id: 'hepatic-risk',
        type: 'Hepatic Metabolism Disruption',
        severity: 'moderate',
        description: 'CYP450 interaction may increase hepatotoxicity risk.',
        confidence: 0.72,
        triggeredBy: ['CYP3A4 substrate interaction', 'Hepatic enzyme modulation'],
        supportStatus: 'moderate',
        relatedTargets: ['CYP3A4'],
        relatedOffTargets: [],
        relatedMechanisms: ['Oxidative stress induction'],
        relatedPathways: ['Hepatic drug metabolism'],
      },
      {
        id: 'mito-risk',
        type: 'Mitochondrial Dysfunction',
        severity: 'moderate',
        description: 'Mitochondrial stress may disrupt energy metabolism.',
        confidence: 0.65,
        triggeredBy: ['Oxidative phosphorylation disruption', 'Mitochondrial membrane interaction'],
        supportStatus: 'emerging',
        relatedTargets: [],
        relatedOffTargets: [],
        relatedMechanisms: ['Oxidative stress induction', 'Lipid metabolism interference'],
        relatedPathways: ['Oxidative phosphorylation'],
      },
    ],
    primaryTargets: [
      { name: 'hERG (KCNH2)', interaction: 'Inhibitor', confidence: 0.89, provenance: 'curated' },
      { name: 'CYP3A4', interaction: 'Substrate', confidence: 0.76, provenance: 'database' },
      { name: 'P-glycoprotein', interaction: 'Substrate', confidence: 0.68, provenance: 'database' },
    ],
    offTargets: [
      { name: 'Sodium channels (Nav1.5)', interaction: 'Weak blocker', confidence: 0.54, provenance: 'llm' },
      { name: 'Dopamine D2 receptor', interaction: 'Antagonist', confidence: 0.48, provenance: 'llm' },
    ],
    mechanisms: [
      { text: 'Ion channel blockade', provenance: 'curated' },
      { text: 'Oxidative stress induction', provenance: 'database' },
      { text: 'Protein binding disruption', provenance: 'llm' },
      { text: 'Lipid metabolism interference', provenance: 'llm' },
    ],
    pathways: [
      { text: 'Cardiac action potential regulation', provenance: 'curated' },
      { text: 'Hepatic drug metabolism', provenance: 'database' },
      { text: 'Oxidative phosphorylation', provenance: 'curated' },
      { text: 'Xenobiotic clearance', provenance: 'database' },
    ],
    adverseEvents: [
      { event: 'QT interval prolongation', frequency: 'Common', evidence: 'Strong', provenance: 'curated' },
      { event: 'Elevated liver enzymes', frequency: 'Occasional', evidence: 'Moderate', provenance: 'database' },
      { event: 'Cardiac arrhythmia', frequency: 'Rare', evidence: 'Strong', provenance: 'curated' },
    ],
    confidence: {
      modelConfidence: 0.78,
      mechanisticSupport: 0.82,
      evidenceStrength: 0.85,
    },
  };
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'moderate':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const getRiskIcon = (severity: string) => {
  switch (severity) {
    case 'high':
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    case 'moderate':
      return <AlertCircle className="w-5 h-5 text-amber-600" />;
    case 'low':
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    default:
      return <AlertCircle className="w-5 h-5" />;
  }
};

const getProvenanceBadge = (provenance: string) => {
  switch (provenance) {
    case 'curated':
      return {
        icon: <FileText className="w-3 h-3" />,
        label: 'Manual curation',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    case 'database':
      return {
        icon: <Database className="w-3 h-3" />,
        label: 'Database',
        color: 'bg-blue-100 text-blue-800 border-blue-300',
      };
    case 'llm':
      return {
        icon: <Sparkles className="w-3 h-3" />,
        label: 'LLM extracted',
        color: 'bg-purple-100 text-purple-800 border-purple-300',
      };
    default:
      return {
        icon: <Info className="w-3 h-3" />,
        label: 'Unknown',
        color: 'bg-slate-100 text-slate-800 border-slate-300',
      };
  }
};

const getSupportBadge = (status: string) => {
  switch (status) {
    case 'strong':
      return { label: 'Strong evidence', color: 'bg-green-100 text-green-800 border-green-300' };
    case 'moderate':
      return { label: 'Moderate evidence', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    case 'emerging':
      return { label: 'Emerging evidence', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    default:
      return { label: 'Unknown', color: 'bg-slate-100 text-slate-800 border-slate-300' };
  }
};

export function ResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const smiles = searchParams.get('smiles') || '';
  const [highlightedItems, setHighlightedItems] = useState<string[]>([]);

  useEffect(() => {
    if (!smiles) {
      navigate('/', { replace: true });
    }
  }, [smiles, navigate]);

  if (!smiles) {
    return null;
  }

  const results = generateMockResults(smiles);

  const handleRiskHover = (riskId: string, isHovering: boolean) => {
    const risk = results.mechanisticRisks.find((r) => r.id === riskId);
    if (!risk) return;

    if (isHovering) {
      const highlighted = [
        ...risk.relatedTargets,
        ...risk.relatedOffTargets,
        ...risk.relatedMechanisms,
        ...risk.relatedPathways,
      ];
      setHighlightedItems(highlighted);
    } else {
      setHighlightedItems([]);
    }
  };

  const isHighlighted = (text: string) => highlightedItems.includes(text);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="max-w-[1800px] mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="gap-2 h-8"
                >
                  <ArrowLeft className="w-4 h-4" />
                  New Analysis
                </Button>
                <Separator orientation="vertical" className="h-5" />
                <div>
                  <p className="text-xs text-slate-500">Analyzing compound</p>
                  <p className="font-mono text-xs text-slate-900 break-all max-w-[700px]">
                    {smiles}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
            {/* LEFT COLUMN */}
            <div className="space-y-5">
              {/* Prediction Summary */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Toxicity Prediction
                  </CardTitle>
                  <CardDescription>Overall risk assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-2xl text-amber-900 mb-1">{results.toxicityClass}</div>
                    <div className="text-sm text-amber-700">
                      Overall Score: {(results.overallScore * 100).toFixed(0)}%
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-slate-600 font-medium">Key Endpoints</p>
                    {results.endpoints.map((endpoint, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-700">{endpoint.name}</span>
                          <Badge variant="outline" className={`${getSeverityColor(endpoint.risk)} text-xs`}>
                            {endpoint.risk}
                          </Badge>
                        </div>
                        <Progress value={endpoint.score * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Interpretation */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <p className="text-sm text-green-900 leading-relaxed">
                    <span className="font-semibold">Interpretation:</span> Model predictions are supported by
                    curated mechanistic evidence, especially for cardiac and hepatic risk.
                  </p>
                </CardContent>
              </Card>

              {/* Why toxic */}
              <Card className="border-2 border-blue-300 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
                <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b-2 border-blue-200 pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <AlertTriangle className="w-6 h-6 text-blue-600" />
                    Why might this be toxic?
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Key mechanistic risk factors with supporting evidence
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  {results.mechanisticRisks.map((risk, idx) => {
                    const supportBadge = getSupportBadge(risk.supportStatus);

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border-2 ${getSeverityColor(
                          risk.severity
                        )} transition-all hover:shadow-lg`}
                        onMouseEnter={() => handleRiskHover(risk.id, true)}
                        onMouseLeave={() => handleRiskHover(risk.id, false)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">{getRiskIcon(risk.severity)}</div>

                          <div className="flex-1 min-w-0 space-y-3">
                            <div>
                              <div className="flex items-start justify-between mb-2 gap-2">
                                <h4 className="text-base font-semibold text-slate-900">{risk.type}</h4>
                                <Badge variant="outline" className="capitalize shrink-0">
                                  {risk.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-700">{risk.description}</p>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5">
                                <Link2 className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-xs font-medium text-slate-600">Triggered by</span>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {risk.triggeredBy.map((trigger, tidx) => (
                                  <Badge
                                    key={tidx}
                                    variant="secondary"
                                    className="bg-white text-slate-700 border border-slate-200 font-normal"
                                  >
                                    {trigger}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 gap-3">
                              <Badge
                                variant="outline"
                                className={`${supportBadge.color} text-xs gap-1`}
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                {supportBadge.label}
                              </Badge>

                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-600">Confidence</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-white rounded-full h-2 overflow-hidden border border-slate-200">
                                    <div
                                      className={`h-full ${
                                        risk.severity === 'high'
                                          ? 'bg-red-500'
                                          : risk.severity === 'moderate'
                                          ? 'bg-amber-500'
                                          : 'bg-green-500'
                                      }`}
                                      style={{ width: `${risk.confidence * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-slate-900 font-semibold min-w-[3ch]">
                                    {(risk.confidence * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="pt-1 flex items-center gap-2 text-xs text-slate-500 italic">
                    <Info className="w-3.5 h-3.5" />
                    Hover over a risk to highlight related evidence in the right panel
                  </div>
                </CardContent>
              </Card>

              {/* Confidence */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Prediction Confidence
                  </CardTitle>
                  <CardDescription>How reliable is this prediction?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">Model Confidence</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="inline-flex">
                              <Info className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">
                              How confident the AI model is in its toxicity prediction
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="text-lg font-bold text-blue-900">
                        {(results.confidence.modelConfidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={results.confidence.modelConfidence * 100} className="h-2" />
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">Mechanistic Support</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="inline-flex">
                              <Info className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">
                              Alignment with known biological mechanisms and pathways
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="text-lg font-bold text-green-900">
                        {(results.confidence.mechanisticSupport * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={results.confidence.mechanisticSupport * 100} className="h-2" />
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">Evidence Strength</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="inline-flex">
                              <Info className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">
                              Quality and reliability of supporting scientific evidence
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="text-lg font-bold text-purple-900">
                        {(results.confidence.evidenceStrength * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={results.confidence.evidenceStrength * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-5 xl:sticky xl:top-24 self-start">
              {/* Biological Targets */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 text-purple-600" />
                    Biological Targets
                  </CardTitle>
                  <CardDescription>Molecular interactions supporting predictions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-4 h-4 text-red-500" />
                      <h4 className="text-sm font-semibold text-slate-900">Primary Targets</h4>
                    </div>
                    <div className="space-y-2">
                      {results.primaryTargets.map((target, idx) => {
                        const provBadge = getProvenanceBadge(target.provenance);
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-md border transition-all ${
                              isHighlighted(target.name)
                                ? 'bg-blue-100 border-blue-400 shadow-md'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <span className="text-sm font-semibold text-slate-900">{target.name}</span>
                                <span className="text-sm text-slate-600 ml-2">• {target.interaction}</span>
                              </div>
                              <span className="text-xs text-slate-600 whitespace-nowrap">
                                {(target.confidence * 100).toFixed(0)}% confidence
                              </span>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button type="button" className="inline-flex">
                                  <Badge variant="outline" className={`${provBadge.color} text-xs gap-1`}>
                                    {provBadge.icon}
                                    {provBadge.label}
                                  </Badge>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Data source: {provBadge.label}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4 text-orange-500" />
                      <h4 className="text-sm font-semibold text-slate-900">Off-Target Effects</h4>
                    </div>
                    <div className="space-y-2">
                      {results.offTargets.map((target, idx) => {
                        const provBadge = getProvenanceBadge(target.provenance);
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-md border transition-all ${
                              isHighlighted(target.name)
                                ? 'bg-blue-100 border-blue-400 shadow-md'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <span className="text-sm font-semibold text-slate-900">{target.name}</span>
                                <span className="text-sm text-slate-600 ml-2">• {target.interaction}</span>
                              </div>
                              <span className="text-xs text-slate-600 whitespace-nowrap">
                                {(target.confidence * 100).toFixed(0)}% confidence
                              </span>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button type="button" className="inline-flex">
                                  <Badge variant="outline" className={`${provBadge.color} text-xs gap-1`}>
                                    {provBadge.icon}
                                    {provBadge.label}
                                  </Badge>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Data source: {provBadge.label}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mechanisms & Pathways */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Workflow className="w-5 h-5 text-blue-600" />
                    Mechanisms & Pathways
                  </CardTitle>
                  <CardDescription>Biological processes underlying toxicity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Workflow className="w-4 h-4 text-blue-500" />
                      <h4 className="text-sm font-semibold text-slate-900">Toxicity Mechanisms</h4>
                    </div>
                    <ul className="space-y-2">
                      {results.mechanisms.map((mechanism, idx) => {
                        const provBadge = getProvenanceBadge(mechanism.provenance);
                        return (
                          <li
                            key={idx}
                            className={`flex items-center justify-between gap-3 p-2.5 rounded-md border transition-all ${
                              isHighlighted(mechanism.text)
                                ? 'bg-blue-100 border-blue-400 shadow-md'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <span className="text-sm text-slate-700">{mechanism.text}</span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button type="button" className="inline-flex shrink-0">
                                  <Badge variant="outline" className={`${provBadge.color} text-xs gap-1`}>
                                    {provBadge.icon}
                                    {provBadge.label}
                                  </Badge>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Data source: {provBadge.label}</p>
                              </TooltipContent>
                            </Tooltip>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <h4 className="text-sm font-semibold text-slate-900">Affected Pathways</h4>
                    </div>
                    <ul className="space-y-2">
                      {results.pathways.map((pathway, idx) => {
                        const provBadge = getProvenanceBadge(pathway.provenance);
                        return (
                          <li
                            key={idx}
                            className={`flex items-center justify-between gap-3 p-2.5 rounded-md border transition-all ${
                              isHighlighted(pathway.text)
                                ? 'bg-blue-100 border-blue-400 shadow-md'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <span className="text-sm text-slate-700">{pathway.text}</span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button type="button" className="inline-flex shrink-0">
                                  <Badge variant="outline" className={`${provBadge.color} text-xs gap-1`}>
                                    {provBadge.icon}
                                    {provBadge.label}
                                  </Badge>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Data source: {provBadge.label}</p>
                              </TooltipContent>
                            </Tooltip>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Known Adverse Events */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Pill className="w-5 h-5 text-purple-600" />
                    Known Adverse Events
                  </CardTitle>
                  <CardDescription>Clinically reported toxicity outcomes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.adverseEvents.map((event, idx) => {
                      const provBadge = getProvenanceBadge(event.provenance);
                      return (
                        <div
                          key={idx}
                          className="p-3 bg-purple-50 rounded-md border border-purple-200"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="text-sm font-semibold text-slate-900">{event.event}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Badge variant="outline" className="text-xs bg-white">
                                {event.frequency}
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-white">
                                {event.evidence} evidence
                              </Badge>
                            </div>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="inline-flex">
                                <Badge variant="outline" className={`${provBadge.color} text-xs gap-1`}>
                                  {provBadge.icon}
                                  {provBadge.label}
                                </Badge>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Data source: {provBadge.label}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}