export const withLoading =
  (setLoading: (value: boolean) => void) => async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } finally {
      setLoading(false);
    }
  };
