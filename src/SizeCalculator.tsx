import React, { ReactNode, useEffect, useRef, useState } from "react";

type Size = { width: number; height: number };

let i = 0;

const SizeCalculator: React.FC<
    React.HTMLAttributes<HTMLDivElement> & { children?: (size: Size) => ReactNode }
> = props => {
    const [observedElement, setObservedElement] = useState<HTMLDivElement | null>(null);
    const [size, setSize] = useState<Size | null>(null);

    useEffect(() => {
        if (!observedElement) return;

        // @ts-ignore
        const observer = new ResizeObserver(() => {
            const newSize = { width: observedElement.scrollWidth, height: observedElement.scrollHeight };
            if (i++ < 10) setSize(newSize);
        });

        observer.observe(observedElement);
        return () => observer.unobserve(observedElement);
    }, [observedElement]);

    return (
        <div {...props} ref={setObservedElement}>
            {size !== null && props.children?.(size)}
        </div>
    );
};

export default SizeCalculator;
