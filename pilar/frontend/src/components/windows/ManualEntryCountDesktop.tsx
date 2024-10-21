import { useEffect, useState } from "react";
import { AforoOccupation, currentOccupation, egress_register, egress_register_sala4, income_register, income_register_sala4 } from "../../logic/Aforo"
import Swal from "sweetalert2";

interface domain {
    domain: string
}

export function ManualEntryCountDesktop({ domain }: domain) {
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
    //ocupacion actual en aforo
    async function occupation() {
        const res = await currentOccupation();
        if (res.total_dataaforo > 1300) {
            console.log('lorem')
            const Toast = Swal.mixin({
                toast: true,
                position: "bottom-end",
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
        <section >
            <div className="py-4 xl:py-8 2xl:py-6    text-white">
                <h1 className="text-sm sm:text-base text-black ">CANTIDAD DE PERSONAS EN SALA: </h1>
                <div className="grid grid-cols-5 py-2 gap-2 px-2">
                    <button className="flex col-span-3 items-center justify-start mx-auto text-greenText bg-black border-0 py-2 px-8 w-full focus:outline-none rounded-xl shadow-xl  text-sm sm:text-lg">{aforoOccupation?.total_dataaforo}</button>
                    <div className="col-span-2 flex gap-2 ">
                        <button onClick={() => incomeValue(1)} className="flex items-center justify-center mx-auto w-full  bg-blueColor hover:bg-blue-700 hover:scale-105 duration-300 border-0 py-2 px-8 focus:outline-none rounded-xl shadow-xl  text-sm sm:text-lg">+1</button>
                        <button onClick={() => egressValue(1)} className="flex items-center justify-center mx-auto w-full  bg-buttonRed border-0 py-2 px-8 focus:outline-none hover:bg-buttonRedDark hover:scale-105 duration-300  rounded-xl shadow-xl  text-sm sm:text-lg">-1</button>
                    </div>
                </div>
                <div className="grid grid-cols-4 py-2 gap-4 px-2">
                    <button onClick={() => incomeValue(5)} className="flex items-center justify-center mx-auto hover:bg-blue-700 hover:scale-105 duration-300 bg-blueColor border-0 py-2 px-8 w-full focus:outline-none rounded-xl shadow-xl  text-sm sm:text-lg">+5</button>
                    <button onClick={() => egressValue(5)} className="flex items-center justify-center mx-auto hover:bg-buttonRedDark hover:scale-105 duration-300 bg-buttonRed border-0 py-2 px-8 w-full focus:outline-none rounded-xl shadow-xl  text-sm sm:text-lg">-5</button>
                    <button onClick={() => incomeValue(10)} className="flex items-center justify-center mx-auto hover:bg-blue-700 hover:scale-105 duration-300 bg-blueColor border-0 py-2 px-8 w-full focus:outline-none rounded-xl shadow-xl  text-sm sm:text-lg">+10</button>
                    <button onClick={() => egressValue(10)} className="flex items-center justify-center mx-auto hover:bg-buttonRedDark hover:scale-105 duration-300 bg-buttonRed border-0 py-2 px-8 w-full focus:outline-none rounded-xl shadow-xl  text-sm sm:text-lg">-10</button>
                </div>
            </div>
        </section>
    )
}