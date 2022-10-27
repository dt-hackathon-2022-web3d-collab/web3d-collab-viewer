import { useCallback, useEffect } from "react";
import { CameraRotate, ChatCircleDots, ScribbleLoop } from "phosphor-react";
import { CharKey } from "./CharKey.jsx";
import { RoundedButton } from "./RoundedButton";
import modes from "../constants/modes.js";

const keyCodes = {
  65: modes.view,
  83: modes.annotate,
  68: modes.point,
};

const modeKeys = Object.fromEntries(
  Object.entries(keyCodes).map(([code, mode]) => [
    mode,
    String.fromCharCode(code),
  ])
);

const buttons = {
  [modes.view]: <CameraRotate size={30} />,
  [modes.annotate]: <ChatCircleDots size={30} />,
  [modes.point]: <ScribbleLoop size={30} />,
};

const Toolbar = ({ mode, onModeChanged }) => {
  const handleKeyPress = useCallback(
    (event) => {
      const newMode = keyCodes[event.keyCode];

      if (newMode) {
        onModeChanged(newMode);
      }
    },
    [onModeChanged]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="flex">
      {Object.entries(buttons).map(([key, icon]) => (
        <div key={key} className="flex flex-col">
          <CharKey>{modeKeys[key]}</CharKey>
          <RoundedButton
            onClick={() => onModeChanged(key)}
            selected={mode === key}
          >
            {icon}
          </RoundedButton>
        </div>
      ))}
    </div>
  );
};

export default Toolbar;
