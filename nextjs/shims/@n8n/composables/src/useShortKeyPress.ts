import { useEffect, useRef, useState } from 'react';

type KeyFilter = (event: KeyboardEvent) => boolean;
type MaybeRefOrGetter<T> = T | (() => T);

export function useShortKeyPress(
  key: KeyFilter,
  fn: () => void,
  {
    dedupe = true,
    threshold = 300,
    disabled = false,
  }: {
    dedupe?: boolean;
    threshold?: number;
    disabled?: MaybeRefOrGetter<boolean>;
  } = {}
) {
  const keyDownTime = useRef<number | null>(null);
  const [isDisabled, setIsDisabled] = useState(disabled);

  // Handle the disabled prop which can be a function or a value
  useEffect(() => {
    if (typeof disabled === 'function') {
      setIsDisabled(disabled());
    } else {
      setIsDisabled(disabled);
    }
  }, [disabled]);

  useEffect(() => {
    if (isDisabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!key(event)) return;
      
      if (dedupe && event.repeat) return;
      
      keyDownTime.current = Date.now();
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!key(event) || !keyDownTime.current) return;

      const isShortPress = Date.now() - keyDownTime.current < threshold;
      if (isShortPress) {
        fn();
      }
      keyDownTime.current = null;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [key, fn, dedupe, threshold, isDisabled]);
}
