import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'ingosstrakh-theory-progress';

export interface TheoryProgressState {
  /** id терминов, отмеченных как изученные */
  completedConceptIds: string[];
  /** лучший результат теста: доля правильных 0…1 */
  quizBestFraction: number | null;
  /** последний прогон: правильных и всего */
  lastQuizCorrect: number | null;
  lastQuizTotal: number | null;
  lastQuizAt: string | null;
}

export const defaultTheoryProgress: TheoryProgressState = {
  completedConceptIds: [],
  quizBestFraction: null,
  lastQuizCorrect: null,
  lastQuizTotal: null,
  lastQuizAt: null,
};

function load(): TheoryProgressState {
  if (typeof window === 'undefined') return defaultTheoryProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultTheoryProgress;
    const p = JSON.parse(raw) as Partial<TheoryProgressState>;
    return {
      completedConceptIds: Array.isArray(p.completedConceptIds)
        ? p.completedConceptIds.filter((x) => typeof x === 'string')
        : [],
      quizBestFraction:
        typeof p.quizBestFraction === 'number' && p.quizBestFraction >= 0 && p.quizBestFraction <= 1
          ? p.quizBestFraction
          : null,
      lastQuizCorrect: typeof p.lastQuizCorrect === 'number' ? p.lastQuizCorrect : null,
      lastQuizTotal: typeof p.lastQuizTotal === 'number' ? p.lastQuizTotal : null,
      lastQuizAt: typeof p.lastQuizAt === 'string' ? p.lastQuizAt : null,
    };
  } catch {
    return defaultTheoryProgress;
  }
}

function save(state: TheoryProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useTheoryProgress() {
  const [state, setState] = useState<TheoryProgressState>(defaultTheoryProgress);

  useEffect(() => {
    setState(load());
  }, []);

  const toggleConceptComplete = useCallback((conceptId: string) => {
    setState((prev) => {
      const completedConceptIds = prev.completedConceptIds.includes(conceptId)
        ? prev.completedConceptIds.filter((id) => id !== conceptId)
        : [...prev.completedConceptIds, conceptId];
      const next = { ...prev, completedConceptIds };
      save(next);
      return next;
    });
  }, []);

  const setConceptComplete = useCallback((conceptId: string, completed: boolean) => {
    setState((prev) => {
      const has = prev.completedConceptIds.includes(conceptId);
      if (completed === has) return prev;
      const completedConceptIds = completed
        ? [...prev.completedConceptIds, conceptId]
        : prev.completedConceptIds.filter((id) => id !== conceptId);
      const next = { ...prev, completedConceptIds };
      save(next);
      return next;
    });
  }, []);

  const recordQuizResult = useCallback((correct: number, total: number) => {
    setState((prev) => {
      const fraction = total > 0 ? correct / total : 0;
      const prevBest = prev.quizBestFraction ?? 0;
      const next: TheoryProgressState = {
        ...prev,
        lastQuizCorrect: correct,
        lastQuizTotal: total,
        lastQuizAt: new Date().toISOString(),
        quizBestFraction: Math.max(prevBest, fraction),
      };
      save(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    save(defaultTheoryProgress);
    setState(defaultTheoryProgress);
  }, []);

  return {
    ...state,
    toggleConceptComplete,
    setConceptComplete,
    recordQuizResult,
    resetProgress,
  };
}
