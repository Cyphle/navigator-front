# Navigator — Design System Specification

> Fichier de référence pour l'implémentation du redesign de l'application Navigator.  
> Stack cible : **React + Tailwind CSS + shadcn/ui**

---

## Stack & setup

```bash
# Si migration depuis Ant Design
npm install tailwindcss @tailwindcss/vite
npx shadcn@latest init
```

Lors du `shadcn init`, choisir :
- Style : **Default**
- Base color : **Slate** (on va override les tokens)
- CSS variables : **Yes**

---

## 1. Tokens CSS — `globals.css`

Ajouter dans la section `:root` de `globals.css` :

```css
:root {
  /* Couleurs principales */
  --ocean: #1B4F8A;
  --ocean-light: #2D6CC0;
  --ocean-pale: #E8F1FB;

  --sage: #3D8B6E;
  --sage-light: #52B991;
  --sage-pale: #E6F5EF;

  --sun: #F5A623;
  --sun-pale: #FEF3E2;

  --coral: #E85D5D;
  --coral-pale: #FDEAEA;

  /* Surfaces */
  --sand: #F7F4EF;       /* fond principal — remplace le blanc froid */
  --stone: #2C2C3E;      /* textes, sidebar */
  --mist: #8B8FA8;       /* textes secondaires */
  --white: #FFFFFF;

  /* Shadows */
  --shadow-soft: 0 2px 16px rgba(27,79,138,0.08);
  --shadow-card: 0 4px 24px rgba(27,79,138,0.10);
  --shadow-hover: 0 8px 40px rgba(27,79,138,0.16);

  /* Border radius */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 22px;
  --radius-xl: 32px;
}
```

---

## 2. Typographie — `tailwind.config.js`

```js
// tailwind.config.js
import { fontFamily } from "tailwindcss/defaultTheme"

export default {
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "serif"],   // Titres, noms de pages, headings
        sans: ["DM Sans", ...fontFamily.sans],  // Corps, labels, boutons
      },
    },
  },
}
```

Ajouter dans `index.html` ou `layout.tsx` :

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

**Règle d'usage :**
- `font-display` (`Fraunces`) → tous les titres de page, noms de cartes, headings
- `font-sans` (`DM Sans`) → body text, labels, boutons, inputs

---

## 3. Layout global

L'application utilise un layout **sidebar fixe + contenu principal** :

```
┌─────────────┬──────────────────────────────────────┐
│   Sidebar   │  Top bar                             │
│   260px     │  (titre page + actions + user)       │
│   bg-stone  ├──────────────────────────────────────┤
│             │  Contenu (bg-sand)                   │
│             │                                      │
└─────────────┴──────────────────────────────────────┘
```

```tsx
// AppLayout.tsx
export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[var(--sand)]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

---

## 4. Sidebar

**Specs visuelles :**
- Fond : `var(--stone)` (#2C2C3E)
- Largeur : 260px, fixe
- Logo : icône ancre dans un bloc bleu dégradé `#1B4F8A → #2D6CC0`, border-radius 10px
- Items de navigation : chaque item a un **dot coloré** à gauche indiquant la section

**Couleurs des dots par section :**
| Section | Couleur dot |
|---|---|
| Dashboard | `var(--ocean-light)` |
| Familles | `var(--sage-light)` |
| Calendrier | `#9B8AF4` (violet doux) |
| Todos | `var(--sun)` |
| Recettes | `#4EC9B0` (teal) |
| Menus semaine | `var(--sage-light)` |
| Liste de courses | `var(--coral)` |
| Profil | `var(--ocean-light)` |

**Item actif :**
- Fond : `rgba(255,255,255,0.08)`
- Bordure gauche : 3px solid `var(--sage-light)`, inset, border-radius 0 3px 3px 0
- Texte : blanc

**Item inactif :**
- Texte : `rgba(255,255,255,0.55)`

**Badge de compteur** (ex: "4" sur Todos) :
- Fond : `var(--sage)`, texte blanc, border-radius 20px, font-size 10px, font-weight 700

```tsx
// Exemple item actif
<div className="relative flex items-center gap-3 px-5 py-2.5 bg-white/[0.08] cursor-pointer">
  <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[var(--sage-light)] rounded-r-sm" />
  <span className="w-2 h-2 rounded-full bg-[#4EC9B0] shrink-0" />
  <span className="text-white text-sm font-medium">Recettes</span>
</div>
```

---

## 5. Top Bar

- Fond : blanc (`bg-white`)
- Ombre : `var(--shadow-soft)`
- Gauche : titre de page en `font-display` + sous-titre en `text-[var(--mist)]`
- Droite : bouton cloche + avatar initiales + nom utilisateur

