import React from 'react'
import { Tabs, Tab, Card, CardBody, User } from "@nextui-org/react";
import { ProductTData } from "@/types/shop";
import RatingStars from "react-rating-stars-component";
import { motion } from 'framer-motion'

const Review = ({ item }: {
    item: {
        user: {
            name: string;
            description: string;
        };
        rating: number;
        title: string;
        comment: string;
    }
}) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 15,
                scale: 0.99
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                scale: 1
            }}
            viewport={{
                once: false
            }}
            transition={{
                type: 'spring',
                mass: 0.1,
                stiffness: 45,
                damping: 5,
                duration: .14
            }}
            className="border bg-gray-800  border-gray-200 md:mx-24 mb-2 p-2 rounded-[10px]"
        >
            <User
                classNames={{
                    base: "bg-gray-200 py-[2px] pr-8 pl-[2px]",
                    name: "text-[12px] text-gray-600",
                    description: "text-[10px] text-gray-500",

                }}
                name={item.user.name}
                description={item.user.description}

            />
            <div className="">
                <RatingStars
                    count={5}
                    value={item.rating}
                    size={20}
                    edit={false}
                    activeColor='#ffd700'
                    isHalf={true}
                    color={'#e4e4e4'}
                />

                <h1 className="text-[12px] font-semibold capitalize tracking-normal ">
                    {
                        item.title
                    }
                </h1>

                <p className="text-sm text-[#ccc]">
                    {
                        item.comment
                    }
                </p>
            </div>
        </motion.div>
    )
}
export default Review