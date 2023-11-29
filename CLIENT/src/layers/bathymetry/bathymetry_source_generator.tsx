import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import axios from "axios";

interface IProps {
  url: string;
  method: string;
  data: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
const generateBathymetrySource = async ({
  url,
  method,
  data,
  setLoading,
}: IProps) => {
  const bathymetrySource = new VectorSource({
    format: new GeoJSON(),
    loader: async (extent, resolution, projection) => {
      setLoading(true);
      const axiosConfig = {
        method: method,
        url: url,
        data: data,
      };
      // TODO -> set the projection of coordinates to EPSG:3857
      try {
        const res = await axios(axiosConfig);
        // TODO -> LATER TAKE THIS DATA FROM CONTEXT STORE WE CREATE
        console.log(res.data);
        const features = new GeoJSON().readFeatures(res.data, {
          dataProjection: "EPSG:4326",
          featureProjection: projection,
        });
        bathymetrySource.addFeatures(features);
        setLoading(false);
      } catch (error: any) {
        console.log(error.message);
        setLoading(false);
      }
    },
  });
  return bathymetrySource;
};

export default generateBathymetrySource;

// http://14.139.105.24:8000/sea-data
