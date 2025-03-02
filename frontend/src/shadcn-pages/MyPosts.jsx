import { Container, Navbar, Pagination } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

import Header from "../components/Header"
import Footer from "../components/Footer"
import postsApi from "../api/posts"
import Post from "../components/Post"

function MyPosts() {
    const [loading, setLoading] = useState(true);
    const [myPosts, setMyPosts] = useState([]);
    // Phân trang
    const [currentPage, setCurrentPage] = useState(1)
    const postsPerPage = 10

    // Lấy dữ liệu bài viết
    useEffect(() => {
        const fetchMyPosts = async () => {
            setLoading(true);
            try {
                const myPostsResponse = await postsApi.getMyPosts() || [];
                setMyPosts(myPostsResponse)
                console.log("myPostsRes:", myPostsResponse)
            } catch (error) {
                console.log("Lỗi khi lấy dữ liệu bài viết", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyPosts();
    }, []);

    // Xử lý số bài viết trên một trang
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = myPosts.slice(indexOfFirstPost, indexOfLastPost)

    // Thay đổi trang
    const paginate = (pageNumber) => {
        console.log("curPage", pageNumber)
        setCurrentPage(pageNumber)
    }

    // Hàm cập nhật danh sách bài viết sau khi xóa
    const handleDelete = (deletedPostId) => {
        setMyPosts((prevPosts) => prevPosts.filter(post => post.id !== deletedPostId));
    };

    // Hàm cập nhật bài viết
    const handleUpdate = (updatedPostId, updatedTitle, updatedContent) => {
        setMyPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === updatedPostId
                    ? { ...post, title: updatedTitle, content: updatedContent }
                    : post
            )
        );
    };

    return (
        <>
            <Header />

            <Container>
                <Navbar>
                    <nav style={{
                                    "--bs-breadcrumb-divider": `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E")`,
                                }} aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/" className="link-underline-light text-secondary">Trang chủ</Link></li>
                        <li className="breadcrumb-item active text-dark" aria-current="page">Bài viết của tôi</li>
                    </ol>
                    </nav>
                </Navbar>
                <h1 className="mb-3">Bài viết của tôi</h1>
                <div className="mt-5">
                    {loading ? (
                        <p className="text-center text-secondary">Đang tải...</p>
                    ) : myPosts.length === 0 ? (
                        <p className="text-center text-secondary">Không có bài viết nào để hiển thị</p>
                    ) : (
                        currentPosts.map((post) => (   
                            <Post key={post.id} data={post} onDelete={handleDelete} onUpdate={handleUpdate} />
                        ))
                    )}
                </div>
                <Pagination className="justify-content-center mt-4">
                    {Array.from(
                        { length: Math.ceil(myPosts.length / postsPerPage) },
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
    )
}

export default MyPosts