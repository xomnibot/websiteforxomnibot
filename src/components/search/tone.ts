/**
 * Small local mirror of `src/lib/badges.ts` + `Badge.astro`'s tone classes,
 * for the difficulty/CVE chip in a result row. Not imported from `@/lib/badges`
 * because that module's type comes from a `.astro` file's frontmatter export —
 * kept fully self-contained here since this ships in the client bundle.
 */

export type Tone = 'neutral' | 'accent' | 'green' | 'amber' | 'orange' | 'red' | 'blue';

export const toneClasses: Record<Tone, string> = {
  neutral: 'border-line bg-surface text-muted',
  accent: 'border-accent/30 bg-accent/10 text-accent',
  green: 'border-green/30 bg-green/10 text-green',
  amber: 'border-amber/30 bg-amber/10 text-amber',
  orange: 'border-orange/30 bg-orange/10 text-orange',
  red: 'border-red/30 bg-red/10 text-red',
  blue: 'border-blue/30 bg-blue/10 text-blue',
};

export function difficultyTone(difficulty?: string): Tone {
  switch (difficulty) {
    case 'Easy':
      return 'green';
    case 'Medium':
      return 'amber';
    case 'Hard':
      return 'orange';
    case 'Insane':
      return 'red';
    default:
      return 'neutral';
  }
}
