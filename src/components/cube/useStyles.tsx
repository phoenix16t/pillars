import { useMemo } from "react";
import { Sides } from "../../types";

const COLOR13 = 255 / 3;
const COLOR23 = (255 * 2) / 3;
const COLOR33 = 255;

export const useStyle = ({
  maxPillarHeight,
  percentage,
}: {
  maxPillarHeight: number;
  percentage: number;
}) => {
  const height = useMemo(
    () => percentage * maxPillarHeight,
    [maxPillarHeight, percentage],
  );

  const translate = useMemo(() => `translateZ(${height / 2}px)`, [height]);

  const colorStyle = useMemo(() => {
    const value = Math.round(255 * percentage);
    const selection = Math.floor(percentage * 3);
    const arr = [
      // white  -> yellow
      `rgb(255, 255, ${COLOR33 - value * 3})`,
      // yellow -> orange
      `rgb(255, ${COLOR33 - (value - COLOR13)}, 0)`,
      // orange -> red
      `rgb(255, ${COLOR23 - (value - COLOR23) * 2}, 0)`,
    ];
    return { backgroundColor: arr[selection] };
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

  return {
    combinedStyles,
  };
};
