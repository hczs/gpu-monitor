import {Card, Col, InputNumber, message, Row, Spin, Tooltip} from "antd"
import {useEffect, useState} from "react";
import {GpuInfo} from "../../globalInterface";
import GpuCard from "../GpuCard/GpuCard";
import "./GouMonitor.scss"
import GpuDetail from "../GpuDetail/GpuDetail";
import ProcessTable from "../ProcessTable/ProcessTable";
import {getMultiGpuInfoList} from "../../api/GpuMonitorApi";

// 模拟数据
const gpuDataArray: Array<GpuInfo> = [
    {
        "fanSpeed": 91,
        "gpuId": 0,
        "gpuName": "NVIDIA TITAN X (Pascal)",
        "gpuUsage": 97,
        "memoryTotal": 12192,
        "memoryUsage": 61,
        "memoryUsed": 7519,
        "powerLimit": 250,
        "powerRate": 57,
        "powerUsage": 144,
        "processInfoList": [
            {
                "gpuMemoryUsage": 7129,
                "pid": 1842398,
                "processName": "python"
            }
        ],
        "temperature": 90
    },
    {
        "fanSpeed": 31,
        "gpuId": 1,
        "gpuName": "NVIDIA TITAN X (Pascal)",
        "gpuUsage": 0,
        "memoryTotal": 12196,
        "memoryUsage": 0,
        "memoryUsed": 11,
        "powerLimit": 250,
        "powerRate": 4,
        "powerUsage": 11,
        "processInfoList": [],
        "temperature": 54
    },
    {
        "fanSpeed": 28,
        "gpuId": 2,
        "gpuName": "NVIDIA TITAN X (Pascal)",
        "gpuUsage": 0,
        "memoryTotal": 12196,
        "memoryUsage": 0,
        "memoryUsed": 11,
        "powerLimit": 250,
        "powerRate": 4,
        "powerUsage": 11,
        "processInfoList": [],
        "temperature": 49
    },
    {
        "fanSpeed": 100,
        "gpuId": 3,
        "gpuName": "NVIDIA TITAN X (Pascal)",
        "gpuUsage": 100,
        "memoryTotal": 12196,
        "memoryUsage": 100,
        "memoryUsed": 12196,
        "powerLimit": 250,
        "powerRate": 100,
        "powerUsage": 250,
        "processInfoList": [],
        "temperature": 101
    }
]


