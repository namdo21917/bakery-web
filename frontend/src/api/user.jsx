import axiosClient from "./axios";

const userApi = {
    login(email, password) {
        const url = `/tlu/login/`
        const data = { email, password }
        return axiosClient.post(url, data).then(response => response)
    },
    register(username, email, password) {
        const url = `/tlu/register/`
        const data = { username, email, password }
        return axiosClient.post(url, data).then(response => response)
    },
    userInfo() {
        const url = `/tlu/user-info/`
        return axiosClient.get(url).then(response => response)
    },
}

export default userApi
