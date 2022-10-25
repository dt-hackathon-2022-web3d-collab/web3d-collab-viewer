import { Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import Room from "./pages/Room";

const App = () => (
  <Routes>
    <Route exact path="/rooms/:roomId" element={<Room />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default App;
