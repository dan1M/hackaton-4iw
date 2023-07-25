import Link from "next/link";
import {   AiOutlineHome } from "react-icons/ai";


// NavLink component


const Sidebar = () => {
    return (
        <>
            <nav className="sm:w-1/5 w-1/5 bg-white shadow-md"
              style={{height:"790px", width:"15%",boxShadow:"10px 5px 5px #E8E8E8",position:"fixed", borderRadius:"5px"}}>
                <div className="sticky top-0 space-y-8 bg-white">
                    <div className='h-20 flex items-center px-4 border-b'>
                        <a href='javascript:void(0)' className='flex-none'>
                            <img src="https://floatui.com/logo.svg" width={140} className="mx-auto" />
                        </a>
                    </div>   
                </div>
                <div>
                <ul className="flex flex-col space-y-2">
                    <li className="flex items-center space-x-2">
                        <AiOutlineHome className="icon-sidebar" />
                        <Link href="/">
                            Home
                        </Link>
                    </li>
                    <li className="flex items-center space-x-2">
                        <AiOutlineHome className="icon-sidebar" />
                        <Link href="/about">
                            About
                        </Link>
                    </li>
                    <li className="flex items-center space-x-2">
                        <AiOutlineHome className="icon-sidebar" />
                        <Link href="/about">
                            Teams
                        </Link>
                    </li>
                   
                    <li className="flex items-center space-x-2">
                        <AiOutlineHome className="icon-sidebar" />
                        <Link href="/blog">
                            Blog
                        </Link>
                    </li>
                </ul>
            </div>
            </nav>

          
        </>
    );
};

export default Sidebar;