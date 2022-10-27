import { CameraRotate, ChatCircleDots, ScribbleLoop } from "phosphor-react";
import { RoundedButton } from "./RoundedButton";

const Toolbar = ({ mode, onModeChanged }) => {
  const buttons = {
    view: <CameraRotate size={30} />,
    annotate: <ChatCircleDots size={30} />,
    point: <ScribbleLoop size={30} />,
  };

  return (
    <div className="flex">
      {Object.entries(buttons).map(([key, icon]) => (
        <RoundedButton
          key={key}
          onClick={() => onModeChanged(key)}
          selected={mode === key}
        >
          {icon}
        </RoundedButton>
      ))}
    </div>
  );
};

export default Toolbar;
