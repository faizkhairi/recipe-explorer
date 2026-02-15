# Recipe Explorer

A modern recipe browsing application built with **Next.js 15**, **React Query**, and **Tailwind CSS**. Browse, search, filter, and save your favorite recipes from around the world using [TheMealDB](https://www.themealdb.com/) API.

**Live Demo:** [recipe-explorer-five.vercel.app](https://recipe-explorer-five.vercel.app/)

## Features

- **Browse Recipes** — Explore a curated collection of recipes from TheMealDB API
- **Search** — Find recipes by name with real-time filtering
- **Category Filtering** — Filter recipes by category (Beef, Chicken, Dessert, Seafood, etc.)
- **Recipe Details** — View full recipe with ingredients list, step-by-step instructions, and video tutorials
- **Favorites** — Save your favorite recipes with localStorage persistence
- **Feedback System** — Leave ratings and reviews on recipes, displayed with star ratings
- **Pagination** — Navigate through large recipe collections with page controls
- **Responsive Design** — Optimized for mobile, tablet, and desktop
- **Error Handling** — Graceful fallbacks with sample recipes when API is unavailable

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Next.js 15](https://nextjs.org/) | React framework with App Router |
| [React Query v5](https://tanstack.com/query) | Server state management and caching |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [TheMealDB API](https://www.themealdb.com/api.php) | Recipe data source |
| [Vitest](https://vitest.dev/) | Unit testing |
| [react-hot-toast](https://react-hot-toast.com/) | Toast notifications |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/faizkhairi/recipe-explorer.git
cd recipe-explorer
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

```bash
npm test           # Run tests once
npm run test:watch # Watch mode
```

### Build

```bash
npm run build
npm start
```

## Project Structure

```
recipe-explorer/
├── app/
│   ├── page.tsx                 # Home page (search, category filter, pagination)
│   ├── layout.tsx               # Root layout with header/footer
│   ├── favorites/page.tsx       # Saved favorites page
│   └── recipes/
│       ├── page.tsx             # Featured recipes showcase
│       └── [id]/page.tsx        # Recipe detail (ingredients, instructions, feedback)
├── components/
│   ├── RecipeCard.tsx           # Recipe card with favorite button
│   ├── IngredientsList.tsx      # Ingredient list with images
│   ├── FeedbackForm.tsx         # Rating and review form
│   ├── FeedbackList.tsx         # Display submitted reviews
│   ├── FavoriteButton.tsx       # Heart toggle button
│   ├── LoadingSpinner.tsx       # Loading state
│   ├── ErrorDisplay.tsx         # Error state with retry
│   └── QueryProvider.tsx        # React Query provider
├── hooks/
│   ├── useRecipes.ts            # Recipe data hooks (search, details, categories)
│   ├── useFavorites.ts          # localStorage favorites management
│   └── useFeedback.ts           # localStorage feedback management
├── lib/
│   ├── api.ts                   # TheMealDB API client
│   ├── types.ts                 # TypeScript interfaces
│   └── sampleRecipes.ts         # Fallback recipe data
└── tests/
    ├── setup.ts                 # Test configuration
    ├── api.test.ts              # API function tests (10 tests)
    ├── favorites.test.ts        # Favorites hook tests (5 tests)
    └── feedback.test.ts         # Feedback hook tests (3 tests)
```

## Architecture Decisions

### Data Fetching with React Query

React Query handles all API communication with built-in caching (5-minute stale time), automatic retries, and loading/error states. Custom hooks (`useRecipes`, `useRecipeDetails`, `useCategories`) abstract the data layer from components.

### Client-Side Storage

Favorites and feedback are persisted in `localStorage` since this is a frontend-only application with no backend. The `useFavorites` and `useFeedback` hooks provide a clean API for reading and writing this data.

### TheMealDB API Integration

The app uses multiple TheMealDB endpoints:
- `search.php?s=` — Search/browse all recipes
- `lookup.php?i={id}` — Get recipe details by ID
- `list.php?c=list` — List all categories
- `filter.php?c={category}` — Filter recipes by category

When the API is unavailable, the app falls back to 5 built-in sample recipes.

## License

MIT
