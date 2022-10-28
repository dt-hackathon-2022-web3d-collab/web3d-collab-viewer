import { CaretLeft, CaretRight } from "phosphor-react";

export const DrawerToggle = ({ direction, ...rest }) => (
  <div
    className="w-10 h-10 bg-white rounded drop-shadow-md flex items-center justify-center pointer-events-auto"
    {...rest}
  >
    {direction === "in" && <CaretLeft size={24} />}
    {direction === "out" && <CaretRight size={24} />}
  </div>
);
