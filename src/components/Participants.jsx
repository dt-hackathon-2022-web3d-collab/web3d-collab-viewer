import { colourClassArray } from "../constants/colours";
import { avatarArray } from "../constants/avatars";

const Participants = ({ participants }) => {
  return participants.map((participant, index) => {
    const colourIndex = index % colourClassArray.length;
    const colour = colourClassArray[colourIndex];
    const thumbImage = avatarArray[colourIndex];
    return (
      <div key={`participant-${index}`} className="inline-block">
        <div className={`p-2 m-1 ${colour} rounded-full w-20`}>
          <div
            className="rounded-full bg-black w-16 h-16 bg-cover"
            style={{ backgroundImage: `url('${thumbImage}')` }}
          ></div>
        </div>
        <div className="font-bold truncate w-20" title={participant.name}>
          {participant.name}
        </div>
      </div>
    );
  });
};

export default Participants;
