import { useEffect, useState } from "react";

import VariantItem from "./VariantItem.jsx";
import { CaretLeft, CaretRight } from "phosphor-react";
import classNames from "classnames";

const Toggle = ({ direction, ...rest }) => (
  <div
    className="w-10 h-10 bg-white rounded drop-shadow-md flex items-center justify-center"
    {...rest}
  >
    {direction === "in" && <CaretLeft size={24} />}
    {direction === "out" && <CaretRight size={24} />}
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
    <div>
      <div className="ml-2 mb-2">
        <Toggle
          direction={drawerOpen ? "in" : "out"}
          onClick={() => setDrawerOpen(!drawerOpen)}
        />
      </div>
      <div
        id="VariantList"
        className={classNames(
          "ml-2 backdrop-blur-sm bg-white/50 drop-shadow-lg border border-white p-3 rounded transition-transform",
          {
            "-translate-x-[22rem]": !drawerOpen,
            "translate-x-0": drawerOpen,
          }
        )}
      >
        <h3 className="mb-6">Variants</h3>
        {variantOptions.map(({ name, options }) => (
          <div key={name} className="pb-4 bg-white-600/74">
            <h4 className="lowercase first-letter:uppercase">{name}</h4>
            <div className="flex flex-wrap">
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
    </div>
  );
};

export default VariantList;
