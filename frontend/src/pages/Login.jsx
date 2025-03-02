import { Form, Button, Container, Toast, ToastContainer } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

import Logo from "../assets/Logo.svg"
import "../components/Custom.css"
import userApi from '../api/user'
import dishesApi from "../api/dishes"
import LoginImage from '../assets/LoginImage.jpeg'
import { useCart } from "../components/CartContext"

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const { updateCartCount } = useCart()
    const currentPath = sessionStorage.getItem("path-before-login") || '/'

    const handleLogin = async(e) => {
      e.preventDefault()
      try {
        const response = await userApi.login(email, password) || []

        if (response && response.access) {
            sessionStorage.setItem('access_token', response.access);
            sessionStorage.setItem('refresh_token', response.refresh)
            sessionStorage.setItem('username', response.username);
            sessionStorage.setItem('userID', response.userID);

            localStorage.setItem('access_token', response.access);
            localStorage.setItem('refresh_token', response.refresh)
            localStorage.setItem('username', response.username);
            localStorage.setItem('userID', response.userID);

            if (sessionStorage.getItem('access_token')) {
                // Gọi API để lấy số lượng sản phẩm mới trong giỏ
                const cartResponse = await dishesApi.customerCart()
                // console.log("cusCartRes:", cartResponse)
                const totalItems = cartResponse.carts[0].quantity

                // Cập nhật số lượng giỏ hàng trong context
                updateCartCount(totalItems)

                setShow(true)
                setTimeout(() => {
                    sessionStorage.removeItem("path-before-login")
                    navigate(currentPath) // Chuyển hướng về trang trước đó sau 1 giây
                }, 1000)  
          }
        } else throw new Error("Đăng nhập thất bại")

      } catch(error) {
            console.error('Đăng nhập không thành công:', error)

            // Cập nhật thông báo lỗi chi tiết
            if (error.response) {
                setError(error.response.data.detail || 'Đăng nhập không thành công!')
            } else {
                setError('Kiểm tra lại email hoặc password!')
            }
        }
    }

    return (
        <>
            <div className="d-flex justify-content-center py-3 border-bottom bg-white">
                <Link to="/">
                    <img
                        src={Logo}
                        alt="TLU Food Logo"
                        height="30"
                        style={{ cursor: "pointer" }}
                    />
                </Link>
            </div>
            <Container>
                <div
                    className="bg-white mt-5 rounded"
                    style={{ width: "100%", height: "50%" }}
                >
                    <div className="row p-3">
                        <div className="col-md-5 d-flex align-items-center">
                            <img
                                src={LoginImage}
                                className="ms-5"
                                style={{ width: "85%" }}
                            ></img>
                        </div>
                        <div className="col-md-7 justify-content-center">
                            <div
                                className="p-5"
                                style={{ width: "85%", marginTop: "85px" }}
                            >
                                <p className="fs-3 fw-bold">Đăng nhập</p>
                                <Form onSubmit={handleLogin}>
                                  <Form.Label htmlFor="emailUser">
                                      Tài khoản
                                  </Form.Label>
                                  <Form.Control
                                      type="email"
                                      id="emailUser"
                                      placeholder="Nhập Email"
                                      className="mb-2"
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      required
                                      />
                                  <Form.Label htmlFor="passwordlUser">
                                      Mật khẩu
                                  </Form.Label>
                                  <Form.Control
                                      type="password"
                                      id="passwordUser"
                                      placeholder="Nhập mật khẩu"
                                      className="mb-2"
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}
                                      required
                                      />
                                  {error && <p className="text-danger mb-0">{error}</p>}
                                  <Button
                                      className="buttonHover rounded-pill mt-3"
                                      style={{ width: "100%" }}
                                      type="submit"
                                  >
                                      Đăng nhập
                                  </Button>
                                </Form>
                                <p className="text-secondary text-center mt-4">
                                    Không có tài khoản?
                                    <Link to="/register">
                                        <span className="text-black ms-1 text-decoration-underline">
                                            Đăng ký
                                        </span>
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            <ToastContainer className="mt-3" position="top-center">
                <Toast className="bg-success text-white text-center fw-medium" onClose={() => setShow(false)} delay={800} show={show} autohide>
                    <Toast.Body>Đăng nhập thành công!</Toast.Body>
                </Toast>    
            </ToastContainer>
        </>
    );
}

export default Login;
