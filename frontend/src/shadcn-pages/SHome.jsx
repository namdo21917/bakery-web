import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import dishesApi from '../api/dishes'

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../components/ui/tabs"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../components/ui/carousel"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card"

import { Skeleton } from "../components/ui/skeleton"
import Banner from "@/assets/Banner.png";
import ms_banner_img3 from "@/assets/ms_banner_img3.webp"

function ProductCarousel({ dishes }) {
    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full px-4"
        >
            <CarouselContent>
                {dishes.map((dish, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                        <div className="p-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="line-clamp-1">{dish.name}</CardTitle>
                                    <CardDescription className="line-clamp-2">{dish.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="aspect-square relative">
                                    <img
                                        src={dish.image}
                                        alt={dish.name}
                                        className="aspect-square object-cover rounded-md"
                                    />
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <span className="text-lg font-semibold">{dish.price.toLocaleString()}đ</span>
                                </CardFooter>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
        </Carousel>
    )
}

function Home() {
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState({})
    const [activeTab, setActiveTab] = useState("")

    useEffect(() => {
        const fetchDishes = async () => {
            setLoading(true)
            try {
                const dishesResponse = await dishesApi.getAllDishes() || []
                const categoriesResponse = await dishesApi.getAllCategories() || []

                if (dishesResponse) {
                    const dishesData = dishesResponse || []
                    const categoriesData = categoriesResponse || []

                    const dishGroupbyIdCategory = dishesData.reduce((acc, dish) => {
                        const categoryId = dish.category
                        if (!acc[categoryId]) {
                            acc[categoryId] = []
                        }
                        acc[categoryId].push(dish)
                        return acc
                    }, {})

                    const categoryMap = categoriesData.reduce((acc, { id, name }) => {
                        acc[id] = name
                        return acc
                    }, {})

                    const dishGroupbyNameCategory = Object.keys(dishGroupbyIdCategory).reduce((acc, key) => {
                        const newKey = categoryMap[key]
                        acc[newKey] = dishGroupbyIdCategory[key]
                        return acc
                    }, {})

                    setCategories(dishGroupbyNameCategory)
                    // Set the first category as active tab
                    if (Object.keys(dishGroupbyNameCategory).length > 0) {
                        setActiveTab(Object.keys(dishGroupbyNameCategory)[0])
                    }
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

        <div className="min-h-screen">
            <Header/>
            <img src={ms_banner_img3} alt="Banner" className='w-100 mb-4'/>
            <div className="container mx-auto px-4 py-8 justify-center">
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-[400px] mx-auto"/>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Card key={i}>
                                    <CardHeader>
                                        <Skeleton className="h-4 w-[250px]"/>
                                        <Skeleton className="h-4 w-[200px]"/>
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-[200px] w-full"/>
                                    </CardContent>
                                    <CardFooter>
                                        <Skeleton className="h-4 w-[100px]"/>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : Object.keys(categories).length === 0 ? (
                    <div className="text-center text-muted-foreground text-lg">
                        Không có món ăn nào để hiển thị!
                    </div>
                ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="flex justify-center">
                            <TabsList className="h-12 justify-center">
                                {Object.keys(categories).map((category) => (
                                    <TabsTrigger
                                        key={category}
                                        value={category}
                                        className="px-4"
                                    >
                                        {category}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                        {Object.entries(categories).map(([category, dishes]) => (
                            <TabsContent key={category} value={category} className="mt-6">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold text-center">{category}</h2>
                                    <ProductCarousel dishes={dishes}/>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                )}
            </div>

            <Footer/>
        </div>
    )
}

export default Home
