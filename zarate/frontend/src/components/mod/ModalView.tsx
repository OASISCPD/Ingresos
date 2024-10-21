import React, { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io';
import { getClientNotAllowed } from '../../logic/Clients';
import { useForm } from 'react-hook-form';
/* import { baseUrl } from '../../BaseUrl'; */
/* import Swal from 'sweetalert2'; */
/* import { SwalMobile } from './SwalMobile'; */

interface propModal {
    closeModal: () => void;
    id: number
}
type Inputs = {
    id: number;
    id_foreign_key: number;
    num_exclusion: number;
    caracteristicas_fisicas: string;
    tiempo_exclusion: string;
    motivo: string;
    emitido_por: string;
    responsable_seguridad: string;
    fecha_actualizacion: any;
    fecha_creacion: any;
    estado: string
};
interface clientNotAllowed {
    id: number;
    id_foreign_key: number;
    caracteristicas_fisicas: string;
    tiempo_exclusion: string;
    motivo: string;
    emitido_por: string;
    responsable_seguridad: string;
    fecha_actualizacion: any;
    fecha_creacion: any;
    estado: string;
    id_image: string
}
export function ModalView(prop: propModal) {
    const [client, setClient] = useState<clientNotAllowed>();
    const [maxHeight, setMaxHeight] = useState('800px');
    /*  const [originalClient, setOriginalClient] = useState<clientNotAllowed>(); // Almacena los valores originales del cliente */
    const { register, setValue } = useForm<Inputs>()
    async function getClient(id: number) {
        const res = await getClientNotAllowed(id);
        await setClient(res)
        /* await setOriginalClient(res); */
    }
    async function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const selectedCampaignName = e.target.value;//nombre de la campana seleccionada
        console.log(selectedCampaignName)

    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setValue(name as keyof Inputs, value)
    }

    useEffect(() => {
        getClient(prop.id)
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
                <div className=" bg-backgroundModalGray  rounded-lg shadow min-h-40 ">
                    <div className="flex items-center justify-between p-4">
                        <h3 className="text-xl strokeWidth text-gray-900"></h3>
                        <button className="text-white hover:text-red-500 bg-transparent  rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center " onClick={prop.closeModal}>
                            <IoMdClose size={40} />
                        </button>
                    </div>
                    <p className='text-center  text-white text-2xl'>Cliente </p>

                    {client && (
                        <div style={{ maxHeight: maxHeight, overflowY: 'auto', overflowX: "auto" }} className="px-4 scrollbar text-gray-200">
                            <div /* onSubmit={handleSubmit} */>

                                <div className="my-2 mt-3">
                                    <label className="block mb-2 text-sm   ">N° de Exclusión</label>
                                    <input disabled={true} type="input" {...register('id')} id="id" value={client.id} onChange={handleInputChange} className="bg-black border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="completa este campo" required />
                                </div>
                                <div className="my-2">
                                    <label className="block mb-2 text-sm  ">Características físicas *</label>
                                    <input disabled={true} type="input"  {...register('caracteristicas_fisicas')} id="caracteristicas_fisicas" defaultValue={client.caracteristicas_fisicas} onChange={handleInputChange} className="bg-black border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="completa este campo" required />
                                </div>
                                <input type="text" className='hidden' defaultValue={client.id} {...register('id')} />
                                <input type="text" className='hidden' defaultValue={client.id_foreign_key} {...register('id_foreign_key')} />
                                {client.id_image !== '' && client.id_image !== null ? (
                                    <div className='my-2'>
                                        <label className="block mb-2 text-sm  ">Imagen</label>
                                        {/*  <img src={`https://drive.usercontent.google.com/download?id=${client.id_image}`} alt="Imagen no_permitido" /> */}
                                        {/*     <img src={`https://www.googleapis.com/drive/v2/files/${client.id_image}`} alt="" /> */}
                                        <iframe className='w-1/3 mx-auto' src={`https://drive.google.com/file/d/${client.id_image}/preview?usp=drivesdk`} ></iframe>
                                    </div>
                                ) : (
                                    <div className='my-2'>
                                        <label className="block mb-2 text-sm  ">Imagen</label>
                                        <h1 className='block mb-2 text-sm'>***No hay una imagen agregada al no permitido***</h1>
                                    </div>
                                )}
                                <div className="my-2">
                                    <label className="block mb-2 text-sm  ">Motivo</label>
                                    <input disabled={true} type="input"{...register('motivo')} id="motivo" defaultValue={client.motivo} onChange={handleInputChange} className="bg-black border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="completa este campo" required />
                                </div>
                                <div className="my-2">
                                    <label className="block mb-2 text-sm  ">Emitido por</label>
                                    <select onChange={(e) => {
                                        handleSelectChange(e);
                                        setValue("emitido_por", e.target.value); // Actualizar el valor en el hook form
                                    }} id="countries" className="bg-black border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                        <option value={'otro'} disabled selected>{client.emitido_por}</option>
                                        {/* {personal.map((data, index) => (
                                            <option key={index} value={data.string}>{data.string}</option>
                                        ))} */}
                                    </select>
                                </div>
                                <div className="my-2">
                                    <label className="block mb-2 text-sm  ">Responsable de seguridad</label>
                                    <select onChange={(e) => {
                                        handleSelectChange(e);
                                        setValue("responsable_seguridad", e.target.value); // Actualizar el valor en el hook form
                                    }} id="countries" className="bg-black border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                        <option value={'otro'} disabled selected>{client.responsable_seguridad}</option>
                                        {/* {personal.map((data, index) => (
                                            <option key={index} value={data.string}>{data.string}</option>
                                        ))} */}
                                    </select>
                                </div>
                                <div className="my-2">
                                    <label className="block mb-2 text-sm  ">Estado</label>
                                    <select onChange={(e) => {
                                        handleSelectChange(e);
                                        setValue("estado", e.target.value); // Actualizar el valor en el hook form
                                    }} id="countries" className="bg-black border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                        <option /* key={index} */ /* value={data.value} */>{client.estado}</option>
                                        {/* {valores_Estado.map((data, index) => (
                                            <option key={index} value={data.value}>{data.string}</option>
                                        ))} */}
                                    </select>
                                </div>
                                <div className="my-2">
                                    <label className="block mb-2 text-sm  ">Tiempo de exclusión</label>
                                    <select onChange={(e) => {
                                        handleSelectChange(e);
                                        setValue("tiempo_exclusion", e.target.value); // Actualizar el valor en el hook form
                                    }} id="countries" className="bg-black border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                        <option /* key={index} */ /* value={data.tiempo_exclusion} */>{client.tiempo_exclusion}</option>
                                        {/* {tiempos_Exclusion.map((data, index) => (
                                            <option key={index} value={data.tiempo_exclusion}>{data.tiempo_exclusion}</option>
                                        ))} */}
                                    </select>
                                </div>
                                <div className='flex justify-center items-center text-sm'>
                                    <div className="modal-footer mt-3 mx-auto  flex justify-center">
                                        <button style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} onClick={prop.closeModal} className="bg-backgroundButtonRed shadow-md hover:bg-red-500 text-white py-2 px-8 rounded-md">
                                            Salir</button>
                                    </div>
                                    {/* <div className="modal-footer mt-3 mx-auto flex justify-center">
                                        <button style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} onClick={sendUpdate} className="bg-backgroundButtonGreen shadow-md hover:bg-green-500 text-white py-2 px-8 rounded-md">
                                            Guardar
                                        </button>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </section>
    );

}
