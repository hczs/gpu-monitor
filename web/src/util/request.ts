import axios, {AxiosInstance} from 'axios';

const apiUrl = process.env.REACT_APP_API_URL
let axiosInstance: AxiosInstance;
if (apiUrl) {
    axiosInstance = axios.create({
        baseURL: apiUrl
    });
} else {
    axiosInstance = axios.create();
}

export default axiosInstance;