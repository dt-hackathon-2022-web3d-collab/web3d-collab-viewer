const VariantItem = ({ label, onClick }) => (
  <div
    className="bg-sky-300 relative w-10 h-10 mb-0.5 px-1 rounded-full cursor-pointer relative"
    onClick={onClick}
  >
    <div className="absolute">{label}</div>
  </div>
);

export default VariantItem;
