import React, { LegacyRef, createContext } from "react";
import { useEffect, useRef, useState } from "react";
import GeoJSON from "ol/format/GeoJSON";
import { Coordinate, toStringXY } from "ol/coordinate";
import Overlay from "ol/Overlay";
import * as ol from "ol";
import { Circle, Geometry, Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import mockdata from "../assets/mock-geojson.json";
import { bSplineLineLayerGenerator } from "../helper/bSplinePlotter";
import { transform } from "ol/proj";
import windLayerGenerator from "../layers/wind-layer/wind_layer_generator";
import { plotPointsIndividually } from "../helper/normalPlotter";
import { removeLayer } from "../constants/removeLayer";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { Fill, Stroke, Style } from "ol/style";
import { fromLonLat } from "ol/proj";
import bathymetryLayerGenerator from "../layers/bathymetry/bathymetry_layer_generator";
import CircleStyle from "ol/style/Circle";
import { log } from "console";
const baseIP = process.env.REACT_APP_BASE_IP || "localhost";

interface IMapContextType {
  map: ol.Map | undefined;
  setMap: React.Dispatch<React.SetStateAction<ol.Map | undefined>>;
  featuresLayer: VectorLayer<VectorSource<Geometry>> | undefined;
  setFeaturesLayer: React.Dispatch<
    React.SetStateAction<VectorLayer<VectorSource<Geometry>> | undefined>
  >;
  begin: boolean;
  setBegin: React.Dispatch<React.SetStateAction<boolean>>;
  mapElement: React.MutableRefObject<HTMLElement | undefined>;
  handleMapClick: (event: any) => void;
  popup: Overlay;
  layerLoading: boolean;
  setLayerLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCoord: Coordinate | undefined;
  setSelectedCoord: React.Dispatch<
    React.SetStateAction<Coordinate | undefined>
  >;
  source: string | undefined;
  setSource: React.Dispatch<React.SetStateAction<string | undefined>>;
  destination: string | undefined;
  setDestination: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleSearch: () => Promise<void>;
  handlePathGenerator: () => Promise<void>;
  showWind: boolean;
  setShowWind: React.Dispatch<React.SetStateAction<boolean>>;
  showBathymetry: boolean;
  setShowBathymetry: React.Dispatch<React.SetStateAction<boolean>>;
  isSearched: boolean;
  setIsSearched: React.Dispatch<React.SetStateAction<boolean>>;
  features: ol.Feature<Geometry>[];
  setFeatures: React.Dispatch<React.SetStateAction<ol.Feature<Geometry>[]>>;
  handleRemoveCurrentRoute: () => void;
  isLoadingMap: boolean;
  setIsLoadingMap: React.Dispatch<React.SetStateAction<boolean>>;
  layerModalIsOpen: boolean;
  setLayerModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clickedCoordinates: Coordinate[];
}

export const MapContext = createContext<IMapContextType>({
  map: undefined,
  popup: new Overlay({
    element: document.getElementById("popup") as HTMLElement,
  }),
  begin: false,
  source: undefined,
  showWind: false,
  features: [],
  mapElement: { current: undefined },
  isSearched: false,
  destination: undefined,
  layerLoading: false,
  isLoadingMap: false,
  selectedCoord: undefined,
  featuresLayer: undefined,
  showBathymetry: false,
  layerModalIsOpen: false,
  setMap: () => {},
  setBegin: () => {},
  setSource: () => {},
  setFeatures: () => {},
  setShowWind: () => {},
  setIsSearched: () => {},
  handleMapClick: () => {},
  setDestination: () => {},
  setIsLoadingMap: () => {},
  setLayerLoading: () => {},
  setFeaturesLayer: () => {},
  setSelectedCoord: () => {},
  setShowBathymetry: () => {},
  setLayerModalIsOpen: () => {},
  handleRemoveCurrentRoute: () => {},
  handleSearch: () => Promise.resolve(),
  handlePathGenerator: () => Promise.resolve(),
  clickedCoordinates: [],
});

interface IMapProviderProps {
  children: React.ReactNode;
}

const MapProvider = ({ children }: IMapProviderProps) => {
  const [clickedCoordinates, setClickedCoordinates] = useState<Coordinate[]>([]);
  const [features, setFeatures] = useState<ol.Feature<Geometry>[]>([]);

  const [showWind, setShowWind] = useState<boolean>(false);
  const [showBathymetry, setShowBathymetry] = useState<boolean>(false);
  const [layerLoading, setLayerLoading] = useState<boolean>(false);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [isLoadingMap, setIsLoadingMap] = useState<boolean>(true);
  const [layerModalIsOpen, setLayerModalIsOpen] = useState<boolean>(false);

  const [source, setSource] = useState<any>();
  const [destination, setDestination] = useState<any>();
  const [selectedCoord, setSelectedCoord] = useState<Coordinate>();

  const [map, setMap] = useState<ol.Map>();
  // useGeographic();

  const [featuresLayer, setFeaturesLayer] =
    useState<VectorLayer<VectorSource<Geometry>>>();
  const [begin, setBegin] = useState<boolean>(false);

  const mapElement = useRef<HTMLDivElement>();
  const mapRef = useRef<ol.Map>();
  // const popupRef = useRef<any>();

  mapRef.current = map;
  // const container = popupRef.current;

  const cont = document.createElement("div");
  cont.className = "popup";

  const popup = new Overlay({
    element: cont,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });

  useEffect(() => {
    const response = JSON.stringify(mockdata);
    const wktOptions = {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    };
    const parsedFeatures = new GeoJSON().readFeatures(response, wktOptions);
    setFeatures(parsedFeatures);
    setIsLoadingMap(false);
  }, []);

  // const handlePathGenerator = async () => {
  //   // const pathLayer = await bSplineLineLayerGenerator(source, destination);
  //   // if (map) {
  //   //   console.log("PATH LAYER");
  //   //   map.addLayer(pathLayer);
  //   // }
  //   // await plotPointsIndividually(source, destination, map, setLayerLoading);
  //   await bSplineLineLayerGenerator(source, destination, map, setLayerLoading);
  // };

  const handlePathGenerator = async () => {
    if (!source || !destination) {
      alert("Please select both source and destination points.");
      return;
    }
    if (source == destination) {
      alert("Please select different coordinates for source and destination.");
      return;
    }
    // const validLatRange = { min: -90, max: 90 };
    // const validLonRange = { min: -180, max: 180 };
  
    // const sourceCoords = source.split(',').map(parseFloat);
    // const destinationCoords = destination.split(',').map(parseFloat);
    
    const SRC_COORDINATES = source.split(", ");
    const DEST_COORDINATES = destination.split(", ");
    if(Math.abs(parseInt(SRC_COORDINATES[0])-parseInt(DEST_COORDINATES[0]))+Math.abs(parseInt(SRC_COORDINATES[1])-parseInt(DEST_COORDINATES[1]))<=1.0){
      alert("Source and Destination are too close!");
      return;
    }
    // console.log(parseInt(DEST_COORDINATES[0]),
    // parseInt(DEST_COORDINATES[1]))
  
    // if (!isValidCoordinates(sourceCoords, validLatRange, validLonRange)) {
    //   alert("Source coordinates are not within valid limits.");
    //   return;
    // }
  
    // if (!isValidCoordinates(destinationCoords, validLatRange, validLonRange)) {
    //   alert("Destination coordinates are not within valid limits.");
    //   return;
    // }
  
    await bSplineLineLayerGenerator(source, destination, map, setLayerLoading);
  };
  
  const isValidCoordinates = (coords: [any, any], validLatRange: { min: any; max: any; }, validLonRange: { min: any; max: any; }) => {
    const [lat, lon] = coords;
    return (
      lat >= validLatRange.min &&
      lat <= validLatRange.max &&
      lon >= validLonRange.min &&
      lon <= validLonRange.max
    );
  };
  

  const handleRemoveCurrentRoute = () => {
    if (map) {
      // console.log('hi');
      // removeLayer(map, "lineLayer");
      removeLayer(map, "bSplinPathLayer")
    }
  };

  const getYX = (coord: Coordinate) => {
    const arr = toStringXY(coord, 4).split(", ");
    const lat = parseFloat(arr[1]);
    const lon = parseFloat(arr[0]);
    return `${Math.abs(lat)} ${lat < 0 ? "S" : "N"}, ${Math.abs(lon)} ${
      lon < 0 ? "W" : "E"
    }`;
  };

  const handleMapClick = (event: any) => {
    const coord = mapRef.current?.getCoordinateFromPixel(event.pixel);
    const feature = mapRef.current?.forEachFeatureAtPixel(
      event.pixel,
      function (feature) {
        return feature;
      }
    );
    if (feature && coord) {
      // retrieve the coordinates
      // @ts-ignore
      // const coordinates: Coordinate = feature.getGeometry()?.getCoordinates();
      // // reverse the array
      // const reversed = coordinates.reverse();
      // // convert this array reverses to type Coordinate
      // const coordS: Coordinate = reversed as Coordinate;
      const transformedCoord = transform(coord, "EPSG:3857", "EPSG:4326");
      console.log("Clicked on: ", transformedCoord);
      if (feature.get("uwnd") && feature.get("vwnd")) {
        cont.innerHTML = `<p class="popup-text">Location: ${getYX(
          transformedCoord
        )}</p><p class="popup-text">Wind Speed: ${(
          Math.sqrt(
            feature.get("uwnd") * feature.get("uwnd") +
              feature.get("vwnd") * feature.get("vwnd")
          ) / 10
        ).toFixed(4)} m/s</p><p class="popup-text">Wind Direction: ${feature
          .get("dir")
          .toFixed(4)} radians</p>`;
      } else {
        cont.innerHTML = `<p class="popup-text">Location: ${getYX(
          transformedCoord
        )}</p><p class="popup-text">Depth: ${feature.get("elevation")} m</p>`;
      }
      popup.setPosition(event.coordinate);
    } else {
      popup.setPosition(undefined);
    }

    if (coord) {
      const transformedCoord = transform(coord, "EPSG:3857", "EPSG:4326");
      setSelectedCoord(transformedCoord);
      console.log(transformedCoord);
      setClickedCoordinates((prevCoordinates) => [...prevCoordinates, transformedCoord]);
    }
  };
  useEffect(() => {
    console.log("Clicked Coordinates: ", clickedCoordinates);
    console.log("Latest Clicked Coordinate: ", clickedCoordinates[clickedCoordinates.length - 1]);
    console.log("Previous Clicked Coordinate: ", clickedCoordinates[clickedCoordinates.length - 2]);
    if (clickedCoordinates[clickedCoordinates.length-2]!=null) {
      const source = clickedCoordinates[clickedCoordinates.length - 2];
      const pointFeature = new ol.Feature({
        geometry: new Point(fromLonLat([source[0], source[1]])),
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
            radius: 8,
            fill: new Fill({
              color: 'rgba(0, 255, 0, 0.7)',
            }),
            stroke: new Stroke({
              color: 'rgba(0, 0, 0, 0.8)',
              width: 2,
            }),
          }),
        }),
      });
      
      // how to name this layer
      pointVectorLayer.set("name", "pointLayerSource");
      
      if (map) {
        removeLayer(map, "pointLayerSource");
        map.addLayer(pointVectorLayer);
      }
    }

    if (clickedCoordinates[clickedCoordinates.length-1]!=null) {
      const dest = clickedCoordinates[clickedCoordinates.length - 1];
      const pointFeature = new ol.Feature({
        geometry: new Point(fromLonLat([dest[0], dest[1]])),
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
            radius: 8,
            fill: new Fill({
              color: 'rgba(255, 0, 0, 0.7)',
            }),
            stroke: new Stroke({
              color: 'rgba(0, 0, 0, 0.8)',
              width: 2,
            }),
          }),
        }),
      });
      
      // how to name this layer
      pointVectorLayer.set("name", "pointLayerDestination");
      
      if (map) {
        removeLayer(map, "pointLayerDestination");
        map.addLayer(pointVectorLayer);
      }
    }
  }, [clickedCoordinates]);

  const handleSearch = async () => {
    const windLayer = await windLayerGenerator({
      url: `http://14.139.105.24:5000/get-circle`,
      method: "POST",
      // data: { input1, input2 },
      data: { input1: source, input2: destination },
      setLoading: setLayerLoading,
    });
    if (map) {
      map.addLayer(windLayer);
    }

    // BSPLINE
    //     const lonlat0 = [34.7255, 2.7711];
    //     const lonlat1 = [10.4045, 16.3298];

    //     const arr = String(input1).split(", ");
    //     const arr2 = String(input2).split(", ");
    //     const lonlat2 = [parseFloat(arr[0]), parseFloat(arr[1])];
    //     const lonlat3 = [parseFloat(arr2[0]), parseFloat(arr2[1])];
    //     console.log(lonlat2, lonlat3);

    //     var points = [
    //       [34.7255, 2.7711],
    //       [24.2345 , 5.2345],
    //       [14.2345, 8.2345],
    //       [10.4045, 16.3298],
    //     ];

    //     var degree = 2;

    //     // B-splines with clamped knot vectors pass through
    //     // the two end control points.
    //     //
    //     // A clamped knot vector must have `degree + 1` equal knots
    //     // at both its beginning and end.
    //     var pointes = [fromLonLat(lonlat0), fromLonLat(lonlat1)];

    //     var knots = [
    //       0, 0, 0, 1, 2, 2, 2
    //     ];
    //     let pointss=[];
    //     for(var t=0; t<1; t+=0.01) {
    //       var point = bspline(t, degree, points, knots);
    //       pointss.push(point);
    //       pointes.push(fromLonLat(point));
    //     }
    //     console.log(pointss);

    //     var line_feat1 = new Feature({
    //       geometry: new LineString(pointes),
    //       name: "My_Simple_LineString"
    //     });
    //     var line_vsrc = new VectorSource({
    //       features: [line_feat1],
    //       wrapX: false
    //     });
    //     var lineStyle = new Style({
    //       stroke: new Stroke({
    //         color: "red",
    //         width: 5,
    //         //lineDash: [4, 4, 4],
    //         lineCap: "butt"
    //         /* https://openlayers.org/en/latest/apidoc/module-ol_style_Stroke.html */
    //       })
    //     });
    //     var veclay_line = new VectorLayer({
    //       source: line_vsrc,
    //       style: lineStyle
    //     });
    //     map?.addLayer(veclay_line);

    // console.log(input1, input2, "sfwfwefwefwefwef");
  };

  useEffect(() => {
    if (begin) {
      setTimeout(() => {
        const centerCoordinates = transform([77.4838, 22.7541], "EPSG:4326", "EPSG:3857");
  
        const initialMap = new ol.Map({
          target: mapElement.current,
          layers: [
            new TileLayer({
              source: new OSM({
                url: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", // Use OSM Humanitarian map style
              }),
            }),
          ],
          view: new ol.View({
            center: centerCoordinates,
            zoom: 5,
            projection: "EPSG:3857",
          }),
          controls: [],
        });
        initialMap.on("click", handleMapClick);
        initialMap.addOverlay(popup);
        // const size = initialMap.getSize();
        // set the center of this map to 6, 92
        // initialMap.getView().setCenter(fromLonLat([8.16, 70.58]));
        // initialMap.getView().setCenter(fromLonLat([8.16, 70.58]));
        // setMap(initialMap);
        // setFeaturesLayer(initialFeaturesLayer);
        setMap(initialMap);
      });
    }
    setBegin(true);
  }, [begin]);

  useEffect(() => {
    const getWindData = async () => {
      if (showWind && map) {
        const windLayer = await windLayerGenerator({
          url: `http://14.139.105.24:5000/get-weather-data`,
          method: "GET",
          data: {},
          setLoading: setLayerLoading,
        });
        windLayer.set("name", "windLayer");
        map.addLayer(windLayer);
      } else if (!showWind && map) {
        removeLayer(map, "windLayer");
      }
    };
    getWindData();
  }, [map, showWind]);

  useEffect(() => {
    const getBathmetryData = async () => {
      if (showBathymetry && map) {
        const bathymetryLayer = await bathymetryLayerGenerator({
          url: `http://14.139.105.24:5000/get-bathymetry-polygons`,
          method: "GET",
          data: {},
          setLoading: setLayerLoading,
        });
        // map.addLayer(bathymetryLayer);
        // add layer to map with name
        bathymetryLayer.set("name", "bathymetryLayer");
        map.addLayer(bathymetryLayer);
      } else if (!showBathymetry && map) {
        removeLayer(map, "bathymetryLayer");
      }
    };
    getBathmetryData();
  }, [map, showBathymetry]);

  useEffect(() => {
    if (features && features.length) {
      featuresLayer?.setSource(
        new VectorSource({
          features: features,
        })
      );
      var extent = featuresLayer?.getSource()?.getExtent();
      if (extent !== undefined) {
        map?.getView().fit(extent, {
          padding: [50, 50, 50, 50],
        });
      }
    }
  }, [features, featuresLayer, map]);

  return (
    <MapContext.Provider
      value={{
        map,
        popup,
        begin,
        source,
        showWind,
        features,
        mapElement,
        isSearched,
        destination,
        layerLoading,
        isLoadingMap,
        selectedCoord,
        featuresLayer,
        showBathymetry,
        layerModalIsOpen,
        clickedCoordinates,
        setMap,
        setBegin,
        setSource,
        setFeatures,
        setShowWind,
        handleSearch,
        setIsSearched,
        handleMapClick,
        setDestination,
        setLayerLoading,
        setIsLoadingMap,
        setFeaturesLayer,
        setSelectedCoord,
        setShowBathymetry,
        handlePathGenerator,
        setLayerModalIsOpen,
        handleRemoveCurrentRoute,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
