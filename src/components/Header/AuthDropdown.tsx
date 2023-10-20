import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User } from "@nextui-org/react";
import { useSession, signOut } from "next-auth/react";
import { ChevronDown } from "lucide-react";
import { useMediaQuery } from '@mantine/hooks';
import { useCart } from "react-use-cart";




export default function AuthDropdown() {
    const { clearCartMetadata } = useCart()
    const { data: session } = useSession();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const handlesignOut = () => {
        signOut();
        clearCartMetadata();
        localStorage.removeItem('cartId')
        localStorage.removeItem('wishlistId')


    }
    return (
        <Dropdown

            placement="bottom-end"
        >
            <DropdownTrigger>
                <div className="flex flex-row items-center justify-center cursor-pointer">
                    <User
                        classNames={{
                            base: "",
                            name: "text-[10px] text-gray-600 font-light",
                            description: "text-[10px] text-gray-400",

                        }}
                        name={session?.user?.email}
                        avatarProps={{
                            src: session?.user?.avatar,
                            size: 'sm',

                        }}
                    />
                    <ChevronDown
                        size={12}
                        color='black'
                    />
                </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="solid">
                <DropdownItem
                    classNames={{
                        wrapper: 'text-red-500'
                    }}
                    textValue="profile"
                    isReadOnly
                    key="profile"
                    className="h-14 gap-2"
                >
                    <p className="font-semibold text-gray-400 text-xs">Signed in as</p>
                    <p className="font-semibold text-gray-400 text-xs">{session?.user?.email}</p>
                </DropdownItem>
                <DropdownItem textValue="my settings" key="settings">
                    <span className="text-[11px]">My Settings</span>
                </DropdownItem>
                <DropdownItem textValue="help and feedback" isReadOnly={true} key="help_and_feedback">
                    <span className="text-[11px]">Help & Feedback</span>
                </DropdownItem>
                <DropdownItem textValue="sign out " onClick={() => handlesignOut()} key="logout" color="danger">
                    <span className="text-[11px]">Sign Out</span>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
