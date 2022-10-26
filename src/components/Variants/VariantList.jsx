import { useEffect, useState } from "react";
import VariantItem from "./VariantItem.jsx";

const VariantList = () => {
  const [variantOptions, setVariantOptions] = useState([]);

  useEffect(() => {
    const setup = async () => {
      const viewerDom = document.querySelector("needle-engine");
      const context = await viewerDom?.getContext();
      setTimeout(() => {
        setVariantOptions(context.variantOptions ?? []);
      }, 1000);
    };

    setup();
  }, []);

  return (
    <div className="bg-white h-full overflow-y-auto overflow-x-hidden">
      <h3>Variants</h3>
      {variantOptions.map(({ name, options }) => (
        <div key={name}>
          <h4>{name}</h4>
          {options.map(({ label, id, select }) => (
            <VariantItem key={id} title={label} onClick={select} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default VariantList;
