import { useParams } from "react-router";
import { colourClassArray } from "../constants/colours";
import { useGetUsersInSession } from "../queries/users/users-query";

const Participants = () => {
  const { roomId } = useParams();
  const { data } = useGetUsersInSession(roomId);
  const participants = data?.rows ?? [];

  return participants.map((participant, index) => {
    const colourIndex = index % colourClassArray.length;
    const colour = colourClassArray[colourIndex];

    return (
      <div
        key={`participant-${index}`}
        className={`inline-block p-3 m-1 ${colour}`}
      >
        {participant.name}
      </div>
    );
  });
};

export default Participants;
