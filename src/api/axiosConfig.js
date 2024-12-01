import axios from 'axios';

export default axios.create({
    baseURL: 'https://3b28-35-151-153-4.ngrok-free.app',
    headers: {"ngrok-skip-browser-warning": "true"}
});
