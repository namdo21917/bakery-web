import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from "sonner"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "../components/ui/command"
import { Toaster } from "../components/ui/sonner"

import Logo from '../assets/Logo.svg'
import UserLogo from '../assets/User.svg'
import GroupLogo from '../assets/Group.svg'
import BagLogo from '../assets/Bag.svg'
import CartItem from './CartItem'
import { useCart } from './CartContext'
import './Custom.css'
import dishesApi from '../api/dishes'

function Header() {
    const [showOffcanvas, setShowOffcanvas] = useState(false)
    const location = useLocation()
    const isCheckout = location.pathname === '/checkout'
    const [dishes, setDishes] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredDishes, setFilteredDishes] = useState([])
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const userName = sessionStorage.getItem('username')
    const { cartCount, updateCartCount } = useCart()
    const currentPath = window.location.pathname
    sessionStorage.setItem("path-before-login", currentPath)

    useEffect(() => {
        const accessToken = sessionStorage.getItem("access_token")
        setIsLoggedIn(!!accessToken)
    }, [])

    const handleLogout = async (e) => {
        e.preventDefault()

        if (isCheckout) {
            toast.error("Hãy hoàn thành việc thanh toán!")
            return
        }

        if (!window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            return
        }

        try {
            sessionStorage.clear()
            localStorage.clear()
            updateCartCount(0)
            setIsLoggedIn(false)

            toast.success("Đăng xuất thành công!")

            setTimeout(() => {
                navigate('/')
            }, 1000)
        } catch (error) {
            console.error('Lỗi trong quá trình đăng xuất:', error)
            toast.error("Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại!")
        }
    }

    const handleShow = () => {
        if (isCheckout) {
            toast.error("Hãy hoàn thành việc thanh toán!")
            return false
        } else if (isLoggedIn) {
            setShowOffcanvas(true)
            return true
        } else {
            toast.error("Vui lòng đăng nhập trước!")
            return false
        }
    }

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const response = await dishesApi.getAllDishes()
                setDishes(response || [])
            } catch (error) {
                console.log('Lỗi lấy dữ liệu tìm kiếm: ', error)
            }
        }
        fetchDishes()
    }, [])

    const handleSearch = (query) => {
        setSearchQuery(query)
        if (query === '') {
            setFilteredDishes([])
        } else {
            const filtered = dishes.filter(dish => {
                return dish.name.toLowerCase().includes(query.toLowerCase())
            })
            setFilteredDishes(filtered)
        }
    }

    const handleSelectDish = () => {
        setSearchQuery('')
        setFilteredDishes([])
    }

    return (
        <>
            <div className="relative">
                {/* Banner Section */}
                <div className="relative h-[600px] w-full">
                    <div className="absolute inset-0 bg-black/60 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop"
                        alt="Banner"
                        className="w-full h-full object-cover"
                    />

                    {/* Search and Actions Bar - Absolute positioned on top of banner */}
                    <div className="absolute top-0 left-0 right-0 z-20 bg-transparent">
                        <div className="container mx-auto">
                            <div className="flex items-center justify-between py-4">
                                {/* Logo */}
                                <Link to="/" className="flex items-center">
                                    <img src={Logo} alt="Logo" className="h-12" />
                                </Link>

                                {/* Search Bar */}
                                <div className="w-[500px]">
                                    <Command className="rounded-lg border shadow-sm bg-white/10 backdrop-blur-md">
                                        <CommandInput
                                            placeholder="Tìm kiếm sản phẩm..."
                                            value={searchQuery}
                                            onValueChange={handleSearch}
                                            className="text-white placeholder:text-white/70"
                                        />
                                        {filteredDishes.length > 0 && (
                                            <CommandList className="absolute top-full w-full bg-white mt-1 rounded-lg border shadow-lg max-h-[300px] overflow-auto">
                                                <CommandGroup>
                                                    {filteredDishes.map(dish => (
                                                        <CommandItem
                                                            key={dish.id}
                                                            onSelect={() => {
                                                                handleSelectDish()
                                                                navigate(`/dish/${dish.id}`)
                                                            }}
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <img
                                                                    src={dish.image}
                                                                    alt={dish.name}
                                                                    className="h-8 w-8 object-cover rounded"
                                                                />
                                                                <span>{dish.name}</span>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        )}
                                    </Command>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-4">
                                    <Link to="/blog">
                                        <Button variant="ghost" size="icon" className="hover:bg-white/10">
                                            <img src={GroupLogo} alt="Blog" className="h-6 w-6 brightness-0 invert" />
                                        </Button>
                                    </Link>

                                    <Sheet
                                        open={showOffcanvas}
                                        onOpenChange={(open) => {
                                            if (open) {
                                                if (handleShow()) {
                                                    setShowOffcanvas(true)
                                                }
                                            } else {
                                                setShowOffcanvas(false)
                                            }
                                        }}
                                    >
                                        <SheetTrigger asChild>
                                            <Button variant="ghost" size="icon" className="relative hover:bg-white/10">
                                                <img src={BagLogo} alt="Cart" className="h-6 w-6 brightness-0 invert" />
                                                {cartCount > 0 && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="absolute -top-1 -right-1"
                                                    >
                                                        {cartCount}
                                                    </Badge>
                                                )}
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent>
                                            <SheetHeader>
                                                <SheetTitle>Giỏ hàng</SheetTitle>
                                            </SheetHeader>
                                            <CartItem />
                                        </SheetContent>
                                    </Sheet>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="hover:bg-white/10">
                                                <img src={UserLogo} alt="User" className="h-6 w-6 brightness-0 invert" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {isLoggedIn ? (
                                                <>
                                                    <DropdownMenuLabel>{userName}</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link to="/account" className="no-underline text-black">Trang cá nhân</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link to="/orders" className="no-underline text-black">Đơn hàng của tôi</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link to="/my-posts" className="no-underline text-black">Bài viết của tôi</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={handleLogout}>
                                                        Đăng xuất
                                                    </DropdownMenuItem>
                                                </>
                                            ) : (
                                                <DropdownMenuItem asChild>
                                                    <Link to="/login">Đăng nhập</Link>
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Banner Content */}
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white">
                        <h1 className="text-5xl font-bold mb-2">Delicious Cafe</h1>
                        <h2 className="text-7xl font-bold mb-8 text-orange-300">
                            Sweet Treats,<br />Perfect Eats
                        </h2>
                    </div>
                </div>
            </div>
            <Toaster />
        </>
    )
}

export default Header