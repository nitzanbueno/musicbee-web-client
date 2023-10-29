import React, { ReactNode } from "react";
import SizeCalculator from "./SizeCalculator";
import { List } from "react-virtualized";

interface Props {
    flex?: boolean;
    rowHeight: number;
    rowCount: number;
    rowRenderer: (data: { index: number; key: string | number; style: any }) => ReactNode;
    className?: string;
    innerRef?: (element: HTMLElement | null) => void;
}

const VirtualList: React.FC<Props> = props => {
    const { flex, ...listProps } = props;

    return (
        <SizeCalculator flex={flex}>
            {size => (
                <List
                    ref={ref => {
                        if (ref) {
                            // react-virtualized has no exposed way to get the list's DOM element.
                            // The author of the example used findDOMNode, which I'm not personally a fan of,
                            // so I used private properties of the List class instead.
                            // THIS MAY BREAK ON react-virtualized UPDATES!
                            const scrollingContainer = ref.Grid._scrollingContainer;
                            if (scrollingContainer instanceof HTMLElement) {
                                props.innerRef?.(scrollingContainer);
                            }
                        }
                    }}
                    {...size}
                    style={{ outline: "none" }} // Without this prop, the list gets a fugly border when clicked
                    {...listProps}
                />
            )}
        </SizeCalculator>
    );
};

export default VirtualList;
