import { useEffect, useState } from 'react'
import { SkeletonMobileReports } from '../loading/SkeletonMobileReports'
import { baseUrl } from '../../BaseUrl';
import { capacity_of_the_day, capacity_of_the_day_interface, total_ocupation, /* currentOccupation */  total_of_the_day, total_of_the_day_interface } from '../../logic/Aforo';
import { ModalExport } from '../mod/ModalExport';
import { Modal } from '../mod/Modal';
import { ModalExportAforo } from '../mod/ModalExportAforo';

export function TableReportsMobile() {
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
        /*   console.log('capacidad del dia', data) */
        setOccupation(data)
        await applyColors()
    }

    async function getTotalDay() {
        const res = await total_of_the_day();
        const data = await res?.json();
        setTotalDay(data)
        /*    console.log('data del total del dia', data) */
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
    async function getTotalOcupation() {
        const res = await total_ocupation();
        const data = await res?.json();
        setTotalOccupation(data)
    }

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
        <div className='container mx-auto'>
            <div className='grid grid-cols-2 gap-4 items-center my-8'>
                <div className=''>
                    <div onClick={exportClients} style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} className={`flex justify-center focus:outline-none items-center text-sm  p-2.5 mx-auto w-full bg-gradient-to-b shadow-md shadow-backgroundGrayBlack cursor-pointer hover:scale-105 duration-200 2xl:text-base from-blueColor to-blue-700 rounded-lg text-white`}>
                        <h1>Exportar Clientes</h1>
                    </div>
                </div>
                <div className=''>
                    <div onClick={openModal} style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} className={`flex justify-center focus:outline-none items-center text-sm  p-2.5 mx-auto w-full bg-gradient-to-b shadow-md cursor-pointer hover:scale-105 duration-200 2xl:text-base shadow-backgroundGrayBlack from-waterGreenShadow to-waterGreenBlack rounded-lg text-white`}>
                        <h1>Exportar Ingresos</h1>
                    </div>
                </div>
                <div className=''>
                    <div onClick={() => setModalAforo(true)} style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} className={`flex justify-center focus:outline-none items-center text-sm  p-2.5 mx-auto w-full bg-gradient-to-b shadow-md cursor-pointer hover:scale-105 duration-200 2xl:text-base shadow-backgroundGrayBlack from-buttonRed to-backgroundButtonOraengeGradient rounded-lg text-white`}>
                        <h1>Exportar Aforo</h1>
                    </div>
                </div>
            </div>
            {loading ? (
                <SkeletonMobileReports />
            ) : (
                <div className="relative rounded-md overflow-x-auto my-8">
                    <div className='rounded-md'>
                        <table className="w-full text-xs sm:text-sm   ">
                            <thead className=" uppercase border-b  border-gray-300  text-white bg-waterGreenBlack ">
                                <tr>
                                    <th scope="col" className="px-2 py-3 text-sm">
                                        Total ingresos
                                    </th>
                                    <th scope="col" className="px-2 py-3 text-sm">
                                        Total egresos
                                    </th>
                                    <th scope="col" className="px-2 py-3 text-sm">
                                        Total en sala
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-waterGreenWhite text-lg  text-center text-black">
                                    <td className="px-2 py-4">
                                        {totalDay?.[0]?.ingresos ?? 0}
                                    </td>
                                    <td className="px-2 py-4">
                                        {totalDay?.[0]?.egresos ?? 0}
                                    </td>
                                    <td className="px-2 py-4">
                                        {totalOccupation?.total_dataaforo ? totalOccupation.total_dataaforo : 0}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="relative rounded-md overflow-x-auto my-8 ">
                        <table id="tabla_historial" className="w-full text-xs sm:text-sm  ">
                            <thead className="text-xs text-white uppercase border-b border-gray-300 bg-waterGreenBlack">
                                <tr className="text-center text-xs sm:text-sm  ">
                                    <th scope="col" className="px-0.5 sm:px-2  py-3">
                                        Fecha
                                    </th>
                                    <th scope="col" className=" px-0.5 sm:px-2 py-3">
                                        Hora
                                    </th>
                                    <th scope="col" className="px-0.5 sm:px-2  py-3">
                                        Ingresos
                                    </th>
                                    <th scope="col" className="px-0.5 sm:px-2  py-3">
                                        Egresos
                                    </th>
                                    <th scope="col" className=" px-0.5 sm:px-2 py-3    ">
                                        Aforo maximo
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {occupation?.map((data, index) => (
                                    <tr className="bg-waterGreenWhite text-center text-base border-b border-gray-300 text-black" key={index}>
                                        <td className=" py-4">
                                            {data.fecha}
                                        </td>
                                        <td className=" py-4">
                                            {data.hora}
                                        </td>
                                        <td className=" py-4">
                                            {data.ingresos}
                                        </td>
                                        <td className=" py-4">
                                            {data.egresos}
                                        </td>
                                        <td className=" py-4">
                                            {data.aforo_maximo}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
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
