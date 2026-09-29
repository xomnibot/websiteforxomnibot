/**
 * Maps content fields (writeup difficulty, research severity, project status)
 * to a `<Badge tone>` value, per the design system's status-color rule:
 * easy/low -> green, medium -> amber, hard/high -> orange, insane/critical -> red.
 */
import type { BadgeTone } from '@/components/ui/Badge.astro';

export function difficultyTone(difficulty?: string): BadgeTone {
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

export function severityTone(severity?: string): BadgeTone {
  switch (severity) {
    case 'Low':
      return 'green';
    case 'Medium':
      return 'amber';
    case 'High':
      return 'orange';
    case 'Critical':
      return 'red';
    default:
      return 'neutral';
  }
}

export function statusTone(status?: string): BadgeTone {
  switch (status) {
    case 'active':
      return 'green';
    case 'wip':
      return 'amber';
    case 'archived':
      return 'neutral';
    default:
      return 'neutral';
  }
}
