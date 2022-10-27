import { useEffect, useState } from "react";

import VariantItem from "./VariantItem.jsx";
import { CaretLeft, CaretRight } from "phosphor-react";
import classNames from "classnames";

const Toggle = ({ direction, ...rest }) => (
  <div className="w-10 h-10 border border-red-800" {...rest}>
    {direction === "in" && <CaretLeft size={32} />}
    {direction === "out" && <CaretRight size={32} />}
  </div>
);

const VariantList = ({ onChange, selectedVariant, isFollowing }) => {
  const [variantOptions, setVariantOptions] = useState([]);
  const [context, setContext] = useState();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    console.log("=>", variantOptions);
  }, [variantOptions]);

  useEffect(() => {
    if (!selectedVariant && !isFollowing) return;

    context.selectVariantById(selectedVariant);
  }, [selectedVariant]);

  return (
    <>
      <Toggle
        direction={drawerOpen ? "in" : "out"}
        onClick={() => setDrawerOpen(!drawerOpen)}
      />
      <div
        id="VariantList"
        className={classNames(
          "backdrop-blur-md bg-white/50 border border-white p-3 transition-transform",
          {
            "-translate-x-full": !drawerOpen,
            "translate-x-0": drawerOpen,
          }
        )}
      >
        <h3 className="mb-6">Variants</h3>
        {variantOptions.map(({ name, options }) => (
          <div key={name} className="pb-4 bg-white-600/74">
            <h4>{name}</h4>
            <div className="grid grid-flow-col auto-cols-max gap-1 border border-red-800">
              {options.map(({ label, id, select }) => (
                <VariantItem
                  key={id}
                  label={label}
                  onClick={() => {
                    select();
                    onChange(id);
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default VariantList;
