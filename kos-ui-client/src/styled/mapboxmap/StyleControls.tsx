/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fromJS, setIn } from 'immutable';
import { createContext, ReactNode, useState } from 'react';
import { MapboxStyle } from 'react-map-gl';

// Example has this object as a Map. I think it's to prevent renders.
import default_style from '../../assets/styles/map-style-basic-v8.json';

// Same as the zoom context
// but slightly different
// Run out the provider with no props
// The hierarchy is a bit awkward, since the provider would
// have to be outside of the component making changes to styles and containing the map itself.
export const StylesContext = createContext<{
  styles: Immutable.Collection<unknown, unknown> | undefined;
  pushStyleChange: (newStyles: StyleTypeUpdate) => void;
  pasteStyleChange: (newStyle: MapboxStyle) => void;
}>({
  pushStyleChange: () => null,
  styles: fromJS(default_style),
  pasteStyleChange: () => null,
});

export type StyleTypeUpdate = {
  keyAccess: Array<string>; // Starting with the id of the layer to edit.
  value: any;
};

export const StylesContextProvider = ({ children }: { children: ReactNode }) => {
  const [style, setStyle] = useState<Immutable.Collection<unknown, unknown>>(
    fromJS(default_style),
  );
  const makeStyleChange = ({ keyAccess, value }: StyleTypeUpdate) => {
    setStyle((oldStyles) => {
      let neverPushed = true;
      // @ts-ignore
      style.get('layers').forEach((layer: Map<string, any>, index: number) => {
        const id = layer.get('id');
        if (id === keyAccess[0]) {
          oldStyles = setIn(oldStyles, ['layers', index, ...keyAccess], value);
          neverPushed = false;
        }
      });
      if (neverPushed) oldStyles = setIn(oldStyles, ['layers'], [...oldStyles, value]);
      return oldStyles;
    });
  };
  const fullStylePaste = (newStyle: MapboxStyle) => {
    setStyle(fromJS(newStyle));
  };
  return (
    <StylesContext.Provider
      value={{
        styles: style,
        pushStyleChange: makeStyleChange,
        pasteStyleChange: fullStylePaste,
      }}
    >
      {children}
    </StylesContext.Provider>
  );
};
