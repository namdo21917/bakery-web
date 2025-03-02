import { Container, Navbar, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Post from "../components/Post";
import "../components/Custom.css";
import postsApi from "../api/posts";

function Blog() {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    // Phân trang
    const [currentPage, setCurrentPage] = useState(1)
    const postsPerPage = 10

    // Lấy dữ liệu bài viết
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await postsApi.getAllPosts() || [];
                setPosts(response.posts);
                console.log("Response:", response)
            } catch (error) {
                console.log("Lỗi khi lấy dữ liệu bài viết", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // Xử lý số bài viết trên một trang
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

    // Thay đổi trang
    const paginate = (pageNumber) => {
        console.log("curPage", pageNumber)
        setCurrentPage(pageNumber)
    }

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
                                <Link
                                    to="/"
                                    className="link-underline-light text-secondary"
                                >
                                    Trang chủ
                                </Link>
                            </li>
                            <li
                                className="breadcrumb-item active text-dark"
                                aria-current="page"
                            >
                                Cộng đồng
                            </li>
                        </ol>
                    </nav>
                </Navbar>
                <h1>Bài viết nổi bật </h1>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Link
                        to="/posting"
                        className="btn rounded-pill buttonHover"
                        style={{
                            textDecoration: "none",
                        }}
                    >
                        Đăng bài
                    </Link>
                </div>
                <div className="">
                    {loading ? (
                        <p className="text-center text-secondary">Đang tải...</p>
                    ) : posts.length === 0 ? (
                        <p className="text-center text-secondary">Không có bài viết nào để hiển thị</p>
                    ) : (
                        currentPosts.map((post) => (   
                            <Post key={post.id} data={post}/>
                        ))
                    )}
                </div>
                <Pagination className="justify-content-center mt-4">
                    {Array.from(
                        { length: Math.ceil(posts.length / postsPerPage) },
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
            </Container>
            
            <Footer />
        </>
    );
}

export default Blog;
