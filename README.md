# Navigator Front

A modern React application for team and tool management, built with Vite, TypeScript, TailwindCSS, and Lucide React icons.

## Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **TailwindCSS** - Utility-first CSS Framework
- **Lucide React** - Icon Library
- **Vitest** - Testing Framework

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Run tests:
```bash
npm test
```

## Project Structure

```
navigator-front/
├── src/
│   ├── App.tsx           # Main application component
│   ├── main.tsx         # Application entry point
│   ├── index.css        # Global styles and Tailwind imports
│   └── __tests__/       # Test files
├── public/              # Static assets
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── vite.config.ts      # Vite configuration
└── package.json        # Project dependencies and scripts
```

## Tailwind Configuration

The project uses TailwindCSS for styling. The configuration is located in `tailwind.config.js`. To modify the Tailwind configuration:

1. Open `tailwind.config.js`
2. Add custom colors, fonts, or other theme extensions in the `theme.extend` object:

```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Add custom colors
      colors: {
        primary: '#your-color',
        // ...
      },
      // Add custom fonts
      fontFamily: {
        sans: ['your-font', 'sans-serif'],
        // ...
      },
      // Add other customizations
    },
  },
  plugins: [],
};
```

## Converting to SCSS

To use SCSS in the project:

1. Install SCSS:
```bash
npm install -D sass
```

2. Rename CSS files to `.scss`
3. Update imports accordingly
4. You can now use SCSS features like nesting, variables, and mixins

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests 