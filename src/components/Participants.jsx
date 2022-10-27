import React, { useContext } from "react";
import { Context } from "../pages/Room";
import { avatarArray } from "../constants/avatars";
import { colourClassArray } from "../constants/colours";
import classNames from "classnames";

const Participants = ({
  participants,
  onSelectParticipant,
  selectedParticipant,
}) => {
  const { user } = useContext(Context);

  return participants.map((participant, index) => {
    const colourIndex = index % colourClassArray.length;
    const avatarIndex = index % avatarArray.length;
    const colour = colourClassArray[colourIndex];
    const thumbImage = avatarArray[avatarIndex];
    const isSelected = selectedParticipant?.id === participant.id;
    const isMyself = participant.id === user?.id;

    if (!participant.online) {
      return <React.Fragment key={`participant-${index}`} />;
    }

    return (
      <div
        key={`participant-${index}`}
        className="inline-block cursor-pointer"
        onClick={() => onSelectParticipant(participant)}
      >
        <div className="flex flex-col items-center">
          <div
            className={`m-1 p-1 ${colour} w-12 h-12 rounded-full drop-shadow-md`}
          >
            <div
              className="rounded-full w-full h-full bg-black bg-cover"
              style={{ backgroundImage: `url('${thumbImage}')` }}
            ></div>
          </div>
        </div>
        <div
          className={classNames(
            `rounded-full drop-shadow-md  truncate w-20 ${
              isSelected ? colour : ""
            }`,
            {
              "text-white": isSelected,
              "font-bold": isMyself,
            }
          )}
          title={participant.name}
        >
          {participant.name}
        </div>
      </div>
    );
  });
};

export default Participants;
