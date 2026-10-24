/**
 * Pure math and state helpers for 3D portfolio calculations and rules.
 */

export function calculateScrollProgress(scrollY: number, totalHeight: number, windowHeight: number): number {
  const maxScroll = Math.max(0, totalHeight - windowHeight);
  if (maxScroll <= 0) return 0;
  const progress = (scrollY / maxScroll) * 100;
  return Math.min(100, Math.max(0, Math.round(progress * 10) / 10));
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function calculateCubeExpansion(cubeState: number): { distance: number; glowIntensity: number; coreScale: number } {
  switch (cubeState) {
    case 1:
      // Exploded Matrix
      return { distance: 1.8, glowIntensity: 1.5, coreScale: 1.4 };
    case 2:
      // Quantum Hyperdrive / Rapid rotation state
      return { distance: 0.6, glowIntensity: 2.2, coreScale: 1.8 };
    case 3:
      // Holographic Dispersed Nebula
      return { distance: 1.4, glowIntensity: 1.0, coreScale: 1.2 };
    case 0:
    default:
      // Standard Solved Cyber Cube
      return { distance: 1.05, glowIntensity: 0.8, coreScale: 1.0 };
  }
}

export function validateDefconOverride(input: string): boolean {
  if (!input) return false;
  const cleaned = input.trim().toLowerCase();
  return cleaned === 'override' || cleaned === 'exit' || cleaned === 'unlock' || cleaned === 'admin';
}

export function getSkillStrokeOffset(percentage: number, radius = 45): number {
  const circumference = 2 * Math.PI * radius; // ~282.74
  const target = circumference - (percentage / 100) * circumference;
  return Math.round(target * 100) / 100;
}
