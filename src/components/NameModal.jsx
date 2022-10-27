import { useState } from "react";

const NameModal = ({ onSubmit }) => {
  const [showModal, setShowModal] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (onSubmit && event.target.username.value) {
      onSubmit(event.target.username.value);
      setShowModal(false);
    }
  };

  const renderModal = () => (
    <div className="w-full h-full absolute z-20 bg-slate-400/75 backdrop-blur-md ">
      <div className="relative p-4 w-full max-w-md h-full md:h-auto mx-auto mt-16">
        <div className="relative bg-white/50 drop-shadow-lg border border-white rounded">
          <div className="py-6 px-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900">Welcome!</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="mb-6">
                <input
                  type="text"
                  id="name-input"
                  name="username"
                  placeholder="Enter a username"
                  autoFocus
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  onKeyDown={(event) => event.stopPropagation()}
                />
              </div>
              <button
                type="submit"
                className="w-full rounded text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return showModal && renderModal();
};

export default NameModal;
