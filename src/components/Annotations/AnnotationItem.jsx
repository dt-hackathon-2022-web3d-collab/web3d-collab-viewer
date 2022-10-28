import moment from "moment";

export const AnnotationItem = ({ onClick, ...annotation }) => {
  const { message, user, resolved } = annotation;

  const handleOnClick = (event) => {
    onClick?.(event, annotation);
  };

  return (
    <div className="px-2" onClick={handleOnClick}>
      <div className="bg-white p-3 drop-shadow-md">
        {resolved && <del>{message}</del>}
        {!resolved && message}
      </div>
      <div class="w-10 overflow-hidden inline-block transform rotate-180">
        <div class=" h-5 w-5 bg-white rotate-45 transform origin-bottom-left"></div>
      </div>

      <div className="flex flex-col">
        <div>{user.name}</div>

        <div className="text-sm">
          {moment(new Date(user.updatedAt)).fromNow()}
        </div>
      </div>
    </div>
  );
};
