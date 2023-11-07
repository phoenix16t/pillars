import { useEffect, useMemo, useState } from "react";
import "./style.scss";

type MousePosition = {
  x: number;
  y: number;
};

export const TiltBase = ({
  children,
  height,
  isMouseClicked,
  mousePosition,
  width,
}: {
  children: JSX.Element | JSX.Element[];
  height: number;
  isMouseClicked: boolean;
  mousePosition: MousePosition;
  width: number;
}) => {
  const [isHoldingMouse, setIsHoldingMouse] = useState(false);
  const [baseRotationSnap, setBaseRotationSnap] = useState({ x: 0, y: 0 });
  const [mousePositionSnap, setMousePositionSnap] = useState({ x: 0, y: 0 });

  const baseRotation = useMemo(() => {
    let x = baseRotationSnap.x;
    let y = baseRotationSnap.y;
    if (isHoldingMouse) {
      x += mousePositionSnap.x - mousePosition.x;
      y += mousePositionSnap.y - mousePosition.y;
    }
    return { x, y };
  }, [baseRotationSnap, isHoldingMouse, mousePosition, mousePositionSnap]);

  const rotationString = useMemo(() => {
    return `rotateX(${baseRotation.y}deg) rotateY(${-baseRotation.x}deg)`;
  }, [baseRotation]);

  useEffect(() => {
    if (isMouseClicked && !isHoldingMouse) {
      setIsHoldingMouse(true);
      setMousePositionSnap({ x: mousePosition.x, y: mousePosition.y });
    } else if (!isMouseClicked && isHoldingMouse) {
      setIsHoldingMouse(false);
      setBaseRotationSnap({ x: baseRotation.x, y: baseRotation.y });
    }
  }, [baseRotation, isHoldingMouse, isMouseClicked, mousePosition]);

  return (
    <ul
      className="tilt-base"
      style={{
        height: height,
        transform: rotationString,
        width: width,
      }}
    >
      {children}
      {/* tilt<br></br>base<br></br>
      height - {height}
      <br></br>
      width - {width}
      <br></br>
      isMouseClicked - {isMouseClicked}
      <br></br>
      mousePosition.x - {mousePosition.x}
      <br></br>
      baseRotationSnap.x - {baseRotationSnap.x}
      <br></br>
      mousePositionSnap.x - {mousePositionSnap.x}
      <br></br> */}
      {/* baserotation - {baseRotation.x} */}
      {/* <br></br>
      ttttt - {rotationString} */}
    </ul>
  );
};
