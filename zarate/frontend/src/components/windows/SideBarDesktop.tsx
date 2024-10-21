import { FaUserCircle, FaUserMinus } from 'react-icons/fa';
import { FaRegCircleDot, FaUserXmark } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Logout, getUserInSession } from '../../logic/User';
import { useSidebar } from '../../context/SideBarContext';
import { MdSecurity } from 'react-icons/md';
import { TbReport } from "react-icons/tb";

interface SideBarProps {
    onClose: () => void;
}

export function SideBarDesktop({ onClose }: SideBarProps) {
    const navigate = useNavigate();
    const [user, setUser] = useState('');
    const { selectedLink, setSelectedLink } = useSidebar();
    const [visible, setVisible] = useState(false);
    const [maxHeight, setMaxHeight] = useState('800px');

    async function dataUser() {
        const data = await getUserInSession();
        if (data) {
            setUser(data);
        }
    }

    async function singOut() {
        await Logout(navigate); // Llama a Logout pasando navigate
    }

    useEffect(() => {
        dataUser();
    }, []);

    useEffect(() => {
        // Muestra la barra lateral después de un pequeño retraso para que la animación se reproduzca correctamente
        const timeout = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(orientation: portrait)");

        const handleOrientationChange = (mediaQueryList: MediaQueryListEvent | MediaQueryList) => {
            setMaxHeight(mediaQueryList.matches ? '200px' : '400px');
        };

        // Ejecutar la primera vez para establecer la altura inicial
        handleOrientationChange(mediaQuery);

        // Escuchar cambios en la orientación
        const listener = (event: MediaQueryListEvent) => {
            handleOrientationChange(event);
        };
        mediaQuery.addEventListener('change', listener);

        // Limpieza al desmontar el componente
        return () => {
            mediaQuery.removeEventListener('change', listener);
        };
    }, []);

    return (
        <div

            className={`fixed top-0 left-0 transition-all duration-500 h-full w-1/5 bg-waterGreenBlack shadow-2xl text-lg sm:text-2xl text-white ${visible ? 'translate-x-0' : '-translate-x-full'
                }`}
        >
            <div className="flex justify-end">
                <h1 className="p-2 sm:p-4 cursor-pointer" onClick={onClose}>
                    <IoMdClose size={30} />
                </h1>
            </div>
            {/* Resto del contenido de la barra lateral */}
            <div className='flex justify-center items-center bg-waterGreenShadow'>
                <div className='flex items-center justify-start p-2 sm:px-4 sm:py-2 '>
                    <h1 className="mx-2" ><FaUserCircle size={24} />
                    </h1>
                    <h1 className='text-xs xl:text-lg'>{user}</h1>
                </div>
            </div>
            <div className='my-4 absolute w-full text-sm xl:text-lg 2xl:text-xl'>
                <div style={{ maxHeight: maxHeight, overflowY: 'auto', overflowX: "auto" }} className="scrollbar my-4 pt-4 sm:my-8  ">
                    {user !== 'Seguridad S4' && (
                        <div className={` `}>
                            <div className={`flex items-center ml-auto mr-auto  justify-center py-4 ${selectedLink === '/home' ? 'bg-waterGreenShadow bg-opacity-100' : ''}`}>
                                <Link onClick={() => {
                                    if (selectedLink === "/home") {
                                        window.location.reload();
                                    } else {
                                        setSelectedLink('/home');
                                    }
                                }} className="flex items-center justify-start mr-auto" to={'/home'}>
                                    <FaRegCircleDot size={24} className=' ml-4 text-waterGreenWhite' />
                                    <h1 className='mr-auto  ml-4 uppercase '>Home</h1>
                                </Link>
                            </div>
                            <hr className=" mx-4 border-white" />
                        </div>
                    )}
                    {/*   {user !== "seguridad generico" && (
                        <div className={` `}>
                            <div className={` flex items-center ml-auto mr-auto justify-center py-4  ${selectedLink === '/sala4' ? 'bg-waterGreenShadow bg-opacity-100' : ''}`}>
                                <Link onClick={() => {
                                    if (selectedLink === "/sala4") {
                                        window.location.reload();
                                    } else {
                                        setSelectedLink('/sala4');
                                    }
                                }} className="flex items-center justify-start mr-auto" to={'/sala4'}>
                                    <FaRegCircleDot size={24} className=' ml-4 text-waterGreenWhite' />
                                    <h1 className='mr-auto  ml-4 uppercase '>Sala 4</h1>
                                </Link>
                            </div>
                            <hr className=" mx-4 border-white" />
                        </div>
                    )} */}

                    <div className={` `}>
                        <div className={`flex items-center ml-auto mr-auto justify-center py-4  ${selectedLink === '/autoExclude' ? 'bg-waterGreenShadow bg-opacity-100' : ''}`}>
                            <Link onClick={() => {
                                if (selectedLink === "/autoExclude") {
                                    window.location.reload();
                                } else {
                                    setSelectedLink('/autoExclude');
                                }
                            }} className="flex items-center justify-start mr-auto" to={'/autoExclude'}>
                                <FaUserXmark size={24} className=' ml-4 text-waterGreenWhite' />
                                <h1 className='mr-auto  ml-4 uppercase '>Auto excluidos</h1>
                            </Link>
                        </div>
                        <hr className=" mx-4 border-white" />
                    </div>
                    <div className={` `}>
                        <div className={` flex items-center ml-auto mr-auto justify-center py-4  ${selectedLink === '/notAllowed' ? 'bg-waterGreenShadow bg-opacity-100' : ''}`}>
                            <Link onClick={() => {
                                if (selectedLink === "/notAllowed") {
                                    window.location.reload();
                                } else {
                                    setSelectedLink('/notAllowed');
                                }
                            }} className="flex items-center justify-start mr-auto" to={'/notAllowed'}>
                                <FaUserMinus size={24} className=' ml-4 text-waterGreenWhite' />
                                <h1 className='mr-auto  ml-4 uppercase '>No Permitidos</h1>
                            </Link>
                        </div>
                        <hr className=" mx-4 border-white" />
                    </div>
                    <div className={` `}>
                        <div className={` flex items-center ml-auto mr-auto justify-center py-4  ${selectedLink === '/abmSecurity' ? 'bg-waterGreenShadow bg-opacity-100' : ''}`}>
                            <Link onClick={() => {
                                if (selectedLink === "/abmSecurity") {
                                    window.location.reload();
                                } else {
                                    setSelectedLink('/abmSecurity');
                                }
                            }} className="flex items-center justify-start mr-auto" to={'/abmSecurity'}>
                                <MdSecurity size={24} className=' ml-4 text-waterGreenWhite' />
                                <h1 className='mr-auto  ml-4 uppercase '>Abm Seguridad</h1>
                            </Link>
                        </div>
                        <hr className=" mx-4 border-white" />
                    </div>
                    <div className={` `}>
                        <div className={` flex items-center ml-auto mr-auto justify-center py-4  ${selectedLink === '/reports' ? 'bg-waterGreenShadow bg-opacity-100' : ''}`}>
                            <Link onClick={() => {
                                if (selectedLink === "/reports") {
                                    window.location.reload();
                                } else {
                                    setSelectedLink('/reports');
                                }
                            }} className="flex items-center justify-start mr-auto" to={'/reports'}>
                                <TbReport size={24} className=' ml-4 text-waterGreenWhite' />
                                <h1 className='mr-auto  ml-4 uppercase '>Reportes</h1>
                            </Link>
                        </div>
                        <hr className=" mx-4 border-white" />
                    </div>
                </div>
            </div>
            <div className="absolute bottom-4 w-full justify-center items-center ">
                <button onClick={singOut} className=" flex border-2 bg-buttonSideBar mx-auto bg-opacity-85 border-red-500 py-1.5 px-4 rounded-full text-sm"> Cerrar Sesion
                </button>
            </div>
        </div>
    );
}