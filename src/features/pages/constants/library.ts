export const LOVE_PHRASES = [
  'Te amo',
  'Eres mi todo',
  'Mi amor eterno',
  'Siempre juntos',
  'Corazón mío',
  'Eres mi vida',
  'Te quiero',
  'Para siempre',
  'Mi media naranja',
  'Amor infinito',
  'Eres única',
  'Contigo siempre',
  'Mi razón de ser',
  'Te adoro',
  'Eres mi sol',
]

export interface AnimationPreset {
  /** Keyframes name defined in style.css */
  id: string
  label: string
  emoji: string
  color: string
  fontSize: number
}

export const ANIMATIONS: AnimationPreset[] = [
  { id: 'float-heart', label: 'Heart float', emoji: '💖', color: '#ef4444', fontSize: 56 },
  { id: 'spin-star', label: 'Spinning star', emoji: '⭐', color: '#fbbf24', fontSize: 52 },
  { id: 'pulse-heart', label: 'Pulse heart', emoji: '❤️', color: '#dc2626', fontSize: 56 },
  { id: 'bounce-circle', label: 'Bouncing ball', emoji: '🔴', color: '#ef4444', fontSize: 48 },
  { id: 'twinkle-star', label: 'Twinkling star', emoji: '✨', color: '#facc15', fontSize: 52 },
  { id: 'drift-cloud', label: 'Floating cloud', emoji: '☁️', color: '#94a3b8', fontSize: 52 },
  { id: 'float-flower', label: 'Floating flower', emoji: '🌸', color: '#f472b6', fontSize: 52 },
  { id: 'spin-moon', label: 'Spinning moon', emoji: '🌙', color: '#fbbf24', fontSize: 52 },
]

export const SOLID_BACKGROUNDS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b', '#1e293b',
  '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#2563eb', '#7c3aed', '#db2777', '#475569', '#0f172a',
]

export const PASTEL_BACKGROUNDS = [
  '#fce4ec', '#f3e5f5', '#e8eaf6', '#e3f2fd', '#e0f7fa', '#e0f2f1', '#e8f5e9', '#fff9c4',
  '#fff3e0', '#fbe9e7', '#f1f8e9', '#fff8e1', '#e1f5fe',
]

export const GRADIENT_BACKGROUNDS = [
  { label: 'Purple Blue', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', darkText: false },
  { label: 'Pink Red', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', darkText: false },
  { label: 'Blue Cyan', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', darkText: false },
  { label: 'Green Teal', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', darkText: false },
  { label: 'Pink Yellow', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', darkText: false },
  { label: 'Lavender', value: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', darkText: false },
  { label: 'Peach', value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', darkText: false },
  { label: 'Sky Blue', value: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', darkText: false },
  { label: 'Cream Sky', value: 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)', darkText: true },
  { label: 'Silver', value: 'linear-gradient(135deg, #c3cfe2 0%, #f5f7fa 100%)', darkText: true },
  { label: 'Sunset', value: 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)', darkText: false },
  { label: 'Ocean', value: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', darkText: false },
]

export const FONT_FAMILIES = [
  { value: 'sans-serif', label: 'Sans-serif' },
  { value: 'serif', label: 'Serif' },
  { value: 'monospace', label: 'Monospace' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Impact', label: 'Impact' },
  { value: 'Comic Sans MS', label: 'Comic Sans' },
  { value: 'cursive', label: 'Cursive' },
  { value: 'fantasy', label: 'Fantasy' },
]
