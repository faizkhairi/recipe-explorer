'use client'

import { useState, useEffect, useCallback } from 'react';
import { StoredFeedback } from '@/lib/types';

const STORAGE_KEY = 'recipe-feedback';

export function useFeedback(recipeId: string) {
  const [feedback, setFeedback] = useState<StoredFeedback[]>([]);

  const loadFeedback = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const all = JSON.parse(stored);
      setFeedback(all[recipeId] || []);
    }
  }, [recipeId]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  return { feedback, refreshFeedback: loadFeedback };
}
