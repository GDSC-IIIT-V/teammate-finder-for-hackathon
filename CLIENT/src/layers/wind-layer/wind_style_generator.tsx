import { FeatureLike } from "ol/Feature";
import {head, shaft, windStyles} from "./wind_layer.styles";

interface IProp {
  feature: FeatureLike;
}
const generateWindStyles = ({ feature }: IProp) => {
  const direction = feature.get("dir");
  const uwnd = feature.get("uwnd");
  const vwnd = feature.get("vwnd");
  const angle = direction;
  const scale = Math.sqrt(uwnd * uwnd + vwnd * vwnd) / 10;
  shaft.setScale([1, scale]);
  shaft.setRotation(angle);
  head.setDisplacement([0, head.getRadius() / 2 + shaft.getRadius() * scale]);
  head.setRotation(angle);
  return windStyles;
};

export default generateWindStyles;