```tsx
// TopBar.tsx
<header className="bg-white shadow-[var(--shadow-soft)] px-7 py-4 flex items-center justify-between">
  <div>
    <h1 className="font-display text-2xl font-bold text-[var(--stone)]">{title}</h1>
    <p className="text-sm text-[var(--mist)] mt-0.5">{subtitle}</p>
  </div>
  <div className="flex items-center gap-3">
    <BellButton />
    <Avatar initials="JD" />
    <span className="text-sm font-semibold text-[var(--stone)]">John Doe</span>
  </div>
</header>
```

**Avatar :** cercle 36px, dégradé `var(--ocean) → var(--ocean-light)`, texte blanc, font-weight 700

**Bouton cloche :** carré 36px, fond `var(--sand)`, icône grise, point rouge en position absolute si notifications

---

## 6. Boutons

### Primary (bleu)
```tsx
<button className="
  bg-gradient-to-br from-[var(--ocean)] to-[var(--ocean-light)]
  text-white text-sm font-semibold px-5 py-2.5 rounded-[var(--radius-sm)]
  shadow-[0_3px_12px_rgba(27,79,138,0.3)]
  hover:shadow-[0_4px_18px_rgba(27,79,138,0.4)] hover:-translate-y-px
  transition-all duration-150
">
  + Ajouter une recette
</button>
```

### Success (vert)
Même pattern avec `from-[var(--sage)] to-[var(--sage-light)]` et shadow verte.

### Ghost (neutre)
```tsx
<button className="
  border border-black/10 bg-transparent text-[var(--stone)]
  text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)]
  hover:bg-black/5 transition-colors
">
  Modifier
</button>
```

### Danger (rouge outline)
```tsx
<button className="
  border border-[var(--coral)] text-[var(--coral)] bg-transparent
  text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)]
  hover:bg-[var(--coral-pale)] transition-colors
">
  Supprimer
</button>
```

---

## 7. Cartes Recettes

```tsx
// RecipeCard.tsx
<div className="
  bg-white rounded-[var(--radius-lg)] overflow-hidden
  shadow-[var(--shadow-soft)]
  hover:shadow-[var(--shadow-hover)] hover:-translate-y-1
  transition-all duration-200
">
  {/* Image / placeholder */}
  <div className="h-28 bg-gradient-to-br from-[var(--sage-pale)] to-[var(--ocean-pale)] 
                  flex items-center justify-center text-4xl relative">
    {emoji}
    <span className="absolute top-3 left-3 bg-white text-[var(--ocean)] text-[10px] 
                     font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
      {category}
    </span>
  </div>

  {/* Body */}
  <div className="p-4">
    <h3 className="font-display text-lg font-semibold text-[var(--stone)] mb-1.5">
      {title}
    </h3>
    <div className="text-[var(--sun)] text-sm mb-3">{stars}</div>
    <div className="flex gap-2 items-center">
      <button className="action-ghost">Modifier</button>
      <button className="action-ghost">Partager</button>
      <button className="ml-auto action-delete">Supprimer</button>
    </div>
  </div>
</div>
```

**Couleurs de fond image selon catégorie :**
- Plat → `sage-pale` → `ocean-pale`
- Dessert → `coral-pale` → `#FBBFBF`
- Entrée → `sun-pale` → `#FDE8B4`
- Apéro → `ocean-pale` → `sage-pale`

---

## 8. Cartes Familles

Trait coloré en haut de la carte (4px, dégradé ocean → sage) :

```tsx
<div className="bg-white rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-soft)] relative overflow-hidden">
  {/* Accent bar */}
  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--ocean)] to-[var(--sage-light)]" />
  
  <h2 className="font-display text-xl font-bold text-[var(--stone)]">{name}</h2>
  <p className="text-sm text-[var(--mist)] mt-1 mb-3">{count} membres</p>
  
  <span className="inline-block bg-[var(--sage-pale)] text-[var(--sage)] 
                   text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-4">
    Actif
  </span>

  {/* Members */}
  {members.map(m => (
    <div className="flex justify-between py-2 border-t border-black/5 text-sm">
      <span className="text-[var(--mist)] font-medium">{m.role}</span>
      <span className="text-[var(--stone)] font-medium">{m.email}</span>
    </div>
  ))}

  <div className="flex gap-2.5 mt-5">
    <button className="ghost-btn">Modifier</button>
    <button className="danger-btn">Désactiver</button>
  </div>
</div>
```

---

## 9. Todos — Cartes liste

