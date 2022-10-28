import moment from "moment";

export const ReplyItem = ({ message, userName, updatedAt }) => {
  return (
    <div className="bg-white/75 p-3 mb-2">
      {message}
      <br /> - {userName}, {moment(new Date(updatedAt)).fromNow()}
    </div>
  );
};
