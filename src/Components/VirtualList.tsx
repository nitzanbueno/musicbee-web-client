import React, { ReactNode } from "react";
import SizeCalculator from "./SizeCalculator";
import { List } from "react-virtualized";

interface Props {
    flex?: boolean;
    rowHeight: number;
    rowCount: number;
    rowRenderer: (data: { index: number; key: string | number; style: any }) => ReactNode;
    className?: string;
}

const VirtualList: React.FC<Props> = props => {
    const { flex, ...listProps } = props;

    return (
        <SizeCalculator flex={flex}>
            {size => (
                <List
                    {...size}
                    style={{ outline: "none" }} // Without this prop, the list gets a fugly border when clicked
                    {...listProps}
                />
            )}
        </SizeCalculator>
    );
};

export default VirtualList;
