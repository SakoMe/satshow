import { useDebounce } from '@kythera/kui-components';
import { createContext, useContext, useEffect } from 'react';
import { useMap } from 'react-map-gl';

export const ZoomContext = createContext<{
  level: number;
  setLevel: (n: number) => void;
}>({
  level: 2,
  setLevel: () => null,
});

export const ZoomControls = () => {
  // Follow setZoom context
  const map = useMap();
  const zoomLevelContext = useContext(ZoomContext);
  const { debounce } = useDebounce(200);
  useEffect(() => {
    map.current?.setZoom(zoomLevelContext.level);
  }, [zoomLevelContext]);
  map.current?.on('zoom', () => {
    // This won't do anything if there
    // isn't a zoom context above this component.
    debounce(zoomLevelContext.setLevel, map.current?.getZoom() ?? 3);
  });
  return <></>;
};
