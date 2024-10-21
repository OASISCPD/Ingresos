import { Navbar } from "../components/mobile/Navbar";
import { TableReportsMobile } from "../components/mobile/TableReportsMobile";
import { TableReportsDesktop } from "../components/windows/TableReportsDesktop";
import { useMediaQuery } from 'react-responsive';
export function ReportsPage() {
    // Detectar el tamaño de la pantalla
    const isMobileOrTablet = useMediaQuery({ maxWidth: 1023 }); // Para móviles y tablets
    const isDesktop = useMediaQuery({ minWidth: 1024 }); // Para desktop

    return (
        <div className="textGothamMedium">

            {/* MOBILE */}
            {isMobileOrTablet && (
                <div className="max-w-[90%] p-[2%] sm:max-w-full mx-auto md:pb-40  sm:mx-[6%] lg:hidden">
                    <div className="flex flex-col">
                        <Navbar titleNavbar='Reportes' />
                        {/*     <NotAllowedMobile /> */}
                        <div className='flex flex-col my-4 mt-8 xl:my-8 '>
                            {/*  <SelfExcludedDesktop /> */}
                            <div className="">
                                <h1 className=" text-3xl   my-2   text-black ">Reportes</h1>
                                {/*   <h1 className=" sm:text-xl xl:text-2xl   text-textWhiteShadow ">Agregar registro</h1> */}
                                <TableReportsMobile />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* DESKTOP */}
            {isDesktop && (
                < div className="hidden lg:block lg:pb-12 2xl:pb-16">
                    <div className="flex flex-col">
                        <Navbar titleNavbar="Reportes" />
                        <div className="flex flex-row mx-[5%]">
                            <TableReportsDesktop />
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    )
}
