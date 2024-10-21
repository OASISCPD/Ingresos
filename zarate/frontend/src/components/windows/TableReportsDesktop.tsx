import { useEffect, useState } from "react"
import { capacity_of_the_day, capacity_of_the_day_interface, total_ocupation, /* currentOccupation, */ total_of_the_day, total_of_the_day_interface } from "../../logic/Aforo"
import { baseUrl } from "../../BaseUrl";
import { Modal } from "../mod/Modal";
import { ModalExport } from "../mod/ModalExport";
import { SkeletonDesktopReports } from "../loading/SkeletonDesktopReports";
import { ModalExportAforo } from "../mod/ModalExportAforo";

export function TableReportsDesktop() {
    const [loading, setLoading] = useState<boolean>(false);
    const [occupation, setOccupation] = useState<Array<capacity_of_the_day_interface> | null>(null)
    const [totalDay, setTotalDay] = useState<Array<total_of_the_day_interface> | null>(null);
    const [totalOccupation, setTotalOccupation] = useState<{ total_dataaforo: number }>()

    //modal que exporta segun fechas
    const [modal, setModal] = useState<boolean>(false);
    const [modalAforo, setModalAforo] = useState<boolean>(false);

    async function getCapacityDay() {
        const res = await capacity_of_the_day();
        const data = await res?.json()
        console.log('capacidad del dia', data)
        setOccupation(data)
        await applyColors();
    }

    async function getTotalDay() {
        const res = await total_of_the_day();
        const data = await res?.json();
        setTotalDay(data)
        console.log('data del total del dia', data)
    }


    async function getTotalOcupation() {
        const res = await total_ocupation();
        const data = await res?.json();
        setTotalOccupation(data)
    }

    async function exportClients() {
        const url = `${baseUrl}/exportar_clientes`
        await window.open(url, '_blank')
    }
    function openModal() {
        setModal(true)
    }
    function closeModal() {
        setModal(false)
        setModalAforo(false)
    }
    /* function calcularColor(valor: number, maximo: number) {
        const porcentaje = (valor / maximo) * 100;
        const rojo = Math.round(porcentaje * 255 / 100);
        // Evitar el negro puro (#000000) para los valores más bajos
        const minColor = 10; // Color mínimo (50) para valores bajos
        const color = `#${Math.max(minColor, rojo).toString(16).padStart(2, '0')}0000`;
        return color;
    } */

    //logica de printeo de colores en la tabla
    function calcularColor(valor: number, maximo: number) {
        const porcentaje = (valor / maximo) * 100;
        const opacidad = (porcentaje / 100); // La opacidad es inversamente proporcional al porcentaje

        // Rojo puro, pero con opacidad variable
        const color = `rgba(255, 0, 0, ${opacidad})`;
        return color;
    }

    function applyColors() {
        const columnas = [3, 4, 5]; // Índices de las columnas

        columnas.forEach(columnaIndex => {
            const valores = Array.from(document.querySelectorAll(`#tabla_historial tr td:nth-child(${columnaIndex})`))
                .map(cell => parseInt((cell as HTMLElement).textContent ?? '0', 10));

            const maximo = Math.max(...valores);

            valores.forEach((valor, index) => {
                const color = calcularColor(valor, maximo);
                (document.querySelectorAll(`#tabla_historial tr:nth-child(${index + 1}) td:nth-child(${columnaIndex})`)[0] as HTMLElement).style.backgroundColor = color;
            });
        });
    }
    useEffect(() => {
        if (occupation) {
            setTimeout(() => {
                applyColors();
            }, 1000);
        }
    }, [occupation]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            await Promise.all([getTotalDay(), getTotalOcupation(), getCapacityDay()]);
            setLoading(false);
        }
        fetchData();

        // Configuración del intervalo de recarga cada 5 minutos
        const intervalId = setInterval(() => {
            window.location.reload();
        }, 1 * 60 * 1000); // 1 minuto en milisegundos

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalId);
    }, [])

    return (
        <div className='container mx-auto '>
            <div className='flex justify-end items-center my-4'>
                <div className='mx-4'>
                    <div onClick={exportClients} style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} className={`flex justify-center focus:outline-none items-center text-sm  p-2.5 mx-auto w-full bg-gradient-to-b shadow-md shadow-backgroundGrayBlack cursor-pointer hover:scale-105 duration-200 2xl:text-base from-blueColor to-blue-700 rounded-md text-white`}>
                        <h1>Exportar Clientes</h1>
                    </div>
                </div>
                <div className='mx-4'>
                    <div onClick={openModal} style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} className={`flex justify-center focus:outline-none items-center text-sm  p-2.5 mx-auto w-full bg-gradient-to-b shadow-md cursor-pointer hover:scale-105 duration-200 2xl:text-base shadow-backgroundGrayBlack from-waterGreenBlack to-waterGreenBlack rounded-md text-white`}>
                        <h1>Exportar Ingresos</h1>
                    </div>
                </div>
                <div className='ml-4'>
                    <div onClick={() => setModalAforo(true)} style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} className={`flex justify-center focus:outline-none items-center text-sm  p-2.5 mx-auto w-full bg-gradient-to-b shadow-md cursor-pointer hover:scale-105 duration-200 2xl:text-base shadow-backgroundGrayBlack from-buttonRed to-backgroundButtonOraengeGradient rounded-md text-white`}>
                        <h1>Exportar Aforo</h1>
                    </div>
                </div>
            </div>
            {/* LOADING */}
            {loading ? (
                <><SkeletonDesktopReports /></>
            ) : (
                <>
                    <div className="relative overflow-x-auto my-8 shadow-2xl rounded-md">
                        <table className="w-full text-sm ">
                            <thead className="text-sm  uppercase border-b border-gray-300  text-white bg-waterGreenBlack">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-xl">
                                        Total ingresos
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xl">
                                        Total egresos
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xl">
                                        Total en sala
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-waterGreenWhite  text-center text-black ">
                                    <td className="px-6 py-4 text-2xl " >
                                        {totalDay?.[0]?.ingresos ?? 0}
                                    </td>
                                    <td className="px-6 py-4 text-2xl " >
                                        {totalDay?.[0]?.egresos ?? 0}
                                    </td>
                                    <td className="px-6 py-4 text-2xl " >
                                        {totalOccupation?.total_dataaforo ? totalOccupation.total_dataaforo : 0}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* segunda tabla  */}
                    <div className="relative overflow-x-auto my-8 shadow-2xl rounded-md">
                        <table className="w-full text-sm  " id="tabla_historial">
                            <thead className="text-sm text-white uppercase border-b border-gray-300 bg-waterGreenBlack">
                                <tr className="text-center">
                                    <th scope="col" className=" py-3 text-lg">
                                        Fecha
                                    </th>
                                    <th scope="col" className=" py-3 text-lg">
                                        Hora
                                    </th>
                                    <th scope="col" className=" py-3 text-lg">
                                        Ingresos
                                    </th>
                                    <th scope="col" className=" py-3 text-lg">
                                        Egresos
                                    </th>
                                    <th scope="col" className=" py-3 text-lg">
                                        Aforo maximo
                                    </th>
                                </tr>
                            </thead>

                            <tbody >
                                {/* MAPEO CON DATOS */}
                                {occupation?.map((data, index) => (
                                    <tr className="bg-waterGreenWhite text-center border-b border-gray-300 text-black" key={index}>
                                        <td className=" py-4 text-lg">
                                            {data.fecha}
                                        </td>
                                        <td className=" py-4 text-lg">
                                            {data.hora}
                                        </td>
                                        <td className=" py-4 text-lg">
                                            {data.ingresos}
                                        </td>
                                        <td className=" py-4 text-lg">
                                            {data.egresos}
                                        </td>
                                        <td className=" py-4 text-lg">
                                            {data.aforo_maximo}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div></>
            )}
            {modal && (
                <Modal isOpen={true} onClose={closeModal}>
                    <ModalExport closeModal={closeModal} />
                </Modal>
            )}
            {modalAforo && (
                <Modal isOpen={true} onClose={closeModal}>
                    <ModalExportAforo closeModal={closeModal} />
                </Modal>
            )}
        </div>
    )
}
