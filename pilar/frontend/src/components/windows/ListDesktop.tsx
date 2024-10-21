import { useEffect, useState } from 'react'
import { getClients } from '../../logic/Clients';
import { ManualEntryCountDesktop } from './ManualEntryCountDesktop';
/* import { ManualEntryCountDesktop } from './ManualEntryCountDesktop'; */
/* import { ManualEntryCountDesktop } from './ManualEntryCountDesktop'; */


interface Clients {
    fecha: string;
    evento: string;
}
interface domain {
    domain: string
}
export function
    ListDesktop({ domain }: domain) {
    const [clients, setClients] = useState<Clients[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [maxHeight, setMaxHeight] = useState('800px');
    async function data() {
        setLoading(true)
        const res = await getClients();
        await setClients(res)
        setLoading(false)

    }
    useEffect(() => {
        const mediaQuery = window.matchMedia("(orientation: portrait)");

        const handleOrientationChange = (mediaQueryList: MediaQueryListEvent | MediaQueryList) => {
            setMaxHeight(mediaQueryList.matches ? '200px' : '400px');
        };

        // Ejecutar la primera vez para establecer la altura inicial
        handleOrientationChange(mediaQuery);

        // Escuchar cambios en la orientación
        const listener = (event: MediaQueryListEvent) => {
            handleOrientationChange(event);
        };
        mediaQuery.addEventListener('change', listener);

        // Limpieza al desmontar el componente
        return () => {
            mediaQuery.removeEventListener('change', listener);
        };
    }, []);
    useEffect(() => {
        data()
    }, [])
    return (
        <>
            {/* REGISTROS */}
            <div className='lg:my-4 xl:my-20 2xl:my-20 '>
                <h1 className="text-2xl  font-bold my-4 sm:my-0 text-black">
                    Registros
                </h1>
                <ManualEntryCountDesktop domain={domain} />
                {loading ? (
                    <div style={{ maxHeight: maxHeight, overflowY: 'auto', overflowX: "auto" }} className="scrollbar my-2 xl:my-8 2xl:my-12 text-xl xl:text-2xl relative overflow-x-auto border-4 border-backgroundForm rounded-xl shadow-lg animate-pulse bg-white">
                        <div style={{ zIndex: 100 }} className="block max-w-full sm:p-2 backgroundOpacityBlack  p-1  rounded-md text-base  shadow ">
                            <div className='p-2 bg-teal-100 m-2 my-3 rounded-md text-base text-white'>
                                <p className="">cliente... </p>
                                <p className="">Cargando..</p>
                            </div> <div className='p-2 bg-teal-100 m-2 my-3 rounded-md text-base text-white'>
                                <p className="">cliente... </p>
                                <p className="">Cargando..</p>
                            </div> <div className='p-2 bg-teal-100 m-2 my-3 rounded-md text-base text-white'>
                                <p className="">cliente... </p>
                                <p className="">Cargando..</p>
                            </div> <div className='p-2 bg-teal-100 m-2 my-3 rounded-md text-base text-white'>
                                <p className="">cliente... </p>
                                <p className="">Cargando..</p>
                            </div> <div className='p-2 bg-teal-100 m-2 my-3 rounded-md text-base text-white'>
                                <p className="">cliente... </p>
                                <p className="">Cargando..</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ maxHeight: maxHeight, overflowY: 'auto', overflowX: "auto" }} className="scrollbar  text-sm  xl:text-lg 2xl:text-xl relative overflow-x-auto border-4 border-backgroundForm rounded-xl shadow-lg ">
                        <div style={{ zIndex: 100 }} className="block max-w-full sm:p-2 bg-black bg-opacity-70  p-1  rounded-lg  shadow ">
                            {/* REALIZAR MAPEO PARA LAS LISTA  */}
                            {clients.map((client, index) => (
                                <div key={index} className='p-2 bg-waterGreenShadow m-2 my-3 rounded-lg text-white '>
                                    <p className="">{client.fecha} </p>
                                    <p className="">{client.evento} </p>
                                </div>
                            ))}
                        </div>
                    </div>)}

            </div>
        </>
    )
}