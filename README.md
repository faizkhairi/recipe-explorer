# Recipe Explorer Lite

- Browse recipes from TheMealDB API
- View detailed recipe information including ingredients, instructions, and media
- Search for recipes by name
- Submit feedback for recipes
- Responsive design for all device sizes
- Loading states and error handling

## Data Fetching Approach

- Used React Query for data fetching, caching, and state management
- Implemented custom hooks for recipe data:
  - `useRecipes()` - Fetches the list of recipes
  - `useRecipeDetails(id)` - Fetches detailed information for a specific recipe
- Used React Query's `useMutation` for submitting feedback
- Implemented loading and error states for a better user experience
- Added stale time configuration to minimize unnecessary API calls

### Installation

1. Clone the repository:
```
git clone https://github.com/faizkhairi/RecipeExplorer.git
cd RecipeExplorer
```

2. Install dependencies:
```
npm install
# or
yarn install
```

3. Run the development server:
```
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in browser.

5. Or just go here : https://recipe-explorer-five.vercel.app/
