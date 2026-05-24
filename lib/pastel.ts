/**
 * Pastel colors at chart-saturation (~70% lightness).
 * Used for donut segments and stacked bars where pale background
 * pastels (`--pastel-*` tokens) would read as off-white.
 */
export interface PastelHue {
  bg: string;   // segment / bar color
  ink: string;  // matching dark text color
  name: string;
}

export const PASTEL_CHART_RAMP: PastelHue[] = [
  { bg: "hsl(345 65% 76%)", ink: "hsl(345 55% 35%)", name: "pink" },
  { bg: "hsl(275 50% 76%)", ink: "hsl(275 45% 38%)", name: "lav" },
  { bg: "hsl(150 45% 70%)", ink: "hsl(155 45% 28%)", name: "mint" },
  { bg: "hsl(210 60% 76%)", ink: "hsl(215 55% 35%)", name: "sky" },
  { bg: "hsl(45 75% 72%)",  ink: "hsl(35 60% 32%)",  name: "butter" },
  { bg: "hsl(20 75% 76%)",  ink: "hsl(18 55% 35%)",  name: "peach" },
  { bg: "hsl(180 40% 70%)", ink: "hsl(180 40% 28%)", name: "teal" },
  { bg: "hsl(310 45% 78%)", ink: "hsl(310 40% 35%)", name: "rose" },
  { bg: "hsl(95 40% 72%)",  ink: "hsl(100 40% 28%)", name: "olive" },
  { bg: "hsl(240 35% 80%)", ink: "hsl(240 35% 38%)", name: "indigo" },
];

export const pastelAt = (i: number): PastelHue => PASTEL_CHART_RAMP[i % PASTEL_CHART_RAMP.length];
