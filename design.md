# ShameNeta — Design Direction

## Brand
**ShameNeta: Your Favourite Politician's Good Deeds**
Satirical civic transparency. Factual. Non-defamatory. Visually dramatic.

## Color Palette
- `--bg-primary: #080808` — near-black base
- `--bg-secondary: #111111` — card surfaces
- `--bg-elevated: #181818` — elevated cards
- `--crimson: #c41e3a` — primary accent (danger, charges)
- `--crimson-dark: #8b0000` — deep red
- `--crimson-light: #e63950` — hover states
- `--gold: #d4af37` — premium accent (scores, highlights)
- `--gold-light: #f0cc5a` — gold hover
- `--text-primary: #f5f0e8` — warm white (newspaper feel)
- `--text-muted: #8a8a8a` — secondary text
- `--text-dim: #555555` — tertiary
- `--border: #222222` — subtle borders
- `--border-red: #3a1010` — red-tinted borders

## Gradients
- Hero: `linear-gradient(135deg, #080808 0%, #1a0505 50%, #080808 100%)`
- Card hover: `linear-gradient(135deg, #111 0%, #1a0808 100%)`
- Score bar: `linear-gradient(90deg, #8b0000, #c41e3a, #e63950)`
- Gold shimmer: `linear-gradient(90deg, #d4af37, #f0cc5a, #d4af37)`
- Mesh overlay: radial gradient crimson glow top-right

## Typography
- **Display/Headlines:** `Playfair Display` — serif, dramatic, newspaper
- **UI/Body:** `Inter` — clean, readable
- **Mono/Data:** `JetBrains Mono` — scores, IPC sections
- Scale: 4xl+ for hero, 2xl for section headers, base for body, sm for meta

## Layout
- Max width: 1280px centered
- Newspaper-inspired column grids
- Section headers styled like tabloid masthead dividers
- Cards with dark surfaces, red-left-border accents
- Wanted-poster aesthetic for candidate cards

## Components
- **Risk Meter:** Animated arc gauge, crimson fill, gold needle
- **Charge Badge:** Dark pill with red border, IPC section code
- **Score Badge:** Gold gradient text, mono font
- **Party Tag:** Small colored dot + party name
- **Section Divider:** Full-width red line with centered label
- **Disclaimer Banner:** Subtle yellow-on-dark strip

## Motion
- Page load: staggered fade-up for cards
- Risk meter: animated fill on mount
- Hover: subtle scale(1.01) + border glow
- Number counters: count-up animation on scroll

## Aesthetic References
- The Daily Chronicle layout → adapted dark/premium
- Interpol wanted poster aesthetics
- Bloomberg Terminal data density
- NYT investigative journalism typography
