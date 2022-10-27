import classNames from "classnames";

export const CharKey = ({ children, selected }) => (
  <div
    className={classNames(
      "mx-auto text-xs px-2 rounded shrink absolute bottom-0 ml-0.5 transform -translate-x-[1rem] -translate-y-[0.3rem]",
      {
        "text-black/50 ": !selected,
        "text-white": selected,
      }
    )}
  >
    {children}
  </div>
);
