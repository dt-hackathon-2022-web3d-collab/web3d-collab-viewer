import { useParams } from "react-router";
import { useGetAllAnnotations } from "../queries/annotations/annotations-query";

const Annotations = () => {
  const { roomId: sessionId } = useParams();
  const annotationsQuery = useGetAllAnnotations(sessionId);
  const annotations = annotationsQuery.data?.rows ?? [];

  return (
    <div className="bg-white">
      <h4>Annotations</h4>
      {annotations.map(({ message, user }, index) => (
        <div key={`annotation-${index}`} className="bg-black/10 mb-2">
          {message}
          <br /> - {user.name} at {new Date(user.updatedAt).toLocaleString()}
        </div>
      ))}
    </div>
  );
};

export default Annotations;
