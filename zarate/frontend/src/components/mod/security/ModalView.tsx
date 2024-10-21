import { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io';

interface datasecurity {
    apellido_nombre: string;
    emisor: string;
    estado: string;
    fecha_actualizacion: any;
    fecha_creacion: any;
    id: number;
    seguridad: string;
}

interface propModal {
    closeModal: () => void;
    data: any
}

export function ModalView(prop: propModal) {
    const [maxHeight, setMaxHeight] = useState('800px');
    const [dataModal, setDataModal] = useState<datasecurity>();

    useEffect(() => {
        setDataModal(prop.data)
    }, [])

    useEffect(() => {
        const mediaQuery = window.matchMedia("(orientation: portrait)");
        const handleOrientationChange = (mediaQueryList: MediaQueryListEvent | MediaQueryList) => {
            setMaxHeight(mediaQueryList.matches ? '400px' : '400px');
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
    return (
        <section className="fixed top-0 left-0 w-full h-full flex items-center justify-center  z-500">
            <div className="rounded-xl shadow-xl max-w-md w-full mx-4 md:mx-auto ">
                <div className=" bg-backgroundModalGray  rounded-lg shadow min-h-56">
                    <div className="flex items-center justify-between p-4">
                        <h3 className="text-xl strokeWidth text-gray-900"></h3>
                        <button className="text-white hover:text-red-500 bg-transparent  rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center " onClick={prop.closeModal}>
                            <IoMdClose size={40} />
                        </button>
                    </div>
                    <p className='text-center  text-white text-lg lg:text-2xl'>Seguridad </p>
                    {dataModal && (
                        <div style={{ maxHeight: maxHeight, overflowY: 'auto', overflowX: "auto" }} className="px-4 scrollbar text-gray-200">
                            <div /* onSubmit={handleSubmit} */>
                                <div className="my-2">
                                    <label className="block mb-2 text-sm   ">N° de Seguridad</label>
                                    <input disabled={true} type="input" id="id" value={dataModal.id} className="bg-black border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="completa este campo" required />
                                </div>
                                <div className="my-2">
                                    <label className="block mb-2 text-sm  ">Apellido y Nombre *</label>
                                    <input disabled={true} type="input" id="caracteristicas_fisicas" defaultValue={dataModal.apellido_nombre} className="bg-black border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="completa este campo" required />
                                </div>

                                <div className="my-2">
                                    <label className="block mb-2 text-sm  ">Emisor</label>
                                    <input disabled={true} type="input" id="motivo" defaultValue={dataModal.emisor} className="bg-black border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="completa este campo" required />
                                </div>
                                <div className="my-2">
                                    <label className="block mb-2 text-sm  ">Seguridad</label>
                                    <input disabled={true} type="input" id="motivo" defaultValue={dataModal.seguridad} className="bg-black border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="completa este campo" required />
                                </div>
                                <div className="my-2">
                                    <label className="block mb-2 text-sm  ">Fecha de creacion</label>
                                    <input disabled={true} type="input" id="motivo" defaultValue={dataModal.fecha_creacion} className="bg-black border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="completa este campo" required />
                                </div> <div className="my-2">
                                    <label className="block mb-2 text-sm  ">Fecha de actualizacion</label>
                                    <input disabled={true} type="input" id="motivo" defaultValue={dataModal.fecha_actualizacion} className="bg-black border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="completa este campo" required />
                                </div>
                            </div> <div className="my-2">
                                <label className="block mb-2 text-sm  ">Estado</label>
                                <input disabled={true} type="input" id="motivo" defaultValue={dataModal.estado} className="bg-black border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="completa este campo" required />
                            </div>
                            <div className='flex justify-center items-center text-sm'>
                                <div className="modal-footer mt-3 mx-auto  flex justify-center">
                                    <button style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} onClick={prop.closeModal} className="bg-backgroundButtonRed shadow-md hover:bg-red-500 text-white py-2 px-8 rounded-md">
                                        Salir</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );

}
