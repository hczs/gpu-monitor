#!/bin/bash

nohup python api/app.py --host 0.0.0.0 --port 9999 > gpu_monitor_running.log 2>&1 &
echo $! > gpu_monitor.pid
echo "======GPU 实时监控服务已启动======"
echo "您现在可以使用 CTRL + C 停止此日志输出界面，但是并不会停止程序，程序运行日志文件可以查看 gpu_monitor_running.log"
tail -1000f gpu_monitor_running.log