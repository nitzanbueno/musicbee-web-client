import React, { ReactNode } from "react";
import SizeCalculator from "./SizeCalculator";
import { List } from "react-virtualized";

interface Props {
    flex?: boolean;
    rowHeight: number;
    rowCount: number;
    rowRenderer: (data: { index: number; key: string | number; style: any }) => ReactNode;
}

const VirtualList: React.FC<Props> = props => {
    const { flex, ...listProps } = props;

    return <SizeCalculator flex={flex}>{size => <List {...size} {...listProps} />}</SizeCalculator>;
};

export default VirtualList;
