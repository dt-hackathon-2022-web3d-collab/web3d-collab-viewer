import { useState } from "react";

const NameModal = ({ onSubmit }) => {
  const [showModal, setShowModal] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (onSubmit) {
      onSubmit(event.target.username.value);
    }

    setShowModal(false);
  };

  return (
    showModal && (
      <div
        tabIndex="-1"
        className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full justify-center items-center bg-gray-700 bg-opacity-50"
      >
        <div className="relative p-4 w-full max-w-md h-full md:h-auto mx-auto mt-16">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="py-6 px-6 lg:px-8">
              <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                Please enter your name
              </h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="name-input"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name-input"
                    name="username"
                    autoFocus
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default NameModal;
