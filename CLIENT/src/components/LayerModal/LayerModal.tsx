import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
} from "@ionic/react";
import "./LayerModal.css";
import { useContext, useState } from "react";
import { MapContext } from "../../store/MapContext";

const layers = [
  {
    id: 0,
    name: "windLayer",
    title: "Wind Speed",
  },
  {
    id: 1,
    name: "bathymetryLayer",
    title: "Bathymetry",
  },
];

const LayerModal = () => {
  const {
    setShowWind,
    setShowBathymetry,
    layerModalIsOpen,
    setLayerModalIsOpen,
    showWind,
    showBathymetry
  } = useContext(MapContext);
  const [selectedLayers, setSelectedLayers] = useState<boolean[]>([showWind, showBathymetry]);

  const onClickCheckbox = (id: number) => {
    setSelectedLayers((prev) => {
      const newSelectedLayers = [...prev];
      newSelectedLayers[id] = !newSelectedLayers[id];
      return newSelectedLayers;
    });
  };

  const setNewLayers = () => {
    setShowWind(selectedLayers[0]);
    setShowBathymetry(selectedLayers[1]);
    setLayerModalIsOpen(false);
  };

  return (
    
    <IonModal
      isOpen={layerModalIsOpen}
      class="layer-modal"
      id="layer-modal"
      backdropDismiss
      onDidDismiss={() => setLayerModalIsOpen(false)}
    >
      <IonContent class="layer-modal-content">
        <div className="layer-modal-header">
        <h1 className="layer-modal-title">Change Layers</h1>
<div className="layer-modal-button" onClick={setNewLayers}>
  X
</div>
        </div>
        <IonList class="layer-modal-list-container">
          {layers.map((layer) => (
            <IonItem key={layer.id}>
              <IonCheckbox slot="start" onClick={() => onClickCheckbox(layer.id)} checked={selectedLayers[layer.id]} />
              <IonLabel>{layer.title}</IonLabel>
            </IonItem>
          ))}
        </IonList>
  
      </IonContent>
    </IonModal>
  );
};

export default LayerModal;
