import { useEffect, useState } from 'react'
import { Modal } from '../mod/Modal'
import { ModalExcludeDesktop } from '../mod/ModalExcludeDesktop';
import { MdQrCodeScanner } from 'react-icons/md';
import { CgSearchFound } from 'react-icons/cg';
import { BiRefresh } from 'react-icons/bi';
import { getClientsExclude } from '../../logic/Clients';

interface dataExclude {
    apellido_nombre: string;
    detalle: string;
    estado: string;
    fecha_actualizacion: any;
    fecha_carga_loteria: any;
    fecha_creacion: any
    fecha_vencimiento: any;
    id_autoexcluido: number;
    n_documento: number;
    sitio: string;
}

export function ListSelfExclude() {
    const [maxHeight, setMaxHeight] = useState('400px');
    const [modal, setModal] = useState<boolean>(false)
    const [dataModal, setDataModal] = useState({})
    const [loading, setLoading] = useState<boolean>(false);
    //logic inputs
    const [inputValue, setInputValue] = useState("");
    const [excludes, setExcludes] = useState<dataExclude[]>([])
    //boolean check

    //functions
    async function openModal(data: any) {
        await setDataModal(data)
        setModal(true)
    }
    function closeModal() {
        setModal(false)
    }
    async function getExcludes() {
        setLoading(true)
        try {
            const data = await getClientsExclude('');
            await setExcludes(data)
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }
    const extractDni = (inputValue: string) => {
        // Verificar si el inputValue incluye @ o "
        const includesAt = inputValue.includes('@');
        const includesQuote = inputValue.includes('"');
        // Definir el patrón para buscar el DNI de 8 dígitos precedido por " o @
        let pattern;
        if (includesAt && includesQuote) {
            // Si incluye ambos caracteres, usar una expresión regular que coincida con cualquiera de ellos
            pattern = /[@"](\d{8})\s*/;
        } else if (includesAt) {
            // Si solo incluye @, usar una expresión regular que coincida solo con @
            pattern = /@(\d{8})\s*/;
        } else if (includesQuote) {
            // Si solo incluye ", usar una expresión regular que coincida solo con "
            pattern = /"(\d{8})\s*/;
        } else {
            // Si no incluye ninguno de los dos, mostrar un mensaje de error
            return;
        }
        // Buscar el DNI utilizando el patrón
        const match = inputValue.match(pattern);
        // Actualizar el estado del DNI
        if (match && match[1]) {
            const extractedDni = match[1];
            setInputValue(extractedDni); // Actualiza el estado con el DNI extraído
            (true);
            // Aquí puedes hacer lo que necesites con el DNI extraído
            // Llamar manualmente a handleInputChange con el DNI extraído
            handleInputChange({ target: { value: extractedDni } } as React.ChangeEvent<HTMLInputElement>);
        } else {
            // Si no se encuentra el patrón, puedes realizar alguna acción o dejar el campo vacío
            (false)
            // setDniScan("");
        }
    };
    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value.trim();
        // Verificar si el input está vacío
        if (inputValue === '') {
            // Si está vacío, llamar a getExcludes para obtener todos los datos
            await getExcludes();
        } else {
            // Si no está vacío, llamar a getClientsExclude con el valor del input como parámetro
            try {
                const data = await getClientsExclude(inputValue);
                await setExcludes(data);
            } catch (error) {
                console.error(error);
            }
        }
        // Actualizar el estado de inputValue
        setInputValue(inputValue);
        // Restaurar el estado de dniExtracted
        (false);
    };
    useEffect(() => {
        const mediaQuery = window.matchMedia("(orientation: portrait)");
        const handleOrientationChange = (mediaQueryList: MediaQueryListEvent | MediaQueryList) => {
            setMaxHeight(mediaQueryList.matches ? '500px' : '400px');
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
        getExcludes()
    }, [])
    return (
        <>
            <div className="flex items-center justify-between my-4 text-base">
                <div className="flex text-black flex-wrap relative items-center justify-center">
                    <MdQrCodeScanner
                        className="absolute right-6 top-0.5 mt-0 mr-0 text-white"
                        size={24}
                    />
                    <h1>Escanear DNI</h1>
                    <div>
                        <input
                            /* value={inputValue} */
                            onChange={(event) => {
                                setInputValue(event.target.value);
                                extractDni(event.target.value); // Llama a extractDni cada vez que cambia el valor del input
                            }}
                            placeholder="Escanear DNI"
                            className="mx-4 hover:bg-waterGreenAllBlack bg-waterGreenBlack px-4 py-1 rounded-md text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-backgroundButtonRed z-0 focus:border-transparent"
                        />
                    </div>
                </div>
                <div className="border-l-2 border-l-backgroundForm flex items-center justify-center">
                    <h1 className="px-2 text-black">Ingreso Manual</h1>
                    <div className="relative">
                        <CgSearchFound
                            className="absolute right-0 top-0 pb-1 mr-1 text-gray-700"
                            size={30}
                        />
                        <input
                            type="text"
                            defaultValue={inputValue} // Utiliza el valor de inputValue
                            className="bg-white border border-gray-300 rounded-md py-1 px-4 placeholder-gray-500 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-backgroundButtonRed z-0 focus:border-transparent w-64 "
                            placeholder="Buscar DNI manual"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="ml-auto">
                    <BiRefresh
                        onClick={() => window.location.reload()}
                        size={30}
                        className="cursor-pointer text-blueColor hover:text-cyan-700 hover:animate-spin transition-transform duration-75"
                    />
                </div>
            </div>
            {loading ? (
                <>
                    < div className=' flex animate-pulse  items-center justify-center ' >
                        <div className="flex items-center justify-center min-h-[450px]">
                            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                                <div style={{ maxHeight: maxHeight, overflowY: 'auto', overflowX: "auto" }} className="scrollbar overflow-x-auto relative shadow-md rounded-2xl">
                                    <table className="w-full text-sm text-left ">
                                        <thead className="text-xs text-white uppercase bg-zinc-300">
                                            <tr>
                                                <th scope="col" className="py-3 px-3 ">Id</th>
                                                <th scope="col" className="py-3 px-3 ">Apellido y Nombre</th>
                                                <th scope="col" className="py-3 px-3 ">Dni</th>
                                                <th scope="col" className="py-3 px-3 ">detalle</th>
                                                <th scope="col" className="py-3 px-3 ">estado</th>
                                                <th scope="col" className="py-3 px-3 ">fecha_creacion</th>
                                                <th scope="col" className="py-3 px-3 ">fecha_actualizacion</th>
                                                <th scope="col" className="py-3 px-3 ">Mas Datos</th>
                                            </tr>
                                        </thead>
                                        <>
                                            <tbody className='bg-zinc-300'>
                                                {/* MAPEO */}

                                                <tr className=" text-zinc-100 border-b border-colorLine text-sm">
                                                    <td className="py-4 px-2">lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                </tr>

                                                <tr className=" text-zinc-100 border-b border-colorLine text-sm">
                                                    <td className="py-4 px-2">lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                </tr>

                                                <tr className=" text-zinc-100 border-b border-colorLine text-sm">
                                                    <td className="py-4 px-2">lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                </tr>

                                                <tr className=" text-zinc-100 border-b border-colorLine text-sm">
                                                    <td className="py-4 px-2">lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                </tr>

                                                <tr className=" text-zinc-100 border-b border-colorLine text-sm">
                                                    <td className="py-4 px-2">lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                </tr>
                                                <tr className=" text-zinc-100 border-b border-colorLine text-sm">
                                                    <td className="py-4 px-2">lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                    <td className="py-4 px-2"> lorem</td>
                                                </tr>

                                            </tbody>
                                        </>

                                    </table>
                                </div>
                            </div>
                        </div>
                    </div >
                </>

            ) : (
                < div className=' flex  items-center justify-center ' >
                    <div className="flex items-center justify-center min-h-[450px]">
                        <div className="overflow-x-auto relative shadow-md sm:rounded-md">
                            <div style={{ maxHeight: maxHeight, overflowY: 'auto', overflowX: "auto" }} className="scrollbar overflow-x-auto relative shadow-md rounded-2xl">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-white uppercase bg-waterGreenBlack">
                                        <tr>
                                            <th scope="col" className="py-3 px-3">Id</th>
                                            <th scope="col" className="py-3 px-3">Apellido y Nombre</th>
                                            <th scope="col" className="py-3 px-3">Dni</th>
                                            <th scope="col" className="py-3 px-3">detalle</th>
                                            <th scope="col" className="py-3 px-3">estado</th>
                                            <th scope="col" className="py-3 px-3">fecha_creacion</th>
                                            <th scope="col" className="py-3 px-3">fecha_actualizacion</th>
                                            <th scope="col" className="py-3 px-3">Mas Datos</th>
                                        </tr>
                                    </thead>
                                    {excludes ? (
                                        <>
                                            <tbody >
                                                {/* MAPEO */}
                                                {excludes.map((exclude) => (
                                                    <tr key={exclude.id_autoexcluido} className="bg-waterGreenWhite text-black border-b border-colorLine text-sm">
                                                        <td className="py-4 px-2">{exclude.id_autoexcluido}</td>
                                                        <td className="py-4 px-2">{exclude.apellido_nombre}</td>
                                                        <td className="py-4 px-2">{exclude.n_documento}</td>
                                                        <td className="py-4 px-2">{exclude.detalle}</td>
                                                        <td className="py-4 px-2">{exclude.estado}</td>
                                                        <td className="py-4 px-2">{exclude.fecha_creacion}</td>
                                                        <td className="py-4 px-2">{exclude.fecha_actualizacion}</td>
                                                        <td className="py-4 px-2"><h1 onClick={() => openModal(exclude)} className=' cursor-pointer text-waterGreenShadow'>VER</h1></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan={8}>
                                                <div className="max-w-full rounded bg-backgroundGrayBlack text-white overflow-hidden shadow-lg">
                                                    <div className="px-6 py-4">
                                                        <div className="font-bold text-xl mb-2">No se encontro cliente excluido con el dni <span className='text-red-500'>- {inputValue} -</span> </div>
                                                        <p className=" text-base">
                                                            Verifique que el numero de documento haya sido escrito/scaneado correctamente
                                                        </p>
                                                    </div>

                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }

            {
                modal && (
                    <Modal isOpen={true} onClose={closeModal}>
                        <ModalExcludeDesktop onClose={closeModal} body={dataModal} />
                    </Modal>
                )
            }
        </>
    )
}

