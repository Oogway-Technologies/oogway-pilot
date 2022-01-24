import React, {useRef, useEffect} from 'react';

// A react-friendly wrapper around setTimeout
export default function useTimeout(callback, delay: number) {
    const timeoutRef: React.Ref<T> = useRef(null);
    const savedCallback: React.Ref<T> = useRef(callback);

    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      const tick = () => savedCallback.current();

      if (typeof delay === 'number') {
        timeoutRef.current = window.setTimeout(tick, delay);

        return () => window.clearTimeout(timeoutRef.current);
      }
    }, [delay]);

    return timeoutRef;
  };