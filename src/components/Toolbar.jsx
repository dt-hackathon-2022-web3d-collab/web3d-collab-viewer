import { Planet, Pencil, ScribbleLoop } from "phosphor-react";
import { RoundedButton } from "./RoundedButton";

const Toolbar = () => {
  return (
    <div className="flex">
      <RoundedButton>
        <Planet size={30} />
      </RoundedButton>
      <RoundedButton>
        <Pencil size={30} />
      </RoundedButton>
      <RoundedButton>
        <ScribbleLoop size={30} />
      </RoundedButton>
    </div>
  );
};

export default Toolbar;
