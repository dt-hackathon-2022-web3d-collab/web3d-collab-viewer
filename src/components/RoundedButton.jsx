export const RoundedButton = ({ children, onClick }) => (
  <div
    className="bg-blue-600 hover:bg-blue-800 text-white rounded m-1 p-3"
    onClick={onClick}
  >
    {children}
  </div>
);
