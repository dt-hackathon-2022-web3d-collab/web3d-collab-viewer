import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 ">
      Hello
    </div>
  );
}

export default App;
