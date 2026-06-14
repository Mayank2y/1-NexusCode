import axios from "axios"

const axiosClient =  axios.create({
    baseURL: 'http://13.203.66.112',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;