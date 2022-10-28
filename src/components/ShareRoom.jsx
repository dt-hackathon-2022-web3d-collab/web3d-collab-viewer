import { Clipboard } from "phosphor-react";
import { useParams } from "react-router-dom";
import { RoundedButton } from "./RoundedButton";

export default () => {
  const { roomId } = useParams();

  const handleClick = () => {
    const shareUrl = `${window.location.host}/rooms/${roomId}`;
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="rounded backdrop-blur-sm bg-white/50 drop-shadow-lg border border-white">
      <RoundedButton onClick={handleClick}>
        <Clipboard size={32} />
      </RoundedButton>
    </div>
  );
};
