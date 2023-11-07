import { ForwardedRef, forwardRef, useMemo } from "react";
import "./style.scss";

enum Sides {
  right,
  up,
  down,
  top,
  left,
}

type Style = {
  transform: string;
  bottom?: string;
  height?: string;
  left?: string;
  right?: string;
  top?: string;
  width?: string;
};

type Styles = {
  [key in Sides]: Style;
};

export const Cube = forwardRef(
  (
    { percentage }: { percentage: number },
    ref: ForwardedRef<HTMLDivElement> | null,
  ): JSX.Element => {
    // console.log("ref", ref);

    // const ref1 = useRef<HTMLDivElement>(null);

    const height = useMemo(() => percentage * 5, [percentage]);

    const translate = useMemo(() => `translateZ(${height / 2}px)`, [height]);

    const upDownStyle = useMemo(() => {
      return {
        height: `${height}px`,
        transform: `${translate} rotateX(-90deg)`,
      };
    }, [height, translate]);

    const leftRightStyle = useMemo(() => {
      return {
        width: `${height}px`,
        transform: `${translate} rotateY(-90deg)`,
      };
    }, [height, translate]);

    const styles = useMemo<Styles>(() => {
      return {
        [Sides.top]: { transform: `translateZ(${height}px)` },
        [Sides.up]: { ...upDownStyle, top: `-${height / 2}px` },
        [Sides.down]: { ...upDownStyle, bottom: `-${height / 2}px` },
        [Sides.left]: { ...leftRightStyle, left: `-${height / 2}px` },
        [Sides.right]: { ...leftRightStyle, right: `-${height / 2}px` },
      };
    }, [height, leftRightStyle, upDownStyle]);

    // useEffect(() => {
    //   // const element = ref.current;
    //   // console.log(element); // 👈️ element here
    //   console.log("ref1", ref1.current);
    // }, []);

    // ref={ref}
    // console.log("ref1", ref1.current);
    return (
      <div className="cube" ref={ref}>
        <div className="face up" style={styles[Sides.up]} />
        <div className="face down" style={styles[Sides.down]} />
        <div className="face left" style={styles[Sides.left]} />
        <div className="face right" style={styles[Sides.right]} />
        <div className="face top" style={styles[Sides.top]} />
      </div>
    );
  },
);
