export const RoundedButton = ({ children, onClick, selected }) => (
  <div
    className={
      (selected ? "bg-blue-900" : "bg-blue-600") +
      " hover:bg-blue-800 cursor-pointer text-white rounded m-1 p-3"
    }
    onClick={onClick}
  >
    {children}
  </div>
);
