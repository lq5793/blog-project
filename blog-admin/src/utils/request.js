// 封装 Axios 并测试调用
import axios from 'axios';

const request = axios.create({
    baseURL: '/api', // 这样写会自动走代理，不会写死 localhost:3000
    timeout: 5000
});

// 测试一下：挂载到全局方便调试（非必须）
export default request;