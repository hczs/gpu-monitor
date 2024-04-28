# GPU 实时监控服务

## 效果展示
<img width="960" alt="0d801e7fdd9c3d604d1c9588ce458a2" src="https://github.com/hczs/gpu-monitor/assets/43227582/879f1697-064c-4733-b622-9af6b918fc2c">

## 功能说明
1. 多 GPU 卡实时监控
2. 可点击选择某个卡查看风扇转速、显卡温度、当前功率、显存占用、GPU利用率指标
3. 最下方可查看该 GPU 上的进程信息和显存占用大小

## 安装
1. 首先要确认自己机器上 nvidia-smi 命令是否正常，打开终端，输入 nvidia-smi 命令进行验证

2. 拉取代码：`git clone https://github.com/hczs/gpu-monitor.git`

3. 进入到项目文件夹中，安装依赖

   ```shell
   cd gpu-monitor/api
   pip install -r requirements.txt 
   ```

4. Linux 平台：使用 `start.sh` 脚本启动，终端执行 `sh start.sh` 

5. Windows 平台：`python api/app.py --host 0.0.0.0 --port 9999`

6. 访问：http://127.0.0.1:9999

## 开发

### 整体技术栈说明
1. 服务端：Python3 + Flask + pynvml
2. web页面：React + TypeScript + Ant Design

### 服务端开发

1. 安装依赖：`pip install -r requirements.txt `
2. 修改 `app.py` 文件
3. 使用命令运行验证：`python app.py`

### 页面开发

需要有 node 环境，node 版本：`v20.12.2`
1. 到 web 文件夹下，安装依赖：`npm install`
2. 启动项目：`npm start`
3. 构建项目：`npm run build`，注意，构建会自动更新构建后的文件到 api 文件夹的 `templates` 和 `static` 文件夹中，所以直接启动 `app.py` 进行验证即可

## TODO
- [ ] 使用服务端推送技术进行更新页面数据
