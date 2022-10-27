import { useContext, useState } from "react";

import { Context } from "../pages/Room";
import { avatarArray } from "../constants/avatars";
import { colourClassArray } from "../constants/colours";

const Participants = ({ participants, onSelectParticipant, selectedParticipant }) => {
  const { user } = useContext(Context);

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
        onClick={() => onSelectParticipant(participant)}
      >
        <div className={selectedParticipant?.id === participant.id ? `bg-yellow-200` : ``}>
          <div className={`p-2 m-1 ${colour} rounded-full w-20`}>
            <div
              className="rounded-full bg-black w-16 h-16 bg-cover"
              style={{ backgroundImage: `url('${thumbImage}')` }}
            ></div>
          </div>
          <div className="font-bold truncate w-20" title={participant.name}>
            {participant.id === user?.id && <span>*</span>}
            {participant.name}
          </div>
        </div>
      </div>
    );
  });
};

export default Participants;
