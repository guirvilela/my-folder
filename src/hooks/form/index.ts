import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEqual(a: any, b: any): boolean {
  if (!a || !b) return false;
  return Object.keys(a).every((key) => a[key] === b[key]);
}

export interface Form<T> {
  /** current value of form */
  value: T;
  /** set value of field */
  set: (f: keyof T, options?: FormSetterOptions) => (v: T[keyof T]) => void;
  /** set more fields, keep others fields */
  setAll: (v: Partial<T>, options?: FormSetterOptions) => void;
  /** reset fields, can ignores any field and set field same time */
  reset: (ignores?: (keyof T)[], value?: Partial<T>) => void;
  /** return by validator */
  isValid: boolean;
  /** return true if change any field */
  hasChanges: boolean;
  /** count changes fields, can custom compare fields */
  count(compare?: (key: keyof T) => boolean): number;
  /** return true if field never changed, can custom validation */
  pristine(key?: keyof T | (keyof T)[] | ((a: T, b: T) => boolean)): boolean;
  /** mark hasChanges to false */
  markNoChanges(): void;
}

interface FormSetterOptions {
  noMarkChange?: boolean;
}

/**
 * Create state to use in forms
 * @param initial Object
 * @param validator Function
 * @return Form
 */
export function useForm<T extends object>(
  initial?: T,
  validator?: (form: T) => boolean
): Form<T> {
  const [form, setForm] = React.useState<T>(initial as T);
  const [hasChanges, setHasChanges] = React.useState(false);

  const isValid = React.useMemo(() => {
    if (validator) {
      return validator(form);
    }
    return true;
  }, [form, validator]);

  function set(field: keyof T, options?: FormSetterOptions) {
    return (value: T[keyof T]) => {
      setForm((v) => ({ ...v, [field]: value }));
      if (!options?.noMarkChange) {
        setHasChanges(true);
      }
    };
  }

  function setAll(value: Partial<T>, options?: FormSetterOptions) {
    setForm((v) => ({ ...v, ...value }));
    if (!options?.noMarkChange) {
      setHasChanges(true);
    }
  }

  function reset(ignores?: (keyof T)[], value?: Partial<T>) {
    if (ignores && initial) {
      setForm((f) =>
        Object.keys(f).reduce(
          (newForm, key) => {
            if (!ignores.includes(key as keyof T)) {
              newForm[key as keyof T] = initial[key as keyof T];
            }
            if (value && key in value) {
              newForm[key as keyof T] = value[key as keyof T] as T[keyof T];
            }
            return newForm;
          },
          { ...f }
        )
      );
    } else {
      setForm({ ...initial, ...value } as T);
    }
  }

  function count(compare?: (key: keyof T) => boolean) {
    return (Object.keys(form) as (keyof T)[]).filter((key) =>
      compare ? compare(key) : form[key] !== initial?.[key]
    ).length;
  }

  function pristine(key?: keyof T | (keyof T)[] | ((a: T, b: T) => boolean)) {
    if (!initial) return false;
    if (Array.isArray(key)) {
      return key.every((k) => form[k] === initial[k]);
    }
    if (typeof key === "function") {
      return key(initial, form);
    }
    if (key) {
      return form[key] === initial[key];
    }
    return isEqual(form, initial);
  }

  function markNoChanges() {
    setHasChanges(false);
  }

  return {
    value: form,
    set,
    setAll,
    reset,
    isValid,
    hasChanges,
    count,
    pristine,
    markNoChanges,
  };
}
