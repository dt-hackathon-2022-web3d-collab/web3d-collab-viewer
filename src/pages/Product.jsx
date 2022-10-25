import { generatePath, useNavigate, useParams } from "react-router-dom";
import routes from "../constants/routes.js";
import {
  useCreateSession,
  useGetAllSessions,
} from "../queries/sessions/sessions-query.js";
import { useEffect } from "react";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { data: getAllData, isLoading } = useGetAllSessions();
  const { data: createData, mutate } = useCreateSession();

  useEffect(() => {
    if (!isLoading) {
      const sessionMatch = getAllData?.rows?.find(
        (session) => session.productId === productId
      );

      if (sessionMatch?.id) {
        navigate(generatePath(routes.room, { roomId: sessionMatch.id }));
      } else {
        mutate(productId);
      }
    }
  }, [isLoading, getAllData, productId, navigate, mutate]);

  useEffect(() => {
    if (createData?.id) {
      navigate(generatePath(routes.room, { roomId: createData.id }));
    }
  }, [createData, navigate]);
};

export default Product;
