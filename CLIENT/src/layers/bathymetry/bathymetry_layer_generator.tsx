import VectorLayer from "ol/layer/Vector";
import generateBathymetrySource from "./bathymetry_source_generator";
import generateBathymetryStyles from "./bathymetry_style_generator";

interface IProp {
  url: string;
  method: string;
  data: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const bathymetryLayerGenerator = async ({
  url,
  method,
  data,
  setLoading,
}: IProp) => {
  const bathymetryLayer = new VectorLayer({
    source: await generateBathymetrySource({
      url: url,
      method: method,
      data: data,
      setLoading: setLoading,
    }),
    style: (feature) => generateBathymetryStyles({ feature: feature }),
  });

  console.log("Bathymetry Layer Generated!!");
  bathymetryLayer.set("name", "bathymetryLayer");
  return bathymetryLayer;
};

export default bathymetryLayerGenerator;
