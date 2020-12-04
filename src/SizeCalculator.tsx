import React, { ReactNode, useEffect, useState } from "react";

type Size = { width: number; height: number };

const SizeCalculator: React.FC<{ flex?: boolean; children?: (size: Size) => ReactNode }> = props => {
    const [observedElement, setObservedElement] = useState<HTMLDivElement | null>(null);
    const [size, setSize] = useState<Size | null>(null);
    const { flex = false } = props;

    const style = flex ? { flexGrow: 1, width: "100%" } : { width: "100%", height: "100%" };

    useEffect(() => {
        if (!observedElement) return;

        // @ts-ignore
        const observer = new ResizeObserver(() => {
            const newSize = { width: observedElement.scrollWidth, height: observedElement.scrollHeight };
            console.log("Resize:", newSize);
            setSize(newSize);
        });

        observer.observe(observedElement);
        return () => observer.unobserve(observedElement);
    }, [observedElement]);

    return (
        <div style={{ ...style, position: "relative" }}>
            <div style={{ width: "100%", height: "100%", position: "absolute" }} ref={setObservedElement}></div>
            <div style={{ width: "100%", height: "100%", position: "absolute" }}>
                {size !== null && props.children?.(size)}
            </div>
        </div>
    );
};

export default SizeCalculator;
