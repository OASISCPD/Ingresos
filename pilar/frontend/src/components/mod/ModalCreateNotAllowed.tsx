import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { client_not_allowed_DTO, formatFecha, insert_client_not_allowed } from "../../logic/NotAllowed";
import { getSecuritys } from "../../logic/Security";
import { get_client_x_id } from "../../logic/Clients";
import { baseUrl } from "../../BaseUrl";
import { SwalMobile } from "./SwalMobile";
import { FaRegCheckCircle } from "react-icons/fa";

interface Props {
    onClose: () => void;
}

interface securityData {
    id: number;
    apellido_nombre: number;
    emisor: string;
    seguridad: string
}

export function ModalCreateNotAllowed(prop: Props) {
    const tiempos_Exclusion = [{ 'value': 'INDETERMINADO', 'tiempo_exclusion': 'INDETERMINADO' }, { 'value': '1 MES', 'tiempo_exclusion': '1 MES' }, { 'value': '2 MESES', 'tiempo_exclusion': '2 MESES' }, { 'value': '3 MESES', 'tiempo_exclusion': '3 MESES' }, { 'value': '4 MESES', 'tiempo_exclusion': '4 MESES' }, { 'value': '5 MESES', 'tiempo_exclusion': '5 MESES' }, { 'value': '6 MESES', 'tiempo_exclusion': '6 MESES' }, { 'value': '1 AÑO', 'tiempo_exclusion': '1 AÑO' }, { 'value': '2 AÑOS', 'tiempo_exclusion': '2 AÑOS' }, { 'value': '3 AÑOS', 'tiempo_exclusion': '3 AÑOS' }, { 'value': '0', 'tiempo_exclusion': '0' },]
    const valores_Estado = [{ 'value': 'ACTIVO', 'string': 'ACTIVO' }, { 'value': 'REVOCADO', 'string': 'REVOCADO' }, { 'value': 'SEGUIMIENTO', 'string': 'SEGUIMIENTO' }, { 'value': 'AUTOEXCLUIDO', 'string': 'AUTOEXCLUIDO' }]
    const [maxHeight, setMaxHeight] = useState('800px');
    const [security, setSecurity] = useState<securityData[]>([])
    const [clientNotAllowed, setClientNotAllowed] = useState<any>([])
    const [clientFetched, setClientFetched] = useState(false);
    //logic image
    const [id_image, setId_image] = useState<string>('')
    const [loadingImage, setLoadingImage] = useState<boolean>(false)
    const [loadingImageCheck, setLoadingImageCheck] = useState<boolean>(false)
    const { register, setValue, getValues } = useForm<client_not_allowed_DTO>()
    //loading general al primer envio de datos
    const [loadingGeneral, setLoadingGeneral] = useState<boolean>(false)

    //check edad
    function isAdult(fecha_nacimiento: string): boolean {
        const birth_date = new Date(fecha_nacimiento);
        const date_now = new Date();
        // Calcular la edad
        const age = date_now.getFullYear() - birth_date.getFullYear();

        // Comparar las fechas de nacimiento y actual
        birth_date.setFullYear(date_now.getFullYear()); // Establecer el año de nacimiento al año actual
        const isBeforeBirthday = birth_date.getTime() > date_now.getTime();

        if (age > 18 || (age === 18 && !isBeforeBirthday)) {
            return true; // Mayor de edad
        } else {
            return false; // Menor de edad
        }
    }
    
    async function sendNewClient() {
        try {
            /* setLoadingGeneral(true) */
            const data = getValues()
            console.log(data)
            if (isAdult(data.fecha_nacimiento)) {
                /* CREAR CLIENTE DESCOMPRIMIENDO LA DATA Y UTILIZANDO LO QUE SE NECESITA PARA LA CARGA DE UN CLIENTE NUEVO PARA LUEGO PASARLO A NO PERMITIDO */
                const res = await insert_client_not_allowed(data)
                if (!res?.ok) {
                    throw new Error(`Http Status-> ${res?.status}`)
                }
                console.log(res)
                const newClient = await res?.json();
                console.log(newClient[0].id_ingreso)
                await getCLientById(newClient[0].id_ingreso)
            }
            else {
                await SwalMobile('warning', 'checkea la fecha de nacimiento del cliente,este, por el momento es menor de edad', 3000)
                return
            }

        }
        catch (error) {
            console.error(error)
            setLoadingGeneral(false)
            await SwalMobile('error', 'No se pudo AGREGAR el cliente para despues asociarlo a los no permitidos', 3000)
        }

    }
    async function getCLientById(id: number) {
        try {
            const res = await get_client_x_id(id);
            const data = await res?.json()
            console.log('data recibiad del id--->', data[0])
            await setClientNotAllowed(data[0])
            setClientFetched(true);
        }
        catch (error) {
            console.error(error)
            await SwalMobile('error', 'No se pudo TRAER el cliente para despues asociarlo a los no permitidos', 3000)
            setLoadingGeneral(false)
        }

    }

    async function sendAllValues() {
        const clientData = getValues()
        console.log('data recibida desde el sendAllValues', clientData)
        console.log('data del cliente a combinar', clientNotAllowed)
        console.log(clientNotAllowed.apellido + ' ' + clientNotAllowed.nombre)
        console.log(clientNotAllowed.id_cliente)
        console.log(clientNotAllowed.n_documento)
        console.log(clientNotAllowed.fecha_creacion)
        /* DATOS MANUALES de los inputs */
        console.log('otros datos', clientData.caracteristicas_fisicas, clientData.tiempo_exclusion, clientData.motivo, clientData.emitido_por, clientData.responsable_seguridad, clientData.estado, clientData.id_imagen)
        try {
            // Formatear la fecha
            const fechaFormateada = formatFecha(clientNotAllowed.fecha_creacion);
            const body = new URLSearchParams();
            body.append("apellido_nombre", clientNotAllowed.apellido + ' ' + clientNotAllowed.nombre);
            body.append("id_foreign_key", clientNotAllowed.id_cliente.toString()); //id del cliente
            body.append("n_documento", clientNotAllowed.n_documento);
            body.append("fecha_hora_ingreso", fechaFormateada);
            body.append("caracteristicas_fisicas", clientData.caracteristicas_fisicas);
            body.append("tiempo_exclusion", clientData.tiempo_exclusion);
            body.append("motivo", clientData.motivo);
            body.append("emitido_por", clientData.emitido_por);
            body.append("responsable_seguridad", clientData.responsable_seguridad);
            body.append("estado", clientData.estado);
            body.append('id_imagen', id_image);
            const requestOptions = {
                method: "POST",
                body: body,
                credentials: "include" as RequestCredentials,
                redirect: "follow" as RequestRedirect,
                mode: "cors" as RequestMode,
                headers: {},
            };
            const response = await fetch(
                `${baseUrl}/insertar_no_permitido`,
                requestOptions
            );
            if (!response.ok) {
                throw new Error("Error en la solicitud.");
            }
            if (response.status === 200) {
                setLoadingGeneral(false)
                prop.onClose()
                await SwalMobile('success', 'Guardado correctamente', 3000);
                window.location.reload();
                return response;
            }
        } catch (error) {
            await SwalMobile('error', 'se pudo AGREGAR el cliente, pero no se pudo asociar a no permitidos', 3000)
            console.error(error);
        }
    }
    async function getAllSecurity() {
        const res = await getSecuritys();
        const data = await res?.json()
        await setSecurity(data)
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
                setLoadingImageCheck(true)

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
    const handleTipoGeneroChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setValue('genero', selectedValue); // Actualiza el valor del campo en el estado
    };
    useEffect(() => {
        if (clientFetched) {
            sendAllValues();
            setClientFetched(false);
        }
    }, [clientFetched]);
    useEffect(() => {
        getAllSecurity()
    }, [])

    useEffect(() => {
        const mediaQuery = window.matchMedia("(orientation: portrait)");
        const handleOrientationChange = (mediaQueryList: MediaQueryListEvent | MediaQueryList) => {
            setMaxHeight(mediaQueryList.matches ? '400px' : '300px');
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
        <div className="p-4 flex items-center justify-center h-screen text-white">
            <div>

                <div x-show="showModal" className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-backgroundGrayBlack rounded-lg p-6 w-[90%] sm:w-[80%] lg:w-3/6 xl:w-1/2 2xl:w-1/3 max-w-full shadow-lg transform transition-all duration-300">
                        <div className="flex justify-between items-center border-b-2 border-colorLine pb-4">
                            {loadingGeneral && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                    <div role="status">
                                        <svg
                                            aria-hidden="true"
                                            className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"
                                            />
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            )}
                            <h2 className="text-xl">Agregar No Permitido</h2>
                            <button onClick={prop.onClose} className="text-red-500 hover:text-red-700 focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div style={{ maxHeight: maxHeight, overflowY: 'auto', overflowX: "auto" }} className="my-6 scrollbar  grid grid-cols-2 gap-4 text-black text-sm ">
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block mb-2 text-base text-white">Nombre</label>
                                <input autoComplete="off" {...register('nombre')} className="block w-full text-base text-gray-900 border border-gray-300 rounded-lg  bg-gray-50 p-0.5  focus:outline-none" id="nombre" type="text" /* onChange={handleImageUpload} */ />
                                {/* En caso de que sea true y encuentre la imagen */}
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block mb-2 text-base text-white">Apellido</label>
                                <input autoComplete="off" {...register('apellido')} className="block w-full text-base text-gray-900 border border-gray-300 rounded-lg  bg-gray-50 p-0.5  focus:outline-none" id="apellido" type="text" /* onChange={handleImageUpload} */ />
                                {/* En caso de que sea true y encuentre la imagen */}
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block mb-2 text-base text-white">Dni</label>
                                <input autoComplete="off" {...register('n_documento')} className="block w-full text-base text-gray-900 border border-gray-300 rounded-lg  bg-gray-50 p-0.5  focus:outline-none" id="dni" type="text" /* onChange={handleImageUpload} */ />
                                {/* En caso de que sea true y encuentre la imagen */}
                            </div>
                            <div className="flex flex-col justify-start items-center col-span-2 sm:col-span-1 ">
                                <label className="mr-auto  mb-2 text-base text-white">Genero</label>
                                <select className="w-full text-base p-2 rounded-lg"   {...register('genero')} onChange={handleTipoGeneroChange} >
                                    <option disabled selected value="">elegir genero </option>
                                    <option value={'M'}>Masculino</option>
                                    <option value={'F'}>Femenino</option>
                                </select>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block mb-2 text-base text-white">Fecha de nacimiento</label>
                                <input autoComplete="off" {...register('fecha_nacimiento')} className="block w-full text-base text-gray-900 border border-gray-300 rounded-lg  bg-gray-50 p-0.5  focus:outline-none" type="date" /* onChange={handleImageUpload} */ />
                                {/* En caso de que sea true y encuentre la imagen */}
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block mb-2 text-base text-white">Selecciona una imagen</label>
                                <input {...register('id_imagen')} className="block w-full text-base text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-0  focus:outline-none" id="file_input" type="file" onChange={handleImageUpload} />
                                {/* En caso de que sea true y encuentre la imagen */}
                            </div>
                            <div className="col-span-2">
                                {loadingImage && (
                                    <div role="status" className='flex justify-center items-center my-4'>
                                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                                    </div>
                                )}
                                {loadingImageCheck && (
                                    <div role="status" className='flex justify-center items-center my-4 text-white'>
                                        <h1 className='text-xs sm:text-sm'>Imagen guardada correctamente...</h1>
                                        <FaRegCheckCircle className='text-greenText mx-auto' size={20} />
                                    </div>
                                )}
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block mb-2 text-base text-white">Características físicas</label>
                                <input autoComplete="off" {...register('caracteristicas_fisicas')} className="block w-full text-base text-gray-900 border border-gray-300 rounded-lg  bg-gray-50 p-0.5  focus:outline-none" type="text" /* onChange={handleImageUpload} */ />
                                {/* En caso de que sea true y encuentre la imagen */}
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block mb-2 text-base text-white">Motivo</label>
                                <input autoComplete="off" {...register('motivo')} className="block w-full text-base text-gray-900 border border-gray-300 rounded-lg  bg-gray-50 p-0.5  focus:outline-none" type="text" /* onChange={handleImageUpload} */ />
                                {/* En caso de que sea true y encuentre la imagen */}
                            </div>
                            <div className="text-white col-span-2 sm:col-span-1">
                                <label className="block mb-2 text-base  ">Emitido por</label>
                                <select onChange={(e) => {
                                    /*  handleSelectChange(e); */
                                    setValue("emitido_por", e.target.value); // Actualizar el valor en el hook form
                                }} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 ">
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
                            <div className="text-white col-span-2 sm:col-span-1">
                                <label className="block mb-2 text-base  ">Responsable de seguridad</label>
                                <select onChange={(e) => {
                                    /*  handleSelectChange(e); */
                                    setValue("responsable_seguridad", e.target.value); // Actualizar el valor en el hook form
                                }} id="countries" className="bg-gray-50 border text-base border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 ">
                                    <option value={'otro'} disabled selected>Elegir opción</option>
                                    {security.map((data) => (
                                        <>
                                            {data.seguridad === "Si" && (
                                                <option key={data.id} value={data.id}>{data.apellido_nombre}</option>
                                            )}
                                        </>
                                    ))}
                                </select>
                            </div>
                            <div className="text-white col-span-2 sm:col-span-1">
                                <label className="block mb-2 text-base  ">Estado</label>
                                <select onChange={(e) => {
                                    /*  handleSelectChange(e); */
                                    setValue("estado", e.target.value); // Actualizar el valor en el hook form
                                }} id="countries" className="bg-gray-50 border text-base border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 ">
                                    <option value={'otro'} disabled selected>Elegir opción</option>
                                    {valores_Estado.map((data, index) => (
                                        <option key={index} value={data.value}>{data.string}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="text-white col-span-2 sm:col-span-1">
                                <label className="block mb-2 text-base  ">Tiempo de exclusión</label>
                                <select onChange={(e) => {
                                    /*  handleSelectChange(e); */
                                    setValue("tiempo_exclusion", e.target.value); // Actualizar el valor en el hook form
                                }} id="countries" className="bg-gray-50 border text-base border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 ">
                                    <option value={'otro'} disabled selected>Elegir opción</option>
                                    {tiempos_Exclusion.map((data, index) => (
                                        <option key={index} value={data.tiempo_exclusion}>{data.tiempo_exclusion}</option>
                                    ))}
                                </select>
                            </div>

                        </div>
                        <button type="button" style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} onClick={sendNewClient} className={`flex justify-center items-center shadow-md shadow-backgroundGrayBlack text-x  py-2 mx-auto w-1/2 bg-gradient-to-b from-backgroundRed to-backgroundButtonOraengeGradient rounded-lg text-white shadowText`}>
                            <h1>Agregar</h1>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}



