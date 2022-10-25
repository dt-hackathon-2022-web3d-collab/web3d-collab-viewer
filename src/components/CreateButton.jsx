import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateSession } from "../queries/sessions/sessions-query.js";

const TEMP_PRODUCT_ID = "002c59ac-32b7-453a-ab4b-338bdc988b1e";

const CreateButton = () => {
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const { data, mutate } = useCreateSession();

  const handleClick = () => {
    mutate(TEMP_PRODUCT_ID);
    setDisabled(true);
  };

  useEffect(() => {
    if (data?.id) {
      navigate(`/rooms/${data.id}`);
    }
  }, [data, navigate]);

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Create Room
    </button>
  );
};

export default CreateButton;
