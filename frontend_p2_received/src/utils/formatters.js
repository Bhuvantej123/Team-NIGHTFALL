/**
 * Utility formatters matching the Colophon Design Master Plan
 */

// Formats prices using Indian grouping (e.g. ₹1,25,000)
export function formatRupees(amount) {
  if (amount === undefined || amount === null) return '₹0';
  return '₹' + amount.toLocaleString('en-IN');
}

// Tool monogram mapping (two-letter mono mark in a 20px rounded square)
export const TOOL_MARKS = {
  'Midjourney V7': 'MJ',
  'Midjourney V6': 'MJ',
  'ComfyUI': 'CF',
  'Stable Diffusion XL': 'SD',
  'Flux.1 Pro': 'FL',
  'Runway Gen-3': 'RW',
  'Krea AI': 'KR',
  'Magnific AI': 'MG',
  'Adobe Photoshop': 'PS',
  'Adobe Premiere': 'PR',
  'After Effects': 'AE',
  'Blender 4.2': 'BL',
  'Cinema 4D': 'C4',
  'Topaz Video': 'TP',
  'ElevenLabs': 'EL',
};

export function getToolMark(toolName) {
  for (const [key, val] of Object.entries(TOOL_MARKS)) {
    if (toolName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(toolName.toLowerCase())) {
      return val;
    }
  }
  // Fallback: first 2 characters uppercased
  return toolName.slice(0, 2).toUpperCase();
}
