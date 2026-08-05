import { useEffect, useState } from 'react';

export function useScrollSpy(selectors: string[], offset = 100): string {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      for (let i = selectors.length - 1; i >= 0; i--) {
        const selector = selectors[i];
        const element = document.getElementById(selector);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveId(selector);
            return;
          }
        }
      }
      if (selectors.length > 0) {
        setActiveId(selectors[0]);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectors, offset]);

  return activeId;
}
