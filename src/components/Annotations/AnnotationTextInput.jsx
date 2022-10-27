import { PaperPlaneRight } from "phosphor-react";

export const AnnotationTextInput = ({ label, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <label
        htmlFor="text-input"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        {label}
      </label>
      <div className="flex flex-row">
        <input
          id="text-input"
          type="text"
          name="text"
          className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onKeyDown={(event) => event.stopPropagation()}
        />
        <button
          type="submit"
          className="mb-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          name="submitter"
        >
          <PaperPlaneRight />
        </button>
      </div>
    </form>
  );
};
