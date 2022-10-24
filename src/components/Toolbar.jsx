import { Planet, Pencil, ScribbleLoop } from "phosphor-react";

const ToolbarControl = ({ children }) => (
  <div className="bg-white rounded m-1 p-3">{children}</div>
);

const Toolbar = () => {
  return (
    <div className="flex">
      <ToolbarControl>
        <Planet size={30} />
      </ToolbarControl>
      <ToolbarControl>
        <Pencil size={30} />
      </ToolbarControl>
      <ToolbarControl>
        <ScribbleLoop size={30} />
      </ToolbarControl>
    </div>
  );
};

export default Toolbar;
