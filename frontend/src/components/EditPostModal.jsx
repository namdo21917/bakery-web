import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

import postsApi from '../api/posts';
import '../components/Custom.css'

function EditPostModal({ show, onHide, post, onUpdate }) {
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [loading, setLoading] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault()
        setLoading(true);
        try {
            await postsApi.updatePost(post.id, title, content);
            alert('Cập nhật bài viết thành công!');
            if (onUpdate) onUpdate(post.id, title, content);
            onHide(); 
        } catch (error) {
            console.error('Lỗi khi cập nhật bài viết:', error);
            alert('Cập nhật bài viết thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa bài viết</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Tiêu đề</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Nội dung</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={8} 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            required
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn blButtonHover rounded-pill' onClick={onHide}>
                    Hủy
                </Button>
                <Button className='btn buttonHover rounded-pill' onClick={handleSave} disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditPostModal;
