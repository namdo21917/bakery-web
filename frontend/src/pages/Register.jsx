import { Form, Button, Container, Toast, ToastContainer } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import Logo from '../assets/Logo.svg'
import '../components/Custom.css'
import userApi from '../api/user'


function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [show, setShow] = useState(false)

    const handleRegister = async(e) => {
        e.preventDefault()
        try {
            const response = await userApi.register(username, email, password) || []

            if (response && response.message) {
                
                setShow(true)
                setTimeout(() => {
                    navigate('/login')
                }, 1000) 
            } else throw new Error("Đăng ký thất bại!")
        } catch(error) {
            console.error('Đăng ký không thành công:', error)

            if (error.response) {
                setError(error.response.data.detail || 'Đăng ký không thành công!')
            } else {
                setError('Có lỗi xảy ra, hãy kiểm tra lại!')
            }
        }
    }

    return (
        <>
            <div className="d-flex justify-content-center py-3 border-bottom bg-white">
                <Link to='/'>
                    <img src={Logo} alt="TLU Food Logo" height="30" style={{ cursor: 'pointer' }}/>
                </Link>
            </div>
            <Container>
            <div className="bg-white mt-5 rounded" style={{width:"100%",height:"50%"}}>
                <div className="row">
                    <div className='col-md-5 d-flex align-items-center'>
                        <img src='login.jpg' className='ms-5' style={{width:"85%"}}></img>
                    </div>
                    <div className="col-md-7">
                        <div className='p-5' style={{width:"85%",marginTop:"75px"}}>
                            <p className="fs-3 fw-bold">Tạo tài khoản</p>
                            <Form onSubmit={handleRegister}>
                                <Form.Label htmlFor="nameUser">Tên tài khoản</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="nameUser"
                                    placeholder='Nhập tên tài khoản'
                                    className='mb-2'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <Form.Label htmlFor="emailUser">Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    id="emailUser"
                                    placeholder='Nhập email'
                                    className='mb-2'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Form.Label htmlFor="passwordlUser">Mật khẩu</Form.Label>
                                <Form.Control
                                    type="password"
                                    id="passwordUser"
                                    placeholder='Nhập mật khẩu'
                                    className='mb-2'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {error && <p className="text-danger mb-0">{error}</p>}
                                <Button className='buttonHover rounded-pill mt-3' style={{width: '100%'}} type='submit'>
                                    Tạo tài khoản
                                </Button>
                            </Form>
                            <p className='text-secondary text-center mt-4'>
                                Đã có tài khoản?
                                <Link to='/login'>
                                    <span className='text-black ms-1 text-decoration-underline'>Đăng nhập</span>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            </Container>
            <ToastContainer className="mt-3" position="top-center">
                <Toast className="bg-success text-white text-center fw-medium" onClose={() => setShow(false)} delay={800} show={show} autohide>
                    <Toast.Body>Đăng ký thành công!</Toast.Body>
                </Toast>    
            </ToastContainer>
        </>
    )
}

export default Register