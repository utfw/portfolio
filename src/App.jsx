import { useState, useEffect, useCallback } from 'react';
import DirectionC2 from './2026/direction-c2.jsx';
import data from './2026/data.jsx';
import { resolveVariant } from './2026/variants.jsx';

function readVariantFromUrl() {
  if (typeof window === 'undefined') return resolveVariant();
  return resolveVariant(new URLSearchParams(window.location.search).get('v'));
}

function App() {
  const [variant, setVariant] = useState(readVariantFromUrl);

  // 뒤로가기/앞으로가기로 버전이 바뀌는 경우
  useEffect(() => {
    const onPop = () => setVariant(readVariantFromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const changeVariant = useCallback((next) => {
    const v = resolveVariant(next);
    setVariant((cur) => {
      if (cur === v) return cur;
      const url = new URL(window.location.href);
      url.searchParams.set('v', v);
      window.history.pushState({ v }, '', url);
      return v;
    });
  }, []);

  return (
    <DirectionC2 data={data} variant={variant} onVariantChange={changeVariant} />
  );
}

export default App
