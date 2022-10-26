export const ReplyItem = ({ message, userName, updatedAt }) => {
  return (
    <div className="bg-black/10 mb-2">
      {message}
      <br /> - {userName} at {new Date(updatedAt).toLocaleString()}
    </div>
  );
};
