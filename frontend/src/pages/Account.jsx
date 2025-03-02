import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import "../components/Custom.css";
import userApi from "../api/user";

function Account() {
	const [image, setImage] = useState(null);
	const [userInfo, setUserInfo] = useState([]);

	useEffect(() => {
		const fetchUserInfo = async () => {
			try {
				const userResponse = await userApi.userInfo();
				console.log("userRes:", userResponse);
				setUserInfo(userResponse);
			} catch (err) {
				console.log("Có lỗi khi lấy thông tin người dùng", err);
			}
		};
		fetchUserInfo();
	}, []);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImage(URL.createObjectURL(file));
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
								Tài khoản
							</li>
						</ol>
					</nav>
				</Navbar>
				<div
					className="bg-white p-3 rounded just-content-center"
					style={{ marginTop: "30px", marginLeft: "12%", width: "80%" }}
				>
					<h2 className="mb-3">Thông tin của bạn</h2>
					<div className="row">
						<div className="col-md-4 text-center ">
							<div className="mb-3">
								<div
									className="rounded-circle overflow-hidden"
									style={{ width: "100px", height: "100px", margin: "auto" }}
								>
									<img
										src={
											image ||
											"https://via.placeholder.com/100x100?text=No+Image"
										}
										alt="Profile"
										className="img-fluid"
										style={{
											objectFit: "cover",
											width: "100%",
											height: "100%",
										}}
									/>
								</div>
							</div>
							<input
								type="file"
								accept="image/*"
								id="profilePicture"
								style={{ display: "none" }}
								onChange={handleImageChange}
							/>
							<label
								htmlFor="profilePicture"
								className="btn rounded-pill buttonHover"
							>
								Thêm ảnh
							</label>
						</div>
						<div className="col-md-8 " style={{ width: "60%" }}>
							<h6 className="text-secondary fw-normal">
								Tên tài khoản:{" "}
								<span className="text-dark fw-medium">{userInfo.username}</span>
							</h6>
							<h6 className="text-secondary fw-normal">
								SĐT:{" "}
								<span className="text-dark fw-medium">
									{userInfo ? userInfo.phone_number : "Trống"}
								</span>
							</h6>
							<h6 className="text-secondary fw-normal">
								Email:{" "}
								<span className="text-dark fw-medium">
									{userInfo ? userInfo.email : "Trống"}
								</span>
							</h6>
							<h6 className="text-secondary fw-normal">
								Địa chỉ:{" "}
								<span className="text-dark fw-medium">
									{userInfo ? userInfo.address : "Trống"}
								</span>
							</h6>

							{/* <label for="exampleFormControlInput1" class="form-label fw-bold">
                Tên tài khoản
              </label>
              <input
                type="text"
                className="form-control mb-3"
                id="exampleFormControlInput1"
                placeholder=""
              />
              <label for="exampleFormControlInput1" class="form-label fw-bold">
                Email
              </label>
              <input
                type="email"
                className="form-control mb-3"
                id="exampleFormControlInput1"
                placeholder=""
              />
              <label for="exampleFormControlInput1" class="form-label fw-bold">
                Số điện thoại
              </label>
              <input
                type="number"
                className="form-control mb-3"
                id="exampleFormControlInput1"
                placeholder=""
              />
              <label for="exampleFormControlInput1" class="form-label fw-bold">
                Địa chỉ
              </label>
              <input
                type="text"
                className="form-control mb-3"
                id="exampleFormControlInput1"
                placeholder=""
              /> */}

							{/* <div className="d-grid gap-2 d-md-flex justify-content-md-end">
								<Link to="/account" className="btn rounded-pill buttonHover">
									Cập nhật
								</Link>
							</div> */}
						</div>
					</div>
				</div>
			</Container>

			<Footer />
		</>
	);
}

export default Account;
