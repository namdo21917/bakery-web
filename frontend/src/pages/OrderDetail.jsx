import { Container, Navbar } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import orderApi from "../api/order";
import Currency from "../components/Currency";
import "../components/Custom.css"

function OrderDetail() {
  const {id} = useParams()
  const [order, setOrder] = useState(null)

  // Lấy dữ liệu đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderApi.getUserOrders();
        // console.log("All Orders:", response.orders)
        
        // Lọc ra đơn hàng có id trùng với id từ URL
        const foundOrder = response.orders.find(order => order.id === parseInt(id))
        console.log("This order:", foundOrder)
        setOrder(foundOrder)
         
      } catch (err) {
        console.log("Lỗi khi lấy dữ liệu đơn hàng", err)
      }
    };

    fetchOrders();
  }, [id]);


  return (
    <>
      <Header />

      <Container>

        <Navbar>
          <nav
            style={{
              "--bs-breadcrumb-divider": `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E")`,
            }}
            aria-label="breadcrumb"
          >
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/" className="link-underline-light text-secondary">
                  Trang chủ
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link
                  to="/orders"
                  className="link-underline-light text-secondary"
                >
                  Đơn hàng
                </Link>
              </li>
              <li
                className="breadcrumb-item active text-dark"
                aria-current="page"
              >
                Chi tiết đơn hàng
              </li>
            </ol>
          </nav>
        </Navbar>
        
        <h2 className="mb-3">Chi tiết đơn hàng</h2>
        <div className="bg-white rounded px-4 py-3 mb-5">
          <div className="d-flex border-bottom mb-3 pb-1">
            <h5 className="me-auto">Thông tin</h5>
            {order && order.status == "Chờ xác nhận" ? (
              <p className="align-self-center">Trạng thái: <span className="text-primary fw-medium">{order && order.status}</span></p>
            ) : order && order.status == "Đang chuẩn bị" ? (
              <p className="align-self-center">Trạng thái: <span className="text-warning fw-medium">{order && order.status}</span></p>
            ) : order && order.status == "Đang giao" ? (
              <p className="align-self-center">Trạng thái: <span className="text-warning-emphasis fw-medium">{order && order.status}</span></p>
            ) : order && order.status == "Hoàn thành" ? (
              <p className="align-self-center">Trạng thái: <span className="text-success fw-medium">{order && order.status}</span></p>
            ) : (
              <p className="align-self-center">Trạng thái: <span className="text-danger fw-medium">{order && order.status}</span></p>
            )}
          </div>
          <p>Mã vận đơn:<span className="mx-2 text-secondary fw-medium">{order && order.tracking_number}</span></p>
          <div className="d-flex">
            <p className="me-2">Họ và tên:</p>
            <p className="fw-medium me-5">{order && order.hovaten}</p>
            <p className="me-2">SĐT:</p>
            <p className="fw-medium">{order && order.sdt}</p>
          </div>
          <p className="text-secondary mb-2">Từ</p>
          <p className="fw-medium mb-2">Đồ ăn | TLU FOOD</p>
          <p className="text-secondary mb-3">
            [Trường đại học Thăng Long] Nghiêm Xuân Yêm - P.Đại Kim, Hoàng Mai,
            Hà Nội
          </p>
          <p className="text-secondary mb-2">Đến</p>
          <p className="fw-medium border-bottom mb-3 pb-3">{order ? order.diachi : "None"}</p>
          <h5 className="mb-4">Chi tiết đơn hàng</h5>
          <div className="mb-3 border-bottom">
            {order && order.products.map((item, index) => (
              <div className="d-flex mb-3" key={index}>
                <img className="rounded me-3 align-self-center" src={item.product.image} style={{ width: "3rem" }}></img>
                <span className="me-2 align-self-center" style={{fontSize: "1.15rem"}}>x{item.quantity}</span>
                <span className="me-auto align-self-center" style={{fontSize: "1.15rem"}}>{item.product.name}</span>
                <p className="align-self-center"><Currency amount={item.product.price} fontSize={15} /></p>
              </div>
            ))}
          </div>
          <h5>Chi tiết thanh toán</h5>
          <div className="d-flex mb-3">
            <p className="my-1 me-auto align-self-center">Tổng tiền</p>
            <p>{order ? <Currency amount={order.tongtien} fontSize={20}/> : 0}</p>
          </div>
          <div className="d-grid d-md-flex justify-content-md-end">
            <Link
              to="/orders"
              className="btn buttonHover rounded-pill"
            >
              Quay lại
            </Link>
          </div>
        </div>
      </Container>

      <Footer />
    </>
  );
}

export default OrderDetail;
