import argparse
import os.path
from logging.config import dictConfig

import pynvml
from flask import Flask, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)


@app.route("/")
def hello_world():
    return render_template("index.html")


@app.route("/api/gpu/list")
def gpu_info_list():
    return jsonify(get_multi_gpu_info())


def get_multi_gpu_info():
    """
    获取机器上多个cpu信息
    :return: 多gpu信息集合
    """
    pynvml.nvmlInit()
    device_count = pynvml.nvmlDeviceGetCount()
    logger.debug("GPU 数量: {}".format(device_count))
    gpu_info_list = []
    for gpu_id in range(device_count):
        gpu_info_list.append(get_gpu_info_by_id(gpu_id))
    pynvml.nvmlShutdown()
    return gpu_info_list


def get_gpu_info_by_id(gpu_id):
    """
    根据 gpu id 获取单个 gpu 信息
    需要预先进行 pynvml.nvmlInit() 初始化，并自行 pynvml.nvmlShutdown()
    :param gpu_id: gpu id
    :return: gpu 信息字典对象
    """
    handle = pynvml.nvmlDeviceGetHandleByIndex(gpu_id)
    name = pynvml.nvmlDeviceGetName(handle).decode("UTF-8")
    fan_speed = pynvml.nvmlDeviceGetFanSpeed(handle)
    temperature = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
    power_usage = int(pynvml.nvmlDeviceGetPowerUsage(handle) / 1000)
    power_limit = int(pynvml.nvmlDeviceGetEnforcedPowerLimit(handle) / 1000)
    power_rate = int((power_usage / power_limit) * 100)
    memory_info = pynvml.nvmlDeviceGetMemoryInfo(handle)
    memory_used = int(memory_info.used / (1024 ** 2))
    memory_total = int(memory_info.total / (1024 ** 2))
    memory_usage = int((memory_used / memory_total) * 100)

    utilization = pynvml.nvmlDeviceGetUtilizationRates(handle)
    gpu_usage = utilization.gpu

    logger.debug("=" * 10 + "GPU {} INFO".format(gpu_id) + "=" * 10)
    logger.debug("显卡名称：{}".format(name))
    logger.debug("风扇转速：{}%".format(fan_speed))
    logger.debug("显卡温度：{}℃".format(temperature))
    logger.debug("当前功率：{} W".format(power_usage))
    logger.debug("额定功率：{} W".format(power_limit))
    logger.debug("当前功率/额定功率：{}%".format(power_rate))
    logger.debug("已用显存：{} MB".format(memory_used))
    logger.debug("总显存：{} MB".format(memory_total))
    logger.debug("显存使用率：{}%".format(memory_usage))
    logger.debug("GPU 利用率：{}% ".format(gpu_usage))

    process_info_list = []
    process_list = pynvml.nvmlDeviceGetComputeRunningProcesses(handle)
    for process in process_list:
        pid = process.pid
        process_name = pynvml.nvmlSystemGetProcessName(pid).decode("UTF-8")
        gpu_memory_usage = int(process.usedGpuMemory / (1024 ** 2))
        logger.debug("进程ID {} 名称 {} 显存使用量 {} MB\n".format(pid, process_name, gpu_memory_usage))
        process_info_list.append({'pid': pid, 'processName': process_name, 'gpuMemoryUsage': gpu_memory_usage})

    return {
        "gpuId": gpu_id,
        "gpuName": name,
        "fanSpeed": fan_speed,
        "temperature": temperature,
        "powerUsage": power_usage,
        "powerLimit": power_limit,
        "powerRate": power_rate,
        "memoryUsed": memory_used,
        "memoryTotal": memory_total,
        "memoryUsage": memory_usage,
        "gpuUsage": gpu_usage,
        "processInfoList": process_info_list
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='GPU实时监控服务程序')
    parser.add_argument("--host", type=str, help="服务地址，默认127.0.0.1", default="127.0.0.1")
    parser.add_argument("--port", type=int, help="服务端口，默认12150", default=12150)
    log_dir = "./gpu_monitor_logs"

    # 确认日志目录存在
    if not os.path.exists(log_dir):
        os.mkdir(log_dir)

    dictConfig({
        "version": 1,
        "disable_existing_loggers": False,  # 不覆盖默认配置
        "formatters": {  # 日志输出样式
            "default": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
            }
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",  # 控制台输出
                "level": "WARN",
                "formatter": "default",
            },
            "log_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "WARN",
                "formatter": "default",  # 日志输出样式对应formatters
                "filename": os.path.join(log_dir, "gpu_monitor.log"),  # 指定log文件目录
                "maxBytes": 20 * 1024 * 1024,  # 文件最大20M
                "backupCount": 10,  # 最多10个文件
                "encoding": "utf8",  # 文件编码
            },

        },
        "root": {
            "level": "WARN",  # # handler中的level会覆盖掉这里的level
            "handlers": ["console", "log_file"],
        },
    }
    )

    # 跨域设置
    CORS(app, resources=r'/*')
    logger = app.logger

    args = parser.parse_args()
    logger.info("GPU实时监控服务程序启动，HOST：{}; PORT: {}".format(args.host, args.port))
    app.run(host=args.host, port=args.port)
