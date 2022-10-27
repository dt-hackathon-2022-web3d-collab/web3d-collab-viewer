import { useEffect, useState } from "react";
import { useParams } from "react-router";

import VariantItem from "./VariantItem.jsx";

import classNames from "classnames";

import { DrawerToggle } from "../DrawerToggle";
import { useGetAllAnnotations } from "../../queries/annotations/annotations-query.js";

const VariantList = ({ onChange, selectedVariant, isFollowing }) => {
  const [variantOptions, setVariantOptions] = useState([]);
  const [context, setContext] = useState();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { roomId: sessionId } = useParams();
  const annotationsQuery = useGetAllAnnotations(sessionId);

  const annotationCounts = {};
  const annotationVariantIds =
    annotationsQuery.data?.rows?.map(({ variantId }) => variantId) ?? [];

  annotationVariantIds.forEach((id) => {
    if (annotationCounts.hasOwnProperty(id)) {
      annotationCounts[id] += 1;
    } else {
      annotationCounts[id] = 1;
    }
  });

  useEffect(() => {
    const setup = async () => {
      const viewerDom = document.querySelector("needle-engine");
      const context = await viewerDom?.getContext();
      setContext(context);
      setTimeout(() => {
        setVariantOptions(context.variantOptions ?? []);

        const firstVariant = context.variantOptions[0]?.options[0];
        if (firstVariant) {
          const { id, select } = firstVariant;
          onChange(id);
          select();
        }
      }, 1500);
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
    <div className="w-[15rem]">
      <div className="ml-2 mb-2">
        <DrawerToggle
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
                  annotations={annotationCounts[id]}
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
