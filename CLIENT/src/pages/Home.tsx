import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonFab,
  IonItem,
  IonLabel,
  IonMenu,
  IonMenuToggle,
  IonPage,
  IonRow,
} from "@ionic/react";
import { Map, SettingsSheet, CustomFabButton, LayerModal } from "../components";
import { useContext } from "react";
import { MapContext } from "../store/MapContext";
import "./Home.css";

const FabButtons = () => {
  const { setLayerModalIsOpen } = useContext(MapContext);

  return (
    <>
      <IonFab slot="fixed" vertical="top" horizontal="start">
        <IonMenuToggle>
          <CustomFabButton
            imageSrc="assets/icon/profile.svg"
            className="home-action-button"
          />
        </IonMenuToggle>
        <CustomFabButton
          imageSrc="assets/icon/layers.svg"
          className="home-action-button"
          onPress={() => setLayerModalIsOpen(true)}
        />
      </IonFab>
      <IonFab slot="fixed" vertical="top" horizontal="end">
        <CustomFabButton
          id="open-settings-sheet"
          imageSrc="assets/icon/compass.svg"
          className="home-action-button"
        />
        <CustomFabButton
          imageSrc="assets/icon/location.svg"
          className="home-action-button"
        />
      </IonFab>
    </>
  );
};

const ProfileMenu = () => {
  const data = [
    {
      id: 1,
      label: "Name",
      value: "Kalash Shah",
    },
    {
      id: 2,
      label: "Email",
      value: "kalash@gmail.com",
    },
    {
      id: 3,
      label: "Phone",
      value: "9689153473",
    },
  ];

  const vessels = [
    {
      name: "Vessel 1",
      id: 1,
      type: "Cargo",
    },
    {
      id: 2,
      name: "Vessel 2",
      type: "Cargo",
    },
    {
      id: 3,
      name: "Vessel 3",
      type: "Ship",
    },
    {
      id: 4,
      name: "Vessel 4",
      type: "Cargo",
    },
    {
      id: 5,
      name: "Vessel 5",
      type: "Ship",
    },
    {
      id: 6,
      name: "Vessel 6",
      type: "Cargo",
    },
    {
      id: 7,
      name: "Vessel 7",
      type: "Ship",
    },
    {
      id: 8,
      name: "Vessel 8",
      type: "Cargo",
    },
  ];

  return (
    <IonMenu type="reveal" contentId="home-main-content">
      <IonCard>
        <IonCardContent>
          {data.map((item) => (
            <IonCol key={item.id}>
              <IonRow>
                <IonLabel>{item.label}</IonLabel>
              </IonRow>
              <IonRow>
                <IonLabel>{item.value}</IonLabel>
              </IonRow>
            </IonCol>
          ))}
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonCardContent>
          {vessels.map((vessel) => (
            <IonItem key={vessel.id} class="">
              <IonCol>
                <IonRow>
                  <IonLabel>{vessel.name}</IonLabel>
                </IonRow>
                <IonRow>
                  <IonLabel>{vessel.type}</IonLabel>
                </IonRow>
              </IonCol>
            </IonItem>
          ))}
        </IonCardContent>
      </IonCard>
      <IonMenuToggle>
        <IonButton
          style={{
            width: "100%",
            height: 40,
          }}
        >
          Click to close the menu
        </IonButton>
      </IonMenuToggle>
    </IonMenu>
  );
};

const Home: React.FC = () => {
  return (
    <>
      <ProfileMenu />
      <LayerModal />
      <IonPage id="home-main-content">
        <IonContent fullscreen>
          <Map />
          <FabButtons />
          <SettingsSheet />
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
