import { Fill, RegularShape, Stroke, Style } from "ol/style";

const shaft = new RegularShape({
  points: 2,
  radius: 5,
  stroke: new Stroke({
    width: 2,
    color: "black",
  }),
  rotateWithView: true,
});

const head = new RegularShape({
  points: 3,
  radius: 5,
  fill: new Fill({
    color: "black",
  }),
  rotateWithView: true,
});

const windStyles = [new Style({ image: shaft }), new Style({ image: head })];

export {windStyles, shaft, head};