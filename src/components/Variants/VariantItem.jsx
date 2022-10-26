const VariantItem = ({ label, onClick }) => (
  <div
    className="bg-sky-300 mb-0.5 px-1 rounded border border-solid border-black cursor-pointer"
    onClick={onClick}
  >
    {label}
  </div>
);

export default VariantItem;
