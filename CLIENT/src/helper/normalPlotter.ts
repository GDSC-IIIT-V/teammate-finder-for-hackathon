import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import axiosInstance from "../services/axiosInstance";
const baseIP = process.env.REACT_APP_BASE_IP || "localhost";

export const plotPointsIndividually = async (
  source: string,
  destination: string,
  map: any,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true);
  const SRC_COORDINATES = source.split(", ");
  const DEST_COORDINATES = destination.split(", ");

  const res = await axiosInstance.post(`http://14.139.105.24:5000/stream-path`, {
    source_coords: [parseInt(SRC_COORDINATES[0]), parseInt(SRC_COORDINATES[1])],
    destination_coords: [
      parseInt(DEST_COORDINATES[0]),
      parseInt(DEST_COORDINATES[1]),
    ],
    gtype: "full",
    ntype: 1,
  });
  const points = res.data;
  
  points.forEach((point: number[]) => {
    const pointFeature = new Feature({
      geometry: new Point(fromLonLat([point[1], point[0]])),
      name: "Point",
    });
    const pointVectorSource = new VectorSource({
      features: [pointFeature],
      wrapX: false,
    });
    const pointVectorLayer = new VectorLayer({
      source: pointVectorSource,
      style: new Style({
        image: new CircleStyle({
          radius: 4,
          fill: new Fill({ color: "red" }),
          stroke: new Stroke({ color: "black", width: 1 }),
        }),
      }),
    });
    // how to name this layer
    pointVectorLayer.set("name", "pointLayer");
    map.addLayer(pointVectorLayer);
    setLoading(false);
  });
};
