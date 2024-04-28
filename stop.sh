#!/bin/bash

echo "正在停止 GPU 监控服务..."
PID=$(cat gpu_monitor.pid)
kill $PID
rm gpu_monitor.pid
echo "GPU 监控服务已成功停止"