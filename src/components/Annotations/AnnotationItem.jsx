export const AnnotationItem = ({ onClick, ...annotation }) => {
  const { message, user, resolved } = annotation;

  const handleOnClick = (event) => {
    onClick?.(event, annotation);
  };

  return (
    <div
      className="bg-black/10 mb-2 rounded border border-white px-2"
      onClick={handleOnClick}
    >
      {resolved && <del>{message}</del>}
      {!resolved && message}
      <br /> - {user.name} at {new Date(user.updatedAt).toLocaleString()}
    </div>
  );
};
