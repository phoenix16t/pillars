import {
  StrictMode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom/client";
import throttle from "lodash/throttle";

import { Cube, TiltBase } from "./components";

import "./style.scss";

const App = ({
  baseHeight,
  baseWidth,
  delay,
  horizontalCount,
  verticalCount,
}: {
  baseHeight: number;
  baseWidth: number;
  delay: number;
  horizontalCount: number;
  verticalCount: number;
}) => {
  const [isMouseClicked, setIsMouseClicked] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const refs = useRef<HTMLDivElement[]>([]);

  // console.log("refs", refs.current[0]?.getBoundingClientRect());

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

  const cubeStyle = useMemo(() => {
    return {
      height: `${100 / verticalCount}%`,
      width: `${100 / horizontalCount}%`,
    };
  }, [horizontalCount, verticalCount]);

  const pillarCoordinates = useMemo(() => {
    if (!isMouseClicked) {
      return refs.current.map((ref) => {
        const obj = ref.getBoundingClientRect();
        return {
          x: obj.x + obj.width / 2,
          y: obj.y + obj.height / 2,
        };
      });
    }
  }, [isMouseClicked]);

  console.log("pillarCoordinates", pillarCoordinates);

  console.log("refs", refs);

  useEffect(() => {
    // if (!isMouseClicked) {
    const blah = refs.current.map((ref) => {
      const obj = ref.getBoundingClientRect();
      return {
        x: obj.x + obj.width / 2,
        y: obj.y + obj.height / 2,
      };
    });

    console.log("blah", blah);
    // }
  }, []);

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
              // console.log("y", y);
              // console.log("x", x);
              const index = y * horizontalCount + x;
              const percentage = 10;

              return (
                <li key={index} style={cubeStyle}>
                  <Cube
                    ref={(el: HTMLDivElement) => (refs.current[index] = el)}
                    percentage={percentage}
                  />
                  {index}
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
      horizontalCount={5}
      verticalCount={7}
    />
  </StrictMode>,
);
