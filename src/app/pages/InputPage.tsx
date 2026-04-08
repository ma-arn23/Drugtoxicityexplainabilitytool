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
    <div className="min-h-screen bg-slate-50 px-4 py-4 sm:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-4xl flex-col justify-center">
        <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 sm:h-16 sm:w-16">
            <FlaskConical className="h-7 w-7 text-blue-600 sm:h-8 sm:w-8" />
          </div>

          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Drug Toxicity Explainability Tool
          </h1>

          <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
            Predict and understand potential drug toxicity with AI-powered molecular analysis
          </p>
        </div>

        <Card className="rounded-2xl border border-slate-200 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">
                  SMILES String
                </label>
                <Input
                  value={smiles}
                  onChange={(e) => setSmiles(e.target.value)}
                  placeholder="e.g., CC(=O)Oc1ccccc1C(=O)O"
                  className="h-12 rounded-xl border-slate-200 bg-slate-100 text-sm sm:text-base"
                />
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-3 sm:p-4 text-left">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">About SMILES:</span>{' '}
                  Simplified Molecular Input Line Entry System (SMILES) is a notation for
                  describing molecular structures using ASCII strings.
                </p>
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-slate-500 text-sm font-semibold hover:bg-slate-600 sm:text-base"
                disabled={!smiles.trim()}
              >
                Analyze Toxicity
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-5 text-center sm:mt-6">
          <p className="mb-3 text-sm text-slate-500 sm:text-base">
            Try a supported example:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {exampleCompounds.map((compound) => (
              <Button
                key={compound.name}
                type="button"
                variant="outline"
                className="rounded-xl px-4 py-2 text-sm"
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