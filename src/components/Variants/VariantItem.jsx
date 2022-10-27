import { useState } from "react";
import classNames from "classnames";

const VariantItem = ({ label, onClick, annotations }) => {
  const [hovering, setHovering] = useState(false);

  const annotationEl = annotations ? (
    <div className="absolute bottom-0 right-0 border bg-white w-1/2 h-1/2 text-center text-sm font-bold">
      {annotations}
    </div>
  ) : null;

  return (
    <div
      className="bg-sky-300 relative w-10 h-10 mb-1 mr-1 rounded-full cursor-pointer relative"
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className={classNames(
          "absolute w-auto py-1 px-2 -top-2 left-0 transform -translate-y-full rounded bg-white drop-shadow-md lowercase first-letter:uppercase z-20 whitespace-nowrap",
          {
            hidden: !hovering,
          }
        )}
      >
        {label}
      </div>
      {annotationEl}
    </div>
  );
};

export default VariantItem;
