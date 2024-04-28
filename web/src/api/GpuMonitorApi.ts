import axiosInstance from "../util/request";


export const getMultiGpuInfoList = async () => {
    try {
        const response = await axiosInstance.get('/api/gpu/list');
        if (response.data) {
            return response.data;
        } else {
            console.error('request getMultiGpuInfoList error: ', response.statusText);
        }
    } catch (error) {
        throw error;
    }
}
