import { useState, useCallback, useMemo } from "react";
import { throttle } from "lodash";

import { TiltBase, Cube } from "components";

import "./style.scss";

const TILT_BASE_DETECTION_RATE = 100;

export const App = ({
  baseHeight,
  baseWidth,
  detectionRadius,
  detectionRate,
  horizontalCount,
  maxPillarHeight,
  pillarPadding,
  verticalCount,
}: {
  baseHeight: number;
  baseWidth: number;
  detectionRadius: number;
  detectionRate: number;
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
    return isMouseClicked ? TILT_BASE_DETECTION_RATE : detectionRate;
  }, [detectionRate, isMouseClicked]);

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

  const handleMouseDown = useCallback(
    ({ clientX, clientY }: { clientX: number; clientY: number }) => {
      setIsMouseClicked(true);
      handleMouseMove({ clientX, clientY });
    },
    [handleMouseMove],
  );

  const handleMouseUp = useCallback(() => {
    setIsMouseClicked(false);
  }, []);

  return (
    <div
      className="app"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
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
            Array.from(Array(horizontalCount).keys()).map((x) => (
              <li key={`${x}-${y}`} style={cubeWrapperStyle}>
                <Cube
                  detectionRadius={detectionRadius}
                  isMouseClicked={isMouseClicked}
                  maxPillarHeight={maxPillarHeight}
                  mousePosition={mousePosition}
                />
              </li>
            )),
          )}
        </>
      </TiltBase>
    </div>
  );
};
