import { Clipboard } from "phosphor-react";
import { useParams } from "react-router-dom";
import { RoundedButton } from "./RoundedButton";

export default () => {
  const { roomId } = useParams();

  const handleClick = () => {
    navigator.clipboard.writeText(`${window.location.host}/rooms/${roomId}`);
  };

  return (
    <RoundedButton onClick={handleClick}>
      <Clipboard size={32} />
    </RoundedButton>
  );
};
