import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Enterprise Memory-Safe React Hooks Suite
 * 
 * Eliminates common React memory leaks:
 * 1. Prevents setState on unmounted components
 * 2. Automatically aborts pending network fetches via AbortController on unmount
 * 3. Cleans up background interval & timeout timers
 * 4. Cancels pending debounced microtasks
 */

/**
 * 1. Memory-Safe State Hook
 * Discards state updates if the component has unmounted.
 */
export function useSafeState(initialValue) {
  const [state, setState] = useState(initialValue);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const setSafeState = useCallback((updater) => {
    if (isMounted.current) {
      setState(updater);
    }
  }, []);

  return [state, setSafeState, isMounted];
}

/**
 * 2. Memory-Safe Async Fetch Hook
 * Automatically attaches an AbortController to in-flight requests and cancels them on unmount.
 */
export function useSafeAsync() {
  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const runAsync = useCallback(async (fetchCallback) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Cancel previous in-flight request
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      return await fetchCallback(controller.signal);
    } catch (err) {
      if (err.name === 'AbortError') {
        // Request was safely aborted on unmount; suppress error
        return null;
      }
      throw err;
    }
  }, []);

  return { runAsync };
}

/**
 * 3. Memory-Safe Interval Hook
 * Automatically unregisters setInterval on unmount or delay changes.
 */
export function useSafeInterval(callback, delay, enabled = true) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || delay === null || delay === undefined) return;

    const tick = () => {
      // Pause execution when browser tab is inactive to preserve CPU & heap
      if (!document.hidden && savedCallback.current) {
        savedCallback.current();
      }
    };

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay, enabled]);
}

/**
 * 4. Memory-Safe Timeout Hook
 * Automatically cancels setTimeout on unmount.
 */
export function useSafeTimeout() {
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const setSafeTimeout = useCallback((fn, delay) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(fn, delay);
  }, []);

  const clearSafeTimeout = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { setSafeTimeout, clearSafeTimeout };
}

/**
 * 5. Memory-Safe Debounced Callback
 */
export function useDebouncedCallback(callback, delay = 300) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback((...args) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);
}

export default {
  useSafeState,
  useSafeAsync,
  useSafeInterval,
  useSafeTimeout,
  useDebouncedCallback
};
