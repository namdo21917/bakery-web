import {
	Container,
	Navbar,
	Toast,
	ToastContainer,
	Modal,
	Pagination,
	Button,
  Form,
  FloatingLabel
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

import React, { useState, useEffect } from "react";
import orderApi from "../api/order";
import "../components/Custom.css";

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [toastVariant, setToastVariant] = useState("success");
	const [showModal, setShowModal] = useState(false);
	const [dishesList, setDishesList] = useState([]);
  	const [orderId, setOrderId] = useState(null)
  	const [ratings, setRatings] = useState({}); // Lưu rating cho từng sản phẩm
	// Phân trang
	const [currentPage, setCurrentPage] = useState(1);
	const ordersPerPage = 10;

	useEffect(() => {
		// Fetch the orders when the component mounts
		const fetchOrders = async () => {
			try {
				const response = await orderApi.getUserOrders();
				// console.log("My OrderRes:", response.orders);
				setOrders(response.orders); // Assuming response contains an 'orders' array
			} catch (err) {
				console.log("Lỗi khi lấy dữ liệu đơn hàng", err);
			}
		};

		fetchOrders();
	}, []);

	// Xử lý số bài viết trên một trang
	const indexOfLastOrder = currentPage * ordersPerPage;
	const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
	const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

	// Thay đổi trang
	const paginate = (pageNumber) => {
		console.log("curPage", pageNumber);
		setCurrentPage(pageNumber);
	};

	const handleCancelOrder = async (orderId) => {
		try {
			const cancelResponse = await orderApi.cancelOrder(orderId);
			console.log("Cancel:", cancelResponse);
			// Cập nhật trạng thái đơn hàng trong state sau khi hủy
			setOrders((prevOrders) =>
				prevOrders.map((order) =>
					order.id === orderId ? { ...order, status: "Hủy" } : order
				)
			);

			// Hiển thị thông báo thành công
			setToastMessage("Đơn hàng đã hủy thành công.");
			setToastVariant("success");
			setShowToast(true);
		} catch (err) {
			console.log("Lỗi khi hủy đơn:", err);
			setToastMessage("Không thể hủy đơn hàng!");
			setToastVariant("danger");
			setShowToast(true);
		}
	};

	const handleOpen = ([dishList, orderId]) => {
    console.log("List:", dishList, orderId); // Kiểm tra danh sách sản phẩm
    setDishesList(dishList);
    setOrderId(orderId)
    setShowModal(true);
  };

	const handleClose = () => {
		setShowModal(false);
	};

  const handleRatingChange = (productId, value) => {
    // Cập nhật giá trị rating của từng sản phẩm
    console.log("Rating:", ratings)
    setRatings((prevRatings) => ({
      ...prevRatings,
      [productId]: Math.min(Math.max(value, 0), 5), // Giới hạn từ 0 đến 5
    }));
  };

  const handleSubmitRatings = async (e) => {
    e.preventDefault()
    try {
      for (const productId in ratings) {
        const rating = ratings[productId];
        if (rating) {
          await orderApi.rateDish(orderId, productId, rating);
        }
      }
      // Thông báo thành công
      setToastMessage("Đánh giá thành công!");
      setToastVariant("success");
      setShowToast(true);
      handleClose();
    } catch (error) {
      console.error("Lỗi đánh giá sản phẩm:", error);
      setToastMessage("Đánh giá không thành công!");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

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
							<li
								className="breadcrumb-item active text-dark"
								aria-current="page"
							>
								Đơn hàng
							</li>
						</ol>
					</nav>
				</Navbar>
				<h1 className="mb-3">Đơn hàng của tôi</h1>

				{orders.length === 0 ? (
					<div>Không có đơn hàng nào</div>
				) : (
					currentOrders.map((order) => (
						<div className="my-4" key={order.id}>
							<div className="card cardHover">
								<div className="card-body">
									<div className="d-flex justify-content-between align-items-center mb-3 border-bottom">
										<p>
											Mã vận hàng:{" "}
											<span className="text-secondary fw-medium">
												{order.tracking_number}
											</span>
										</p>
										{order && order.status == "Chờ xác nhận" ? (
											<p>
												Trạng thái:{" "}
												<span className="text-primary fw-medium">
													{order.status}
												</span>
											</p>
										) : order && order.status == "Đang chuẩn bị" ? (
											<p>
												Trạng thái:{" "}
												<span className="text-warning fw-medium">
													{order.status}
												</span>
											</p>
										) : order && order.status == "Đang giao" ? (
											<p>
												Trạng thái:{" "}
												<span className="text-warning-emphasis fw-medium">
													{order.status}
												</span>
											</p>
										) : order && order.status == "Hoàn thành" ? (
											<p>
												Trạng thái:{" "}
												<span className="text-success fw-medium">
													{order.status}
												</span>
											</p>
										) : (
											<p>
												Trạng thái:{" "}
												<span className="text-danger fw-medium">
													{order.status}
												</span>
											</p>
										)}
									</div>

									<ul className="list-group list-group-flush mb-3 border-bottom">
										{order.products.map((productItem, index) => (
											<li
												className="d-flex justify-content-between mb-3"
												key={`${order.id}-product-${index}`}
											>
												<span
													className="fw-medium"
													style={{
														fontSize: "17px",
													}}
												>
													{productItem.product.name}
												</span>
												<span className="fw-medium">
													x{productItem.quantity}
												</span>
											</li>
										))}
									</ul>
									<div className="d-flex justify-content-between align-items-center">
										<p>
											Thành tiền:{" "}
											<span
												className="fw-bold"
												style={{
													color: "#000066",
												}}
											>
												{order.tongtien.toLocaleString()}đ
											</span>
										</p>
									</div>
									<div className="text-end mt-3">
										<button
											className="btn me-2 rounded-pill rButtonHover"
											onClick={() => handleCancelOrder(order.id)}
										>
											Hủy đơn
										</button>
										{order && order.status == "Hoàn thành" && (
											<button
												className="btn me-2 rounded-pill yButtonHover"
												onClick={() => handleOpen([order.products, order.id])}
											>
												Đánh giá
											</button>
										)}
										<Link
											to={"/order-detail/" + order.id}
											className="btn rounded-pill buttonHover"
										>
											Chi tiết
										</Link>
									</div>
								</div>
							</div>
						</div>
					))
				)}
				<Pagination className="justify-content-center mt-4">
					{Array.from(
						{
							length: Math.ceil(orders.length / ordersPerPage),
						},
						(_, index) => (
							<Pagination.Item
								key={index + 1}
								active={index + 1 === currentPage}
								onClick={() => paginate(index + 1)}
							>
								{index + 1}
							</Pagination.Item>
						)
					)}
				</Pagination>

				<ToastContainer className="mt-3 position-fixed" position="top-center">
					<Toast
						className="text-white text-center fw-medium"
						show={showToast}
						onClose={() => setShowToast(false)}
						bg={toastVariant}
						delay={2500}
						autohide
					>
						<Toast.Body>{toastMessage}</Toast.Body>
					</Toast>
				</ToastContainer>

				<Modal
					show={showModal}
					onHide={handleClose}
					backdrop="static"
					keyboard={false}
				>
					<Modal.Header closeButton>
						<Modal.Title>Đánh giá sản phẩm</Modal.Title>
					</Modal.Header>
          <Form>
            <Modal.Body className="px-3">
              {dishesList.map((item, index) => (
                <div className="d-flex" key={index}>
                  <p className="fs-5 mb-2 align-self-center">{item.product.name}</p>
                  <FloatingLabel label="Số sao" className='mb-3 ms-auto'>
                    <Form.Control
                      type="number"
                      min="0"
                      max="5"
                      value={ratings[item.product.id] || ""}
                      onChange={(e) =>
                        handleRatingChange(item.product.id, parseFloat(e.target.value))
                      }
                      required
                    />
                  </FloatingLabel>
                </div>
              ))}
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="btn rounded-pill blButtonHover"
                onClick={handleClose}
              >
                Đóng
              </Button>
              <Button className="btn rounded-pill yButtonHover" type="submit" onClick={handleSubmitRatings}>Đánh giá</Button>
            </Modal.Footer>
          </Form>
				</Modal>
			</Container>

			<Footer />
		</>
	);
};

export default Orders;
