/**
 * frontend/src/utils/formatters.ts
 * Formatting utilities for currency and tool monograms.
 */

export function formatCurrency(amount: number | null | undefined, currency = 'USD'): string {
  if (amount === undefined || amount === null) {
    return currency === 'USD' ? '$0' : '₹0';
  }
  if (currency === 'INR') {
    return '₹' + amount.toLocaleString('en-IN');
  }
  return '$' + amount.toLocaleString('en-US');
}

// Backward-compatible formatRupees expected by P2 components
export function formatRupees(amount: number | null | undefined, currency = 'USD'): string {
  return formatCurrency(amount, currency);
}

export const TOOL_MARKS: Record<string, string> = {
  'Midjourney V7': 'MJ',
  'Midjourney V6': 'MJ',
  'Midjourney': 'MJ',
  'ComfyUI': 'CF',
  'Stable Diffusion XL': 'SD',
  'Stable Diffusion': 'SD',
  'Flux.1 Pro': 'FL',
  'Flux': 'FL',
  'Runway Gen-3': 'RW',
  'Runway': 'RW',
  'Krea AI': 'KR',
  'Magnific AI': 'MG',
  'Adobe Photoshop': 'PS',
  'Photoshop': 'PS',
  'Adobe Premiere': 'PR',
  'Premiere': 'PR',
  'After Effects': 'AE',
  'Blender 4.2': 'BL',
  'Blender': 'BL',
  'Cinema 4D': 'C4',
  'Topaz Video': 'TP',
  'ElevenLabs': 'EL',
};

export function getToolMark(toolName: string): string {
  if (!toolName) return 'AI';
  for (const [key, val] of Object.entries(TOOL_MARKS)) {
    if (
      toolName.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(toolName.toLowerCase())
    ) {
      return val;
    }
  }
  return toolName.slice(0, 2).toUpperCase();
}
