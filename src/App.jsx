import { Route, Routes } from "react-router-dom";
import routes from "./constants/routes.js";
import PageNotFound from "./pages/PageNotFound";
import Product from "./pages/Product";
import Room from "./pages/Room";

const App = () => (
  <Routes>
    <Route exact path={routes.room} element={<Room />} />
    <Route exact path={routes.product} element={<Product />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default App;
