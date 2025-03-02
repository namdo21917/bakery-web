import 'bootstrap/dist/css/bootstrap.min.css'
import { Routes, Route } from 'react-router-dom'

import './App.css'
import Home from './pages/Home'
import Blog from './pages/Blog'
import DishDetail from './pages/DishDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import Post from './pages/Posting'
import Account from './pages/Account'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import ScrollToTop from './components/ScrollToTop'
import PostDetail from './pages/PostDetail'
import MyPosts from './pages/MyPosts'

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/dish/:id' element={<DishDetail />}/>
        <Route path='/blog' element={<Blog />}/>
        <Route path='/account' element={<Account />}/>
        <Route path='/posting' element={<Post />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/order-detail/:id' element={<OrderDetail />} />
        <Route path='/posts/:id' element={<PostDetail />} />
        <Route path='/my-posts' element={<MyPosts />} />

      </Routes>

    </>
  )
}

export default App
