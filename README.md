# 🦁 Elemental Lions

An immersive, Awwwards-level single-page experience featuring 7 elemental lions. ⚡ Step into a dark cinematic world powered by Three.js, where each lion embodies a primal force of nature. 🌌

---

# ✨ Table of Contents

- [Introduction](#%EF%B8%8F-introduction)
- [Inspiration](#-inspiration)
- [Features](#-features)
- [The Seven Lions](#-the-seven-lions)
- [Getting Started](#-getting-started)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Site URL](#-site-url)
- [License](#-license)
- [Contact](#%EF%B8%8F-contact)
- [Author](#-author)

---

## ⛩️ Introduction

Hey 👋🏻, this is **Elemental Lions** — a showcase of modern web technologies combined with stunning visual effects. Each lion represents a primal element — Thunder, Fire, Water, Nature, Wind, Ice, and Shadow — brought to life through WebGL-powered 3D scenes and cinematic post-processing effects. 🎬

A premium dark aesthetic infused with Japanese cultural references. 🇯🇵

## 🌠 Inspiration

This project is born from a fascination with elemental symbolism 🔥💧⚡ and a love for cinematic web experiences 🎥. Inspired by Awwwards-winning websites, Japanese mythology, and the majestic aura of lions 🦁, the goal was to create something immersive, visually stunning, and unforgettable ✨.

## 🐲 Features

- **Immersive 3D Experience:** Full-screen WebGL canvas with Three.js rendering. 🎮
- **7 Elemental Lions:** Each with unique particles, colors, and atmospheric effects. 🌀
- **Post-Processing Effects:** Bloom, vignette, and chromatic aberration for that cinematic feel. 🎬
- **Loading Screen:** Animated kanji sequence cycling through 獅子, 사자, λέων, ♌︎. ⏳
- **Smooth Transitions:** Elegant crossfade animations between elements with glitch text effects. 🔄
- **Custom Cursor:** Smooth lerped cursor that adapts to the current element. 🖱️
- **Keyboard Navigation:** Use arrow keys to switch between lions. ⌨️
- **Responsive Design:** Optimized for all screen sizes with portrait orientation warning. 📱
- **Premium Dark Aesthetic:** Cinematic visual design with Japanese typography. 🖤

## 🐉 The Seven Lions

| Element | Kanji | Japanese | Title |
|---------|-------|----------|-------|
| ⚡ Thunder | 雷 | Kaminari no Shishi | Guardian of Storms |
| 🔥 Fire | 火 | Honō no Shishi | Avatar of Flames |
| 💧 Water | 水 | Mizu no Shishi | Sovereign of Tides |
| 🌿 Nature | 自然 | Daichi no Shishi | Heart of the Wild |
| 🌀 Wind | 風 | Kaze no Shishi | Spirit of Freedom |
| ❄️ Ice | 氷 | Kōri no Shishi | Eternal Frost |
| 🌑 Shadow | 影 | Kage no Shishi | Warden of the Void |

## 🦾 Getting Started

1. ⚔️ **Clone:**
   Clone this repository locally with `git clone`.

```bash
git clone [repository-url]
```

2. 🛡️ **Dependencies:**
   Install dependencies with `npm install` or `npm i`.

```bash
npm i
```

3. 🏹 **Launch:**
   Start the project with `npm run dev`.

```bash
npm run dev
```

4. 🌐 **Open:**
   Visit `http://localhost:3000` in your browser.

## 🎴 Technologies Used

- ⚛️ [**Next.js**](https://nextjs.org/) — React framework for production.
- ⚛️ [**React**](https://reactjs.org/) — JavaScript library for building user interfaces.
- 🎲 [**Three.js**](https://threejs.org/) — 3D graphics library for WebGL rendering.
- 🎲 [**React Three Fiber**](https://docs.pmnd.rs/react-three-fiber) — React renderer for Three.js.
- 🎲 [**React Three Drei**](https://github.com/pmndrs/drei) — Useful helpers for R3F.
- 🎲 [**React Three Postprocessing**](https://github.com/pmndrs/react-postprocessing) — Post-processing effects (bloom, vignette, chromatic aberration).
- 🎬 [**GSAP**](https://greensock.com/gsap/) — A powerful JavaScript animation library.
- 🎨 [**Sass**](https://sass-lang.com/) — CSS extension language for maintainable styles.

---

## 🗂️ Project Structure

```
/
├── public/
│   └── img/
│       ├── background/             # 7 Lion PNG illustrations
│       ├── elements/               # 7 Element SVG icons
│       └── decoration/             # Ornaments, grass, lion print, rosette
├── src/
│   ├── app/
│   │   ├── layout.js               # Root layout
│   │   ├── page.js                 # Main page
│   │   └── globals.scss            # Global styles
│   ├── components/
│   │   ├── layout/                 # Layout components (Header, Footer, Titles, Kanji...)
│   │   ├── three/                  # 3D scene (Lion_Scene, Particles, Post_Processing)
│   │   └── ui/                     # UI components (Cursor, Switcher, Loading, Portrait)
│   ├── context/
│   │   └── ThemeContext.js         # Global state for element selection
│   ├── data/
│   │   └── constants.js            # Colors, titles, descriptions, translations
│   ├── hooks/
│   │   ├── useCursor.js            # Hover state management
│   │   └── useGlitchText.js        # Text scramble effect
│   └── styles/
│       └── _variables.scss         # Global SCSS variables
├── next.config.js
├── jsconfig.json
└── package.json
```

## 🌐 Site URL

You can visit the live site at [https://elementary-lions.vercel.app//](https://elementary-lions.vercel.app//). 💻

## 🏯 License

This project is not licensed for public use.
All rights reserved. ☠️

---

## 🗺️ Contact

For any inquiries, suggestions, or collaboration opportunities, don't hesitate to contact me. 📜

## 🧑🏻‍💻 Author

Created by TheLeon 🔥.

> "When the lion roars, the jungle listens." — Unknown ☄️

Thanks for visiting Elemental Lions! 🩵

Et comme on dit en France : Merci ! 💙🤍❤️
