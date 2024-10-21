import { useEffect, useState } from 'react'
import { getClients } from '../../logic/Clients';
import { ManualEntryCountMobileTablet } from './ManualEntryCount';
/* import { ManualEntryCountMobileTablet } from './ManualEntryCount'; */

interface Client {
    fecha: string;
    evento: string;
}
interface Domain {
    domain: string

}
export function List({ domain }: Domain) {
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [maxHeight, setMaxHeight] = useState('800px');
    async function data() {
        setLoading(true)
        const res = await getClients();
        await setClients(res)
        await setLoading(false)
    }
    useEffect(() => {
        const mediaQuery = window.matchMedia("(orientation: portrait)");

        const handleOrientationChange = (mediaQueryList: MediaQueryListEvent | MediaQueryList) => {
            setMaxHeight(mediaQueryList.matches ? '600px' : '420px');
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
            <div style={{ zIndex: 0 }} className='my-4 '>
                <ManualEntryCountMobileTablet domain={domain} />
                <h1 className="text-2xl sm:text-3xl font-bold my-4  text-black">
                    Registros
                </h1>
                {/* ACA IRIA el componente nuevo */}
                {loading ? (
                    <div style={{ maxHeight: maxHeight, overflowY: 'auto', overflowX: "auto" }} className="text-base scrollbar sm:text-xl relative overflow-x-auto border-4 border-backgroundForm rounded-xl shadow-lg animate-pulse bg-white ">
                        <div className="block max-w-full sm:p-2 backgroundOpacityBlack p-1     shadow ">
                            <div className='p-2 bg-red-100 m-2  rounded-lg min-h-8 sm:min-h-16 text-white'>
                            </div>
                            <div className='p-2 bg-red-100 m-2  rounded-lg min-h-8 sm:min-h-16 text-white'>
                            </div>
                            <div className='p-2 bg-red-100 m-2  rounded-lg min-h-8 sm:min-h-16 text-white'>
                            </div>
                            <div className='p-2 bg-red-100 m-2  rounded-lg min-h-8 sm:min-h-16 text-white'>
                            </div>
                            <div className='p-2 bg-red-100 m-2  rounded-lg min-h-8 sm:min-h-16 text-white'>
                            </div>
                            <div className='p-2 bg-red-100 m-2  rounded-lg min-h-8 sm:min-h-16 text-white'>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ maxHeight: maxHeight, overflowY: 'auto', overflowX: "auto" }} className="text-sm scrollbar sm:text-base relative overflow-x-auto border-4 border-backgroundForm rounded-xl shadow-lg ">
                        {clients.map((client, index) => (
                            <div key={index} className="block max-w-full sm:p-2 bg-black bg-opacity-70 p-1     shadow ">
                                {/* REALIZAR MAPEO PARA LAS LISTA  */}
                                <div className='p-2 bg-waterGreenShadow m-2  rounded-lg text-white'>
                                    <p className="">{client.fecha}</p>
                                    <p className="">{client.evento}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


            </div >
        </>
    )
}