```tsx
<div className="bg-white rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-soft)]
                hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5
                transition-all duration-200 cursor-pointer">
  <h3 className="font-display text-[1.1rem] font-semibold text-[var(--stone)] mb-2">
    {listName}
  </h3>
  <span className="inline-block bg-[var(--ocean-pale)] text-[var(--ocean)] 
                   text-xs font-bold px-2.5 py-1 rounded-full mb-3">
    Partagée
  </span>
  <p className="text-sm text-[var(--mist)] pt-3 border-t border-black/5">
    {count} tâche{count > 1 ? 's' : ''}
  </p>
</div>
```

---

## 10. Todos — Item de tâche

```tsx
<div className="bg-white rounded-[var(--radius-md)] p-4 shadow-[var(--shadow-soft)] 
                mb-2.5 flex items-start gap-3.5">
  
  {/* Status select */}
  <select className={`
    border-none rounded-[var(--radius-sm)] px-2.5 py-1.5 text-xs font-semibold shrink-0
    ${status === 'À faire'  ? 'bg-[var(--ocean-pale)] text-[var(--ocean)]' : ''}
    ${status === 'En cours' ? 'bg-[var(--sun-pale)] text-amber-700' : ''}
    ${status === 'Terminé'  ? 'bg-[var(--sage-pale)] text-[var(--sage)]' : ''}
  `}>
    <option>À faire</option>
    <option>En cours</option>
    <option>Terminé</option>
  </select>

  <div className="flex-1">
    <p className="font-semibold text-sm text-[var(--stone)]">{title}</p>
    <p className="text-xs text-[var(--mist)] mt-0.5">{description}</p>
    <p className={`text-xs font-medium mt-1 ${isLate ? 'text-[var(--coral)]' : 'text-[var(--sun)]'}`}>
      Échéance : {dueDate}
    </p>
  </div>

  <button className="text-[var(--coral)] opacity-60 hover:opacity-100 transition-opacity shrink-0">
    🗑
  </button>
</div>
```

---

## 11. Page d'inscription — Layout split

```
┌─────────────────────┬────────────────┐
│  Fond sombre        │  Formulaire    │
│  (stone → #1A2744)  │  blanc         │
│  Logo + features    │  inputs        │
│  50% largeur        │  50% largeur   │
└─────────────────────┴────────────────┘
```

- Fond gauche : `bg-gradient-to-br from-[var(--stone)] to-[#1A2744]`
- Effets de lumière : 2 blobs radial gradient positionnés en absolute (bleu top-right, vert bottom-left), `opacity-25`
- Titre : `font-display text-3xl font-bold text-white`, mot-clé en `text-[var(--sage-light)]`
- Features : icône dans un carré arrondi avec fond coloré semi-transparent + texte blanc

---

## 12. Dashboard — Stat cards

4 cartes en grille, chacune avec :
- Icône dans un carré arrondi (fond pale de la couleur)
- Valeur en `font-display text-3xl font-bold`
- Label en `text-xs text-[var(--mist)]`
- Bulle décorative en bas à droite en `opacity-8`

| Card | Icône couleur | Fond icône |
|---|---|---|
| Familles actives | `--ocean` | `--ocean-pale` |
| Tâches en cours | `--sage` | `--sage-pale` |
| Recettes | `--sun` | `--sun-pale` |
| Liste courses | `--coral` | `--coral-pale` |

---

## 13. Inputs

```tsx
<input className="
  w-full px-3.5 py-2.5
  bg-[var(--sand)] border border-black/10
  rounded-[var(--radius-sm)]
  text-sm text-[var(--stone)] placeholder:text-[var(--mist)]
  outline-none focus:border-[var(--ocean-light)] focus:bg-white
  transition-colors duration-150
" />
```

---

## 14. Fond de l'app

Remplacer le blanc par `var(--sand)` (#F7F4EF) — c'est le changement le plus impactant visuellement. Chaleureux, repose les yeux, distingue clairement les cartes blanches du fond.

```tsx
// layout.tsx ou App.tsx
<body className="bg-[#F7F4EF] font-sans text-[var(--stone)]">
```

---

## Checklist d'implémentation

- [ ] Installer Tailwind + shadcn
- [ ] Ajouter les fonts Google (Fraunces + DM Sans)
- [ ] Ajouter les tokens CSS dans `globals.css`
- [ ] Configurer `tailwind.config.js` (fontFamily)
- [ ] Créer `AppLayout` avec sidebar + topbar
- [ ] Implémenter `Sidebar` avec dots colorés et item actif
- [ ] Implémenter `TopBar` avec avatar et cloche
- [ ] Implémenter les 4 variantes de boutons
- [ ] Migrer page Recettes → `RecipeCard`
- [ ] Migrer page Familles → `FamilyCard`
- [ ] Migrer page Todos → `TodoListCard` + `TaskItem`
- [ ] Migrer page Register → split layout
- [ ] Changer tous les fonds `#fff` → `var(--sand)` sur `<body>`