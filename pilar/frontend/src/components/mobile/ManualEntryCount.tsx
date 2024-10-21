import { useEffect, useState } from "react";
import { AforoOccupation, currentOccupation, egress_register, egress_register_sala4, income_register, income_register_sala4 } from "../../logic/Aforo";

import Swal from "sweetalert2";
import { useMediaQuery } from "react-responsive";
interface Domain {
    domain: string

}
// Definir los tipos válidos para la posición del Toast
type ToastPosition = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'center-right';

export function ManualEntryCountMobileTablet({ domain }: Domain) {
    
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

    const [aforoOccupation, setAforoOccupation] = useState<AforoOccupation>()
    //ingreso de aforo
    async function incomeValue(value: number) {
        console.log('se ingresan', value, 'desde ', domain.toLowerCase());
        if (domain.toLowerCase() === "entrada") {
            await income_register(value);
            window.location.reload()
            return
        }
        else if (domain.toLowerCase() === 'sala4') {
            await income_register_sala4(value);
            window.location.reload()
            return
        }
    }
    //egreso de aforo
    async function egressValue(value: number) {
        console.log('se van ', value, 'desde ', domain)
        if (domain.toLowerCase() === 'entrada') {
            await egress_register(value)
            window.location.reload()
            return
        }
        else if (domain.toLowerCase() === 'sala4') {
            await egress_register_sala4(value)
            window.location.reload()
            return
        }
    }
    //ocupacion actual
    async function occupation() {
        const res = await currentOccupation();
        console.log(res.total_dataaforo)
        // Definir la posición del Toast según el dispositivo
        if (res.total_dataaforo > 1300) {

            let position: ToastPosition = 'top-end';
            if (isMobile) {
                position = "bottom-start"; // Para móviles
            } else if (isTablet) {
                position = "top-end"; // Para tablets
            }
            const Toast = Swal.mixin({
                toast: true,
                position: position,
                /* position: "center-right", */
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "warning",
                title: "¡ATENCIÓN! El aforo de la sala ha alcanzado las 1.300 personas. Por favor, verifique si este número es correcto."
            });
        }
        setAforoOccupation(res)
    }
    useEffect(() => {
        occupation()
    }, [])

    return (
        <section>

            <div className="pb-8 pt-4 sm:pt-0 text-white text-xs sm:text-base">
                <div className="">
                    <h1 className="text-sm mb-4 sm:text-base text-black">CANTIDAD DE PERSONAS EN SALA:</h1>
                    <button className="flex  text-2xl sm:text-6xl items-center justify-center mx-auto text-greenText text-center  bg-black bg-opacity-70 border border-backgroundBlack py-3 px-8 w-full focus:outline-none rounded-md shadow-xl ">{aforoOccupation?.total_dataaforo}</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1  text-base sm:text-2xl py-2 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => incomeValue(1)}
                            className="animate-buttonClick flex items-center justify-center mx-auto w-full bg-blueColor border-0 py-3 px-8 focus:outline-none rounded-md shadow-xl    duration-300"
                        >+1
                        </button>
                        <button onClick={() => egressValue(1)}
                            className="animate-buttonClick flex items-center justify-center mx-auto w-full bg-buttonRed border-0 py-3 px-8 focus:outline-none rounded-md shadow-xl    duration-300"
                        >-1
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2  text-base sm:text-2xl py-2 gap-4">
                    <button onClick={() => incomeValue(5)}
                        className="animate-buttonClick flex items-center justify-center mx-auto bg-blueColor border-0 py-3 px-8 w-full focus:outline-none rounded-md shadow-xl    duration-300"
                    >+5</button>
                    <button onClick={() => egressValue(5)}
                        className="animate-buttonClick flex items-center justify-center mx-auto bg-buttonRed border-0 py-3 px-8 w-full focus:outline-none rounded-md shadow-xl    duration-300"
                    >-5</button>
                </div>
                <div className="grid grid-cols-2  text-base sm:text-2xl py-2 gap-4">
                    <button onClick={() => incomeValue(10)}
                        className="animate-buttonClick flex items-center justify-center mx-auto bg-blueColor border-0 py-3 px-8 w-full focus:outline-none rounded-md shadow-xl    duration-300"
                    >+10
                    </button>
                    <button onClick={() => egressValue(10)}
                        className="animate-buttonClick flex items-center justify-center mx-auto bg-buttonRed border-0 py-3 px-8 w-full focus:outline-none rounded-md shadow-xl    duration-300"
                    >-10
                    </button>
                </div>
            </div>
        </section>
    );
}
