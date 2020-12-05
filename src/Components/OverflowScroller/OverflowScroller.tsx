import { useEffect, useRef, useState } from "react";
import "./ScrollingText.css";

const OverflowScroller = props => {
    const bigScrollRef = useRef<HTMLDivElement>(null);
    const smallScrollRef = useRef<HTMLSpanElement>(null);
    const [scroll, setScroll] = useState(false);

    useEffect(() => {
        const big = bigScrollRef.current;
        const small = smallScrollRef.current;

        if (!big || !small) return;
        setScroll(big.scrollWidth > small.clientWidth);
    });

    return (
        <span ref={smallScrollRef} className="no-wrap">
            <div ref={bigScrollRef} className={scroll ? "scroll-left" : undefined}>
                {props.children}
            </div>
        </span>
    );
};

export default OverflowScroller;
