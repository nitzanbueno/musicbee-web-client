import React, { ReactNode, useEffect, useRef, useState } from "react";

type Size = { width: number; height: number };

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
            setSize(newSize);
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
