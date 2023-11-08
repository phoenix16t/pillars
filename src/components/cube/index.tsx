import { useEffect, useMemo, useRef, useState } from "react";
import { MousePosition } from "../../types";
import "./style.scss";

enum Sides {
  down,
  left,
  right,
  top,
  up,
}

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

  const height = useMemo(
    () => percentage * maxPillarHeight,
    [maxPillarHeight, percentage],
  );

  const translate = useMemo(() => `translateZ(${height / 2}px)`, [height]);

  const colorStyle = useMemo(() => {
    const value = Math.round(255 * percentage);

    let backgroundColor;
    if (percentage < 1 / 3) {
      backgroundColor = `rgb(255, 255, ${255 - value * 3})`;
    } else if (percentage < 2 / 3) {
      backgroundColor = `rgb(255, ${255 - (value - 85)}, 0)`;
    } else {
      backgroundColor = `rgb(255, ${170 - (value - 170) * 2}, 0)`;
    }

    return { backgroundColor };
  }, [percentage]);

  const topStyle = useMemo(() => {
    return {
      ...colorStyle,
      transform: `translateZ(${height}px)`,
    };
  }, [colorStyle, height]);

  const upDownStyle = useMemo(() => {
    return {
      ...colorStyle,
      height: `${height}px`,
      transform: `${translate} rotateX(-90deg)`,
    };
  }, [colorStyle, height, translate]);

  const leftRightStyle = useMemo(() => {
    return {
      ...colorStyle,
      width: `${height}px`,
      transform: `${translate} rotateY(-90deg)`,
    };
  }, [colorStyle, height, translate]);

  const combinedStyles = useMemo(() => {
    return {
      [Sides.top]: { ...topStyle },
      [Sides.up]: { ...upDownStyle, top: `-${height / 2}px` },
      [Sides.down]: { ...upDownStyle, bottom: `-${height / 2}px` },
      [Sides.left]: { ...leftRightStyle, left: `-${height / 2}px` },
      [Sides.right]: { ...leftRightStyle, right: `-${height / 2}px` },
    };
  }, [height, leftRightStyle, topStyle, upDownStyle]);

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
