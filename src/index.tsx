import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { App } from "app";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <StrictMode>
    <App
      baseHeight={500}
      baseWidth={500}
      detectionRate={100}
      detectionRadius={500}
      horizontalCount={5}
      maxPillarHeight={200}
      pillarPadding={10}
      verticalCount={5}
    />
  </StrictMode>,
);
