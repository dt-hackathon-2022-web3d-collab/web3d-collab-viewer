import { useState } from "react";
import { colourClassArray } from "../constants/colours";
import { avatarArray } from "../constants/avatars";
import { usePersistentContext } from "../hooks/usePersistentContext/usePersistentContext";
import { useEffect } from "react";

const Participants = ({ participants }) => {
  const [user] = usePersistentContext("user");
  const [following, setFollowing] = useState(null);

  useEffect(() => {
    console.log("following", following);
  }, [following]);

  return participants.map((participant, index) => {
    const colourIndex = index % colourClassArray.length;
    const avatarIndex = index % avatarArray.length;
    const colour = colourClassArray[colourIndex];
    const thumbImage = avatarArray[avatarIndex];

    if (!participant.online) {
      return (
        <div key={`participant-${index}`} className="hidden">
          Offline: {participant.name}
        </div>
      );
    }

    return (
      <div
        key={`participant-${index}`}
        className="inline-block"
        onClick={() => setFollowing(index)}
      >
        <div className={following === index ? `bg-yellow-200` : ``}>
          <div className={`p-2 m-1 ${colour} rounded-full w-20`}>
            <div
              className="rounded-full bg-black w-16 h-16 bg-cover"
              style={{ backgroundImage: `url('${thumbImage}')` }}
            ></div>
          </div>
          <div className="font-bold truncate w-20" title={participant.name}>
            {participant.id === user.id && <span>*</span>}
            {participant.name}
          </div>
        </div>
      </div>
    );
  });
};

export default Participants;
