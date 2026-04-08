import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FlaskConical, Info } from 'lucide-react';

import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';

const exampleCompounds = [
  {
    name: 'Troglitazone',
    smiles: 'CC(C)c1ccc(cc1)C(=O)Nc2cccc(c2)O',
  },
  {
    name: 'Rofecoxib',
    smiles: 'CS(=O)(=O)c1ccc(cc1)C2=C(C(=O)OC2)c3ccccc3',
  },
  {
    name: 'Phenacetin',
    smiles: 'CCOc1ccc(NC(C)=O)cc1',
  },
];

export function InputPage() {
  const navigate = useNavigate();
  const [smiles, setSmiles] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    const trimmed = smiles.trim();
    if (!trimmed) return;

    navigate(`/results?smiles=${encodeURIComponent(trimmed)}`);
  };

  const handleExampleClick = (exampleSmiles: string) => {
    setSmiles(exampleSmiles);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
            <FlaskConical className="h-12 w-12 text-blue-600" />
          </div>

          <h1 className="mb-3 text-5xl font-semibold tracking-tight text-slate-900">
            Drug Toxicity Explainability Tool
          </h1>

          <p className="max-w-3xl text-xl text-slate-600">
            Predict and understand potential drug toxicity with AI-powered molecular analysis
          </p>
        </div>

        <Card className="rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-3 font-semibold text-slate-800">SMILES String</label>
                <Input
                  value={smiles}
                  onChange={(e) => setSmiles(e.target.value)}
                  placeholder="e.g., CC(=O)Oc1ccccc1C(=O)O"
                  className="h-16 rounded-2xl border-slate-200 bg-slate-100 text-lg"
                />
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-left">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <p className="text-base text-slate-700">
                  <span className="font-semibold text-slate-900">About SMILES:</span>{' '}
                  Simplified Molecular Input Line Entry System (SMILES) is a notation for
                  describing molecular structures using ASCII strings.
                </p>
              </div>

              <Button
                type="submit"
                className="h-16 w-full rounded-2xl bg-slate-500 text-lg font-semibold hover:bg-slate-600"
                disabled={!smiles.trim()}
              >
                Analyze Toxicity
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-10 text-center">
          <p className="mb-4 text-lg text-slate-500">Try a supported example:</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {exampleCompounds.map((compound) => (
              <Button
                key={compound.name}
                type="button"
                variant="outline"
                className="rounded-2xl px-6 py-5 text-lg"
                onClick={() => handleExampleClick(compound.smiles)}
              >
                {compound.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}