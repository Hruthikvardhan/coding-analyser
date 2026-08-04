// Lightweight client-side helpers for displaying scores.
// The authoritative calculation happens on the backend (services/scoreCalculator.js);
// this file only formats/labels values already returned by the API.

export function scoreLabel(score) {
  if (score >= 85) return { label: 'Elite', color: '#2DD4BF' };
  if (score >= 65) return { label: 'Strong', color: '#F2B705' };
  if (score >= 40) return { label: 'Growing', color: '#8B7FD1' };
  return { label: 'Getting started', color: '#F0654F' };
}

export function formatScore(score) {
  if (score === null || score === undefined) return '—';
  return Math.round(score * 10) / 10;
}

export function toPercent(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 1000) / 10;
}
