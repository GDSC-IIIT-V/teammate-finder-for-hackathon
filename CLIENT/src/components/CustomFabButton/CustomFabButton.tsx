import { IonFabButton, IonImg } from "@ionic/react";

interface ICustomFabButtonProps {
  id?: string;
  className?: string;
  onPress?: () => void;
  imageSrc?: string;
}

const CustomFabButton = ({
  id,
  onPress,
  className,
  imageSrc,
}: ICustomFabButtonProps) => {
  return (
    <IonFabButton onClick={onPress} class={className} id={id}>
      <IonImg src={imageSrc} class="custom-fab-button-image" />
    </IonFabButton>
  );
};

export default CustomFabButton;
