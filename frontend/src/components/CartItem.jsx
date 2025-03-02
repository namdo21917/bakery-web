import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Offcanvas, Toast, ToastContainer } from "react-bootstrap"

import Currency from "./Currency"
import dishesApi from "../api/dishes"
import { useCart } from "./CartContext"

function CartItem() {
    const [cart, setCart] = useState([])
    const { updateCartCount } = useCart()
    const [showToast, setShowToast] = useState(false)
    const navigate = useNavigate()

    // Lấy dữ liệu giỏ hàng
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await dishesApi.customerCart()
                setCart(response.carts[0].products || [])
                console.log("cartRes in cart:", response)


            } catch (err) {
                console.log("Không thể tải giỏ hàng:", err)
            }
        }
        fetchCart()
    }, [])


    // Tăng giảm số lượng có tích hợp API cập  nhật số lượng trong giỏ hàng
    const handleIncrease = async (index) => {
        try {
            const updatedCart = cart.map((item, i) =>
                i === index ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCart(updatedCart);
    
            // Gọi API để cập nhật số lượng 
            const productId = cart[index].product.id;
            const newQuantity = updatedCart[index].quantity;
            await dishesApi.updateCartItem(productId, newQuantity);
            console.log("Tăng số lượng thành công");
        } catch (error) {
            console.error("Lỗi khi tăng số lượng:", error);
            alert("Không thể tăng số lượng. Vui lòng thử lại!");
        }
    };
    
    const handleDecrease = async (index) => {
        if (cart[index].quantity > 0) {
            try {
                const updatedCart = cart.map((item, i) =>
                    i === index ? { ...item, quantity: item.quantity - 1 } : item
                );
                setCart(updatedCart);
    
                // Gọi API để cập nhật số lượng
                const productId = cart[index].product.id;
                const newQuantity = updatedCart[index].quantity;
                
                if (newQuantity === 0) {
                    console.log("Có thể xóa sản phẩm");
                } else {
                    await dishesApi.updateCartItem(productId, newQuantity);
                    console.log("Giảm số lượng thành công");
                }
            } catch (error) {
                console.error("Lỗi khi giảm số lượng:", error);
                alert("Không thể giảm số lượng. Vui lòng thử lại!");
            }
        }
    };
    
    // Xóa sản phẩm khỏi giỏ
    const handleRemove = async (index) => {
        try {
            const productId = cart[index].product.id;
            await dishesApi.removeCartItem(productId);
    
            // Cập nhật lại trạng thái cart sau khi xóa
            const updatedCart = cart.filter((_, i) => i !== index);
            setCart(updatedCart);

            // Cập nhật số loại sản phẩm trong Context
            const cartResponse = await dishesApi.customerCart()
            // console.log("cusCartRes:", cartResponse)
            const totalItems = cartResponse.carts[0].quantity

            // Cập nhật số lượng giỏ hàng trong context
            updateCartCount(totalItems)
    
            console.log("Xóa sản phẩm thành công");
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            alert("Không thể xóa sản phẩm. Vui lòng thử lại!");
        }
    };
    
    const handleCheckout = () => {
        if (cart.length <= 0) {
          // Nếu giỏ hàng trống, hiển thị Toast
          setShowToast(true);
        } else {
          navigate("/checkout/")
        }
      };

    return (
        <>
            <Offcanvas.Body>
                {cart.length > 0 ? (
                    cart.map((item, index) => (
                        <div className="d-flex mb-2" key={index}>
                            <span className='d-flex align-self-center pb-1' >
                                <button type='button' className='btn fw-bold border border-0' onClick={() => handleDecrease(index)}>-</button>
                                <span className='align-self-center mx-0'>{item.quantity}</span>
                                <button type='button' className='btn fw-bold border border-0' onClick={() => handleIncrease(index)}>+</button>
                            </span>
                            <img 
                                src={item.product.image}
                                className='object-fit-scale mx-1 rounded' 
                                style={{width: '2.5em'}}
                            />
                            <p className='fw-medium ms-2 pt-3' style={{fontSize: '14px'}}>{item.product.name}</p>
                            {item.quantity > 0 ? (
                                <p className='ms-auto pt-3'><Currency amount={item.product.price} fontSize={16} /></p>
                            ) : (
                                <button 
                                    type="button" 
                                    className="btn text-danger fw-bold border-0 ms-auto" 
                                    onClick={() => handleRemove(index)}
                                >
                                    Xóa
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Giỏ hàng trống.</p>
                )}
            </Offcanvas.Body>
            <div className="px-3 py-2 border-top mt-auto">
                <div className="d-flex justify-content-between align-items-end">
                    <p className=''>Tổng cộng</p>
                    <p><Currency amount={cart.reduce((total, item) => total + item.quantity * item.product.price, 0)}/></p>
                </div>
                <Button className='buttonHover rounded-pill' style={{width: '100%'}} onClick={handleCheckout}>
                    Thanh toán
                </Button>
            </div>
            <ToastContainer className="mt-3 me-3 position-fixed" position="top-end">
                <Toast className="bg-danger text-white text-center fw-medium" onClose={() => setShowToast(false)} delay={2500} show={showToast} autohide>
                    <Toast.Body>Giỏ hàng trống!</Toast.Body>
                </Toast>    
            </ToastContainer>
        </>
    )
}

export default CartItem