import { Form } from "../components/mobile/Form.tsx";
import { List } from "../components/mobile/List.tsx";
import { Navbar } from "../components/mobile/Navbar.tsx";
import { FormDesktop } from "../components/windows/FormDesktop.tsx";
/* import { FormDesktop } from "../components/windows/FormDesktop.tsx"; */
import { ListDesktop } from "../components/windows/ListDesktop.tsx";

export function Sala4() {
    return (
        <div className="textGothamMedium">
            {/* mobile */}
            <div className="max-w-[90%] p-[2%] sm:max-w-full mx-auto md:pb-40  sm:mx-[6%] lg:hidden">
                <div className="flex flex-col">
                    <Navbar titleNavbar="Registros Sala 4" />
                    <Form title="Registros sala 4" lugar="sala4" />
                    <List domain="sala4"/>
                </div>
            </div>
            {/* Desktop*/}
            <div className="hidden lg:block  lg:pb-12 2xl:pb-16">
                <div className="flex flex-col">
                    <Navbar titleNavbar="Registros Sala 4" />
                    <div className="flex flex-row mx-[5%] ">
                        <div className="mx-[1%] w-full">
                            <FormDesktop lugar="sala4" />
                        </div>
                        <div className="mx-[1%] w-full">
                            <ListDesktop domain="sala4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}