import React from 'react';
import {Progress} from 'antd';
import { ProgressType } from 'antd/es/progress/progress';
import "./GradientProgress.scss"

interface GradientProgressProps {
    percent: number;
    type?: ProgressType;
    percentSuffix?: string;
    format?: (percent?: number, successPercent?: number) => React.ReactNode;
}

const GradientProgress: React.FC<GradientProgressProps> = (props: GradientProgressProps) => {

    const percent = props.percent;

    const progressType = props.type == null ?  "line" : props.type;

    const percentSuffix = props.percentSuffix == null ? "%" : props.percentSuffix;

    const format = props.format == null ? (p1?: number, p2?: number) => p1 + percentSuffix : props.format;

    const selectColor = (percent: number): string => {
        if (percent > 85) {
            return 'red';
        } else if (percent >= 60) {
            // 深黄
            return '#faad14';
        } else {
            return 'green';
        }
    }

    return (
        <Progress
            type={progressType}
            percent={percent}
            format={(percent, successPercent) => format(percent, successPercent)}
            strokeColor={selectColor(percent)}
        />
    );
};

export default GradientProgress;