import { useCallback, useMemo, useState } from "react";

interface ActionConfig<T> {
  onSuccess?: (response: T) => void;
  onError?: (error: any) => void;
  keepData?: boolean;
}

export interface Action<T> {
  payload: T;
  error: string;
  loading: boolean;
  success: boolean;
  reset: () => void;
  exec: (props?: any) => Promise<T>;
}

export function useCustomAction<T>(initialData?: T) {
  const [payload, setPayload] = useState<T>(initialData as T);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const reset = useCallback(() => {
    setPayload(initialData as T);
    setError("");
    setSuccess(false);
  }, [initialData]);

  const exec = async <P>(
    request: (props?: P) => Promise<T>,
    config?: ActionConfig<T>,
    props?: P
  ): Promise<T> => {
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!config?.keepData) {
      setPayload(initialData as T);
    }

    try {
      const response = await request(props);
      setPayload(response);
      setSuccess(true);
      config?.onSuccess?.(response);
      return response;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      config?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { payload, error, loading, success, reset, exec };
}

export function useCustomAct<T>(
  request: (props?: any) => Promise<T>,
  config?: ActionConfig<T>,
  initialData?: T
): Action<T> & ((props?: any) => Promise<T>) {
  const action = useCustomAction<T>(initialData);
  const fn = useCallback(
    (props?: any) => action.exec(request, config, props),
    [action]
  );
  return useMemo(() => Object.assign(fn, action), [action, fn]) as Action<T> &
    ((props?: any) => Promise<T>);
}
