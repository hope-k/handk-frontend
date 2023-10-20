import { Radio, cn } from "@nextui-org/react";
import React, { ReactNode } from 'react';


export const CustomRadio = (props: any) => {
    const { children, ...otherProps } = props;


    return (
        <Radio




            {...otherProps}
            classNames={{
                base: cn(
                    "flex m-0 bg-content1",
                    "flex-row-reverse max-w-fit cursor-pointer rounded-lg gap-2 p-1 px-4 border border-black transition-all duration-500 ease-in-out",
                    "data-[selected=true]:bg-black  text-start"
                ),
                wrapper: cn("bg-slate-100 outline-none hidden"),
                description: cn("text-xs data-[selected=true]:text-red-500  text-start "),


            }}
        >
            {children}
        </Radio>
    );
};


