import { useEffect, useMemo, useRef, useState } from "react";
import { MousePosition, Sides } from "../../types";
import { useStyle } from "./useStyles";
import "./style.scss";

export const Cube = ({
  detectionRadius,
  isMouseClicked,
  maxPillarHeight,
  mousePosition,
}: {
  detectionRadius: number;
  isMouseClicked: boolean;
  maxPillarHeight: number;
  mousePosition: MousePosition;
}): JSX.Element => {
  const [componentIsReady, setComponentIsReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const coordinates = useMemo(() => {
    if (!isMouseClicked && componentIsReady) {
      const obj = ref.current!.getBoundingClientRect();
      return {
        x: obj.x + obj.width / 2,
        y: obj.y + obj.height / 2,
      };
    }

    return { x: 0, y: 0 };
  }, [isMouseClicked, componentIsReady]);

  const percentage = useMemo(() => {
    if (!isMouseClicked) {
      const x = Math.pow(mousePosition.x - coordinates.x, 2);
      const y = Math.pow(mousePosition.y - coordinates.y, 2);
      const distance = Math.sqrt(x + y);

      return distance <= detectionRadius ? 1 - distance / detectionRadius : 0;
    }

    return 0;
  }, [coordinates, detectionRadius, isMouseClicked, mousePosition]);

  const { combinedStyles } = useStyle({ maxPillarHeight, percentage });

  // note: this useEffect ensures that ref.current is populated before
  // the memos kick off
  useEffect(() => {
    setComponentIsReady(true);
  }, []);

  return (
    <div className="cube" ref={ref}>
      <div className="face up" style={combinedStyles[Sides.up]} />
      <div className="face down" style={combinedStyles[Sides.down]} />
      <div className="face left" style={combinedStyles[Sides.left]} />
      <div className="face right" style={combinedStyles[Sides.right]} />
      <div className="face top" style={combinedStyles[Sides.top]} />
    </div>
  );
};
