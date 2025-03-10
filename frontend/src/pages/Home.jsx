import {Spinner} from 'react-bootstrap'
import React, {useEffect, useState} from 'react'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Left from '../assets/Left.svg'
import Right from '../assets/Right.svg'
import Dish from '../components/Dish'
import dishesApi from '../api/dishes'
import ms_banner_img3 from "@/assets/ms_banner_img3.webp";

function Home() {
    const [loading, setLoading] = useState(true)   // Trạng thái lấy dữ liệu
    const [categories, setCategories] = useState({})    // Danh mục và các món ăn trong đó

    // Lấy dữ liệu 
    useEffect(() => {
        const fetchDishes = async () => {
            setLoading(true);
            try {
                const dishesResponse = await dishesApi.getAllDishes() || []
                const categoriesResponse = await dishesApi.getAllCategories() || []

                if (dishesResponse) {
                    const dishesData = dishesResponse || []
                    const categoriesData = categoriesResponse || []

                    // Nhóm món ăn theo id danh mục
                    const dishGroupbyIdCategory = dishesData.reduce((acc, dish) => {
                        const categoryId = dish.category
                        if (!acc[categoryId]) {
                            acc[categoryId] = []
                        }
                        acc[categoryId].push(dish)
                        return acc
                    }, {})

                    const categoryMap = categoriesData.reduce((acc, {id, name}) => {
                        acc[id] = name;
                        return acc;
                    }, {})

                    const dishGroupbyNameCategory = Object.keys(dishGroupbyIdCategory).reduce((acc, key) => {
                        const newKey = categoryMap[key];
                        acc[newKey] = dishGroupbyIdCategory[key];
                        return acc;
                    }, {})

                    setCategories(dishGroupbyNameCategory)
                }
            } catch (error) {
                console.log("Lỗi khi lấy dữ liệu:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchDishes()
    }, [])


    return (
        <div className="min-h-screen flex flex-col" style={{backgroundColor: '#f8f2e8'}}>
            <Header/>

            <img src={ms_banner_img3} alt="Banner" className="w-full mb-4"/>

            <div className="container mx-auto px-4 flex-grow">
                {loading ? (
                    <div className="flex justify-center">
                        <Spinner className="text-primary"/>
                    </div>
                ) : Object.keys(categories).length === 0 ? (
                    <div className="text-center text-muted-foreground">
                        Không có món ăn nào để hiển thị!
                    </div>
                ) : (
                    Object.keys(categories).map((group, index) => (
                        <ProductCarousel
                            key={index}
                            group={group}
                            dishes={categories[group]}
                        />
                    ))
                )}
            </div>

            <Footer/>
        </div>
    )
}

// Hàm hiển thị sản phẩm theo băng chuyền
function ProductCarousel({group, dishes}) {
    const [startIndex, setStartIndex] = useState(0)

    const handlePrev = () => {
        setStartIndex((prevIndex) =>
            prevIndex === 0 ? Math.max(dishes.length - 4, 0) : Math.max(prevIndex - 4, 0)
        )
    }

    const handleNext = () => {
        setStartIndex((prevIndex) =>
            prevIndex + 4 >= dishes.length ? 0 : Math.min(prevIndex + 4, dishes.length - 4)
        )
    }

    // Hiển thị 4 sản phẩm 1 lượt 
    const visibleDishes = dishes.slice(startIndex, startIndex + 4)

    return (
        <div className="my-5">
            <h1 className="text-center pb-4 text-2xl font-bold">
                {group}
            </h1>
            <div className="flex justify-between items-center px-5">
                <button
                    type="button"
                    className="p-2 rounded-full hover:bg-white/50 transition-colors duration-200"
                    onClick={handlePrev}
                >
                    <img src={Left} alt="Left Arrow" className="h-5 w-5"/>
                </button>

                <div className="flex-1 flex justify-center gap-4">
                    <Dish data={visibleDishes}/>
                </div>

                <button
                    type="button"
                    className="p-2 rounded-full hover:bg-white/50 transition-colors duration-200"
                    onClick={handleNext}
                >
                    <img src={Right} alt="Right Arrow" className="h-5 w-5"/>
                </button>
            </div>
        </div>
    )
}

export default Home