import VectorLayer from "ol/layer/Vector";
import generateWindSource from "./wind_layer.source";
import generateWindStyles from "./wind_style_generator";

interface IProp {
    url: string;
    method: string;
    data: any;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const windLayerGenerator = async ({url, method, data, setLoading}: IProp) => {
  // @ts-ignore
  const windLayer = new VectorLayer({
    source: await generateWindSource({
      url: url,
      method: method,
      data: data,
      setLoading: setLoading,
    }),
    style: (feature) => generateWindStyles({ feature: feature }),
  });
  windLayer.set("name", "windLayer");
  return windLayer;
};

export default windLayerGenerator;
