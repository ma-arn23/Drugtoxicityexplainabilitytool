import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { FlaskConical, Info } from 'lucide-react';

export function InputPage() {
  const [smiles, setSmiles] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (smiles.trim()) {
      // Navigate to results page with SMILES string as URL parameter
      navigate(`/results?smiles=${encodeURIComponent(smiles)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && smiles.trim()) {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-4">
            <FlaskConical className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-3xl mb-2 text-slate-900">
            Drug Toxicity Explainability Tool
          </h1>
          <p className="text-slate-600">
            Predict and understand potential drug toxicity with AI-powered molecular analysis
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smiles" className="text-slate-700">
                SMILES String
              </Label>
              <Input
                id="smiles"
                type="text"
                placeholder="e.g., CC(C)Cc1ccc(cc1)C(C)C(O)=O"
                value={smiles}
                onChange={(e) => setSmiles(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-11 text-base"
              />
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md border border-blue-100">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700">
                <span className="font-medium text-slate-900">About SMILES:</span> Simplified Molecular Input Line Entry System (SMILES) is a notation for describing molecular structures using ASCII strings.
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!smiles.trim()}
              className="w-full h-11"
              size="lg"
            >
              Analyze Toxicity
            </Button>
          </div>
        </div>

        {/* Example section */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500 mb-2">Try an example:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSmiles('CC(C)Cc1ccc(cc1)C(C)C(O)=O')}
              className="font-mono text-xs h-8"
            >
              Ibuprofen
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSmiles('CN1C=NC2=C1C(=O)N(C(=O)N2C)C')}
              className="font-mono text-xs h-8"
            >
              Caffeine
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSmiles('CC(=O)Oc1ccccc1C(=O)O')}
              className="font-mono text-xs h-8"
            >
              Aspirin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}