import axiosClient from './axios'

const dishesApi = {
    getAllDishes(params) {
        const url = `/tlu/products/`
        return axiosClient.get(url, { params })
    },
    getDishDetail(id) {
        const url = `/tlu/products/${id}`
        return axiosClient.get(url)
    },
    getAllCategories(params) {
        const url = `/tlu/categories/`
        return axiosClient.get(url, { params })
    },
    addToCart(product_id, quantity) {
        const url = `tlu/carts/add_to_cart/`
        const data = { product_id, quantity }
        return axiosClient.post(url, data).then(response => response)
    },
    updateCartItem(product_id, quantity) {
        const url = `tlu/carts/change_product_quantity/`
        const data = { product_id, quantity }
        return axiosClient.post(url, data).then(response => response)
    },
    removeCartItem(product_id) {
        const url = `tlu/carts/remove_from_cart/`
        const data = { product_id }
        return axiosClient.post(url, data).then(response => response)
    },
    customerCart() {
        const url = `tlu/carts/`
        return axiosClient.get(url).then(response => response)
    }
};

export default dishesApi
