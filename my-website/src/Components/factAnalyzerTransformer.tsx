// factAnalyzerTransformer.tsx
import { exec } from 'child_process';

export function calculateWordScores(text: string): Promise<Record<string, number>> {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = 'path/to/fun_fact_analyzer.py';
    const command = `python ${pythonScriptPath} "${text}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      const result = JSON.parse(stdout);
      resolve(result);
    });
  });
}