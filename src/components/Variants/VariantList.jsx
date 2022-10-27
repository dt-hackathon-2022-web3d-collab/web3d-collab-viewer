import { useEffect, useState } from "react";

import VariantItem from "./VariantItem.jsx";

const VariantList = ({onChange, selectedVariant, isFollowing}) => {
  const [variantOptions, setVariantOptions] = useState([]);
  const [context, setContext] = useState();

  useEffect(() => {
    const setup = async () => {
      const viewerDom = document.querySelector("needle-engine");
      const context = await viewerDom?.getContext();
      setContext(context);
      setTimeout(() => {
        setVariantOptions(context.variantOptions ?? []);
      }, 1000);
    };

    setup();
  }, []);

  useEffect(() => {
    if(!selectedVariant && !isFollowing) return;
    
    context.selectVariantById(selectedVariant);
  }, [selectedVariant])

  return (
    <div className="bg-white h-full overflow-y-auto overflow-x-hidden">
      <h3>Variants</h3>
      {variantOptions.map(({ name, options }) => (
        <div key={name}>
          <h4>{name}</h4>
          {options.map(({ label, id, select }) => (
            <VariantItem key={id} label={label} onClick={() => {
              select();
              onChange(id);
            }} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default VariantList;
