import React, { ReactNode } from "react";
import SizeCalculator from "./SizeCalculator";
import { List } from "react-virtualized";

interface Props {
    containerClassName?: string;
    rowHeight: number;
    rowCount: number;
    rowRenderer: (data: { index: number; key: string | number; style: any }) => ReactNode;
}

const VirtualList: React.FC<Props> = props => {
    const { containerClassName, ...listProps } = props;

    return <SizeCalculator className={containerClassName}>{size => <List {...size} {...listProps} />}</SizeCalculator>;
};

export default VirtualList;
