import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Spoonacular server module', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    process.env.SPOONACULAR_API_KEY = 'server-key';
  });

  it('reads the key from the server-only env var', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [{ id: 1, title: 'Soup', image: 'x.jpg' }] }),
    } as Response);
    const { searchSpoonacularByName } = await import('@/lib/spoonacular.server');

    const recipes = await searchSpoonacularByName('soup');
    expect(recipes).toEqual([expect.objectContaining({ idMeal: 'spn_1', strMeal: 'Soup' })]);
    expect(String(fetchSpy.mock.calls[0][0])).toContain('apiKey=server-key');
  });

  it('rejects non-numeric recipe ids without calling the API', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    const { fetchSpoonacularRecipeById } = await import('@/lib/spoonacular.server');

    expect(await fetchSpoonacularRecipeById('1/../../admin')).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('Spoonacular browser client', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('calls the app proxy, never api.spoonacular.com', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response);
    const client = await import('@/lib/spoonacularApi');

    await client.searchSpoonacularByName('pasta');
    await client.searchSpoonacularByIngredient('egg');
    await client.fetchSpoonacularRecipeById('42');

    const urls = fetchSpy.mock.calls.map((c) => String(c[0]));
    expect(urls).toEqual([
      '/api/spoonacular/search?query=pasta',
      '/api/spoonacular/search?ingredient=egg',
      '/api/spoonacular/recipes/42',
    ]);
  });
});

describe('GET /api/spoonacular/search', () => {
  it('rejects missing and oversized terms', async () => {
    const { GET } = await import('@/app/api/spoonacular/search/route');
    expect((await GET(new Request('http://x/api/spoonacular/search'))).status).toBe(400);
    expect((await GET(new Request(`http://x/api/spoonacular/search?query=${'a'.repeat(101)}`))).status).toBe(400);
  });
});
