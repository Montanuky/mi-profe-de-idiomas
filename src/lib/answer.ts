// Comparación tolerante de respuestas escritas.

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[’`´]/g, "'")
    .replace(/[.,!?¿¡;:"…()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripMarks(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ø/g, 'o')
    .replace(/æ/g, 'ae')
    .replace(/'/g, '');
}

function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

export interface CheckResult {
  correct: boolean;
  /** Aviso cuando se acepta con un pequeño fallo (tilde, letra especial, errata). */
  warning?: string;
}

export function checkWritten(given: string, expected: string, alts: string[] = []): CheckResult {
  const g = normalize(given);
  if (!g) return { correct: false };
  const targets = [expected, ...alts].map(normalize);
  if (targets.includes(g)) return { correct: true };

  const gs = stripMarks(g);
  if (targets.some((t) => stripMarks(t) === gs))
    return { correct: true, warning: `Casi perfecto. Fíjate en las letras especiales o apóstrofos: "${expected}".` };

  if (gs.length >= 5 && targets.some((t) => levenshtein(stripMarks(t), gs) === 1))
    return { correct: true, warning: `Lo damos por bueno, pero revisa la ortografía: "${expected}".` };

  return { correct: false };
}
