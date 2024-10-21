import React, { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io';
import { getClientNotAllowed } from '../../logic/Clients';
import { useForm } from 'react-hook-form';
import { baseUrl } from '../../BaseUrl';
/* import Swal from 'sweetalert2'; */
import { SwalMobile } from './SwalMobile';
import { getSecuritys } from '../../logic/Security';
/* import { json } from 'react-router-dom'; */

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
    estado: string;
    id_imagen: string;

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
}
interface securityData {
    id: number;
    apellido_nombre: number;
    emisor: string;
    estado: string;
    fecha_actualizacion: any;
    fecha_creacion: any;
    seguridad: string
}

export function ModalUpdateClientNotAllowed(prop: propModal) {
    const [client, setClient] = useState<clientNotAllowed>();
    const [maxHeight, setMaxHeight] = useState('800px');
    const [id_image, setId_image] = useState<string>('')
    const [loadingImage, setLoadingImage] = useState<boolean>(false)
    const [originalClient, setOriginalClient] = useState<clientNotAllowed>(); // Almacena los valores originales del cliente
    const { register, setValue, getValues } = useForm<Inputs>()
    const [security, setSecurity] = useState<securityData[]>([])
    const tiempos_Exclusion = [{ 'value': '1 MES', 'tiempo_exclusion': '1 MES' }, { 'value': '2 MESES', 'tiempo_exclusion': '2 MESES' }, { 'value': '3 MESES', 'tiempo_exclusion': '3 MESES' }, { 'value': '4 MESES', 'tiempo_exclusion': '4 MESES' }, { 'value': '5 MESES', 'tiempo_exclusion': '5 MESES' }, { 'value': '6 MESES', 'tiempo_exclusion': '6 MESES' }, { 'value': '1 AÑO', 'tiempo_exclusion': '1 AÑO' }, { 'value': '2 AÑO', 'tiempo_exclusion': '2 AÑO' }, { 'value': '3 AÑO', 'tiempo_exclusion': '3 AÑO' }, { 'value': '0', 'tiempo_exclusion': '0' },]
    const valores_Estado = [{ 'value': 'ACTIVO', 'string': 'ACTIVO' }, { 'value': 'REVOCADO', 'string': 'REVOCADO' }, { 'value': 'SEGUIMIENTO', 'string': 'SEGUIMIENTO' }, { 'value': 'AUTOEXCLUIDO', 'string': 'AUTOEXCLUIDO' }]
    async function getClient(id: number) {
        const res = await getClientNotAllowed(id);
        await setClient(res)
        await setOriginalClient(res);
    }
    async function getAllSecurity() {
        const res = await getSecuritys();
        const data = await res?.json()
        await setSecurity(data)
    }
    async function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const selectedCampaignName = e.target.value;//nombre de la campana seleccionada
        console.log(selectedCampaignName)
    }
    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        const formData = new FormData();
        await formData.append('archivo', file!);
        setLoadingImage(true)
        try {
            const response = await fetch(`${baseUrl}/upload`, {
                method: 'POST',
                body: formData,
                credentials: 'include' as RequestCredentials,
                redirect: "follow" as RequestRedirect,
                mode: "cors" as RequestMode,
                headers: {},
            });
            if (response.ok) {
                const responseData = await response.text();
                await setId_image(responseData)

            } else {
                console.error('Error al cargar la imagen en la API');
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert("No funciona la galería");
        } finally {
            setLoadingImage(false)
        }
    }
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setValue(name as keyof Inputs, value)
    }
    async function sendUpdate() {
        const data = getValues()
        // Compara los valores modificados con los valores originales y usa los valores originales si no hay cambios
        const updatedData = {
            ...originalClient,
            ...data
        };
        const body = new URLSearchParams();
        body.append('caracteristicas_fisicas', updatedData.caracteristicas_fisicas)
        body.append('emitido_por', updatedData.emitido_por)
        body.append('estado', updatedData.estado)
        body.append('id', updatedData.id.toString())
        body.append('id_foreign_key', updatedData.id_foreign_key.toString())
        body.append('motivo', updatedData.motivo)
        body.append('responsable_seguridad', updatedData.responsable_seguridad)
        body.append('tiempo_exclusion', updatedData.tiempo_exclusion)
        body.append('id_imagen', id_image);
        const requestOptions = {
            method: "POST",
            body: body, // Convertir el objeto a JSON
            credentials: "include" as RequestCredentials,
            redirect: "follow" as RequestRedirect,
            /*  mode: "cors" as RequestMode, */
            headers: {}
        };
        try {
            const response = await fetch(`${baseUrl}/actualizar_cliente_no_permitido`, requestOptions);
            if (!response.ok) {
                throw new Error("Error en la solicitud.");
            }
            if (response.status === 200) {
                prop.closeModal()
                await SwalMobile('success', 'Guardado correctamente', 3000)
                window.location.reload()
                return response
            }
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        getClient(prop.id)
        getAllSecurity()
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
                    <p className='text-center my-2 text-white text-2xl'>Editar Motivos </p>

                    {client && (
                        <div style={{ maxHeight: maxHeight, overflowY: 'auto', overflowX: "auto" }} className="p-4 scrollbar text-gray-200">
                            <div /* onSubmit={handleSubmit} */>

                                <div className="mb-5">
                                    <label className="block mb-2 text-sm   ">N° de Exclusión</label>
                                    <input disabled={true} type="input" {...register('id')} id="id" value={client.id} onChange={handleInputChange} className="bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="completa este campo" required />
                                </div>
                                <div className="mb-5">
                                    <label className="block mb-2 text-sm  ">Características físicas *</label>
                                    <input type="input"  {...register('caracteristicas_fisicas')} id="caracteristicas_fisicas" defaultValue={client.caracteristicas_fisicas} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="completa este campo" required />
                                </div>
                                <input type="text" className='hidden' defaultValue={client.id} {...register('id')} />
                                <input type="text" className='hidden' defaultValue={client.id_foreign_key} {...register('id_foreign_key')} />
                                <div className="my-2">
                                    <label className="block mb-2 text-sm text-white">Selecciona una imagen</label>
                                    <input {...register('id_imagen')} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-0.5  focus:outline-none" id="file_input" type="file" onChange={handleImageUpload} />
                                    {/* En caso de que sea true y encuentre la imagen */}
                                </div>
                                {loadingImage && (
                                    <div role="status" className='flex justify-center items-center my-4'>
                                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                                    </div>
                                )}
                                <div className="mb-5">
                                    <label className="block mb-2 text-sm  ">Motivo</label>
                                    <input type="input"{...register('motivo')} id="motivo" defaultValue={client.motivo} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="completa este campo" required />
                                </div>
                                <div className="mb-5">
                                    <label className="block mb-2 text-sm  ">Emitido por</label>
                                    <select onChange={(e) => {
                                        handleSelectChange(e);
                                        setValue("emitido_por", e.target.value); // Actualizar el valor en el hook form
                                    }} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                        <option value={'otro'} disabled selected>Elegir opción</option>
                                        {security.map((data) => (
                                            <>
                                                {data.emisor === "Si" && (
                                                    <option key={data.id} value={data.id}>{data.apellido_nombre}</option>
                                                )}
                                            </>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-5">
                                    <label className="block mb-2 text-sm  ">Responsable de seguridad</label>
                                    <select onChange={(e) => {
                                        handleSelectChange(e);
                                        setValue("responsable_seguridad", e.target.value); // Actualizar el valor en el hook form
                                    }} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                        <option value={'otro'} disabled selected>Elegir opción</option>
                                        {security.map((data, index) => (
                                            <>{data.seguridad === 'Si' && (
                                                <option key={index} value={data.id}>{data.apellido_nombre}</option>
                                            )}
                                            </>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-5">
                                    <label className="block mb-2 text-sm  ">Estado</label>
                                    <select onChange={(e) => {
                                        handleSelectChange(e);
                                        setValue("estado", e.target.value); // Actualizar el valor en el hook form
                                    }} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                        <option value={'otro'} disabled selected> Elegir opcion </option>
                                        {valores_Estado.map((data, index) => (
                                            <option key={index} value={data.value}>{data.string}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-5">
                                    <label className="block mb-2 text-sm  ">Tiempo de exclusión</label>
                                    <select onChange={(e) => {
                                        handleSelectChange(e);
                                        setValue("tiempo_exclusion", e.target.value); // Actualizar el valor en el hook form
                                    }} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                        {tiempos_Exclusion.map((data, index) => (
                                            <option key={index} value={data.tiempo_exclusion}>{data.tiempo_exclusion}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='flex justify-between items-center text-sm'>
                                    <div className="modal-footer mt-3 mx-auto  flex justify-center">
                                        <button style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} onClick={prop.closeModal} className="bg-backgroundButtonRed shadow-md hover:bg-red-500 text-white py-2 px-8 rounded-md">
                                            Cancelar</button>
                                    </div>
                                    <div className="modal-footer mt-3 mx-auto flex justify-center">
                                        <button style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} onClick={sendUpdate} className="bg-blueColor shadow-md hover:bg-blue-600 text-white py-2 px-8 rounded-md">
                                            Guardar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </section>
    );

}
