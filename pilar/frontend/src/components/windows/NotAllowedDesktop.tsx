import { useEffect, useState } from "react";
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
import { ModalCreate } from "../mod/ModalCreate";
import Swal from "sweetalert2";
import { SkeletonListDesktopNotAllowed } from "../loading/SkeletonListDesktopNotAllowed";
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
export function NotAllowedDesktop() {
    const [boolean, setBoolean] = useState<boolean>(false);
    const [clients, setClients] = useState<InterfaceClient[]>([]);
    const [clientsNotAllowed, setClientsNotAllowed] = useState<notAllowed[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    //value para el frontlogi
    const [maxHeight, setMaxHeight] = useState('800px');
    //datos del cliente a pasar para no permitido
    const [clientNotAllowed, setClientNotAllowed] = useState<InterfaceClient>();
    /*     const [visible, setVisible] = useState<boolean>(false); */
    const [modalCreate, setModalCreate] = useState<boolean>(false)
    const [modal, setModal] = useState<boolean>(false)
    const [modalView, setModalView] = useState<boolean>(false)
    //check modal
    const [checkButtonModal, setCheckButtonModal] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>(''); // Estado para almacenar el valor del input
    const [typeSearch, setTypeSearch] = useState<string>('n_documento')
    //value client a pasar para actualizar
    const [clientId, setClientId] = useState<number>(0);
    //modal para agregar uno que no este registrado 
    const [modalNewRegister, setModalNewRegister] = useState<boolean>(false)
    //dni a buscar

    function getClient(data: InterfaceClient) {
        /* setSelectedClientDni(data.n_documento); */
        setClientNotAllowed(data)
        setInputValue(data.n_documento); // Actualiza el valor del input cuando se selecciona un cliente
        setBoolean(false); // Cierra la lista al seleccionar un cliente
        setCheckButtonModal(true)
    }
    function openList() {
        setBoolean(true);
        // Muestra la barra lateral después de un pequeño retraso para que la animación se reproduzca correctamente
        /*    const timeout = setTimeout(() => setVisible(true), 100);
           return () => clearTimeout(timeout); */
    }
    function closeList() {
        setBoolean(false)
    }
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
    async function getNotAllowedByType(input: any) {
        const res = await getNotAllowedType(typeSearch, input)
        if (res) {
            const data = await res.json();
            setClientsNotAllowed(data)
        }
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
                    <h1 className=" lg:text-xl xl:text-2xl   text-black ">Agregar registro</h1>
                    <button style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} onClick={() => setModalNewRegister(true)} className="bg-waterGreenBlack shadow-md hover:bg-waterGreenAllBlack text-white py-2 px-12 rounded-md">
                        Agregar no registrado
                    </button>

                </div>

                <div className="relative w-full cursor-default rounded-t-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">
                    <div>
                        <input
                            type="text"
                            className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            placeholder="Buscar por dni..."
                            value={inputValue} // Usa value en lugar de defaultValue
                            onChange={handleInputChange} // Agregar el evento onChange
                            aria-haspopup="listbox"
                            aria-expanded="true"
                            aria-labelledby="listbox-label"
                        />
                    </div>
                    <span onClick={boolean ? () => closeList() : () => openList()} className="cursor-pointer absolute inset-y-0 right-0  flex items-center m-1 px-1 hover:rounded-lg hover:bg-gray-200">
                        {boolean ? (
                            <MdClear /* onClick={closeList} */ size={20} />
                        ) : (
                            <MdKeyboardArrowDown /* onClick={openList} */ size={20} />
                        )}
                    </span>
                </div>
                {boolean && (
                    <ul className={`absolute z-10 max-h-56 w-full overflow-auto rounded-b-md bg-white py-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`} role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
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
                    <button style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} onClick={sendData} className="bg-waterGreenBlack shadow-md hover:bg-waterGreenShadow text-white py-2 px-12 rounded-md">
                        Agregar
                    </button>
                </div>
            )}

            <div className="relative overflow-x-auto my-8 rounded-md bg-waterGreenShadow p-3 xl:p-4">
                <div className="max-w-xl mr-auto ">
                    <div className="mb-2">

                        <div className="text-xs sm:text-base flex  items-center justify-between sm:justify-start text-white uppercase  ">
                            <tr className="mx-auto w-1/2 ">
                                <th scope="col" className="p-2 text-sm">
                                    Buscar por
                                </th>
                            </tr>
                            <select id="type" onChange={handleSelectChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/4  sm:w-1/2 p-1 ">
                                <option value="n_documento">Dni</option>
                                <option value="apellido_nombre">Apellido y nombre</option>
                                <option value="id">n° </option>
                            </select>
                            <input onChange={handleInputSearch} type="email" id="email" className="bg-gray-50 border border-gray-300 mx-2 w-1/3 sm:w-full text-gray-900 text-sm xl:text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-1 " placeholder="Buscar..." required autoComplete="off" />
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
                <div style={{ maxHeight: maxHeight, overflowY: 'auto', overflowX: "auto" }} className="scrollbar relative overflow-x-auto">

                    <table className="w-full  text-left rtl:text-right text-zinc-100 ">
                        <thead className="text-xs xl:text-sm text-white uppercase  ">
                            <tr className="text-center ">
                                <th scope="col" className="px-3 xl:px-6 py-3 ">
                                    Nombre y apellido
                                </th>
                                <th scope="col" className="px-3 xl:px-6 py-3 ">
                                    DNI
                                </th>
                                <th scope="col" className="px-3 xl:px-6 py-3 ">
                                    Fecha y hora de ingreso
                                </th>
                                <th scope="col" className="px-3 xl:px-6 py-3 ">
                                    Estado
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
                                    <SkeletonListDesktopNotAllowed />
                                    <SkeletonListDesktopNotAllowed />
                                    <SkeletonListDesktopNotAllowed />
                                    <SkeletonListDesktopNotAllowed />
                                    <SkeletonListDesktopNotAllowed />
                                    <SkeletonListDesktopNotAllowed />
                                    <SkeletonListDesktopNotAllowed />
                                    <SkeletonListDesktopNotAllowed />
                                    <SkeletonListDesktopNotAllowed />
                                </>

                            ) : (clientsNotAllowed && (
                                <>
                                    {clientsNotAllowed.length === 0 ? (
                                        <div className="  my-8">
                                            <h1>No se encontro cliente no permitido con ese dni</h1>
                                        </div>
                                    ) : (clientsNotAllowed.map((client) => (
                                        <tr key={client.id} className="p-2 border-t border-gray-500 text-center text-xs xl:text-sm">
                                            <th scope="row" className="px-3 xl:px-6  py-4 bg-waterGreenAllBlack   border-r border-l border-gray-200   whitespace-nowrap ">
                                                {client.apellido_nombre}
                                            </th>
                                            <td className="px-3 xl:px-6  py-4 bg-waterGreenAllBlack   border-r  border-gray-200">
                                                {client.n_documento}

                                            </td>
                                            <td className="px-3 xl:px-6  py-4 bg-waterGreenAllBlack   border-r  border-gray-200">
                                                {client.fecha_hora_ingreso}

                                            </td>
                                            <td className="px-3 xl:px-6  py-4 bg-waterGreenAllBlack  text-backgroundButtonGreen  border-r  border-gray-200">
                                                {client.estado}

                                            </td>
                                            <td className="px-3 xl:px-6  py-4 bg-waterGreenAllBlack    border-r  border-gray-200">
                                                <FaRegEye onClick={() => openModalView(client.id)} size={20} className="mx-auto cursor-pointer hover:text-violet-500 duration-300" />
                                            </td>
                                            <td className="px-3 xl:px-6  py-4 bg-waterGreenAllBlack    border-r  border-gray-200">
                                                <HiPencil onClick={() => openModal(client.id)} size={20} className="mx-auto cursor-pointer hover:text-blue-500 duration-300" />

                                            </td>
                                            <td className="px-3 xl:px-6  py-4 bg-waterGreenAllBlack border-r   ">
                                                <IoMdTrash onClick={() => deleteClient(client.id)} size={20} className="mx-auto cursor-pointer hover:text-red-500 duration-300" />

                                            </td>
                                        </tr>
                                    )))}
                                </>
                            ))}

                        </tbody>
                    </table>
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

