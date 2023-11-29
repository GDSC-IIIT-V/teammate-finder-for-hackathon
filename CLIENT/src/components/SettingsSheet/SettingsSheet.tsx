import { IonCheckbox, IonContent, IonModal, IonSearchbar } from "@ionic/react";
import { Coordinate, toStringXY } from "ol/coordinate";
import { useContext, useRef, useEffect } from "react";
import { MapContext } from "../../store/MapContext";

const SettingsSheet = () => {
  const modal = useRef<HTMLIonModalElement>(null);

  const getYX = (coord: Coordinate) => {
    const arr = toStringXY(coord, 4).split(", ");
    const lat = parseFloat(arr[1]);
    const lon = parseFloat(arr[0]);
    return `${Math.abs(lat)} ${lat < 0 ? "S" : "N"}, ${Math.abs(lon)} ${
      lon < 0 ? "W" : "E"
    }`;
  };

  const reverseCoordinates = (coordinate: Coordinate) => {
    if (coordinate) {
      const coordString = toStringXY(coordinate, 4);
      const [a, b] = coordString.split(", ");
      return `${b}, ${a}`;
    }
    return "";
  };

  const {
    selectedCoord,
    handleMapClick,
    handlePathGenerator,
    handleSearch,
    layerLoading,
    setDestination,
    setShowBathymetry,
    setShowWind,
    setSource,
    showBathymetry,
    showWind,
    handleRemoveCurrentRoute,
    clickedCoordinates,
  } = useContext(MapContext);

  const lastClickedCoordinate = clickedCoordinates[clickedCoordinates.length - 1];
  const secondLastClickedCoordinate = clickedCoordinates[clickedCoordinates.length - 2];

  const lastClickedCoordinateReversed = reverseCoordinates(lastClickedCoordinate);
  const secondLastClickedCoordinateReversed = reverseCoordinates(secondLastClickedCoordinate);

  useEffect(() => {
    if (secondLastClickedCoordinateReversed) {
      console.log('second last clicked: ' + secondLastClickedCoordinate);
      setSource(secondLastClickedCoordinateReversed);
    }
    if (lastClickedCoordinateReversed) {
      console.log('last clicked: ' + lastClickedCoordinate);
      setDestination(lastClickedCoordinateReversed);
    }
  }, [lastClickedCoordinateReversed, secondLastClickedCoordinateReversed]);

  return (
    <IonModal
      ref={modal}
      trigger="open-settings-sheet"
      initialBreakpoint={1}
      breakpoints={[0, 0.25, 0.5, 0.75, 1]}
    >
      <IonContent className="ion-padding">
        <IonSearchbar
          onClick={() => modal.current?.setCurrentBreakpoint(0.75)}
          placeholder="Search"
        ></IonSearchbar>
        <div className="bottom-container">
          {selectedCoord && (
            <>
              <div className="cord-container">
                <span className="inline-title">Coordinate</span>
                <span className="text">
                  {selectedCoord ? getYX(lastClickedCoordinate) : ""}
                </span>
              </div>
              <div className="divider" />
            </>
          )}
          <div className="divider" />
          <div className="subcontainer">
            <p className="title">Get regional data</p>
            <input
              type="text"
              placeholder="Soruce Coordinates"
              onChange={(e) => setSource(e.target.value)}
              className="input"
              disabled={layerLoading}
            />
            <input
              type="text"
              placeholder="Destination Coordinates"
              onChange={(e) => setDestination(e.target.value)}
              className="input"
              disabled={layerLoading}
            />
            <button
              onClick={handleSearch}
              className="button"
              disabled={layerLoading}
            >
              Get Circle
            </button>
          </div>
          <div className="divider" />
          <div className="subcontainer">
            <p className="title">Get Route</p>
            <input
              type="text"
              placeholder="Source Coordinates"
              defaultValue = {lastClickedCoordinateReversed ? lastClickedCoordinateReversed : ""}
              onChange={(e) => {
                setSource(e.target.value);
              }}
              className="input"
              disabled={layerLoading}
            />
            <input
              type="text"
              placeholder="Destination Coordinates"
              defaultValue = {secondLastClickedCoordinateReversed ? secondLastClickedCoordinateReversed : ""}
              onChange={(e) => {
                setDestination(e.target.value);
              }}
              className="input"
              disabled={layerLoading}
            />
            <div className="router__buttons__wrapper">
              <button
                onClick={handlePathGenerator}
                className="button"
                disabled={layerLoading}
              >
                Get Route
              </button>
              <button
                onClick={handleRemoveCurrentRoute}
                className="button"
                disabled={layerLoading}
              >
                Remove Current Route
              </button>
            </div>
          </div>
          <div className="divider" />
        </div>
      </IonContent>
    </IonModal>
  );
};

export default SettingsSheet;
