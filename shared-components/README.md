# Shared Components - SAMEBI Tools

## 🎯 Übersicht
Wiederverwendbare React-Komponenten für alle SAMEBI Marketing-Tools.

## 🛠️ Tech Stack
- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Build:** Vite
- **Package Manager:** npm
- **Testing:** Vitest + React Testing Library

## 📦 Komponenten

### UI Components
- `Button` - Einheitliche Button-Styles
- `Input` - Form-Eingabefelder
- `Card` - Container-Komponente
- `Modal` - Overlay-Dialoge
- `ProgressBar` - Fortschrittsanzeige
- `LoadingSpinner` - Loading-States

### Form Components
- `QuestionCard` - Frage-Anzeige für Tests
- `ScoreDisplay` - Ergebnis-Anzeige
- `EmailCapture` - Lead-Capture Form
- `RatingScale` - Bewertungsskala 1-10

### Layout Components
- `Header` - Tool-Header mit SAMEBI Branding
- `Footer` - Footer mit Links
- `Sidebar` - Navigation (falls nötig)
- `Container` - Responsive Container

### Business Components
- `TestProgress` - Test-Fortschritt
- `ResultCard` - Ergebnis-Darstellung
- `RecommendationList` - Empfehlungen
- `ShareButtons` - Social Sharing

## 🚀 Installation

```bash
npm install @samebi/shared-components
```

## 📖 Usage

```tsx
import { Button, Card, TestProgress } from '@samebi/shared-components';

function MyTool() {
  return (
    <Card>
      <TestProgress current={3} total={10} />
      <Button variant="primary" onClick={handleNext}>
        Weiter
      </Button>
    </Card>
  );
}
```

## 🎨 Design System

### Colors
```css
--samebi-primary: #2563eb
--samebi-secondary: #64748b  
--samebi-success: #16a34a
--samebi-warning: #d97706
--samebi-error: #dc2626
```

### Typography
- **Headings:** Inter Bold
- **Body:** Inter Regular
- **Mono:** JetBrains Mono

## 🔄 Development

```bash
# Setup
git clone https://github.com/PDG1999/shared-components.git
cd shared-components
npm install

# Development
npm run dev

# Build
npm run build

# Test
npm run test

# Storybook
npm run storybook
```

## 📁 Struktur
```
shared-components/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── forms/
│   │   ├── layout/
│   │   └── business/
│   ├── hooks/
│   ├── utils/
│   └── types/
├── stories/
├── tests/
└── dist/
```
