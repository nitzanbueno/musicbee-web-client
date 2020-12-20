import { useEffect, useRef, useState } from "react";
import "./ScrollingText.css";

// pixels per second
const SPEED = 20;

const OverflowScroller = props => {
    const bigScrollRef = useRef<HTMLDivElement>(null);
    const smallScrollRef = useRef<HTMLSpanElement>(null);
    const [scroll, setScroll] = useState(false);
    const [textWidth, setTextWidth] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        const big = bigScrollRef.current;
        const small = smallScrollRef.current;

        if (!big || !small) return;
        setScroll(big.scrollWidth > small.clientWidth);
        setTextWidth(big.scrollWidth);
        setContainerWidth(small.clientWidth);
    }, [props.children]);

    const animationStyle: any = {
        animationDuration: `${textWidth / SPEED}s`,
        "--box-width": `${isNaN(containerWidth) ? 10 : containerWidth}px`,
    };

    return (
        <span ref={smallScrollRef} className="no-wrap">
            <div
                ref={bigScrollRef}
                style={scroll ? animationStyle : undefined}
                className={scroll ? "scroll-left" : undefined}
            >
                {props.children}
            </div>
        </span>
    );
};

export default OverflowScroller;
