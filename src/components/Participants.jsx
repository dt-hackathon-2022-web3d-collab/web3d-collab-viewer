import { useParams } from "react-router";
import { useGetUsersInSession } from "../queries/users/users-query";

const Participants = () => {
  const { roomId } = useParams();
  const { data } = useGetUsersInSession(roomId);
  const participants = data?.rows ?? [];

  return participants.map((participant, index) => (
    <div key={`participant-${index}`} className="inline-block bg-white p-3 m-1">
      {participant.name}
    </div>
  ));
};

export default Participants;
