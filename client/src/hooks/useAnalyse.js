import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { analyseAll } from '../utils/api';
import { RECENT_SEARCHES_KEY } from '../utils/constants';

export default function useAnalyse() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyse = useCallback(async (usernames) => {
    const hasAnyUsername = Object.values(usernames).some((v) => v && v.trim());
    if (!hasAnyUsername) {
      toast.error('Enter at least one platform username');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await analyseAll(usernames);
      setResult(data);

      // Report per-platform errors without failing the whole flow.
      Object.entries(data.platforms).forEach(([platform, res]) => {
        if (res?.error) {
          toast.error(`${platform}: ${res.error}`);
        }
      });

      saveRecentSearch(usernames);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to analyse profiles';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyse, loading, result, error, setResult };
}

function saveRecentSearch(usernames) {
  try {
    const existing = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
    const entry = { ...usernames, at: new Date().toISOString() };
    const updated = [entry, ...existing.filter((e) => JSON.stringify(e) !== JSON.stringify(entry))].slice(0, 5);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable — non-fatal
  }
}
