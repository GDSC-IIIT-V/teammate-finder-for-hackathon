// import axios from "axios";

// const axiosInstance = axios.create({
//     baseURL: "http://14.139.105.24:8000/",
// });

// export default axiosInstance;

import axios from "axios";

const baseIP = process.env.REACT_APP_BASE_IP || "localhost";

const axiosInstance = axios.create({
    baseURL: `http://14.139.105.24:5000/`, 
});

export default axiosInstance;
