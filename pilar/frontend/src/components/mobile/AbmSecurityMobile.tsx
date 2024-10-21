import { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { HiPencil } from "react-icons/hi";
import { IoMdTrash } from "react-icons/io";
import { SwalMobile } from "../mod/SwalMobile";
import { Modal } from "../mod/Modal";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { add_security, dataSecurityDto, delete_security, getSecuritys } from "../../logic/Security";
import { ModalView } from "../mod/security/ModalView";
import { ModalEdit } from "../mod/security/ModalEdit";
import Swal from "sweetalert2";
import { getSecuritysType } from "../../logic/Clients";
import { SkeletonListMobile } from "../loading/SkeletonListMobile";

interface FormData {
    apellido_nombre: string;
    emisor: any;
    seguridad: any;
}

export function AbmSecurityMobile() {
    //value para el frontlogi
    const { control, handleSubmit, setValue, getValues } = useForm<FormData>();
    const [maxHeight, setMaxHeight] = useState('800px');
    const [dataSecuritys, setDataSecuritys] = useState<dataSecurityDto[]>([]);
    // Estados para manejar el color y el booleano de los botones
    const [emisor, setEmisor] = useState({ color: 'bg-white bg-opacity-0', active: false });
    const [seguridad, setSeguridad] = useState({ color: 'bg-white bg-opacity-0', active: false });
    //MODALS SETS
    const [modalOpenView, setModalOpenView] = useState<boolean>(false)
    const [modalOpenEdit, setModalOpenEdit] = useState<boolean>(false)
    const [dataModal, setDataModal] = useState<dataSecurityDto>()
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [typeSearch, setTypeSearch] = useState<string>('apellido_nombre')
    //loading boolean muestra card
    const [loading, setLoading] = useState<boolean>(false)
    /* FUNCIONES QUE manejan la logica del buscador */
    //funcion q toma los valores del input para filtrar en la lista de no permitidos
    function handleInputSearch(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        getSecuritysByType(value)
    };
    //change valor de buscador
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setTypeSearch(value);
    };
    async function getSecuritysByType(input: any) {
        const res = await getSecuritysType(typeSearch, input)
        if (res) {
            const data = await res.json();
            setDataSecuritys(data)
        }
    }
    const handleViewMore = (id: number) => {
        if (selectedClientId === id) {
            setSelectedClientId(null); // Collapse if the same client is clicked again
        } else {
            setSelectedClientId(id); // Expand to show details for the clicked client
        }
    };
    // Funciones para manejar el cambio de color y el booleano
    // Funciones para manejar el cambio de color y el booleano
    const handleButton1Click = () => {
        setEmisor(prevState => {
            const newState = {
                color: prevState.color === 'bg-white bg-opacity-0' ? 'bg-backgroundButtonGreen' : 'bg-white bg-opacity-0',
                active: !prevState.active
            };
            setValue('emisor', newState.active);
            return newState;
        });
    };
    const handleButton2Click = () => {
        setSeguridad(prevState => {
            const newState = {
                color: prevState.color === 'bg-white bg-opacity-0' ? 'bg-backgroundButtonGreen' : 'bg-white bg-opacity-0',
                active: !prevState.active
            };
            setValue('seguridad', newState.active);
            return newState;
        });
    };
    const onSubmit: SubmitHandler<FormData> = async data => {
        // Aquí puedes manejar la lógica para enviar los datos a la base de datos.
        if (!data.apellido_nombre) {
            await SwalMobile('warning', 'El campo de apellido y nombre no debe estar vacio', 3000)
            return;
        }
        const res = await dataChecks()
        if (res === true) {
            const newData = getValues()
            const res = await add_security(newData)
            if (!res?.ok) {
                await SwalMobile('error', 'Error en el envio de datos, vuelva a intentarlo', 3000)
                return
            }
            await SwalMobile('success', 'Personal de seguridad agregado correctamente', 3000)
            window.location.reload()
        }
    };
    async function dataChecks() {
        if (emisor.active && seguridad.active) {
            // Lógica cuando el primer botón está activo
            setValue('seguridad', 'Si');
            setValue('emisor', 'Si');
        }
        else if (emisor.active) {
            // Lógica cuando el segundo botón está activo
            setValue('seguridad', 'No');
            setValue('emisor', 'Si');
        }
        else if (seguridad.active) {
            setValue('seguridad', 'Si');
            setValue('emisor', 'No');
            // Lógica cuando el segundo botón está activo
        }
        else {
            setValue('seguridad', 'No');
            setValue('emisor', 'No');
            await SwalMobile('warning', 'Debe seleccionar al menos una opcion', 3000)
            /* window.location.reload(); */
            return false
        }
        return true
    }
    async function getDataSecuritys() {
        setLoading(true)
        const res = await getSecuritys();
        const data = await res?.json()
        setDataSecuritys(data)
        setLoading(false)
    }
    async function deleteSecurity(id: number) {
        await Swal.fire({
            title: "Estas seguro de eliminar este usuario?",
            text: "",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar!",
            cancelButtonText: "No, eliminar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const idString = id.toString()
                const res = await delete_security(idString, "B")
                if (!res.ok) {
                    await SwalMobile('error', 'No se pudo eliminar el personal de seguridad', 3000)
                }
                await SwalMobile('success', 'Seguridad eliminado con exito', 3000)
                window.location.reload();

            }
        });

    }
    //MODALS
    function openModal(data: dataSecurityDto) {
        setDataModal(data)
        setModalOpenView(true)
    }
    function openModalEdit(data: dataSecurityDto) {
        setDataModal(data);
        setModalOpenEdit(true)
    }
    function closeModal() {
        setModalOpenView(false)
        setModalOpenEdit(false)

    }
    useEffect(() => {
        const mediaQuery = window.matchMedia("(orientation: portrait)");
        const handleOrientationChange = (mediaQueryList: MediaQueryListEvent | MediaQueryList) => {
            setMaxHeight(mediaQueryList.matches ? '500px' : '420px');
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
        setValue('emisor', false);
        setValue('seguridad', false);
        getDataSecuritys()
    }, [])

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="relative my-4">
                <div     className="grid grid-cols-2 gap-2 items-center text-xs sm:text-base  text-white">
                    <div className="col-span-2">
                        <Controller
                            name="apellido_nombre"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <input
                                    type="text"
                                    {...field}
                                    className="relative w-full cursor-default rounded-md bg-waterGreenWhite py-2.5 px-2 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-waterGreenAllBlack sm:text-base sm:leading-6"
                                    placeholder="Ingresar..."
                                    autoComplete="off"
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-wrap items-center justify-center text-black my-4">
                        <button
                            type="button"
                            className={`h-5 w-5 border-2 rounded-full ${emisor.color} duration-300`}
                            onClick={handleButton1Click}
                        ></button>
                        <h1 className="mx-2">EMITE EXCLUSIÓN</h1>
                    </div>
                    <div className="flex flex-wrap items-center justify-center text-black">
                        <button
                            type="button"
                            className={`h-5 w-5 border-2 rounded-full ${seguridad.color} duration-300`}
                            onClick={handleButton2Click}
                        ></button>
                        <h1 className="mx-2">ES SEGURIDAD</h1>
                    </div>
                    <div className="mx-auto col-span-1 my-2">
                        <button
                            type="submit"
                            style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }}
                            className="bg-waterGreenBlack shadow-md hover:bg-waterGreenShadow text-white py-3 text-sm sm:text-base px-12 rounded-md"
                        >
                            Agregar
                        </button>
                    </div>
                </div>
            </form>
            
            <div className="relative overflow-x-auto my-12 rounded-md bg-waterGreenBlack p-2 xl:p-4">
                <div style={{ maxHeight: maxHeight, overflowY: 'auto', overflowX: "auto" }} className="relative scrollbar overflow-x-auto">
                    <table className="w-full   text-zinc-100 mx-auto ">
                        <div className="mb-2">
                            <div className="text-xs sm:text-base sm:flex   items-center justify-between  text-white uppercase  ">
                                <div className="flex justify-start sm:justify-between">
                                    <tr className="mx-auto w-1/2 my-1.5 sm:w-full ">
                                        <h1 className=" text-xs sm:text-sm">
                                            Buscar por
                                        </h1>
                                    </tr>
                                    <select id="type" onChange={handleSelectChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ">
                                        <option value="apellido_nombre">Apellido y nombre</option>
                                        <option value="id">N° </option>
                                    </select>
                                </div>
                                <input onChange={handleInputSearch} type="email" id="email" className="bg-gray-50 border my-2 border-gray-300  sm:w-1/2 text-gray-900 text-xs sm:text-sm  rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-1 sm:p-2 w-full " placeholder="Buscar..." required autoComplete="off" />
                            </div>
                            <thead className="text-xs sm:text-base flex  items-center justify-between text-white uppercase  ">
                                <tr className="text-center ">
                                    <th scope="col" className="p-2 ">
                                        Nombre y apellido
                                    </th>
                                </tr>
                            </thead>
                        </div>
                        <tbody className="">
                            {loading ? (
                                <>
                                    <SkeletonListMobile />
                                    <SkeletonListMobile />
                                    <SkeletonListMobile />
                                </>
                            ) : (
                                <>
                                    {dataSecuritys && (
                                        <>
                                            {dataSecuritys.length === 0 ? (
                                                <>
                                                    <div className="  my-8">
                                                        <h1>No se encontro el personal de seguridad</h1>
                                                    </div>
                                                </>
                                            ) : (dataSecuritys.map((client) => (
                                                <>
                                                    <div key={client.id} className=" border border-waterGreenMedium text-center text-sm sm:text-base  grid grid-cols-2">
                                                        <th className=" xl:px-6  py-4 bg-black    ">
                                                            {client.apellido_nombre}
                                                        </th>
                                                        <th onClick={() => handleViewMore(client.id)} className=" xl:px-6 py-4 bg-black   ">
                                                            {/* {client.emisor} */}
                                                            {selectedClientId === client.id ? 'Cerrar' : 'Ver'}
                                                        </th>
                                                    </div>
                                                    {selectedClientId === client.id && (
                                                        <div className="border-r border-l">
                                                            <div className="border-b  text-center text-xs sm:text-base grid grid-cols-2">
                                                                <h1 className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack border-r border-waterGreenMedium">
                                                                    Emisor
                                                                </h1>
                                                                <h1 className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack  border-waterGreenMedium">
                                                                    {client.emisor}
                                                                </h1>
                                                            </div>
                                                            <div className="border-b  text-center text-xs sm:text-base grid grid-cols-2">
                                                                <h1 className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack border-r border-waterGreenMedium">
                                                                    Responsable Seguridad
                                                                </h1>
                                                                <h1 className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack  border-waterGreenMedium">
                                                                    {client.seguridad}
                                                                </h1>
                                                            </div>
                                                            <div className="border-b  text-center text-xs sm:text-base grid grid-cols-2">
                                                                <h1 className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack border-r border-waterGreenMedium">
                                                                    Fecha de creacion
                                                                </h1>
                                                                <h1 className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack  border-waterGreenMedium">
                                                                    {client.fecha_creacion}
                                                                </h1>
                                                            </div>
                                                            <div className="border-b  text-center text-xs sm:text-base grid grid-cols-2">
                                                                <h1 className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack border-r border-waterGreenMedium">
                                                                    Fecha de actualizacion
                                                                </h1>
                                                                <h1 className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack  border-waterGreenMedium">
                                                                    {client.fecha_actualizacion}
                                                                </h1>
                                                            </div>
                                                            {/*  <div className="border-b  text-center text-xs sm:text-base grid grid-cols-2">
                                                                <h1 className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack border-r border-waterGreenMedium">
                                                                    Amplliar
                                                                </h1>
                                                                <h1 className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack  border-waterGreenMedium">
                                                                    <FaRegEye onClick={() => openModal(client)} size={20} className="mx-auto hover:cursor-pointer hover:text-buttonSend  duration-300" />
                                                                </h1>
                                                            </div> */}
                                                            <div className="border-b  text-center text-xs sm:text-base grid grid-cols-3">
                                                                <div className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack  border-waterGreenMedium">

                                                                    <FaRegEye onClick={() => openModal(client)} size={20} className="mx-auto hover:cursor-pointer hover:text-buttonSend  duration-300" />
                                                                    <h1 className="">
                                                                        Ampliar
                                                                    </h1>
                                                                </div>
                                                                <div className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack  border-waterGreenMedium">

                                                                    <HiPencil onClick={() => openModalEdit(client)} size={20} className="mx-auto hover:cursor-pointer hover:text-greenText duration-300  " />
                                                                    <h1 className="">
                                                                        Editar
                                                                    </h1>
                                                                </div>
                                                                <div className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack  border-waterGreenMedium">

                                                                    <IoMdTrash onClick={() => deleteSecurity(client.id)} size={20} className="mx-auto hover:cursor-pointer hover:text-backgroundRed duration-300 " />
                                                                    <h1 className="">
                                                                        Eliminar
                                                                    </h1>
                                                                </div>
                                                            </div>
                                                            {/*    <div className="  text-center text-xs sm:text-base grid grid-cols-2">
                                                                <h1 className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack border-r border-waterGreenMedium">
                                                                    Eliminar
                                                                </h1>
                                                                <h1 className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack  border-waterGreenMedium">
                                                                    <IoMdTrash onClick={() => deleteSecurity(client.id)} size={20} className="mx-auto hover:cursor-pointer hover:text-backgroundRed duration-300 " />
                                                                </h1>
                                                            </div> */}
                                                        </div>

                                                    )}
                                                </>
                                            )))}
                                        </>
                                    )}
                                </>
                            )}


                        </tbody>
                    </table>
                </div>

            </div>
            {
                modalOpenView && (
                    <Modal isOpen={true} onClose={closeModal}>
                        <ModalView closeModal={closeModal} data={dataModal} />
                    </Modal>
                )
            }
            {
                modalOpenEdit && (
                    <Modal isOpen={true} onClose={closeModal}>
                        <ModalEdit closeModal={closeModal} data={dataModal} />
                    </Modal>
                )
            }
        </div >
    );
}

