import { useState } from "react";
import { useGetOrdered } from "./queries/owen-wilson/owen-wilson-query";

function App() {
  const [count, setCount] = useState(0);
  const { isLoading, data } = useGetOrdered(6);

  console.log(data);

  return (
    <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 ">
      Hello
      {!isLoading && (
        <video width="480" height="360" controls>
          <source src={data.video["360p"]} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

export default App;
