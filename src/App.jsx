import { Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import Room from "./pages/Room";
import { useGetOrdered } from "./queries/owen-wilson/owen-wilson-query";

const App = () => {
  const { isLoading, data } = useGetOrdered(6);

  return (
    <Routes>
      <Route exact path="/rooms/:roomId" element={<Room />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;
