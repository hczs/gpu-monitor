import React from "react";
import {ProcessInfo} from "../../globalInterface";
import {Table} from "antd";

interface ProcessTableProps {
    // 进程信息数据源
    processList: Array<ProcessInfo>;
}

const ProcessTable: React.FC<ProcessTableProps> = (props: ProcessTableProps) => {

    const columns = [
        {
            title: "进程ID",
            dataIndex: "pid"
        },
        {
            title: "进程名称",
            dataIndex: "processName"
        },
        {
            title: "显存占用（MB）",
            dataIndex: "gpuMemoryUsage"
        },
    ]

    return (
        <Table dataSource={props.processList} columns={columns} rowKey={"pid"}/>
    )
}

export default ProcessTable;