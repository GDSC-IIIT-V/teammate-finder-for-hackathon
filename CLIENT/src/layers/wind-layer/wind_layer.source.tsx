import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import axios from "axios";

interface IProps {
  url: string;
  method: string;
  data: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}
const generateWindSource = async ({ url, method, data, setLoading }: IProps) => {
  const windSource = new VectorSource({
    format: new GeoJSON(),
    loader: async (extent, resolution, projection) => {
      setLoading(true);
      const axiosConfig = {
        method: method,
        url: url,
        data: data,
      };
      // TODO -> set the projection of coordinates to EPSG:3857
      const res = await axios(axiosConfig);
      const features = new GeoJSON().readFeatures(res.data, {
        dataProjection: "EPSG:4326",
        featureProjection: projection,
      });
      windSource.addFeatures(features);
      setLoading(false);
    },
  });

  return windSource;
};

export default generateWindSource;

// https://ssn-data-streamer.herokuapp.com/stream-data
