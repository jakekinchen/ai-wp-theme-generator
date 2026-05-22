function channel(value: number): number {
  const normalized = value / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

function hexToRgb(hex: string): [number, number, number] {
  return [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16)) as [number, number, number];
}

export function contrastRatio(a: string, b: string): number {
  const [ar, ag, ab] = hexToRgb(a).map(channel);
  const [br, bg, bb] = hexToRgb(b).map(channel);
  const luminanceA = 0.2126 * ar + 0.7152 * ag + 0.0722 * ab;
  const luminanceB = 0.2126 * br + 0.7152 * bg + 0.0722 * bb;
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
}
