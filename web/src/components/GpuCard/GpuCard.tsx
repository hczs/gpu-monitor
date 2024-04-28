import {Card, Col, Row, Tooltip} from "antd"
import {GpuInfo} from "../../globalInterface";
import "./GpuCard.scss"
import GradientProgress from "../GradientProgress/GradientProgress";

interface GpuCardProps {
    gpuInfo: GpuInfo;
    isActive: boolean;
}

const GpuCard: React.FC<GpuCardProps> = (props: GpuCardProps) => {
    const gpuInfo = props.gpuInfo;
    const gpuTitle = "[GPU " + gpuInfo.gpuId + "] " + gpuInfo.gpuName;
    return (
        <Tooltip title={gpuTitle}>
            <Card
                className={`${props.isActive ? 'gpu-card-selected' : ''}`}
                title={gpuTitle}
                hoverable
                size={"small"}
            >
                <Row gutter={[16, 16]}>
                    <Col span={10}>
                        GPU：
                    </Col>
                    <Col span={14}>
                        <GradientProgress percent={gpuInfo.gpuUsage}/>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={10}>
                        显存：
                    </Col>
                    <Col span={14}>
                        <GradientProgress percent={gpuInfo.memoryUsage}/>
                    </Col>
                </Row>

            </Card>
        </Tooltip>
    )
}

export default GpuCard