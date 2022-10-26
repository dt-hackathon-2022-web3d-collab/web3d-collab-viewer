import { CameraRotate, ChatCircleDots, ScribbleLoop } from "phosphor-react";
import { RoundedButton } from "./RoundedButton";

const Toolbar = ({ onModeChanged }) => {
  return (
    <div className="flex">
      <RoundedButton onClick={() => onModeChanged("view")}>
        <CameraRotate size={30} />
      </RoundedButton>
      <RoundedButton onClick={() => onModeChanged("annotate")}>
        <ChatCircleDots size={30} />
      </RoundedButton>
      <RoundedButton onClick={() => onModeChanged("point")}>
        <ScribbleLoop size={30} />
      </RoundedButton>
    </div>
  );
};

export default Toolbar;
