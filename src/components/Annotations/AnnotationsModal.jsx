import classNames from "classnames";
import { useState } from "react";

const NameModal = ({ onSubmit, onCancel, showModal }) => {
  const renderModal = () => (
    <div className="w-full h-full absolute z-20 bg-zinc-800/20" onClick={onCancel}>
      <div className="relative p-4 w-full max-w-md h-full md:h-auto mx-auto mt-16">
        <div
            className={classNames(
            "ml-2 backdrop-blur-sm bg-white/50 drop-shadow-lg border border-white p-3 rounded transition-transform",
            {
                "-translate-x-[22rem]": !showModal,
                "translate-x-0": showModal,
            }
            )}
        >
        </div>
      </div>
    </div>
  );

  return showModal && renderModal();
};

export default NameModal;
