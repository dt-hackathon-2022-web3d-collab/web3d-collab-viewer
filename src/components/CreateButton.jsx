import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateSession } from "../queries/sessions/sessions-query.js";

const CreateButton = () => {
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const {data, mutate} = useCreateSession();

  const handleClick = () => {
    mutate("product-id");
    setDisabled(true);
  };

  useEffect(() => {
    if (data?.id) {
      navigate(`/rooms/${data.id}`);
    }
  }, [data, navigate]);

  return (
    <button onClick={handleClick} disabled={disabled}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Create Room
    </button>);
};

export default CreateButton;
