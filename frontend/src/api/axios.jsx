import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error.response?.data || error)
);

// const token = localStorage.getItem("access_token"); // Đảm bảo lấy token từ localStorage

// axiosClient.interceptors.request.use(
//     (config) => {
//         // Chỉ thêm token cho các API liên quan đến xác thực, như /orders/. Bỏ qua việc xác thực token với các api không yêu cầu đăng nhập
//         if (
//             token &&
//             !config.url.includes("/tlu/login/") &&
//             !config.url.includes("/tlu/register/") &&
//             !config.url.includes("/tlu/products/") &&
//             !config.url.includes("/tlu/categories/") &&
//             !config.url.includes("/blog/posts/")
//         ) {
//             config.headers["Authorization"] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// Chỉ gửi kèm token với các API yêu cầu xác thực, bỏ qua với các API công khai
axiosClient.interceptors.request.use(
  (config) => {
      const token = localStorage.getItem("access_token"); // Lấy token từ localStorage 

      // Danh sách các endpoint công khai
      const publicEndpoints = [
          { url: "/tlu/login/", method: "all" }, // Công khai cho mọi phương thức
          { url: "/tlu/register/", method: "all" },
          { url: "/tlu/products/", method: "all" },
          { url: "/tlu/categories/", method: "all" },
          { url: "/blog/posts/", method: "get" },  // Chỉ công khai với GET
          { url: "/blog/posts/:id/comments/", method: "get" }
      ];

      // Kiểm tra nếu URL và phương thức nằm trong danh sách publicEndpoints
      const isPublic = publicEndpoints.some(
          (endpoint) =>
              config.url.includes(endpoint.url) &&
              (endpoint.method === "all" || config.method === endpoint.method)
      );

      if (!isPublic && token) {
          // Chỉ thêm token nếu không thuộc endpoint công khai
          config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
  },
  (error) => Promise.reject(error)
);



export default axiosClient;
