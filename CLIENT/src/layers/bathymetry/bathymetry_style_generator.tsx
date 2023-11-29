import { Style, Fill } from "ol/style";
import { FeatureLike } from "ol/Feature";

interface IProps {
  feature: FeatureLike;
}

const generateBathymetryStyles = ({ feature }: IProps) => {
  var elevation = feature.get("elevation");
  // generate blue color shades according to the given sea elevation
  var color;
  if (elevation > -4200) {
    color = `rgb(255, 255, 255)`;
} else if (elevation > -4300) {
    color = `rgb(173, 216, 230)`;
} else if (elevation > -4400) {
    color = `rgb(135, 206, 250)`;
} else if (elevation > -4500) {
    color = `rgb(100, 149, 237)`;
} else if (elevation > -4600) {
    color = `rgb(70, 130, 180)`;
} else if (elevation > -4700) {
    color = `rgb(30, 144, 255)`;
} else if (elevation > -4800) {
    color = `rgb(0, 102, 204)`;
} else if (elevation > -4900) {
    color = `rgb(0, 51, 124)`;
} else if (elevation > -5000) {
    color = `rgb(0, 0, 128)`;
} else if (elevation > -5100) {
    color = `rgb(0, 0, 100)`;
} else if (elevation > -5200) {
    color = `rgb(19, 0, 90)`;
} else {
    // Default color or handling for values less than -5200
    color = `rgb(19, 0, 90)`;
}


  // const color = `rgba(0, 0, ${Math.round((elevation / 10000) * 255)}, 0.9)`;
  const bathymetryStyles = new Style({
    fill: new Fill({
      color: color,
    }),
  });

  return bathymetryStyles;
};

export default generateBathymetryStyles;
