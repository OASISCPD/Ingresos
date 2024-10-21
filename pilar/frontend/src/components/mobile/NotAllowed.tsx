import React, { useEffect, useState } from "react";
import { getAllClient, getClientByDni, getNotAllowedType, get_clients_not_allowed } from "../../logic/Clients";
import { MdClear, MdKeyboardArrowDown } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { HiPencil } from "react-icons/hi";
import { IoMdTrash } from "react-icons/io";
import { SwalMobile } from "../mod/SwalMobile";
import { Modal } from "../mod/Modal";
import { ModalUpdateClientNotAllowed } from "../mod/ModalUpdateClientNotAllowed";
import { baseUrl } from "../../BaseUrl";
import { ModalView } from "../mod/ModalView";
/* import Swal from "sweetalert2"; */
import { ModalCreate } from "../mod/ModalCreate";
import Swal from "sweetalert2";
import { SkeletonListMobile } from "../loading/SkeletonListMobile";
import { ModalCreateNotAllowed } from "../mod/ModalCreateNotAllowed";
export interface InterfaceClient {
    apellido: string,
    cadena: string,
    estado: any,
    fecha_actualizacion: any,
    fecha_creacion: any,
    fecha_nacimiento: any,
    genero: string,
    id_cliente: any,
    id_usuario: number,
    n_documento: any,
    nombre: string,
    tipo_documento: string
}
export interface notAllowed {
    apellido_nombre: string;
    estado: string;
    fecha_hora_ingreso: any;
    id: number;
    n_documento: string
}

