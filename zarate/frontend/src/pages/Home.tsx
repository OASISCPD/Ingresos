import { useMediaQuery } from "react-responsive";
import { Form } from "../components/mobile/Form.tsx";
import { List } from "../components/mobile/List.tsx";
import { Navbar } from "../components/mobile/Navbar.tsx";
import { FormDesktop } from "../components/windows/FormDesktop.tsx";
import { ListDesktop } from "../components/windows/ListDesktop.tsx";

export function Home() {
    // Define breakpoints
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1024 });
    const isMobileOrTablet = useMediaQuery({ maxWidth: 1023 });
    return (
        <div className="textGothamMedium">
            {/* mobile */}
            {isMobileOrTablet && (
                <div className="max-w-[90%] p-[2%] sm:max-w-full mx-auto md:pb-40  sm:mx-[6%] lg:hidden">
                    <div className="flex flex-col">
                        <Navbar titleNavbar="Registros puerta" />
                        <Form title="Registros puerta" lugar="entrada" />
                        <List domain="entrada" />
                    </div>
                </div>
            )}
            {/* Desktop*/}
            {isDesktopOrLaptop && (
                <div className="hidden lg:block  lg:pb-12 2xl:pb-16">
                    <div className="flex flex-col">
                        <Navbar titleNavbar="Registros puerta" />
                        <div className="flex flex-row  mx-[5%]">
                            <div className="mx-[1%] w-full">
                                <FormDesktop lugar="entrada" />
                            </div>
                            <div className="mx-[1%] w-full">
                                <ListDesktop domain="entrada" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}