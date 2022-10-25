import { useEffect, useState } from "react";

const Viewer = () => {
    const [{viewer, context}, setState] = useState({
      context: null, viewer: null,
    });

   useEffect(() => {
      setup();
    
      document.addEventListener("DOMContentLoaded", async () => {

      
      });
    
   }, []);

    async function setup() {
      const viewerDom = document.querySelector("needle-engine");
      setState({ viewer: viewerDom, context: await viewerDom?.getContext() });
    }

    return (
      <needle-engine>
          <div className="loading"></div>
              <div id="overlay" className="overlay ar desktop">
          </div>
      </needle-engine>
    )
}

export default Viewer;