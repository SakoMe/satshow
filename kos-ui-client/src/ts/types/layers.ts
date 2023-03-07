import { Scale } from 'chroma-js';

type LayerElement = {
  // As defined in the database
  id: number;
  coords: Position;
  mobile?: boolean;
  past?: Position[];
  path?: Position[];
};

type Position = {
  // As defined in the database
  lat: number;
  lon: number;
  alt: number;
};

type LayerType = {
  color: string | Scale; // Set in the layer visibility DND, single color or set by the Keys
  visible: boolean;
  index: number; // Replaces the ordering array in the slice.
};

export type { LayerElement, LayerType, Position };
