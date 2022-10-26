const VariantItem = ({ title, onClick }) => (
  <div className="bg-sky-300 mb-1" onClick={onClick}>
    {title}
  </div>
);

export default VariantItem;
