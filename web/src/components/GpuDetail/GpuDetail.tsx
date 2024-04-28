import {Card, Col, Flex, Row, Tooltip} from "antd";
import {GpuInfo} from "../../globalInterface";
import GradientProgress from "../GradientProgress/GradientProgress";
import "./GpuDetail.scss"

interface GpuDetailProps {
    gpuInfo: GpuInfo;
}

const GpuDetail: React.FC<GpuDetailProps> = (props: GpuDetailProps) => {

    const gpuInfo = props.gpuInfo;

    return (
        <div>
            <Flex justify={"space-around"}>
                <Card bordered className={"elevated-card"}>
                    <Flex vertical>
                        <GradientProgress type={"dashboard"} percent={gpuInfo.fanSpeed}/>
                        <div className={"row-label"}>风扇转速</div>
                    </Flex>
                </Card>
                <Card bordered className={"elevated-card"}>
                    <Flex vertical>
                        <GradientProgress type={"dashboard"} percent={gpuInfo.temperature} percentSuffix={"℃"}/>
                        <div className={"row-label"}>显卡温度</div>
                    </Flex>
                </Card>

                <Card bordered className={"elevated-card"}>
                    <Flex vertical>
                        <GradientProgress type={"dashboard"} percent={gpuInfo.powerRate}
                                          format={() => {
                                              return <div className="power-format">
                                                  {gpuInfo.powerUsage}W/{gpuInfo.powerLimit}W
                                              </div>
                                          }}/>
                        <div className={"row-label"}>当前功耗 / 额定功耗</div>
                    </Flex>
                </Card>

                <Card bordered className={"elevated-card"}>
                    <Flex vertical>
                        <Tooltip title={gpuInfo.memoryUsed + "MB / " + gpuInfo.memoryTotal + "MB"}>
                            <GradientProgress type={"dashboard"} percent={gpuInfo.memoryUsage}/>
                            <div className={"row-label"}>显存利用率</div>
                        </Tooltip>
                    </Flex>
                </Card>

                <Card bordered className={"elevated-card"}>
                    <Flex vertical>
                        <GradientProgress type={"dashboard"} percent={gpuInfo.gpuUsage}/>
                        <div className={"row-label"}>GPU利用率</div>
                    </Flex>
                </Card>
            </Flex>
        </div>
    )
}

export default GpuDetail;