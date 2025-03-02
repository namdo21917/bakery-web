import axiosClient from "./axios"

const postsApi = {
    getAllPosts(params) {
        const url = `/blog/posts/`
        return axiosClient.get(url, { params })
    },
    getPostDetail(id) {
        const url = `/blog/posts/${id}/`
        return axiosClient.get(url)
    },
    posting(title, content) {
        const url = `/blog/posts/`
        const data = { title, content }
        return axiosClient.post(url, data).then(response => response)
    },
    like(id) {
        const url = `/blog/posts/${id}/like/`
        return axiosClient.post(url)
    },
    comment(post, content) {
        const url = `/blog/posts/${post}/comments/`
        const data = { post, content }
        return axiosClient.post(url, data).then(response => response)
    },
    getCommentList(post) {
        const url = `/blog/posts/${post}/comments/`
        return axiosClient.get(url)
    },
    getMyPosts(params) {
        const url = `/blog/my-posts/`
        return axiosClient.get(url, { params })
    },
    deletePost(id) {
        const url = `/blog/posts/${id}/`;
        return axiosClient.delete(url).then(response => response);
    },
    updatePost(id, title, content) {
        const url = `/blog/posts/${id}/`
        const data = { title, content }
        return axiosClient.put(url, data).then(response => response)
    }
}

export default postsApi