import { resolve } from 'https://deno.land/std@0.144.0/path/mod.ts';
import { Session } from './session.ts';
import { spawn } from './spawn.ts';

const SCRIPT_PATH = 'print.ts';

export async function runClarinet() {
  const __dirname = new URL('.', import.meta.url).pathname;
  const scriptPath = resolve(__dirname, SCRIPT_PATH);
  const cmd = [
    'clarinet',
    'run',
    scriptPath,
    '--allow-write',
    '--allow-wallets',
  ];

  const result = await spawn(cmd);

  if (result.status.success) {
    try {
      const sessionJSON = result.stdout.split('\n')[1];
      const session: Session = JSON.parse(sessionJSON);
      return session;
    } catch (_) {
      console.warn('Invalid JSON. Stdout:\n', result.stdout);
    }
  }
  const log = result.stderr || result.stdout;
  throw new Error(`Error running 'clarinet run':\n${log}`);
}
