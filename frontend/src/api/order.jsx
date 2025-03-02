import axiosClient from "./axios"; // Assuming axiosClient is the configured axios instance

const orderApi = {
    // Function to get orders for the logged-in user
    getUserOrders() {
        const url = `/tlu/orders`; // Replace with the actual endpoint for fetching user orders
        return axiosClient.get(url);
    },
    getDiscount() {
        const url = `tlu/discount/`;
        return axiosClient.get(url);
    },
    getPaymentMethod() {
        const url = `tlu/payment/`;
        return axiosClient.get(url);
    },
    createOrder(
        payment_method,
        discount,
        products,
        total_price,
        customerInfo = {}
    ) {
        const url = `/tlu/orders/create/`;
        const data = {
            payment_method,
            discount, // Có thể là null
            products,
            total_price,
            customerInfo: { ...customerInfo } // Thông tin khách hàng (nếu có)
        };
        return axiosClient.post(url, data).then((response) => response);
    },
    cancelOrder(pk) {
        const url = `/tlu/orders/${pk}/cancel/`
        return axiosClient.put(url).then(response => response)
    },
    rateDish(pk, product_id, rating) {
        const url = `tlu/orders/${pk}/rate_product`
        const data = {product_id, rating}
        return axiosClient.post(url, data).then(response => response)
    }
};

export default orderApi;
