import { Map } from "ol";

export const removeLayer = (map: Map, layerName: string) => {
  map
    .getLayers()
    .getArray()
    .filter((layer) => layer.get("name") === layerName)
    .forEach((layer) => map.removeLayer(layer));
};
