export const AnnotationItem = ({ onClick, ...annotation }) => {
  const { message, user } = annotation;

  const handleOnClick = (event) => {
    onClick?.(event, annotation);
  };

  return (
    <div className="bg-black/10 mb-2" onClick={handleOnClick}>
      {message}
      <br /> - {user.name} at {new Date(user.updatedAt).toLocaleString()}
    </div>
  );
};