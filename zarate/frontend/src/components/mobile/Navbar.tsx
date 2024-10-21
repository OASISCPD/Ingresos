import { useEffect, useState } from 'react';
import imageBlack from '../../imgs/ImageNavbar.png';
import image from '../../imgs/ImageNavbarWhite.png';
import { FiMenu } from "react-icons/fi";
import { Modal } from '../mod/Modal';
import { SideBar } from './SideBar';
import { SideBarDesktop } from '../windows/SideBarDesktop';
import { getUserInSession } from '../../logic/User';

interface PropNavbar {
    titleNavbar: string;
}

export function Navbar({ titleNavbar }: PropNavbar) {
    //user
    const [user, setUser] = useState<string>('')
    const [sideBar, setSideBar] = useState<boolean>(false)
    const [sideBarDesktop, setSideBarDesktop] = useState<boolean>(false)

    function sideBarOpen() {
        setSideBar(true)
    }

    function sideBarOpenDesktop() {
        setSideBarDesktop(true)
    }

    function sideBarClose() {
        setSideBar(false)
        setSideBarDesktop(false)
    }
    async function getData() {
        const data = await getUserInSession();
        if (data) {
            setUser(data);
        }
    }
    useEffect(() => {
        getData()
    }, [])
    return (
        <div className=''>
            <div className="sm:hidden flex justify-center items-center py-4">
                <img className="h-full   ml-auto max-w-[12rem]" src={imageBlack} alt="image logo bingo" />
                <button onClick={sideBarOpen} className='ml-auto mr-0 text-waterGreenBlack p-1  rounded-xl bg-opacity-50'><FiMenu size={25} /></button>
            </div>
            <div className='sm:hidden bg-waterGreenMedium rounded-md   bg-opacity-80 w-full '>
                <h1 className='text-black text-base text-center'>USUARIO:{user}</h1>
            </div>
            <div className="hidden sm:block lg:hidden">
                <div className="flex justify-between items-center py-2">
                    <img className="h-full w-1/2  mx-auto " src={imageBlack} alt="image logo bingo" />
                </div>
                <div className=' bg-waterGreenMedium rounded-md   bg-opacity-80 w-full '>
                    <h1 className='text-black text-xl text-center'>USUARIO:{user}</h1>
                </div>
                <div className='flex justify-start items-center mt-4 '>
                    <button onClick={sideBarOpen} className='  text-waterGreenBlack  p-1  rounded-xl bg-opacity-50'><FiMenu size={25} /></button>
                    <h1 className="text-3xl text-black">{titleNavbar}</h1>
                </div>
            </div>
            {/* DESKTOP */}
            <div className="hidden lg:block">
                <div className="flex justify-center items-center h-full bg-waterGreenBlack py-3">
                    <img className="h-full  mx-auto lg:w-[16rem] xl:w-[21rem] 2xl:w-[20rem]" src={image} alt="image logo bingo" />
                </div>
                <div className=' bg-waterGreenMedium rounded-md mx-auto  bg-opacity-80 w-full '>
                    <h1 className='text-black text-sm xl:text-base 2xl:text-lg text-center mx-auto'>USUARIO:{user}</h1>
                </div>
                <div className='mx-[5%] py-4'>
                    <div className='flex justify-between items-center'>
                        <h1 className="text-3xl text-black">{titleNavbar}</h1>
                        <button onClick={sideBarOpenDesktop} className='  text-waterGreenBlack p-1  rounded-xl bg-opacity-50 mr-2'><FiMenu size={35} /></button>
                    </div>
                </div>
            </div>
            {sideBar && (
                <Modal isOpen={true} onClose={sideBarClose}>
                    <SideBar onClose={sideBarClose} />
                </Modal>
            )}
            {sideBarDesktop && (
                <Modal isOpen={true} onClose={sideBarClose}>
                    <SideBarDesktop onClose={sideBarClose} />
                </Modal>
            )}
        </div>
    );
}
