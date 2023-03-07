import * as turf from '@turf/turf';
import { useEffect, useState } from 'react';

export const useGXTFileReader = (
  fileList?: FileList | null,
): {
  region:
    | turf.helpers.Feature<
        turf.helpers.Geometry | turf.helpers.GeometryCollection,
        turf.helpers.Properties
      >
    | undefined;
} => {
  const [region, setRegion] = useState<
    | turf.helpers.Feature<
        turf.helpers.Geometry | turf.helpers.GeometryCollection,
        turf.helpers.Properties
      >
    | undefined
  >();
  useEffect(() => {
    if (fileList !== null && fileList !== undefined) {
      fileList
        .item(0)
        ?.text()
        .then((t) => {
          const rows = t.split('\n');
          // GXT files can contain definitions for more than one polygon or a multipolygon
          // const polygons: Record<string, number[][]> = {};
          const properties: Record<string, string | number> = {};
          const coordinates: number[][] = [];
          let sectionName: string | undefined = '';
          rows.forEach((row) => {
            if (row.match(/^\[.+\]$/) !== null) sectionName = row.match(/^\[.+\]$/)?.[0]; // Section titles
            if (row.match(/^\w+\=\w+$/)) {
              const matches = [...row.matchAll(/(\w+)=(\w+)/)];
              properties[matches[0][1]] = matches[0][2]; // This is a little unsafe.
            } // Value setting.
            if (row.match(/^p\d+\=\-?\d+\.\d+\;\d+\.\d+$/)) {
              const matches = [...row.matchAll(/(\-?\d+\.?\d*);(\-?\d+\.?\d*)/)];
              // polygons[sectionName!].push([
              //   parseFloat(matches[0][1]), // Lat
              //   parseFloat(matches[0][2]), // Long
              // ]);
              coordinates.push([
                parseFloat(matches[0][1]), // Lat
                parseFloat(matches[0][2]), // Long
              ]);
            } // Coordinates
          });
          setRegion(
            turf.feature(
              { type: 'Polygon', coordinates },
              { ...properties, region_name: properties['sat_name'] ?? 'New Region' },
            ),
          );
        });
    }
  }, [fileList]);
  return { region };
};