const GpuMonitor: React.FC = () => {

    const [gpuInfoList, setGpuInfoList] = useState<Array<GpuInfo>>([]);

    const [selectedGpuId, setSelectedGpuId] = useState<number>(0);

    const [curGpuInfo, setCurGpuInfo] = useState<GpuInfo>({
        "fanSpeed": 0,
        "gpuId": 0,
        "gpuName": "",
        "gpuUsage": 0,
        "memoryTotal": 0,
        "memoryUsage": 0,
        "memoryUsed": 0,
        "powerLimit": 0,
        "powerRate": 0,
        "powerUsage": 0,
        "processInfoList": [],
        "temperature": 0
    });

    const [frequency, setFrequency] = useState<number>();

    const [showFrequency, setShowFrequency] = useState<number>();

    const [pageLoading, setPageLoading] = useState<boolean>(true);

    const DEFAULT_FREQUENCY = 3;

    const changeCurGpuInfo = (gpuId: number) => {
        setSelectedGpuId(gpuId);
        setCurGpuInfo(gpuInfoList[gpuId]);
    }

    const getInitFrequency = () => {
        const frq: number = Number(localStorage.getItem("frequency"));
        if (frq) {
            setFrequency(frq);
            setShowFrequency(frq);
            return frq;
        } else {
            // 默认数据更新频率
            setFrequency(DEFAULT_FREQUENCY);
            setShowFrequency(DEFAULT_FREQUENCY);
            return DEFAULT_FREQUENCY;
        }
    }

    useEffect(() => {
        getMultiGpuMonitorInfo();
        const handleTimer = () => {
            console.log("timer running")
            getMultiGpuMonitorInfo();
        };
        let frq = frequency;
        if (!frq) {
            frq = getInitFrequency();
        }
        const id = setInterval(handleTimer, frq * 1000);
        return () => {
            clearInterval(id);
        }
    }, [frequency, selectedGpuId]);

    useEffect(() => {
        getInitFrequency();
        getMultiGpuMonitorInfo();
        setPageLoading(false);
    }, [])

    /**
     * 获取GPU运行信息
     */
    const getMultiGpuMonitorInfo = () => {
        // mock data
        // setGpuInfoList(gpuDataArray);
        // setCurGpuInfo(gpuDataArray[selectedGpuId])
        // api data
        getMultiGpuInfoList().then(res => {
            console.log("monitor page gpu list res ", res);
            if (res.length > 0) {
                setGpuInfoList(res);
                setCurGpuInfo(res[selectedGpuId])
            } else {
                message.error("未获取到显卡信息，请检查程序日志，以及运行 nvidia-smi 命令查看是否运行正常")
            }
        })
    }

    const updateFrequency = (value: any) => {
        setFrequency(value);
        localStorage.setItem("frequency", value);
        message.success("更新间隔设置成功！已将更新间隔设置为 " + value + " 秒");
    }

    const changeFrequency = (value: any) => {
        setShowFrequency(value);
    }

    /**
     * 给数组内的元素进行分组，分成 chunkSize 个一组，得出 n 组数据
     *
     * @param arr 原始数组
     * @param chunkSize 每组元素个数
     */
    const chunkArray = (arr: Array<GpuInfo>, chunkSize: number): GpuInfo[][] => {
        const chunks: GpuInfo[][] = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            chunks.push(arr.slice(i, i + chunkSize));
        }
        return chunks;
    };

    // 将数据分组，每组4个Col
    const chunkedData = chunkArray(gpuInfoList, 4);

    return (
        <div className="page-body">
            <Spin spinning={pageLoading} fullscreen delay={2}/>
            <h2 className="text-center">GPU 实时监控</h2>
            <div className="refresh-tip">
                数据更新间隔：
                <Tooltip title={"请输入大于1的数字，按下回车进行更新"}>
                    <InputNumber
                        value={showFrequency}
                        onChange={changeFrequency}
                        min={1}
                        step={1}
                        onPressEnter={() => updateFrequency(showFrequency)}
                    />
                </Tooltip> 秒
            </div>
            <div className="text-center">
                <Card className={"elevated-card"}>
                    {chunkedData.map((row, rowIdx) => (
                        <Row key={rowIdx} gutter={[16, 16]}>
                            {row.map((gpuInfo, gpuIdx) => (
                                // 一行四个 4 * 6 = 24
                                <Col key={gpuIdx} span={6} onClick={() => changeCurGpuInfo(gpuInfo.gpuId)}>
                                    <GpuCard
                                        gpuInfo={gpuInfo}
                                        isActive={selectedGpuId === gpuInfo.gpuId}
                                    />
                                </Col>
                            ))}
                        </Row>
                    ))}
                </Card>
            </div>

            <div className="gpu-detail">
                <Row>
                    <Col span={24}>
                        <Card className={"elevated-card"}
                              title={"[GPU " + curGpuInfo.gpuId + "] " + curGpuInfo.gpuName + " 详细信息"}>
                            <GpuDetail gpuInfo={curGpuInfo}/>
                        </Card>
                    </Col>
                </Row>
            </div>

            <div className="gpu-detail">
                <Row>
                    <Col span={24}>
                        <Card className={"elevated-card"}
                              title={"[GPU " + curGpuInfo.gpuId + "] " + curGpuInfo.gpuName + " 进程信息"}>
                            <ProcessTable processList={curGpuInfo.processInfoList}/>
                        </Card>
                    </Col>
                </Row>
            </div>

        </div>
    )
}

export default GpuMonitor