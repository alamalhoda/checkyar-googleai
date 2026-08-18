/**
 * Landing Page Inline SVG Vector Library
 * Abstract geometric shapes for ambient background depth.
 * Strokes use emerald / currentColor with low opacity, no heavy fills.
 */

export const landingVectors = {
  // 3-4 connected nodes representing discovery & connection marketplace
  connectionNodes: `
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-emerald-500/20">
      <circle cx="30" cy="60" r="6" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.1" />
      <circle cx="100" cy="30" r="8" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.15" />
      <circle cx="170" cy="70" r="6" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.1" />
      <circle cx="110" cy="95" r="4" stroke="currentColor" stroke-width="1.5" />
      <line x1="36" y1="57" x2="92" y2="34" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3" />
      <line x1="108" y1="34" x2="164" y2="67" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3" />
      <line x1="100" y1="38" x2="110" y2="91" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3" />
      <line x1="36" y1="62" x2="106" y2="93" stroke="currentColor" stroke-width="1" stroke-opacity="0.5" stroke-dasharray="2 2" />
    </svg>
  `,

  // Concentric decorative arcs / ring
  arcRing: `
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-emerald-400/20">
      <circle cx="100" cy="100" r="90" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 6" />
      <circle cx="100" cy="100" r="70" stroke="currentColor" stroke-width="1" stroke-opacity="0.6" />
      <path d="M 100 10 A 90 90 0 0 1 190 100" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  `,

  // Soft flowing wave line
  gridWave: `
    <svg viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-emerald-500/15">
      <path d="M0 40 Q 75 10, 150 40 T 300 40" stroke="currentColor" stroke-width="1.5" />
      <path d="M0 55 Q 75 25, 150 55 T 300 55" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" />
    </svg>
  `,

  // Abstract boundary shield outline
  abstractShield: `
    <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-emerald-400/20">
      <path d="M60 10 L105 30 V75 C105 105 60 130 60 130 C60 130 15 105 15 75 V30 L60 10 Z" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4" />
      <path d="M60 25 L90 40 V72 C90 94 60 112 60 112 C60 112 30 94 30 72 V40 L60 25 Z" stroke="currentColor" stroke-width="1" stroke-opacity="0.6" />
    </svg>
  `,

  // Abstract growth curve
  growthCurve: `
    <svg viewBox="0 0 240 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-emerald-400/20">
      <path d="M10 90 Q 90 85, 140 50 T 230 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <path d="M10 90 L 230 90" stroke="currentColor" stroke-width="1" stroke-opacity="0.4" stroke-dasharray="4 4" />
      <circle cx="230" cy="15" r="4" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.3" />
    </svg>
  `
};
