import { Navbar } from "../components/mobile/Navbar";
import { NotAllowedMobile } from "../components/mobile/NotAllowed";
/* import { NotAllowedMobile } from "../components/mobile/NotAllowed"; */
import { NotAllowedDesktop } from "../components/windows/NotAllowedDesktop";

export function NotAllowed() {
    return (
        <div className="textGothamMedium">
            {/* MOBILE/TABLET */}
            <div className="max-w-[90%] p-[2%] sm:max-w-full mx-auto md:pb-40  sm:mx-[6%] lg:hidden">
                <div className="flex flex-col">
                    <Navbar titleNavbar='No permitidos' />
                    {/*     <NotAllowedMobile /> */}
                    <div className='flex flex-col my-4 mt-8 xl:my-8 '>
                        {/*  <SelfExcludedDesktop /> */}
                        <div className="">
                            <h1 className=" text-3xl   my-2   text-black ">No permitidos</h1>
                            <NotAllowedMobile />
                        </div>
                    </div>
                </div>
            </div>
            {/* DESKTOP */}
            <div className="hidden lg:block   lg:pb-12 2xl:pb-16">
                <div className='flex flex-col'>
                    <Navbar titleNavbar='No permitidos' />
                    <div className='flex flex-col my-4 xl:my-8  mx-[5%]'>
                        {/*  <SelfExcludedDesktop /> */}
                        <div className="ml-8 ">
                            <NotAllowedDesktop />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}