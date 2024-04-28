// 进程信息定义
export interface ProcessInfo {
    pid: number;
    processName: string;
    gpuMemoryUsage: number;
}

// 显卡信息定义
export interface GpuInfo {
    gpuId: number;
    gpuName: string;
    fanSpeed: number;
    gpuUsage: number;
    memoryTotal: number;
    memoryUsed: number;
    memoryUsage: number;
    powerLimit: number;
    powerUsage: number;
    powerRate: number;
    temperature: number;
    processInfoList: Array<ProcessInfo>;
}