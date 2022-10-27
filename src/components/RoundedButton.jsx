import classNames from "classnames";

export const RoundedButton = ({ children, onClick, selected }) => (
  <div
    className={classNames("cursor-pointer  rounded m-1 p-3", {
      "bg-blue-900": selected,
      transparent: !selected,
      "text-white": selected,
      "text-black": !selected,
    })}
    onClick={onClick}
  >
    {children}
  </div>
);
