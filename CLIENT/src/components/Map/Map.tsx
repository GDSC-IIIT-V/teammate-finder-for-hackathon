import React, { memo, useContext } from "react";
import "./Map.css";
import Loader from "../Loader/loader.component";
import { MapContext } from "../../store/MapContext";
interface MapProps {
  children?: React.ReactNode;
  center?: any;
  zoom?: number;
  refresh?: number;
  features?: any;
}

const Map = ({ children, center, zoom, refresh, features }: MapProps) => {
  const { mapElement, layerLoading } = useContext(MapContext);

  return (
    <div style={{ overflowY: layerLoading ? "clip" : "auto" }}>
      {layerLoading && <Loader />}
      <div
        ref={mapElement as React.MutableRefObject<HTMLDivElement>}
        className="ol-map"
        style={{ width: window.innerWidth, height: window.innerHeight }}
      />
    </div>
  );
};

export default memo(Map);
