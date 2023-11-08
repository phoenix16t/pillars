import { StrictMode, useCallback, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import throttle from "lodash/throttle";

import { Cube, TiltBase } from "./components";

import "./style.scss";

const App = ({
  baseHeight,
  baseWidth,
  delay,
  detectionRadius,
  horizontalCount,
  maxPillarHeight,
  pillarPadding,
  verticalCount,
}: {
  baseHeight: number;
  baseWidth: number;
  delay: number;
  detectionRadius: number;
  horizontalCount: number;
  maxPillarHeight: number;
  pillarPadding: number;
  verticalCount: number;
}) => {
  const [isMouseClicked, setIsMouseClicked] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    ({ clientX, clientY }: { clientX: number; clientY: number }) => {
      setMousePosition({ x: clientX, y: clientY });
    },
    [],
  );

  const mouseDetectionRate = useMemo(() => {
    return isMouseClicked ? 10 : delay;
  }, [delay, isMouseClicked]);

  const debouncedMouseHandler = useMemo(
    () => throttle(handleMouseMove, mouseDetectionRate),
    [handleMouseMove, mouseDetectionRate],
  );

  const cubeWrapperStyle = useMemo(() => {
    return {
      height: `${100 / verticalCount}%`,
      padding: `${pillarPadding}px`,
      width: `${100 / horizontalCount}%`,
    };
  }, [horizontalCount, pillarPadding, verticalCount]);

  return (
    <div
      className="app"
      onMouseDown={() => setIsMouseClicked(true)}
      onMouseUp={() => setIsMouseClicked(false)}
      onMouseMove={debouncedMouseHandler}
    >
      <TiltBase
        height={baseHeight}
        isMouseClicked={isMouseClicked}
        mousePosition={mousePosition}
        width={baseWidth}
      >
        <>
          {Array.from(Array(verticalCount).keys()).map((y) =>
            Array.from(Array(horizontalCount).keys()).map((x) => {
              return (
                <li key={`${x}-${y}`} style={cubeWrapperStyle}>
                  <Cube
                    detectionRadius={detectionRadius}
                    isMouseClicked={isMouseClicked}
                    maxPillarHeight={maxPillarHeight}
                    mousePosition={mousePosition}
                  />
                </li>
              );
            }),
          )}
        </>
      </TiltBase>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <StrictMode>
    <App
      baseHeight={500}
      baseWidth={500}
      delay={100}
      detectionRadius={500}
      horizontalCount={5}
      maxPillarHeight={200}
      pillarPadding={10}
      verticalCount={5}
    />
  </StrictMode>,
);
