import { SelfExcludedDesktop } from '../components/windows/SelfExcluded'
import { Navbar } from '../components/mobile/Navbar'
import { SelfExcludedMobile } from '../components/mobile/SelfExcludes'

export function SelfExcludesPage() {
    return (

        <div className='textGothamMedium'>
            {/* MOBILE */}
            <div className="max-w-[90%] p-[2%] sm:max-w-full mx-auto md:pb-40  sm:mx-[6%] lg:hidden">
                <div className="flex flex-col">
                    <Navbar titleNavbar='Auto Excluidos' />
                    <SelfExcludedMobile />
                </div>
            </div>
            {/* DESKTOP */}
            <div className="hidden lg:block   lg:pb-12 2xl:pb-16">
                <div className='flex flex-col  '>
                    <Navbar titleNavbar='Auto Excluidos' />
                    <div className='flex flex-row mx-[5%]'>
                        <SelfExcludedDesktop />
                    </div>
                </div>
            </div>

        </div>
    )
}
