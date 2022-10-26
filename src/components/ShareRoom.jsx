import { Clipboard } from "phosphor-react";
import { useParams } from "react-router-dom";

export default () => {
  const { roomId } = useParams();

  const handleClick = () => {
    navigator.clipboard.writeText(`${window.location.host}/rooms/${roomId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white hover:bg-blue-700 font-bold py-2 px-4 rounded"
    >
      <Clipboard size={32} />
    </button>
  );
};
