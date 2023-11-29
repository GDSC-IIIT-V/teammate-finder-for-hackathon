import bspline from "b-spline";
import { fromLonLat } from "ol/proj";
import axiosInstance from "../services/axiosInstance";
import { Feature } from "ol";
import { LineString } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { Style, Stroke } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import axios from "axios";
const baseIP = process.env.REACT_APP_BASE_IP || "localhost";
export const bSplinePointsGenerator = (points: number[][], degree: number, destination: number[], source: number[]) => {
  var pointsOnTheCurve: number[][] = [fromLonLat([source[1], source[0]])];

  for (let t = 0; t < 1; t += 0.01) {
    // TODO -> Research about knots and weights and generate them meaningfully
    var point = bspline(t, degree, points);
    pointsOnTheCurve.push(fromLonLat(point));
  }

  pointsOnTheCurve.push(fromLonLat([destination[1], destination[0]]));

  return pointsOnTheCurve;
}

export const bSplineLineLayerGenerator = async (source: string, destination: string, map: any, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  setLoading(true);
  const SRC_COORDINATES = source.split(", ");
  const DEST_COORDINATES = destination.split(", ");
  console.log(parseInt(SRC_COORDINATES[0]), parseInt(SRC_COORDINATES[1]))
  console.log(parseInt(DEST_COORDINATES[0]),
    parseInt(DEST_COORDINATES[1]))

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

  const destinationArrSTR = destination.split(',');
  const sourceArrSTR = source.split(',');
  console.log("POINTS: ", points);

  // TODO -> IMPROVE THE BELOW IMPLEMENTATION OF BSPLINE CURVE
  const destinationArr = [parseFloat(destinationArrSTR[0]), parseFloat(destinationArrSTR[1])];
  const sourceArr = [parseFloat(sourceArrSTR[0]), parseFloat(sourceArrSTR[1])];

  // TODO -> KNOTS, WEIGHTS
  const newPoints = points.map((point: number[]) => {
    return [point[1], point[0]];
  });

  const bsplinePointsOnCurve = bSplinePointsGenerator(newPoints, 8, destinationArr, sourceArr);

  console.log("BSPLINE POINTS ON CURVE: ", bsplinePointsOnCurve);
  const bSplineLineString = new Feature({
    geometry: new LineString(bsplinePointsOnCurve),
    name: "BSpline LineString"
  });

  const bSplineVectorSource = new VectorSource({
    features: [bSplineLineString],
    wrapX: false
  });

  /* https://openlayers.org/en/latest/apidoc/module-ol_style_Stroke.html */
  const lineStyle = new Style({
    stroke: new Stroke({
      color: "red",
      width: 5,
      lineCap: "butt"
    })
  });

  const bSplinePathLayer = new VectorLayer({
    source: bSplineVectorSource,
    style: lineStyle
  });

  bSplinePathLayer.set("name", "bSplinPathLayer");
  

  map.addLayer(bSplinePathLayer);
  setLoading(false);
  // return bSplinePathLayer;
}