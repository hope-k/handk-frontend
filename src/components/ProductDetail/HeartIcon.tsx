import React from "react";


const HeartIcon = ({
    fill = 'currentColor',
    filled,
    size,
    height,
    width,
    label,
    ...props
}: {
    fill?: string;
    filled?: boolean;
    size?: number;
    height?: number;
    width?: number;
    label?: string;
}) => {
    return (

        <svg
            width={size || width || 24}
            height={size || height || 24}
            viewBox="0 0 24 24"
            fill={filled ? fill : '#ccc'}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            stroke={fill}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-heart">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    );
};

export default HeartIcon;

