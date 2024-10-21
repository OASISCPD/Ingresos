import { AbmSecurityMobile } from "../components/mobile/AbmSecurityMobile";
import { Navbar } from "../components/mobile/Navbar";
/* import { NotAllowedMobile } from "../components/mobile/NotAllowed"; */
import { AbmSecurityDesktop } from "../components/windows/AbmSecurityDesktop";

export function AbmSecurity() {
    return (
        <div className="textGothamMedium">
            {/* MOBILE/TABLET */}
            <div className="max-w-[90%] p-[2%] sm:max-w-full mx-auto md:pb-40  sm:mx-[6%] lg:hidden">
                <div className="flex flex-col">
                    <Navbar titleNavbar='ABM Seguridad' />
                    {/*  <NotAllowedMobile /> */}
                    <div className='flex flex-col my-8 sm:my-12  '>
                        <div className=" ">
                            <h1 className=" text-3xl   my-2   text-black ">ABM Seguridad</h1>
                            <h1 className=" sm:text-xl xl:text-2xl   text-black ">Apellido y Nombre</h1>
                            <AbmSecurityMobile />
                        </div>
                    </div>
                </div>
            </div>
            {/* DESKTOP */}
            <div className="hidden lg:block   lg:pb-12 2xl:pb-16">
                <div className='flex flex-col'>
                    <Navbar titleNavbar='ABM Seguridad' />
                    <div className='flex flex-col lg:my-4 xl:my-8  mx-[5%]'>
                        <div className=" ">
                            <h1 className=" lg:text-xl xl:text-2xl   text-black ">Apellido y Nombre</h1>
                            <AbmSecurityDesktop />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}