'use client'

import { useRecipes, useCategories, useRecipesByCategory, useRecipesByIngredient, useAreas, useRecipesByArea } from '@/hooks/useRecipes';
import RecipeCard from '@/components/RecipeCard';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

type SearchMode = 'name' | 'ingredient';
type SortOption = 'default' | 'az' | 'za';
type FilterMode = 'category' | 'cuisine';

const ITEMS_PER_PAGE = 12;

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="card animate-pulse">
        <div className="h-48 bg-gray-200 rounded-t-lg" />
        <div className="p-4 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('name');
  const [filterMode, setFilterMode] = useState<FilterMode>('category');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: categories } = useCategories();
  const { data: areas } = useAreas();
  const { data: recipes, isLoading, isError, error, refetch } = useRecipes(
    searchMode === 'name' ? debouncedSearch : undefined
  );
  const { data: categoryRecipes, isLoading: isCategoryLoading } = useRecipesByCategory(selectedCategory);
  const { data: areaRecipes, isLoading: isAreaLoading } = useRecipesByArea(selectedArea);
  const { data: ingredientRecipes, isLoading: isIngredientLoading } = useRecipesByIngredient(
    searchMode === 'ingredient' ? debouncedSearch : ''
  );

  const baseRecipes = useMemo(() => {
    if (searchMode === 'ingredient' && debouncedSearch) return ingredientRecipes ?? [];
    if (selectedArea) return areaRecipes ?? [];
    if (selectedCategory) return categoryRecipes ?? [];
    return recipes ?? [];
  }, [searchMode, debouncedSearch, selectedCategory, selectedArea, ingredientRecipes, categoryRecipes, areaRecipes, recipes]);

  const filteredRecipes = useMemo(() => {
    let result = baseRecipes;
    if (searchMode === 'name' && debouncedSearch) {
      result = result.filter(r => r.strMeal.toLowerCase().includes(debouncedSearch.toLowerCase()));
    }
    if (sortOption === 'az') return [...result].sort((a, b) => a.strMeal.localeCompare(b.strMeal));
    if (sortOption === 'za') return [...result].sort((a, b) => b.strMeal.localeCompare(a.strMeal));
    return result;
  }, [baseRecipes, searchMode, debouncedSearch, sortOption]);

  const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE);
  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedArea('');
    setCurrentPage(1);
    setSearchTerm('');
    setDebouncedSearch('');
    setSearchMode('name');
  };

  const handleAreaChange = (area: string) => {
    setSelectedArea(area);
    setSelectedCategory('');
    setCurrentPage(1);
    setSearchTerm('');
    setDebouncedSearch('');
    setSearchMode('name');
  };

  const handleFilterModeChange = (mode: FilterMode) => {
    setFilterMode(mode);
    setSelectedCategory('');
    setSelectedArea('');
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    if (value) {
      setSelectedCategory('');
      setSelectedArea('');
    }
  };

  const handleSearchModeChange = (mode: SearchMode) => {
    setSearchMode(mode);
    setSearchTerm('');
    setDebouncedSearch('');
    setCurrentPage(1);
    setSelectedCategory('');
    setSelectedArea('');
  };

  const loading = isLoading || isCategoryLoading || isAreaLoading || (searchMode === 'ingredient' && isIngredientLoading && !!debouncedSearch);

  const activeFilterLabel = selectedArea
    ? `${selectedArea} cuisine`
    : selectedCategory
    ? selectedCategory
    : null;

  return (
    <div>
      <section className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Browse Recipes</h2>
          <div className="flex gap-2">
            <Link href="/favorites" className="btn btn-primary">
              Favorites
            </Link>
            <Link href="/recipes" className="btn btn-secondary">
              Featured
            </Link>
          </div>
        </div>

        {/* Search bar with mode toggle */}
        <div className="mb-4">
          <div className="flex rounded-md border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-primary">
            <div className="flex border-r border-gray-300">
              <button
                onClick={() => handleSearchModeChange('name')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  searchMode === 'name' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                By Name
              </button>
              <button
                onClick={() => handleSearchModeChange('ingredient')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  searchMode === 'ingredient' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                By Ingredient
              </button>
            </div>
            <input
              type="text"
              placeholder={searchMode === 'ingredient' ? 'Search by ingredient (e.g. chicken, garlic)...' : 'Search recipes by name...'}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 px-4 py-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Filter panel — hidden during ingredient search */}
        {searchMode === 'name' && (
          <div className="mb-6">
            {/* Filter mode toggle: Category / Cuisine */}
            <div className="flex gap-1 mb-3 border-b border-gray-200">
              <button
                onClick={() => handleFilterModeChange('category')}
                className={`px-4 py-1.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  filterMode === 'category'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Category
              </button>
              <button
                onClick={() => handleFilterModeChange('cuisine')}
                className={`px-4 py-1.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  filterMode === 'cuisine'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Cuisine
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-2 flex-1">
                <button
                  onClick={() => filterMode === 'category' ? handleCategoryChange('') : handleAreaChange('')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    (filterMode === 'category' ? !selectedCategory : !selectedArea)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>

                {filterMode === 'category'
                  ? categories?.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))
                  : areas?.map(area => (
                      <button
                        key={area}
                        onClick={() => handleAreaChange(area)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedArea === area ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {area}
                      </button>
                    ))
                }
              </div>

              <select
                value={sortOption}
                onChange={(e) => { setSortOption(e.target.value as SortOption); setCurrentPage(1); }}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="default">Sort: Default</option>
                <option value="az">Sort: A → Z</option>
                <option value="za">Sort: Z → A</option>
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <SkeletonGrid />
        ) : isError ? (
          <ErrorDisplay
            message={error?.message || 'Failed to load recipes'}
            onRetry={() => refetch()}
          />
        ) : (
          <>
            {paginatedRecipes.length > 0 ? (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredRecipes.length)} of {filteredRecipes.length} recipes
                  {activeFilterLabel && ` in ${activeFilterLabel}`}
                  {searchMode === 'ingredient' && debouncedSearch && ` containing "${debouncedSearch}"`}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedRecipes.map(recipe => (
                    <RecipeCard key={recipe.idMeal} recipe={recipe} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-gray-600">
                  {searchMode === 'ingredient' && debouncedSearch
                    ? `No recipes found containing "${debouncedSearch}".`
                    : 'No recipes found. Try a different search term.'}
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
