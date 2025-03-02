import { Container, Form, Button, Toast, ToastContainer, Modal } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import Header from "../components/Header"
import Footer from "../components/Footer"
import Back from '../assets/Back.svg'
import Currency from "../components/Currency"
import QRPay from '../assets/QRPay.jpeg'
import '../components/Custom.css'
import { useCart } from "../components/CartContext"
import dishesApi from "../api/dishes"
import orderApi from "../api/order"

function Checkout() {
    const [cart, setCart] = useState([])
    const [coupon, setCoupon] = useState([])
    const [discount, setDiscount] = useState(0)
    const [total, setTotal] = useState(0)
    const [payment, setPayment] = useState([])
    const [error, setError] = useState('')
    const [showMessage, setShowMessage] = useState(false)
    const [showCoupon, setShowCoupon] = useState(false)
    const [showMinimum, setShowMinimum] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const { updateCartCount } = useCart()
    const navigate = useNavigate()
    // Lưu trữ giá trị mã giảm giá, phương thức thanh toán mà người dùng chọn
    const [selectedCoupon, setSelectedCoupon] = useState([])
    const [selectedPayment, setSelectedPayment] = useState([])
    // Lấy thông tin giao hàng
    const [customerInfo, setCustomerInfo] = useState({
        hovaten: "",
        sdt: "",
        email: "",
        diachi: ""
    });

    // Lấy dữ liệu giỏ hàng
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await dishesApi.customerCart() || []
                const couponRes = await orderApi.getDiscount() || []
                const paymentRes = await orderApi.getPaymentMethod() || []
                setCart(response.carts[0].products || [])
                setCoupon(couponRes.discount_codes)
                setPayment(paymentRes.payment_methods)
                setTotal(response.carts[0].total_value)
                // console.log("Payment:", paymentRes.payment_methods)
                // console.log("coupon:", couponRes.discount_codes)
                // console.log("cartRes in checkout:", response.carts[0].products)

                // Cập nhật giá trị mặc định cho phương thức thanh toán và mã giảm giá
                if (paymentRes.payment_methods.length > 0) {
                    setSelectedPayment([
                        paymentRes.payment_methods[0].id,
                        paymentRes.payment_methods[0].methodname,
                        paymentRes.payment_methods[0].QRcode
                    ])
                }

                if (couponRes.discount_codes.length > 0) {
                    setSelectedCoupon([
                        couponRes.discount_codes[0].id,
                        couponRes.discount_codes[0].discountvalue,
                        couponRes.discount_codes[0].minimum
                    ])
                }

            } catch (err) {
                console.log("Không thể tải giỏ hàng:", err)
            }
        }
        fetchCart()
    }, [])
    
    // console.log("Total:", total)

    // Hàm xử lý khi chọn mã giảm giá
    const handleCouponSelected = (event) => {
        const selectedValue = event.target.value.split(',')
        const couponId = parseFloat(selectedValue[0])
        const discountValue = parseFloat(selectedValue[1])
        const minimumOrder = parseFloat(selectedValue[2])
        setSelectedCoupon([couponId, discountValue, minimumOrder])
        // console.log("selectedCoupon:", selectedCoupon)
    };

    const handlePaymentSelected = (event) => {
        const selectedValue = event.target.value.split(',')
        const paymentId = parseFloat(selectedValue[0])
        setSelectedPayment([paymentId, selectedValue[1], selectedValue[2]])
        // console.log("Payment select:", selectedPayment)
    }

    // Hàm cập nhật thông tin khi người dùng nhập liệu
    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo({
            ...customerInfo,
            [name]: value
        });
    };

    const handleCouponUsing = () => {
        // Nếu tổng giá trị đơn hàng > giá trị tối thiểu của mã giảm giá
        if (total >= selectedCoupon[2]) {
            setDiscount((selectedCoupon[1] / 100) * total)
            setShowCoupon(true)
            return 
        } else {
            setShowMinimum(true)
            return 
        }
    }
    

    console.log("Input:", selectedPayment[0], selectedCoupon[0], cart, total + 25000 - discount, customerInfo)
    const handleOrdering = async(e) => {
        e.preventDefault()
        try {
            const orderingRes = await orderApi.createOrder(selectedPayment[0], selectedCoupon[0], cart, total + 25000 - discount, customerInfo)
            console.log("Ordering Res:", orderingRes)
            if (orderingRes && orderingRes.created_at) {
                // Xóa tất cả các sản phẩm trong giỏ hàng sau khi đặt hàng thành công
                const removePromises = cart.map(item => {
                    return dishesApi.removeCartItem(item.product.id)  // Gọi API xóa sản phẩm khỏi giỏ hàng
                })

                // Chờ tất cả các yêu cầu xóa sản phẩm hoàn tất
                await Promise.all(removePromises)

                // Cập nhật số lượng trong giỏ hàng
                updateCartCount(0)
                if (selectedPayment[0] == 2) {
                    setShowModal(true)
                } else {   
                    setShowMessage(true)
                    setTimeout(() => {
                        navigate('/')
                    }, 1000)
                }
            }
        } catch (err) {
            console.log("Lỗi khi đặt hàng", err)
            setError("Có lỗi khi đặt hàng!")
        }
    }

    const handleClose = () => {
        setShowModal(false)
        setShowMessage(true)
        setTimeout(() => {
            navigate('/')
        }, 1000)
    }

    return (
        <>
            <Header />

            <Container>
                <div className="row">
                    <div className="col-8 offset-md-2">
                        <div className="bg-white mt-4 px-4 py-3 rounded">
                            {/* Thanh toán  */}
                            <div className="d-flex border-bottom mb-3">
                                <Link to='/' className="me-auto">
                                    <img src={Back} alt="Backward" height='25' style={{ cursor: 'pointer' }}/>
                                </Link>
                                <p className="fw-bold fs-5 me-auto">THANH TOÁN</p>
                            </div>
                            {/* Form  */}
                            <div className="px-3 pb-3 mb-3 border-bottom">
                                <div className="row mb-1">
                                    <div className="col">
                                        <Form.Label htmlFor="name">Họ và tên</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="hovaten"
                                            placeholder='Nhập họ và tên người nhận'
                                            className='mb-2'
                                            value={customerInfo.hovaten}
                                            onChange={handleInfoChange}
                                        />
                                    </div>
                                    <div className="col">
                                        <Form.Label htmlFor="sdt">SĐT</Form.Label>
                                        <Form.Control
                                            type="text" 
                                            name="sdt" 
                                            placeholder='Nhập SĐT người nhận'
                                            className='mb-2'
                                            value={customerInfo.sdt}
                                            onChange={handleInfoChange}
                                        />
                                    </div>
                                </div>
                                <Form.Label htmlFor="address">Giao tới</Form.Label>
                                <Form.Control
                                    type="text" 
                                    name="diachi" 
                                    placeholder='Nhập địa chỉ người nhận'
                                    className='mb-2'
                                    value={customerInfo.diachi}
                                    onChange={handleInfoChange}
                                />
                            </div>
                            {/* Tóm tắt đơn hàng */}
                            <div className="px-3 pb-3 border-bottom">
                                <p className="fs-5 fw-medium">Chi tiết đơn hàng</p>
                                {cart.length > 0 ? (
                                    cart.map((item, index) => (
                                        <div className="d-flex mb-3" key={index}>
                                            <img
                                                src={item.product.image}
                                                className='rounded' 
                                                style={{width: '4em'}} 
                                            />
                                            <p className="ms-3 align-self-center me-auto">{item.product.name}</p>
                                            <p className="align-self-center ms-2"><Currency amount={item.product.price} fontSize={16}/></p>
                                            <p className="align-self-center ms-2">x{item.quantity}</p>
                                        </div>
                                    ))
                                ) : (
                                    <span></span>
                                )}
                            </div>
                            <div class=" px-3 py-3">
                                <label for="exampleFormControlTextarea1" class="form-label">Ghi chú cho người bán</label>
                                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                            </div>
                            {/* Phương thức và khuyến mãi */}
                            <div className="px-3 py-3 border-bottom">
                                <p className="fs-5 fw-medium">Phương thức và khuyến mãi</p>
                                <Form.Label>Phương thức thanh toán</Form.Label>
                                <Form.Select defaultValue="Chọn phương thức thanh toán" className="mb-4" onChange={handlePaymentSelected}>
                                    {payment.length > 0 ? (
                                        payment.map((item, index) => (
                                            <option key={index} value={[item.id, item.methodname, item.QRcode]}>{item.methodname}</option>
                                        ))
                                    ) : (
                                        <option>None</option>
                                    )}
                                </Form.Select>
                                <Form.Label htmlFor="coupon">Mã giảm giá</Form.Label>
                                <div className="d-flex justify-content-between">
                                    <Form.Select defaultValue="Chọn mã giảm giá" onChange={handleCouponSelected}>
                                        {coupon.length > 0 ? (
                                            coupon.map((item, index) => (
                                                <option key={index} value={[item.id, item.discountvalue, item.minimum]}>{item.description}</option>
                                            ))
                                        ) : (
                                            <option className="text-secondary">Không có mã giảm giá</option>
                                        )}
                                    </Form.Select>
                                    <Button
                                        variant="dark"
                                        className='blButtonHover rounded-pill ms-3'
                                        onClick={handleCouponUsing}
                                        style={{width: '8rem'}}
                                    >
                                        Áp dụng
                                    </Button>
                                </div>
                            </div>
                            {/* Chi tiết thanh toán  */}
                            <div className="px-3 py-3">
                                <p className="fs-5 fw-medium">Chi tiết thanh toán</p>
                                <p className="mb-2">
                                    Tổng sản phẩm
                                    <span className="float-end">
                                    <Currency
                                        amount={cart.reduce((total, item) => total + item.quantity * item.product.price, 0)}
                                        fontSize={17}
                                    />
                                    </span>
                                </p>
                                <p className="mb-2">
                                    Phí vận chuyển
                                    <span className="float-end fw-medium" style={{color: "#16a634"}}>
                                        +<Currency amount={25000} fontSize={17}/>
                                    </span>
                                </p>    
                                <p className="mb-2">
                                    Mã giảm giá
                                    <span className="float-end fw-medium" style={{color: "#f32409"}}>
                                        -<Currency amount={discount} fontSize={17}/>
                                    </span>
                                </p>
                                <p className="mb-2 fw-medium">
                                    Tổng cộng
                                    <span className="float-end" style={{color: '#000066'}}>
                                        <Currency
                                            amount={total + 25000 - discount}
                                            fontSize={18}
                                        />
                                    </span>
                                </p>
                                
                                {error && <div className="alert alert-danger">{error}</div>}

                                <div className="d-flex justify-content-end">
                                    <Button
                                        className="mt-4 buttonHover rounded-pill"
                                        style={{width: '150px'}}
                                        onClick={handleOrdering}
                                    >
                                        Đặt hàng
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            <ToastContainer className="mt-3 position-fixed" position="top-center">
                <Toast className="bg-success text-white text-center fw-medium" onClose={() => setShowMessage(false)} delay={800} show={showMessage} autohide>
                    <Toast.Body>Đặt hàng thành công!</Toast.Body>
                </Toast>    
            </ToastContainer>
            
            <ToastContainer className="mt-3 position-fixed" position="top-center">
                <Toast className="bg-success text-white text-center fw-medium" onClose={() => setShowCoupon(false)} delay={3000} show={showCoupon} autohide>
                    <Toast.Body>Áp dụng mã giảm giá thành công!</Toast.Body>
                </Toast>    
            </ToastContainer>

            <ToastContainer className="mt-3 position-fixed" position="top-center">
                <Toast className="bg-danger text-white text-center fw-medium" onClose={() => setShowMinimum(false)} delay={3000} show={showMinimum} autohide>
                    <Toast.Body>Đơn hàng của bạn không đủ giá trị tối thiểu!</Toast.Body>
                </Toast>    
            </ToastContainer>

            <Modal
                show={showModal}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                <Modal.Title>Thanh toán qua mã QR</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-center">
                    <img src={QRPay} alt="QRPay" width="400rem"/>
                </Modal.Body>
                <Modal.Footer>
                <Button className="btn rounded-pill buttonHover" onClick={handleClose}>
                    Hoàn thành
                </Button>
                </Modal.Footer>
            </Modal>

            <Footer />
        </>
    )
}

export default Checkout