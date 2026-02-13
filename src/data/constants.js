// === GLOBAL ELEMENTS ===

export const DEFAULT_ELEMENT = 'electricity';

// === LION · CORE STYLIZED ===
// Visual / symbolic forms only

export const LION_STYLIZED = {
  east_asian: '獅子', // shared ideogram (JAPAN Kanji / CHINA simplified & traditional / KOREAN hanja)
  japanese_modern: 'ライオン', // katakana
  korean: '사자', // hangul
  greek_classical: 'λέων',
  zodiac: '♌︎',
};

// === ELEMENTS (unified structure) ===

export const ELEMENTS = {
  electricity: {
    name: 'Thunder',
    kanji: '雷',
    picture: '/img/elements/lightning.svg',
    colors: {
      main: '#4FC3F7',
      second: '#8FAFC4',
      third: '#2E4A5C',
    },
    title: '雷の獅子 (Kaminari no Shishi) – Guardian of Storms',
    text: 'The Thunder Lion embodies raw power and unmatched speed. With its crackling electric mane and glowing blue eyes, it represents the untamed force of storms. A celestial predator born from lightning, it symbolizes strength, energy, and fearless momentum.',
  },

  fire: {
    name: 'Fire',
    kanji: '火',
    picture: '/img/elements/fire.svg',
    colors: {
      main: '#E53935',
      second: '#F28B82',
      third: '#6A1B1A',
    },
    title: '炎の獅子 (Honō no Shishi) – Avatar of Flames',
    text: 'The Fire Lion embodies fury, rebirth, and relentless intensity. Its burning gaze and blazing mane radiate destructive power and renewal. Born from eternal flames, it symbolizes passion, dominance, and the unstoppable will to rise from ashes.',
  },

  water: {
    name: 'Water',
    kanji: '水',
    picture: '/img/elements/water.svg',
    colors: {
      main: '#29B6F6',
      second: '#81D4FA',
      third: '#1C3D5A',
    },
    title: '水の獅子 (Mizu no Shishi) – Sovereign of Tides',
    text: 'The Water Lion flows with calm authority and hidden ferocity. Its luminous eyes mirror the depths of the ocean, concealing immense power. It symbolizes wisdom, adaptability, and overwhelming strength restrained beneath a tranquil surface.',
  },

  nature: {
    name: 'Nature',
    kanji: '自然',
    picture: '/img/elements/nature.svg',
    colors: {
      main: '#6FB98F',
      second: '#A8D5BA',
      third: '#3B5D4A',
    },
    title: '大地の獅子 (Daichi no Shishi) – Heart of the Wild',
    text: 'The Nature Lion stands as the living bond between earth and life. Formed from stone, roots, and soil, its ancient gaze holds timeless wisdom. It represents balance, resilience, harmony, and the primal force of endless growth shaping the natural world.',
  },

  wind: {
    name: 'Wind',
    kanji: '風',
    picture: '/img/elements/wind.svg',
    colors: {
      main: '#A5E1DA',
      second: '#D6F3EE',
      third: '#4F7F7A',
    },
    title: '風の獅子 (Kaze no Shishi) – Spirit of Freedom',
    text: 'The Wind Lion moves unseen across the skies, swift and untouchable. Its sharp eyes follow endless horizons, striking with flawless precision. It embodies freedom, speed, agility, and the invisible force that shapes motion, change, and destiny.',
  },

  ice: {
    name: 'Ice',
    kanji: '氷',
    picture: '/img/elements/ice.svg',
    colors: {
      main: '#9ADCF7',
      second: '#D8F1FB',
      third: '#355F7C',
    },
    title: '氷の獅子 (Kōri no Shishi) – Eternal Frost',
    text: 'The Ice Lion rules with silent, unyielding authority. Its frozen gaze seems to halt time itself, radiating absolute calm and clarity. Born of eternal cold, it symbolizes discipline, endurance, patience, and perfect control beyond emotion.',
  },

  shadow: {
    name: 'Shadow',
    kanji: '影',
    picture: '/img/elements/shadow.svg',
    colors: {
      main: '#9C8FDB',
      second: '#C6BFEF',
      third: '#3A355C',
    },
    title: '影の獅子 (Kage no Shishi) – Warden of the Void',
    text: 'The Shadow Lion dwells between light and nothingness. Its glowing eyes pierce absolute darkness, commanding unseen and forbidden forces. It represents mystery, inner dominance, silent power, and mastery over fear, secrets, and the unknown.',
  },
};

// === LION TRANSLATIONS ===

export const LION_TRAD_TAB = [
  // Western / European
  'lion',
  'león',
  'leão',
  'leone',
  'löwe',
  'leo',

  // Greek & Ancient Europe
  'λέων',

  // Asian
  'shīzi',
  'shishi',
  'raion',
  'saja',
  'simha',
  '사자',

  // Scientific
  'panthera leo',

  // Symbolic / mythological
  'king of beasts',
  'solar beast',
  'guardian lion',
  'celestial lion',
  'primal sovereign',
  'crown of nature',
  'avatar of dominance',
  'eternal guardian',
  'embodiment of power',
  'beast of balance',
  'sentinel of the elements',
];
