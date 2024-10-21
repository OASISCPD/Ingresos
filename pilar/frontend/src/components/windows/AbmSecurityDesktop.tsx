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
import { SkeletonListDesktopAbmSecurity } from "../loading/SkeletonListDesktopAbmSecurity";

interface FormData {
    apellido_nombre: string;
    emisor: any;
    seguridad: any;
}

export function AbmSecurityDesktop() {
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
    //loagin para la lista
    const [loading, setLoading] = useState<boolean>(false);
    //constantes para las funciones
    const [typeSearch, setTypeSearch] = useState<string>('apellido_nombre')
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
        setValue('emisor', false);
        setValue('seguridad', false);
        getDataSecuritys()
    }, [])

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="relative my-4">
                <div className="grid grid-cols-5 gap-2 items-center text-xs xl:text-base 2xl:text-lg text-black">
                    <div className="col-span-2">
                        <Controller
                            name="apellido_nombre"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <input
                                    type="text"
                                    {...field}
                                    className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-waterGreenAllBlack sm:text-sm sm:leading-6"
                                    placeholder="Ingresar..."
                                />
                            )}
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            type="button"
                            className={`h-5 w-5 border-2 rounded-full ${emisor.color} duration-300`}
                            onClick={handleButton1Click}
                        ></button>
                        <h1 className="mx-2">EMITE EXCLUSIÓN</h1>
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            type="button"
                            className={`h-5 w-5 border-2 rounded-full ${seguridad.color} duration-300`}
                            onClick={handleButton2Click}
                        ></button>
                        <h1 className="mx-2">ES SEGURIDAD</h1>
                    </div>
                    <div>
                        <button
                            type="submit"
                            style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }}
                            className="bg-waterGreenBlack shadow-md hover:bg-waterGreenAllBlack text-white py-2 px-12 rounded-md"
                        >
                            Agregar
                        </button>
                    </div>
                </div>
            </form>
            <div className="relative overflow-x-auto my-12 rounded-md bg-waterGreenBlack p-3 xl:p-4">
                <div className="mb-2 max-w-xl">
                    <div className="text-xs sm:text-base flex  items-center justify-between sm:justify-start text-white uppercase  ">
                        <tr className="mx-auto w-1/3 sm:w-1/3 ">
                            <th scope="col" className="p-2 text-xs">
                                Buscar por
                            </th>
                        </tr>
                        <select id="type" onChange={handleSelectChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/4  sm:w-1/2 p-1">
                            <option value="apellido_nombre">Apellido y nombre</option>
                            <option value="id">n° </option>
                        </select>
                        <input onChange={handleInputSearch} type="email" id="email" className="bg-gray-50 border border-gray-300 mx-2 w-1/3 sm:w-full text-gray-900 text-sm xl:text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-1 xl:p-0.5 " placeholder="Buscar..." required autoComplete="off" />
                    </div>
                </div>
                <div style={{ maxHeight: maxHeight, overflowY: 'auto', overflowX: "auto" }} className="relative scrollbar overflow-x-auto">
                    <table className="w-full  text-left rtl:text-right text-waterGreenWhite ">
                        <thead className="text-xs xl:text-sm text-white uppercase  ">
                            <tr className="text-center ">
                                <th scope="col" className="px-3 xl:px-6 py-3 ">
                                    Apellido  y Nombre
                                </th>
                                <th scope="col" className="px-3 xl:px-6 py-3 ">
                                    Emisor
                                </th>
                                <th scope="col" className="px-3 xl:px-6 py-3 ">
                                    Responsable Seguridad
                                </th>
                                <th scope="col" className="px-3 xl:px-6 py-3 ">
                                    fecha de creacion
                                </th>
                                <th scope="col" className="px-3 xl:px-6 py-3 ">
                                    fecha de actualizacion
                                </th>
                                <th scope="col" className="px-3 xl:px-6 py-3 ">
                                    Ampliar
                                </th>
                                <th scope="col" className="px-3 xl:px-6 py-3 ">
                                    Editar
                                </th>
                                <th scope="col" className="px-3 xl:px-6 py-3">
                                    Borrar
                                </th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {loading ? (
                                <>
                                    <SkeletonListDesktopAbmSecurity />
                                    <SkeletonListDesktopAbmSecurity />
                                    <SkeletonListDesktopAbmSecurity />
                                    <SkeletonListDesktopAbmSecurity />
                                    <SkeletonListDesktopAbmSecurity />
                                    <SkeletonListDesktopAbmSecurity />
                                    <SkeletonListDesktopAbmSecurity />
                                    <SkeletonListDesktopAbmSecurity />
                                    <SkeletonListDesktopAbmSecurity />
                                    <SkeletonListDesktopAbmSecurity />
                                    <SkeletonListDesktopAbmSecurity />
                                </>
                            ) : (
                                <>
                                    {dataSecuritys && (
                                        <>
                                            {
                                                dataSecuritys.map((client) => (
                                                    <tr key={client.id} className="p-2 border-t border-gray-500 text-center text-xs xl:text-sm">
                                                        <th scope="row" className="px-3 xl:px-6  py-4 bg-waterGreenAllBlack   border-r border-l border-gray-200   whitespace-nowrap ">
                                                            {client.apellido_nombre}
                                                        </th>
                                                        <td className="px-3 xl:px-6  py-4 bg-waterGreenAllBlack   border-r  border-gray-200">
                                                            {client.emisor}

                                                        </td>
                                                        <td className="px-3 xl:px-6  py-4 bg-waterGreenAllBlack   border-r  border-gray-200">
                                                            {client.seguridad}
                                                        </td>
                                                        <td className="px-3 xl:px-6  py-4 bg-waterGreenAllBlack   border-r  border-gray-200">
                                                            {client.fecha_creacion}
                                                        </td>
                                                        <td className="px-3 xl:px-6  py-4 bg-waterGreenAllBlack   border-r  border-gray-200">
                                                            {client.fecha_actualizacion}
                                                        </td>

                                                        <td className="px-3 xl:px-6   py-4 bg-waterGreenAllBlack    border-r  border-gray-200">
                                                            <FaRegEye onClick={() => openModal(client)} size={20} className="mx-auto hover:cursor-pointer hover:text-buttonSend  duration-300" />
                                                        </td>
                                                        <td className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack    border-r  border-gray-200">
                                                            <HiPencil onClick={() => openModalEdit(client)} size={20} className="mx-auto hover:cursor-pointer hover:text-greenText duration-300  " />

                                                        </td>
                                                        <td className="px-3 xl:px-6  py-4 bg-waterGreenAllBlack border-r   ">
                                                            <IoMdTrash onClick={() => deleteSecurity(client.id)} size={20} className="mx-auto hover:cursor-pointer hover:text-backgroundRed duration-300 " />

                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </>
                                    )
                                    }  </>
                            )}

                        </tbody>
                    </table>
                </div>

            </div>
            {modalOpenView && (
                <Modal isOpen={true} onClose={closeModal}>
                    <ModalView closeModal={closeModal} data={dataModal} />
                </Modal>
            )}
            {modalOpenEdit && (
                <Modal isOpen={true} onClose={closeModal}>
                    <ModalEdit closeModal={closeModal} data={dataModal} />
                </Modal>
            )}
        </div >
    );
}

