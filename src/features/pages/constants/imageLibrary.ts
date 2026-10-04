function svgDataUri(svg: string) {
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}

export interface LibraryImage {
  id: string
  label: string
  url: string
}

export interface LibraryCategory {
  label: string
  items: LibraryImage[]
}

/** Built-in SVG illustrations, grouped by category. */
export const IMAGE_CATEGORIES: Record<string, LibraryCategory> = {
  love: {
    label: 'Love',
    items: [
      {
        id: 'love-1',
        label: 'Heart',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs><linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff6b6b"/><stop offset="100%" style="stop-color:#ee5a24"/>
          </linearGradient></defs>
          <path d="M100 180l-12-11C44 131 20 109 20 76c0-25 20-45 45-45 16 0 31 8 35 21 4-13 19-21 35-21 25 0 45 20 45 45 0 33-24 55-68 93z" fill="url(#lg1)"/>
          <circle cx="70" cy="80" r="4" fill="#fff" opacity=".4"/>
          <circle cx="115" cy="70" r="3" fill="#fff" opacity=".3"/>
        </svg>`),
      },
      {
        id: 'love-2',
        label: 'Rose',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs><radialGradient id="rg1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#ff4757"/><stop offset="100%" style="stop-color:#c0392b"/>
          </radialGradient></defs>
          <g transform="translate(100 120)">
            <path d="M-4 0l-8 40h24z" fill="#27ae60"/>
            <path d="M-8 40h16l-4 20h-8z" fill="#2ecc71"/>
            <ellipse cx="0" cy="-40" rx="35" ry="30" fill="#ff4757" opacity=".9"/>
            <ellipse cx="-12" cy="-50" rx="20" ry="18" fill="#ff6b81" opacity=".8"/>
            <ellipse cx="10" cy="-48" rx="18" ry="16" fill="#ff4757" opacity=".7"/>
            <ellipse cx="0" cy="-55" rx="15" ry="12" fill="#ff6b81" opacity=".9"/>
            <path d="M-25-38Q-35-58-15-65" stroke="#27ae60" stroke-width="3" fill="none"/>
            <path d="M22-36Q35-55 15-62" stroke="#27ae60" stroke-width="3" fill="none"/>
          </g>
        </svg>`),
      },
      {
        id: 'love-3',
        label: 'Two Hearts',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="h1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#ff6b6b"/><stop offset="100%" style="stop-color:#ee5a24"/>
            </linearGradient>
            <linearGradient id="h2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#ff9ff3"/><stop offset="100%" style="stop-color:#f368e0"/>
            </linearGradient>
          </defs>
          <path d="M65 165C29 130 15 108 15 80c0-20 16-36 36-36 13 0 25 7 30 17 5-10 17-17 30-17 20 0 36 16 36 36 0 28-14 50-50 85z" fill="url(#h1)" opacity=".85"/>
          <path d="M140 175c-30-28-40-45-40-67 0-16 13-29 29-29 10 0 20 5 25 13 4-8 14-13 24-13 16 0 29 13 29 29 0 22-10 39-40 67z" fill="url(#h2)" opacity=".9" transform="translate(-15,-5)"/>
        </svg>`),
      },
      {
        id: 'love-4',
        label: 'Couple',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff9ff3"/><stop offset="100%" style="stop-color:#ff6b6b"/>
          </linearGradient></defs>
          <circle cx="75" cy="55" r="18" fill="#ffda79"/>
          <circle cx="125" cy="55" r="18" fill="#ffda79"/>
          <path d="M75 110c-18 0-28 18-35 35-3 7 2 15 10 15h50c8 0 13-8 10-15-7-17-17-35-35-35z" fill="#f19066"/>
          <path d="M125 110c-18 0-28 18-35 35-3 7 2 15 10 15h50c8 0 13-8 10-15-7-17-17-35-35-35z" fill="#f19066"/>
          <path d="M58 73c-2 0-4-1-5-3-2 5-7 8-13 8s-10-3-13-8c1 2-1 3-3 3-5 0-8-6-8-12 0-18 24-30 24-30s24 12 24 30c0 6-3 12-8 12z" fill="#ffda79" opacity=".5"/>
          <path d="M142 73c-2 0-4-1-5-3-2 5-7 8-13 8s-10-3-13-8c1 2-1 3-3 3-5 0-8-6-8-12 0-18 24-30 24-30s24 12 24 30c0 6-3 12-8 12z" fill="#ffda79" opacity=".5"/>
          <path d="M85 105l15-20 15 20" stroke="url(#sg)" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>`),
      },
    ],
  },
  hope: {
    label: 'Hope',
    items: [
      {
        id: 'hope-1',
        label: 'Sunrise',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs><linearGradient id="sk" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#f39c12"/><stop offset="50%" style="stop-color:#f1c40f"/>
            <stop offset="100%" style="stop-color:#e67e22"/>
          </linearGradient></defs>
          <rect width="200" height="200" fill="#2c3e50"/>
          <circle cx="100" cy="110" r="50" fill="url(#sk)" opacity=".9"/>
          <circle cx="100" cy="110" r="35" fill="#f1c40f"/>
          <path d="M0 140q20-30 50-10t50-20 50 10 50-20v70H0z" fill="#2c3e50"/>
          <path d="M100 80v-8m0 64v-8m-28-28l6 6m44 0l6-6" stroke="#f1c40f" stroke-width="2" opacity=".6"/>
        </svg>`),
      },
      {
        id: 'hope-2',
        label: 'Butterfly',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="b1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#9b59b6"/><stop offset="100%" style="stop-color:#e74c3c"/>
            </linearGradient>
            <linearGradient id="b2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#e74c3c"/><stop offset="100%" style="stop-color:#f39c12"/>
            </linearGradient>
          </defs>
          <ellipse cx="80" cy="90" rx="45" ry="35" fill="url(#b1)" opacity=".8" transform="rotate(-15 80 90)"/>
          <ellipse cx="120" cy="90" rx="45" ry="35" fill="url(#b2)" opacity=".8" transform="rotate(15 120 90)"/>
          <ellipse cx="80" cy="120" rx="30" ry="22" fill="url(#b2)" opacity=".7" transform="rotate(10 80 120)"/>
          <ellipse cx="120" cy="120" rx="30" ry="22" fill="url(#b1)" opacity=".7" transform="rotate(-10 120 120)"/>
          <rect x="98" y="60" width="4" height="80" rx="2" fill="#2c3e50"/>
          <line x1="90" y1="70" x2="75" y2="55" stroke="#2c3e50" stroke-width="2"/>
          <line x1="110" y1="70" x2="125" y2="55" stroke="#2c3e50" stroke-width="2"/>
          <circle cx="75" cy="53" r="3" fill="#2c3e50"/>
          <circle cx="125" cy="53" r="3" fill="#2c3e50"/>
        </svg>`),
      },
      {
        id: 'hope-3',
        label: 'Rainbow',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <rect width="200" height="200" fill="#87ceeb" rx="10"/>
          <path d="M20 180a80 80 0 01160 0" stroke="#e74c3c" stroke-width="10" fill="none" stroke-linecap="round"/>
          <path d="M25 180a75 75 0 01150 0" stroke="#f39c12" stroke-width="10" fill="none" stroke-linecap="round"/>
          <path d="M30 180a70 70 0 01140 0" stroke="#f1c40f" stroke-width="10" fill="none" stroke-linecap="round"/>
          <path d="M35 180a65 65 0 01130 0" stroke="#2ecc71" stroke-width="10" fill="none" stroke-linecap="round"/>
          <path d="M40 180a60 60 0 01120 0" stroke="#3498db" stroke-width="10" fill="none" stroke-linecap="round"/>
          <path d="M45 180a55 55 0 01110 0" stroke="#9b59b6" stroke-width="10" fill="none" stroke-linecap="round"/>
          <ellipse cx="100" cy="180" rx="60" ry="15" fill="#27ae60"/>
          <path d="M70 170q15-10 30 0" stroke="#fff" stroke-width="2" fill="none" opacity=".5"/>
          <path d="M100 170q15-10 30 0" stroke="#fff" stroke-width="2" fill="none" opacity=".5"/>
        </svg>`),
      },
      {
        id: 'hope-4',
        label: 'Shining Star',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <rect width="200" height="200" fill="#1a1a2e" rx="10"/>
          <circle cx="100" cy="80" r="3" fill="#fff" opacity=".8"/>
          <circle cx="50" cy="40" r="1.5" fill="#fff" opacity=".5"/>
          <circle cx="160" cy="30" r="2" fill="#fff" opacity=".6"/>
          <circle cx="30" cy="130" r="1" fill="#fff" opacity=".4"/>
          <circle cx="170" cy="150" r="1.5" fill="#fff" opacity=".5"/>
          <circle cx="70" cy="20" r="1" fill="#fff" opacity=".3"/>
          <circle cx="140" cy="170" r="1" fill="#fff" opacity=".4"/>
          <path d="M100 42v20m0-36v-8m16 8l-4 6m-24 22l-4 6m28-6l4 6m-28 10l-4 6m24-32l4-6" stroke="#f1c40f" stroke-width="2" opacity=".6"/>
          <path d="M100 50l-8-4 5-7-8 0-3-8-3 8-8 0 5 7-8 4 7 3-2 8 6-5 4 7 4-7 6 5-2-8z" fill="#f1c40f"/>
          <text x="100" y="160" text-anchor="middle" fill="#f1c40f" font-size="16" font-family="sans-serif" opacity=".8">Shine bright</text>
        </svg>`),
      },
    ],
  },
  tenderness: {
    label: 'Tenderness',
    items: [
      {
        id: 'tender-1',
        label: 'Cat',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <ellipse cx="100" cy="110" rx="55" ry="45" fill="#f8c291"/>
          <circle cx="100" cy="90" r="38" fill="#f8c291"/>
          <polygon points="70,65 55,35 80,55" fill="#f8c291"/>
          <polygon points="130,65 145,35 120,55" fill="#f8c291"/>
          <polygon points="68,63 58,40 78,55" fill="#f19066"/>
          <polygon points="132,63 142,40 122,55" fill="#f19066"/>
          <ellipse cx="85" cy="85" rx="5" ry="6" fill="#2c3e50"/>
          <ellipse cx="115" cy="85" rx="5" ry="6" fill="#2c3e50"/>
          <ellipse cx="85" cy="83" rx="2" ry="2" fill="#fff"/>
          <ellipse cx="115" cy="83" rx="2" ry="2" fill="#fff"/>
          <circle cx="100" cy="100" r="4" fill="#e15f41"/>
          <path d="M100 105q-6 8 0 12 6-4 0-12" fill="#c44569"/>
          <path d="M88 95l-6-2m18 2l6-2" stroke="#2c3e50" stroke-width="1.5" opacity=".4"/>
          <path d="M55 115q-15 5-25 15" stroke="#2c3e50" stroke-width="2" fill="none" opacity=".4"/>
          <path d="M145 115q15 5 25 15" stroke="#2c3e50" stroke-width="2" fill="none" opacity=".4"/>
        </svg>`),
      },
      {
        id: 'tender-2',
        label: 'Teddy Bear',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <circle cx="70" cy="50" r="20" fill="#c68f5e"/>
          <circle cx="130" cy="50" r="20" fill="#c68f5e"/>
          <circle cx="70" cy="45" r="8" fill="#e8b87a"/>
          <circle cx="130" cy="45" r="8" fill="#e8b87a"/>
          <circle cx="100" cy="75" r="30" fill="#d4a574"/>
          <circle cx="100" cy="85" r="35" fill="#c68f5e"/>
          <ellipse cx="100" cy="130" rx="50" ry="55" fill="#d4a574"/>
          <ellipse cx="100" cy="150" rx="40" ry="30" fill="#c68f5e"/>
          <ellipse cx="75" cy="120" rx="20" ry="35" fill="#d4a574" transform="rotate(25 75 120)"/>
          <ellipse cx="125" cy="120" rx="20" ry="35" fill="#d4a574" transform="rotate(-25 125 120)"/>
          <circle cx="88" cy="78" r="4" fill="#2c3e50"/>
          <circle cx="112" cy="78" r="4" fill="#2c3e50"/>
          <ellipse cx="88" cy="76" rx="1.5" ry="1.5" fill="#fff"/>
          <ellipse cx="112" cy="76" rx="1.5" ry="1.5" fill="#fff"/>
          <circle cx="100" cy="88" r="5" fill="#2c3e50"/>
          <ellipse cx="100" cy="95" rx="5" ry="3" fill="#2c3e50"/>
        </svg>`),
      },
      {
        id: 'tender-3',
        label: 'Hug',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs><linearGradient id="hp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff9ff3"/><stop offset="100%" style="stop-color:#f368e0"/>
          </linearGradient></defs>
          <circle cx="80" cy="70" r="20" fill="#ffda79"/>
          <circle cx="120" cy="70" r="20" fill="#ffda79"/>
          <path d="M70 115c-12 0-20 12-25 25-2 5 2 10 8 10h44c6 0 10-5 8-10-5-13-13-25-25-25z" fill="#f19066"/>
          <path d="M130 115c-12 0-20 12-25 25-2 5 2 10 8 10h44c6 0 10-5 8-10-5-13-13-25-25-25z" fill="#f19066"/>
          <path d="M90 100q10-15 20 0" stroke="#ff6b6b" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M50 90q-30 20-15 50" stroke="url(#hp)" stroke-width="15" fill="none" stroke-linecap="round" opacity=".6"/>
          <path d="M150 90q30 20 15 50" stroke="url(#hp)" stroke-width="15" fill="none" stroke-linecap="round" opacity=".6"/>
          <path d="M55 85l6 6m6-10l4 8" stroke="#ff6b6b" stroke-width="2" opacity=".5"/>
          <path d="M145 85l-6 6m-6-10l-4 8" stroke="#ff6b6b" stroke-width="2" opacity=".5"/>
        </svg>`),
      },
      {
        id: 'tender-4',
        label: 'Bunny',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <ellipse cx="100" cy="120" rx="50" ry="45" fill="#fff" opacity=".95"/>
          <ellipse cx="100" cy="80" rx="35" ry="30" fill="#fff" opacity=".95"/>
          <ellipse cx="65" cy="45" rx="12" ry="28" fill="#fff" transform="rotate(-15 65 45)" opacity=".9"/>
          <ellipse cx="62" cy="48" rx="6" ry="18" fill="#ffd1dc" transform="rotate(-15 62 48)" opacity=".6"/>
          <ellipse cx="135" cy="45" rx="12" ry="28" fill="#fff" transform="rotate(15 135 45)" opacity=".9"/>
          <ellipse cx="138" cy="48" rx="6" ry="18" fill="#ffd1dc" transform="rotate(15 138 48)" opacity=".6"/>
          <circle cx="88" cy="75" r="4" fill="#2c3e50"/>
          <circle cx="112" cy="75" r="4" fill="#2c3e50"/>
          <circle cx="89" cy="73" r="1.5" fill="#fff"/>
          <circle cx="113" cy="73" r="1.5" fill="#fff"/>
          <ellipse cx="100" cy="82" rx="3" ry="2" fill="#ff6b6b"/>
          <path d="M95 87q5 5 10 0" stroke="#2c3e50" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M82 90q-6 4-12 2m30 0q-4 4 2 8" stroke="#2c3e50" stroke-width="1.5" fill="none" opacity=".3"/>
          <circle cx="100" cy="145" r="15" fill="#fff" opacity=".7"/>
        </svg>`),
      },
    ],
  },
  gratitude: {
    label: 'Gratitude',
    items: [
      {
        id: 'grat-1',
        label: 'Hands & Heart',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs><linearGradient id="hh" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff6b6b"/><stop offset="100%" style="stop-color:#c0392b"/>
          </linearGradient></defs>
          <path d="M45 140c-8-10-12-25-5-35 8-12 25-8 28-4-3-12 2-28 15-30 15-2 20 12 18 24" stroke="#f19066" stroke-width="10" fill="none" stroke-linecap="round"/>
          <path d="M155 140c8-10 12-25 5-35-8-12-25-8-28-4 3-12-2-28-15-30-15-2-20 12-18 24" stroke="#f19066" stroke-width="10" fill="none" stroke-linecap="round"/>
          <path d="M100 175c-20-18-30-30-30-46 0-12 8-22 20-22 7 0 10 3 10 3s3-3 10-3c12 0 20 10 20 22 0 16-10 28-30 46z" fill="url(#hh)"/>
          <circle cx="92" cy="135" r="2" fill="#fff" opacity=".4"/>
          <circle cx="108" cy="130" r="1.5" fill="#fff" opacity=".3"/>
        </svg>`),
      },
      {
        id: 'grat-2',
        label: 'Prayer',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs><linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f1c40f"/><stop offset="100%" style="stop-color:#f39c12"/>
          </linearGradient></defs>
          <circle cx="100" cy="55" r="22" fill="#ffda79"/>
          <path d="M65 95l20 10 15-10 15 10 20-10" fill="none" stroke="#f19066" stroke-width="8" stroke-linecap="round"/>
          <path d="M65 95c-12 30-8 60 35 75" fill="none" stroke="#f19066" stroke-width="8" stroke-linecap="round"/>
          <path d="M135 95c12 30 8 60-35 75" fill="none" stroke="#f19066" stroke-width="8" stroke-linecap="round"/>
          <circle cx="100" cy="155" r="15" fill="url(#pg)" opacity=".3"/>
          <path d="M95 150l5-10 5 10" fill="none" stroke="url(#pg)" stroke-width="2" stroke-linecap="round"/>
          <circle cx="100" cy="145" r="20" fill="url(#pg)" opacity=".15"/>
          <ellipse cx="90" cy="50" rx="2" ry="3" fill="#2c3e50"/>
          <ellipse cx="110" cy="50" rx="2" ry="3" fill="#2c3e50"/>
        </svg>`),
      },
      {
        id: 'grat-3',
        label: 'Gift Box',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <rect x="45" y="80" width="110" height="90" rx="5" fill="#e74c3c"/>
          <rect x="45" y="80" width="110" height="20" rx="3" fill="#c0392b"/>
          <rect x="90" y="80" width="20" height="90" fill="#c0392b" opacity=".5"/>
          <path d="M100 65q-20-25-45-15-5 2-8 7" fill="none" stroke="#f1c40f" stroke-width="6" stroke-linecap="round"/>
          <path d="M100 65q20-25 45-15 5 2 8 7" fill="none" stroke="#f1c40f" stroke-width="6" stroke-linecap="round"/>
          <ellipse cx="100" cy="52" rx="25" ry="12" fill="none" stroke="#f1c40f" stroke-width="4"/>
          <circle cx="100" cy="52" r="6" fill="#f1c40f"/>
          <path d="M70 110h60m-60 20h50m-40 20h30" stroke="#fff" stroke-width="2" opacity=".3" stroke-linecap="round"/>
        </svg>`),
      },
      {
        id: 'grat-4',
        label: 'Thank You Ribbon',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs><linearGradient id="rb" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3498db"/><stop offset="100%" style="stop-color:#9b59b6"/>
          </linearGradient></defs>
          <rect x="20" y="100" width="160" height="50" rx="10" fill="url(#rb)"/>
          <rect x="20" y="100" width="160" height="50" rx="10" fill="none" stroke="#fff" stroke-width="2" opacity=".3"/>
          <text x="100" y="133" text-anchor="middle" fill="#fff" font-size="24" font-family="Georgia, serif" font-weight="bold">Thank You</text>
          <path d="M12 100l-8 25 8 25" stroke="url(#rb)" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M188 100l8 25-8 25" stroke="url(#rb)" stroke-width="6" fill="none" stroke-linecap="round"/>
          <circle cx="8" cy="100" r="6" fill="#3498db"/>
          <circle cx="192" cy="100" r="6" fill="#9b59b6"/>
          <circle cx="8" cy="150" r="6" fill="#9b59b6"/>
          <circle cx="192" cy="150" r="6" fill="#3498db"/>
          <path d="M30 88l-6 12m-6-6l12 6" stroke="#f1c40f" stroke-width="2" opacity=".6"/>
          <path d="M170 162l6-12m6 6l-12-6" stroke="#f1c40f" stroke-width="2" opacity=".6"/>
        </svg>`),
      },
    ],
  },
  gastronomia: {
    label: 'Gastronomía',
    items: [
      {
        id: 'gastro-1',
        label: 'Plato principal',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs><radialGradient id="pg1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#fef3c7"/><stop offset="100%" style="stop-color:#f59e0b"/>
          </radialGradient></defs>
          <ellipse cx="100" cy="120" rx="80" ry="30" fill="#d1d5db" opacity=".3"/>
          <ellipse cx="100" cy="110" rx="80" ry="30" fill="#e5e7eb"/>
          <ellipse cx="100" cy="105" rx="75" ry="27" fill="#f3f4f6"/>
          <ellipse cx="100" cy="100" rx="70" ry="25" fill="#fefce8"/>
          <circle cx="80" cy="95" r="12" fill="#dc2626" opacity=".9"/>
          <circle cx="100" cy="90" r="10" fill="#ef4444" opacity=".8"/>
          <circle cx="118" cy="95" r="11" fill="#dc2626" opacity=".85"/>
          <path d="M75 100q25-15 50 0" stroke="#16a34a" stroke-width="3" fill="none"/>
          <path d="M85 105q15-8 30 0" stroke="#22c55e" stroke-width="2" fill="none"/>
          <ellipse cx="100" cy="108" rx="20" ry="5" fill="#fbbf24" opacity=".6"/>
        </svg>`),
      },
      {
        id: 'gastro-2',
        label: 'Copa de vino',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs><linearGradient id="wg1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#9f1239"/><stop offset="100%" style="stop-color:#881337"/>
          </linearGradient></defs>
          <path d="M85 30h30l-5 70q0 15-10 15-10 0-10-15z" fill="url(#wg1)" opacity=".9"/>
          <path d="M82 30q-8 10-8 30 0 20 8 30v10h44v-10q8-10 8-30 0-20-8-30z" fill="none" stroke="#d4d4d8" stroke-width="2"/>
          <ellipse cx="100" cy="30" rx="15" ry="4" fill="#9f1239" opacity=".6"/>
          <rect x="97" y="110" width="6" height="40" rx="3" fill="#d4d4d8"/>
          <ellipse cx="100" cy="155" rx="25" ry="6" fill="#d4d4d8"/>
          <circle cx="92" cy="50" r="2" fill="#fff" opacity=".3"/>
          <circle cx="105" cy="45" r="1.5" fill="#fff" opacity=".2"/>
        </svg>`),
      },
      {
        id: 'gastro-3',
        label: 'Tenedor y cuchillo',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <rect x="80" y="20" width="4" height="120" rx="2" fill="#a8a29e" transform="rotate(-15 82 80)"/>
          <path d="M76 20q-4-10 2-15 6 5 2 15z" fill="#a8a29e" transform="rotate(-15 80 20)"/>
          <path d="M80 20q0-10 2-10 2 0 2 10z" fill="#a8a29e" transform="rotate(-15 82 20)"/>
          <path d="M84 20q4-10-2-15-6 5-2 15z" fill="#a8a29e" transform="rotate(-15 84 20)"/>
          <rect x="116" y="20" width="4" height="120" rx="2" fill="#d4d4d8" transform="rotate(15 118 80)"/>
          <path d="M112 20q-6 20 2 30 0-10 6-30z" fill="#d4d4d8" transform="rotate(15 116 20)"/>
          <path d="M118 20q6 20-2 30 0-10-6-30z" fill="#d4d4d8" transform="rotate(15 118 20)"/>
          <ellipse cx="100" cy="165" rx="30" ry="8" fill="#d4d4d8"/>
        </svg>`),
      },
      {
        id: 'gastro-4',
        label: 'Postre',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <rect x="60" y="80" width="80" height="70" rx="5" fill="#fbbf24"/>
          <rect x="55" y="75" width="90" height="15" rx="7" fill="#f59e0b"/>
          <path d="M60 80q40-20 80 0" fill="#fef3c7"/>
          <circle cx="80" cy="72" r="8" fill="#dc2626"/>
          <circle cx="100" cy="68" r="9" fill="#ef4444"/>
          <circle cx="120" cy="72" r="8" fill="#dc2626"/>
          <path d="M78 65q2-8 4-12M98 61q2-8 4-12M118 65q2-8 4-12" stroke="#16a34a" stroke-width="2" fill="none"/>
          <rect x="65" y="150" width="70" height="8" rx="4" fill="#d4d5db"/>
        </svg>`),
      },
      {
        id: 'gastro-5',
        label: 'Café',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs><linearGradient id="cg1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#78350f"/><stop offset="100%" style="stop-color:#451a03"/>
          </linearGradient></defs>
          <path d="M55 60h90l-10 90q-2 10-12 10H77q-10 0-12-10z" fill="url(#cg1)"/>
          <ellipse cx="100" cy="60" rx="45" ry="8" fill="#92400e"/>
          <ellipse cx="100" cy="60" rx="40" ry="6" fill="#78350f"/>
          <path d="M145 75q20 0 20 15t-20 15" fill="none" stroke="#a8a29e" stroke-width="4"/>
          <path d="M85 45q0-15 5-20" stroke="#d6d3d1" stroke-width="2" fill="none" opacity=".5"/>
          <path d="M100 40q0-18 5-25" stroke="#d6d3d1" stroke-width="2" fill="none" opacity=".4"/>
          <path d="M115 45q0-15 5-20" stroke="#d6d3d1" stroke-width="2" fill="none" opacity=".5"/>
          <ellipse cx="100" cy="175" rx="35" ry="5" fill="#d4d5db"/>
        </svg>`),
      },
      {
        id: 'gastro-6',
        label: 'Hamburguesa',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <ellipse cx="100" cy="80" rx="55" ry="20" fill="#d97706"/>
          <ellipse cx="100" cy="75" rx="50" ry="18" fill="#f59e0b"/>
          <path d="M52 82q48 8 96 0" fill="#fbbf24" opacity=".5"/>
          <circle cx="70" cy="78" r="2" fill="#fef3c7" opacity=".6"/>
          <circle cx="90" cy="75" r="1.5" fill="#fef3c7" opacity=".5"/>
          <circle cx="115" cy="77" r="2" fill="#fef3c7" opacity=".6"/>
          <rect x="50" y="90" width="100" height="15" rx="3" fill="#16a34a"/>
          <rect x="48" y="105" width="104" height="18" rx="4" fill="#92400e"/>
          <rect x="50" y="123" width="100" height="12" rx="3" fill="#fbbf24" opacity=".8"/>
          <ellipse cx="100" cy="140" rx="55" ry="15" fill="#d97706"/>
          <ellipse cx="100" cy="138" rx="50" ry="13" fill="#f59e0b"/>
        </svg>`),
      },
      {
        id: 'gastro-7',
        label: 'Pizza',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <path d="M100 30L30 170q0 10 10 10h120q10 0 10-10z" fill="#f59e0b"/>
          <path d="M100 30L35 165q0 8 8 8h114q8 0 8-8z" fill="#fbbf24"/>
          <circle cx="80" cy="100" r="8" fill="#dc2626"/>
          <circle cx="110" cy="120" r="9" fill="#dc2626"/>
          <circle cx="90" cy="140" r="7" fill="#dc2626"/>
          <circle cx="100" cy="80" r="6" fill="#16a34a" opacity=".8"/>
          <circle cx="120" cy="100" r="5" fill="#16a34a" opacity=".8"/>
          <circle cx="75" cy="130" r="5" fill="#16a34a" opacity=".8"/>
          <circle cx="95" cy="110" r="4" fill="#f97316" opacity=".7"/>
          <circle cx="115" cy="145" r="4" fill="#f97316" opacity=".7"/>
        </svg>`),
      },
      {
        id: 'gastro-8',
        label: 'Sushi',
        url: svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <ellipse cx="100" cy="130" rx="70" ry="15" fill="#1c1917"/>
          <ellipse cx="100" cy="128" rx="65" ry="13" fill="#292524"/>
          <ellipse cx="70" cy="100" rx="22" ry="12" fill="#fff" opacity=".95"/>
          <ellipse cx="70" cy="98" rx="20" ry="10" fill="#1c1917"/>
          <ellipse cx="70" cy="96" rx="18" ry="8" fill="#ef4444" opacity=".9"/>
          <ellipse cx="100" cy="95" rx="22" ry="12" fill="#fff" opacity=".95"/>
          <ellipse cx="100" cy="93" rx="20" ry="10" fill="#1c1917"/>
          <ellipse cx="100" cy="91" rx="18" ry="8" fill="#f97316" opacity=".9"/>
          <ellipse cx="130" cy="100" rx="22" ry="12" fill="#fff" opacity=".95"/>
          <ellipse cx="130" cy="98" rx="20" ry="10" fill="#1c1917"/>
          <ellipse cx="130" cy="96" rx="18" ry="8" fill="#22c55e" opacity=".9"/>
          <path d="M40 145h120" stroke="#78716c" stroke-width="1" opacity=".3"/>
        </svg>`),
      },
    ],
  },
}
