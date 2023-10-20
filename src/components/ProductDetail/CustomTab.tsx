import React from "react";
import { Tabs, Tab, Card, CardBody, User } from "@nextui-org/react";
import { ProductTData } from "@/types/shop";
import RatingStars from "react-rating-stars-component";
import ReviewFilter from "./ReviewFilter";
import Review from "./Review";


export default function CustomTab({ product }: { product: ProductTData | undefined }) {
    const fakeReviews = [
        {
            user: {
                name: 'Hope K',
                description: '2 Days Ago'
            },
            rating: 4,
            title: 'Good Product',
            comment: `I recently purchased this product and I'm extremely satisfied with it. The quality is top-notch, and it exceeded my expectations. The design is sleek and modern, and it fits perfectly in my space. The product arrived quickly and was well-packaged. The customer service was also excellent; they promptly answered my questions. I highly recommend this product to anyone looking for a reliable and stylish solutio`,

        },
        {
            user: {
                name: 'Kofi Doe',
                description: '2 Days Ago'
            },
            rating: 5,
            title: 'Good Product',
            comment: `                                            I recently purchased this product and I'm extremely satisfied with it. The quality is top-notch, and it exceeded my expectations. The design is sleek and modern, and it fits perfectly in my space. The product arrived quickly and was well-packaged. The customer service was also excellent; they promptly answered my questions. I highly recommend this product to anyone looking for a reliable and stylish solution.

                                            Pros:
                                            - High-quality materials
                                            - Sleek and modern design
                                            - Fast shipping
                                            - Responsive customer service

                                            Cons:
                                            - None at the moment

                                            Overall, I couldn't be happier with my purchase. This product has made a significant difference in my daily life, and I would definitely buy from this brand again.

                                            Disclaimer: This review is based on my personal experience and opinions. Your experience may vary`,

        },
        {
            user: {
                name: 'Rivers M',
                description: '2 Days Ago'
            },
            rating: 3,
            title: 'Good Product',
            comment: `I recently purchased this product and I'm extremely satisfied with it. The quality is top-notch, and it exceeded my expectations. The design is sleek and modern, and it fits perfectly in my space. The product arrived quickly and was well-packaged. The customer service was also excellent; they promptly answered my questions. I highly recommend this product to anyone looking for a reliable and stylish solutio`,

        },
        {
            user: {
                name: 'Sanny Fame',
                description: '2 Days Ago'
            },
            rating: 5,
            title: 'Good Product',
            comment: `I recently purchased this product and I'm extremely satisfied with it. The quality is top-notch, and it exceeded my expectations. The design is sleek and modern, and it fits perfectly in my space. The product arrived quickly and was well-packaged. The customer service was also excellent; they promptly answered my questions. I highly recommend this product to anyone looking for a reliable and stylish solutio`,

        },
        {
            user: {
                name: 'Jane Doe',
                description: '2 Days Ago'
            },
            rating: 4,
            title: 'Good Product',
            comment: `I recently purchased this product and I'm extremely satisfied with it. The quality is top-notch, and it exceeded my expectations. The design is sleek and modern, and it fits perfectly in my space. The product arrived quickly and was well-packaged. The customer service was also excellent; they promptly answered my questions. I highly recommend this product to anyone looking for a reliable and stylish solutio`,

        },
        {
            user: {
                name: 'Jane Doe',
                description: '2 Days Ago'
            },
            rating: 4,
            title: 'Good Product',
            comment: `I recently purchased this product and I'm extremely satisfied with it. The quality is top-notch, and it exceeded my expectations. The design is sleek and modern, and it fits perfectly in my space. The product arrived quickly and was well-packaged. The customer service was also excellent; they promptly answered my questions. I highly recommend this product to anyone looking for a reliable and stylish solutio`,

        },
        {
            user: {
                name: 'Jane Doe',
                description: '2 Days Ago'
            },
            rating: 4,
            title: 'Good Product',
            comment: `I recently purchased this product and I'm extremely satisfied with it. The quality is top-notch, and it exceeded my expectations. The design is sleek and modern, and it fits perfectly in my space. The product arrived quickly and was well-packaged. The customer service was also excellent; they promptly answered my questions. I highly recommend this product to anyone looking for a reliable and stylish solutio`,

        },
        {
            user: {
                name: 'Jane Doe',
                description: '2 Days Ago'
            },
            rating: 4,
            title: 'Good Product',
            comment: `I recently purchased this product and I'm extremely satisfied with it. The quality is top-notch, and it exceeded my expectations. The design is sleek and modern, and it fits perfectly in my space. The product arrived quickly and was well-packaged. The customer service was also excellent; they promptly answered my questions. I highly recommend this product to anyone looking for a reliable and stylish solutio`,

        }
    ]

    return (
        <Tabs classNames={{
            tabList: 'bg-gray-600',
            tabContent: 'text-[#ccc]'
        }} className="outline-none appearance-none sticky top-20 z-50" size="md" radius="full" aria-label="Options">
            <Tab  key="detail" title="Detail">
                <Card className="text-sm text-[#ccc] max-w-2xl bg-gray-800 rounded-[10px]" shadow="none">
                    <CardBody>
                        {product?.description}
                    </CardBody>
                </Card>
            </Tab>
            <Tab key="features" title="Features">
                <Card className="text-sm text-[#ccc] bg-gray-800  max-w-2xl rounded-[10px] " shadow="none">
                    <CardBody>
                        {
                            product?.features?.map((f, index) => (
                                <div key={index}>
                                    <ul className="capitalize">
                                        <li className="mb-2">{f?.feature_name}: <span className="font-semibold">{f?.feature_value}</span></li>
                                    </ul>
                                </div>
                            ))
                        }
                    </CardBody>
                </Card>
            </Tab>
            <Tab key="reviews" title="Reviews & Ratings" >
                <Card className="rounded-[10px]  text-sm text-gray-500 h-full w-full md:max-w-[900px] flex justify-start  bg-transparent" shadow="none">
                    <CardBody className="md:p-6 mx-auto max-w-[21rem] md:max-w-[20rem]">
                        <ReviewFilter />
                    </CardBody>

                    <CardBody className="flex h-full w-full p-0 md:p-6 overflow-hidden justify-start items-start  ">
                        {
                            fakeReviews.map((item, index) => (
                                <Review key={index} item={item} />
                            ))

                        }

                    </CardBody>
                </Card>
            </Tab>
        </Tabs>
    );
}
