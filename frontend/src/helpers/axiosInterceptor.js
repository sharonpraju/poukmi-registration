import axios from 'axios';

function AxiosInterceptor() {
    axios.interceptors.request.use(
        config => {
          const token = localStorage.getItem("token");
          if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
          }
          return config;
        },
        error => {
          Promise.reject(error);
        }
    );

    axios.interceptors.response.use(
        response => {
          return response;
        },
        function (error) {
          if (error.response.status === 401) {
            if(window.location.pathname!='/login')
            {
              window.location.replace('/login');
            }
            return Promise.reject(error);
          }
          return Promise.reject(error);
        }
    );
}

export default AxiosInterceptor