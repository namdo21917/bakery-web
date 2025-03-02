import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'

import '../components/Custom.css'
import postsApi from '../api/posts'
import EditPostModal from './EditPostModal'

function Post({ data, onDelete, onUpdate }) {
    const [showEditModal, setShowEditModal] = useState(false)
    // Nếu ở trang bài viết của tôi thì hiện nút sửa/xóa bài viết
    const location = useLocation()
    const isMyPosts = location.pathname === '/my-posts'

    // Tính toán thời gian đăng bài 
    const formatDate = (created) => {
        const date = new Date(created)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
    
        return `${day}/${month}/${year}`
    }

    // Hàm xử lý xóa bài viết
    const handleDelete = async () => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?');
        if (confirmDelete) {
            try {
                await postsApi.deletePost(data.id); // Gọi API xóa bài viết
                alert('Xóa bài viết thành công!');
                if (onDelete) onDelete(data.id); // Gọi callback để cập nhật danh sách bài viết
            } catch (error) {
                console.error('Lỗi khi xóa bài viết:', error);
                alert('Xóa bài viết thất bại!');
            }
        }
    };

    // Hàm hiển thị modal sửa bài viết
    const handleEdit = () => {
        setShowEditModal(true);
    };

    return (
        <>  
            <div className="rounded bg-white px-4 py-3 mt-3 cardHover">
                <div className="d-flex border-bottom pb-2 mb-2">
                    <div className="fw-medium me-auto align-self-center" style={{color: '#000066'}}>{data.author}</div>
                    {isMyPosts ? (
                        <span>
                            <button
                                className='btn rounded-pill me-2 buttonHover'
                                onClick={handleEdit}
                            >
                                    Sửa
                            </button>
                            <button
                                className='btn rounded-pill rButtonHover'
                                onClick={handleDelete}
                            >
                                    Xóa
                            </button>
                        </span>
                    ) : (
                        <span></span>
                    )}
                </div>
                <Link className='text-decoration-none text-black' to={`/posts/${data.id}`}>
                    <p className="fs-4 fw-medium mb-2">{data.title}</p>
                    <p className='text-truncate mb-3'>{data.content}</p>
                    <div className='text-secondary' style={{fontSize: '14px'}}>{formatDate(data.created_at)}</div>
                </Link>
            </div>

            {/* Modal sửa bài viết */}
            <EditPostModal 
                show={showEditModal} 
                onHide={() => setShowEditModal(false)} 
                post={data}
                onUpdate={onUpdate} 
            />
        </>
    )
}

export default Post