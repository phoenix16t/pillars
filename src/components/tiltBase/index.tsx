import { useEffect, useMemo, useState } from "react";
import { MousePosition } from "../../types";
import "./style.scss";

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
    const x = isHoldingMouse ? mousePositionSnap.x - mousePosition.x : 0;
    const y = isHoldingMouse ? mousePositionSnap.y - mousePosition.y : 0;

    return {
      x: x + baseRotationSnap.x,
      y: y + baseRotationSnap.y,
    };
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
    </ul>
  );
};