export function NotAllowedMobile() {
    const [loading, setLoading] = useState<boolean>(false)
    const [boolean, setBoolean] = useState<boolean>(false);
    const [clients, setClients] = useState<InterfaceClient[]>([]);
    const [clientsNotAllowed, setClientsNotAllowed] = useState<notAllowed[]>([]);
    const [inputValue, setInputValue] = useState<string>(''); // Estado para almacenar el valor del input
    const [typeSearch, setTypeSearch] = useState<string>('n_documento')
    //value para el frontlogi
    const [maxHeight, setMaxHeight] = useState('800px');
    //datos del cliente a pasar para no permitido
    const [clientNotAllowed, setClientNotAllowed] = useState<InterfaceClient>();
    /*     const [visible, setVisible] = useState<boolean>(false); */
    const [modalCreate, setModalCreate] = useState<boolean>(false)
    const [modal, setModal] = useState<boolean>(false)
    const [modalView, setModalView] = useState<boolean>(false)
    const [modalNewRegister, setModalNewRegister] = useState<boolean>(false)

    //check modal
    const [checkButtonModal, setCheckButtonModal] = useState<boolean>(false)
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    //value client a pasar para actualizar
    const [clientId, setClientId] = useState<number>(0);
    //loading al cargar el componente


    function getClient(data: InterfaceClient) {
        /* setSelectedClientDni(data.n_documento); */
        setClientNotAllowed(data)
        setInputValue(data.n_documento); // Actualiza el valor del input cuando se selecciona un cliente
        setBoolean(false); // Cierra la lista al seleccionar un cliente
        setCheckButtonModal(true)
    }
    async function openList() {
        await setBoolean(true);
        // Muestra la barra lateral después de un pequeño retraso para que la animación se reproduzca correctamente
        /*    const timeout = setTimeout(() => setVisible(true), 100);
           return () => clearTimeout(timeout); */
    }
    function closeList() {
        setBoolean(false)
    }
    //change value del input 
    //funcion q toma los valores del input para filtrar en la lista de no permitidos
    function handleInputSearch(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        getNotAllowedByType(value)
    };
    //change valor de buscador
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setTypeSearch(value);
    };
    async function getNotAllowedByType(input: any) {
        const res = await getNotAllowedType(typeSearch, input)
        if (res) {
            const data = await res.json();
            setClientsNotAllowed(data)
        }
    }
    const handleViewMore = (id: number) => {
        if (selectedClientId === id) {
            setSelectedClientId(null); // Collapse if the same client is clicked again
        } else {
            setSelectedClientId(id); // Expand to show details for the clicked client
        }
    };

    async function openModalView(id: number) {
        await setClientId(id)
        setModalView(true)
    }

    async function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const inputValue = event.target.value;
        setInputValue(inputValue); // Actualiza el valor del input
        if (inputValue.trim() === '') {
            // Si el input está vacío, muestra todos los clientes
            await getData();
        } else {
            // Si hay texto en el input, busca clientes por DNI
            const res = await getClientByDni(parseInt(inputValue));
            const data = await res?.json();
            if (data.length === 0) {
                setBoolean(false);
                setClients([]); // Borra la lista de clientes si no se encuentran resultados
                return;
            }
            setClients(data);
            setBoolean(true);
        }
    }
    async function getData() {
        const response = await getAllClient();
        const data = await response?.json();
        setClients(data);
    }
    async function sendData() {
        setModalCreate(true)
    }
    async function getNotAllowed() {
        setLoading(true)
        const res = await get_clients_not_allowed();
        setClientsNotAllowed(res)
        setLoading(false)
    }
    async function openModal(id: number) {
        await setClientId(id)
        setModal(true)
    }
    async function closeModal() {
        setModal(false)
        setModalView(false)
        setModalCreate(false)
        setModalNewRegister(false)
    }
    async function deleteClient(id: number) {
        const requestOptions: RequestInit = {
            method: "GET",
            credentials: "include" as RequestCredentials, // Agrega esta línea para incluir las cookies en la solicitud
            mode: "cors" as RequestMode, // Agrega esta línea para permitir solicitudes entre dominios
        };
        await Swal.fire({
            title: "Estas seguro de eliminar este cliente no permitido?",
            text: "",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar!",
            cancelButtonText: "No, eliminar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${baseUrl}/eliminar_no_permitido?id=${id}&value=B`, requestOptions)
                    if (!response.ok) {
                        throw new Error(`HTTP Error! Status: ${response.status}`);
                    }
                    if (response.status === 200) {
                        await SwalMobile('success', 'Cliente eliminado correctamente', 3000)
                        window.location.reload()
                        return
                    }
                    else {
                        SwalMobile('error', 'No se puedo eliminar el cliente', 3000)
                        return
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        });
    }
    //trae todos los clientes 
    useEffect(() => {
        getData();
    }, []);
    //trae todos los clientes no permitidos
    useEffect(() => {
        getNotAllowed()
    }, [])
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

    return (
        <div>
            <div className="relative my-4">
                <div className="my-4 flex justify-between items-center">
                    <h1 className=" text-base sm:text-xl lg:text-2xl   text-black ">Agregar registro</h1>
                    <button style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} onClick={() => setModalNewRegister(true)} className="bg-waterGreenBlack shadow-md hover:bg-waterGreenShadow text-white py-2 px-2 sm:px-8 rounded-md text-sm sm:text-base">
                        Agregar no registrado
                    </button>
                </div>
                <div className={`relative w-full cursor-default ${boolean ? ' rounded-t-md' : ' rounded-md'} bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6`} aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">
                    <div>
                        <input
                            type="text"
                            className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base sm:leading-6"
                            placeholder="Buscar por dni..."
                            value={inputValue} // Usa value en lugar de defaultValue
                            onChange={handleInputChange} // Agregar el evento onChange
                            aria-haspopup="listbox"
                            aria-expanded="true"
                            aria-labelledby="listbox-label"
                        />
                        {/* Aquí puedes agregar el resto del código que necesites */}
                    </div>
                    <span onClick={boolean ? () => closeList() : () => openList()} className="cursor-pointer absolute inset-y-0 right-0  flex items-center m-1 px-1 hover:rounded-lg hover:bg-gray-200">
                        {boolean ? (
                            <MdClear /* onClick={closeList}  */ size={20} />
                        ) : (
                            <MdKeyboardArrowDown /* onClick={openList} */ size={20} />
                        )}
                    </span>
                </div>
                {boolean && (
                    <ul className={`absolute z-10 max-h-60 w-full overflow-auto rounded-b-md bg-waterGreenWhite py-2 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`} role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
                        {clients.map((client) => (
                            <li key={client.id_cliente} onClick={() => getClient(client)} className="text-gray-900 z-20 border-b hover:bg-gray-200 cursor-pointer relative select-none py-2 mx-4" role="option">
                                <div className=" grid grid-cols-3">
                                    <span className="font-normal mx-auto">{client.nombre} {client.apellido}</span>
                                    <span className="font-normal mx-auto">{client.n_documento}</span>
                                    <span className="font-normal mx-auto">{client.fecha_creacion}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {checkButtonModal && (
                <div>
                    <button style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} onClick={sendData} className="bg-waterGreenBlack shadow-md text-sm hover:bg-waterGreenShadow text-white py-2 px-12 rounded-md">
                        Agregar
                    </button>
                </div>
            )}
            <div className="my-8">
                {/* Buscador*/}
                <div className="relative overflow-x-auto  rounded-md bg-waterGreenBlack p-3 xl:p-4">
                    <div className="relative overflow-x-auto">
                        <div className="w-full  text-zinc-100 mx-auto">
                            <div className="mb-2">
                                <div className="text-xs sm:text-base sm:flex   items-center justify-between  text-white uppercase  ">
                                    <div className="flex justify-start sm:justify-between">
                                        <tr className="mx-auto w-1/2 my-1.5 sm:w-full ">
                                            <h1 className=" text-xs sm:text-sm">
                                                Buscar por
                                            </h1>
                                        </tr>
                                        <select id="type" onChange={handleSelectChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ">
                                            <option value="n_documento">Dni</option>
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
                            <div style={{ maxHeight: maxHeight, overflowY: 'auto', overflowX: "auto" }} className="scrollbar">
                                {/* AGREGAR VALIDACION DE LOAGIND */}
                                {loading ? (
                                    <>
                                        <SkeletonListMobile />
                                        <SkeletonListMobile />
                                        <SkeletonListMobile />
                                    </>
                                ) : (
                                    <>
                                        {clientsNotAllowed && (
                                            <>{clientsNotAllowed.length === 0 ? (
                                                <div className="  my-8">
                                                    <h1>No se encontro el cliente no permitido</h1>
                                                </div>
                                            ) : (
                                                clientsNotAllowed.map((client) => (
                                                    <>
                                                        <React.Fragment key={client.id}>
                                                            <div className=" border border-waterGreenMedium text-center text-sm sm:text-base  grid grid-cols-2">
                                                                <th className=" xl:px-6  py-4 bg-black    ">
                                                                    {client.apellido_nombre}
                                                                </th>
                                                                <th onClick={() => handleViewMore(client.id)} className=" xl:px-6 py-4 bg-black   ">
                                                                    {/* {client.emisor} */}
                                                                    {selectedClientId === client.id ? 'Cerrar' : 'Ver'}
                                                                </th>
                                                            </div>
                                                            {selectedClientId === client.id && (
                                                                <div className="border-r border-l" >
                                                                    <div className="border-b  text-center text-xs sm:text-sm grid grid-cols-2">
                                                                        <h1 className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack border-r border-gray-200">
                                                                            Dni
                                                                        </h1>
                                                                        <h1 className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack  border-gray-200">
                                                                            {client.n_documento}
                                                                        </h1>
                                                                    </div>
                                                                    <div className="border-b  text-center text-xs sm:text-sm grid grid-cols-2">
                                                                        <h1 className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack border-r border-gray-200">
                                                                            Fecha de ingreso
                                                                        </h1>
                                                                        <h1 className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack  border-gray-200">
                                                                            {client.fecha_hora_ingreso}
                                                                        </h1>
                                                                    </div>
                                                                    <div className="border-b  text-center text-xs sm:text-sm grid grid-cols-2">
                                                                        <h1 className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack border-r border-gray-200">
                                                                            Estado
                                                                        </h1>
                                                                        <h1 className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack  border-gray-200 text-greenText">
                                                                            {client.estado}
                                                                        </h1>
                                                                    </div>

                                                                    <div className="border-b  text-center text-xs sm:text-base grid grid-cols-3">
                                                                        <div className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack border-r border-gray-200">
                                                                            <FaRegEye onClick={() => openModalView(client.id)} size={20} className="mx-auto hover:cursor-pointer hover:text-buttonSend  duration-300" />
                                                                            <h1 className="">
                                                                                Amplliar
                                                                            </h1>
                                                                        </div>
                                                                        <div className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack border-r border-gray-200">
                                                                            <HiPencil onClick={() => openModal(client.id)} size={20} className="mx-auto hover:cursor-pointer hover:text-greenText duration-300  " />
                                                                            <h1 className=" bg-waterGreenAllBlack  border-gray-200">
                                                                                Editar
                                                                            </h1>
                                                                        </div>
                                                                        <div className="px-3 xl:px-6 py-4 bg-waterGreenAllBlack border-r border-gray-200">
                                                                            <IoMdTrash onClick={() => deleteClient(client.id)} size={20} className="mx-auto hover:cursor-pointer hover:text-backgroundRed duration-300 " />
                                                                            <h1 className="">
                                                                                Eliminar
                                                                            </h1>
                                                                        </div>
                                                                    </div>

                                                                </div>

                                                            )}
                                                        </React.Fragment >
                                                    </>
                                                ))
                                            )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {modal && (
                <Modal isOpen={true} onClose={closeModal}>
                    <ModalUpdateClientNotAllowed closeModal={closeModal} id={clientId} />
                </Modal>
            )}
            {modalView && (
                <Modal isOpen={true} onClose={closeModal}>
                    <ModalView closeModal={closeModal} id={clientId} />
                </Modal>
            )}
            {modalCreate && clientNotAllowed && checkButtonModal && (
                <Modal isOpen={true} onClose={closeModal}>
                    <ModalCreate closeModal={closeModal} object={clientNotAllowed} />
                </Modal>
            )}
            {modalNewRegister && (
                <Modal isOpen={true} onClose={closeModal}>
                    <ModalCreateNotAllowed onClose={closeModal} />
                </Modal>

            )}
        </div >
    );
}

