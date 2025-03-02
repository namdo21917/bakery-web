import { Container, Breadcrumb, Form, FloatingLabel, Pagination } from 'react-bootstrap'
import { useEffect, useState } from 'react'   
import { useParams, Link } from 'react-router-dom'

import Header from "../components/Header"
import Footer from "../components/Footer"
import postsApi from '../api/posts'
import Favorite from '../assets/Favorite.svg'
import Favorited from '../assets/Favorited.svg'
import Comment from '../components/Comment'
import '../components/Custom.css'

function PostDetail() {
    const {id} = useParams()
    const [post, setPost] = useState(null)
    const [isLiking, setIsLiking] = useState(false)
    const [likedCount, setLikedCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [commentContent, setCommentContent] = useState('')
    const [commentList, setCommentList] = useState([])
    const [loading, setLoading] = useState(true)
    // Phân trang cho bình luận
    const [currentPage, setCurrentPage] = useState(1)
    const commentsPerPage = 7

    // Lấy dữ liệu chi tiết bài viết
    useEffect(() => {
        const fetchPost = async() => {
            try {
                const postDetail = await postsApi.getPostDetail(id)
                setPost(postDetail)
                setLikedCount(postDetail.liked_by.length)
                setIsLiked(postDetail.liked_by.includes(sessionStorage.getItem("username")))
                // console.log("DL Post", postDetail)
            } catch (error) {
                console.log("Có lỗi khi lấy dữ liệu chi tiết bài viết:", error)
            }
        }
        fetchPost()
    }, [id])

    // Lấy dữ liệu danh sách bình luận của bài viết
    useEffect(() => {
        const fetchCommentList = async() => {
            setLoading(true)
            try {
                const commentListResponse = await postsApi.getCommentList(id) || []
                console.log("commentListRes:", commentListResponse)

                setCommentList(commentListResponse)
            } catch(error) {
                console.log("Lỗi khi lấy dữ liệu danh sách bình luận:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCommentList()
    }, [id])

    const handleLikePost = async () => {
        if (!sessionStorage.getItem("access_token")) {
            alert("Bạn cần đăng nhập để thích bài viết")
            return
        }
        if (!post || isLiking) return
        setIsLiking(true) // Ngăn nhấn liên tục
        try {
            const updatedPost = await postsApi.like(id)
            console.log("postRes:", updatedPost)

            setLikedCount(updatedPost.liked_by.length)
            setIsLiked(!isLiked)
        } catch (error) {
            console.log("Có lỗi khi thích bài viết:", error)
        } finally {
            setIsLiking(false)
        }
    }

    const handleComment = async (e) => {
        e.preventDefault()
        if (!sessionStorage.getItem("access_token")) {
            alert("Bạn cần đăng nhập để bình luận")
            return
        }
        try {
            const commentResponse = await postsApi.comment(id, commentContent)
            console.log('commentRes', commentResponse)
            
             // Cập nhật danh sách bình luận với bình luận mới nhất
            setCommentList((prevComments) => [commentResponse, ...prevComments])

            // Xóa nội dung ô nhập sau khi gửi
            setCommentContent('')
        } catch(error) {
            console.log("Có lỗi khi bình luận:", error)
        }
    }

    // Xử lý số bình luận trên một trang
    const indexOfLastComment = currentPage * commentsPerPage
    const indexOfFirstComment = indexOfLastComment - commentsPerPage
    const currentComment = commentList.slice(indexOfFirstComment, indexOfLastComment)

    // Thay đổi trang
    const paginate = (pageNumber) => {
        console.log("curPage", pageNumber)
        setCurrentPage(pageNumber)
    }

    return (
        <>
            <Header />

            <Container>
                <Breadcrumb className='my-3'>
                    <Link to='/' className='text-decoration-none text-secondary me-2'>Trang chủ</Link>
                    <span className='text-secondary me-2'>&gt;</span>
                    <Link to='/blog' className='text-decoration-none text-secondary me-2'>Cộng đồng</Link>
                    <span className='text-secondary me-2'>&gt;</span>
                    <Breadcrumb.Item active className='text-dark'>
                        {post ? post.title : "Đang tải..."}
                    </Breadcrumb.Item>
                </Breadcrumb>

                <div className="row container gx-3">
                    <div className="col-lg-8">
                        <div className="bg-white rounded py-2 px-4">
                            <div className="d-flex mb-3">
                                <span className='text-secondary me-2'>&lt;</span>
                                <Link to={'/blog'} className='text-secondary text-decoration-none'>Quay lại</Link>
                            </div>
                            <h3 className='mb-3'>{post ? post.title : "Đang tải..."}</h3>
                            <p style={{ whiteSpace: "pre-wrap" }}>{post ? post.content : "Đang tải..."}</p>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="bg-white rounded py-2 px-4 clearfix">
                            <p className='fw-medium border-bottom pb-2 mb-2' style={{color: '#000066'}}>{post ? post.author : "Đang tải..."}</p>
                            <div className="d-flex border-bottom pb-2 mb-2">
                                <img 
                                    src={isLiked ? Favorited : Favorite}
                                    className="me-2"
                                    width='25'
                                    style={{ cursor: 'pointer' }} 
                                    onClick={handleLikePost}
                                />
                                <span className='text-secondary'>{likedCount}</span>
                            </div>
                            <p className='fw-medium mb-2'>
                                <span className='me-1'>{post && post.comments ? post.comments.length : "Đang tải..."}</span>
                                bình luận
                            </p>
                            <Form onSubmit={handleComment}>
                                <FloatingLabel controlId="floatingTextarea2" label="Bình luận" className='mb-2'>
                                    <Form.Control
                                        as='textarea'
                                        placeholder="Thêm bình luận"
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        required
                                    />
                                </FloatingLabel>
                                <button
                                    className='rounded-pill btn float-end buttonHover mb-2'
                                    style={{fontSize: '14px'}}
                                    type='submit'
                                >
                                    Bình luận
                                </button>
                            </Form>
                            <div className="mt-5">
                                {loading ? (
                                    <p className="text-center text-secondary">Đang tải...</p>
                                ) : commentList.length === 0 ? (
                                    <p className="text-center text-secondary">Chưa có bình luận!</p>
                                ) : (
                                    currentComment.map((comment) => (   
                                        <Comment key={comment.id} data={comment}/>
                                    ))
                                )}
                            </div>
                            <Pagination className="justify-content-center mt-4">
                                {Array.from(
                                    { length: Math.ceil(commentList.length / commentsPerPage) },
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
                        </div>
                    </div>
                </div>

            </Container>

            <Footer />
        </>
    )
}

export default PostDetail