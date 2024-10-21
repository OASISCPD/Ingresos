import { useEffect, useRef, useState } from 'react'
import { Modal } from '../mod/Modal';
import { ModalExcludeMobile } from '../mod/ModalExcludeMobile';
import { getClientsExclude } from '../../logic/Clients';
import { MdQrCodeScanner } from 'react-icons/md';
import { CgSearchFound } from 'react-icons/cg';

interface propExclude {
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
export function ListSelfExcludeMobile() {
    const [maxHeight, setMaxHeight] = useState('400px');
    const [modal, setModal] = useState(false)
    const [excludes, setExcludes] = useState<propExclude[]>([])
    const [dataModal, setDataModal] = useState({})
    const [loading, setLoading] = useState<boolean>(false)
    //constantes de los inputs
    const scannerInputRef = useRef<HTMLInputElement>(null)
    const [inputValue, setInputValue] = useState("");
    //functions inputs
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
            // Aquí puedes hacer lo que necesites con el DNI extraído
            // Llamar manualmente a handleInputChange con el DNI extraído
            handleInputChange({ target: { value: extractedDni } } as React.ChangeEvent<HTMLInputElement>);
        } else {
            // Si no se encuentra el patrón, puedes realizar alguna acción o dejar el campo vacío
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
        // Enfocar el input de escaneo automático cuando el componente se monta
        scannerInputRef.current?.focus();
    }, []);
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
        <> <div className="flex flex-col items-center justify-between my-8  text-base">
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 w-full'>
                <div className=" items-center justify-center col-span-2 sm:col-span-1 sm:my-4">
                    <h1 className="px-2 text-sm sm:text-lg">Scaneo Automatico</h1>
                    <div className="relative">
                        <MdQrCodeScanner
                            className="absolute right-0 top-1.5 pb-1 mr-1 text-waterGreenWhite"
                            size={30}
                        />
                        <input
                            type="text"
                            ref={scannerInputRef}
                            defaultValue={inputValue}
                            className="bg-waterGreenBlack border  border-gray-300 rounded-md py-2 px-4 sm:px-12 placeholder-gray-100 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-backgroundButtonRed z-0 focus:border-transparent w-full"
                            placeholder="Scannear"
                            onChange={(event) => {
                                setInputValue(event.target.value);
                                extractDni(event.target.value);
                            }}
                        />
                    </div>
                </div>
                <div className="  items-center  justify-center col-span-2  sm:col-span-1  sm:my-4">
                    <h1 className="px-2 text-sm sm:text-lg">Ingreso Manual</h1>
                    <div className="relative ">
                        <CgSearchFound
                            className="absolute right-0 top-1.5 pb-1 mr-1 text-black"
                            size={30}
                        />
                        <input
                            type="text"
                            defaultValue={inputValue}
                            className="bg-white border border-gray-300 rounded-md py-2 px-4 sm:px-12 placeholder-gray-500 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-backgroundButtonRed z-0 focus:border-transparent w-full"
                            placeholder="Buscar por DNI"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
        </div>
            {loading ? (
                < div className=' flex animate-pulse  items-center justify-center ' >
                    <div className="flex items-center justify-center min-h-[450px]">
                        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                            <div className="overflow-x-auto scrollbar relative shadow-md rounded-2xl">
                                <table className="w-full text-sm text-left ">
                                    <thead className="text-xs text-white uppercase bg-zinc-300">
                                        <tr>
                                            <th scope="col" className="py-3 px-3">Id</th>
                                            <th scope="col" className="py-3 px-3">Apellido y Nombre</th>
                                            <th scope="col" className="py-3 px-3">Dni</th>
                                            <th scope="col" className="py-3 px-3">Mas Datos</th>
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
                                            </tr>
                                            <tr className=" text-zinc-100 border-b border-colorLine text-sm">
                                                <td className="py-4 px-2">lorem</td>
                                                <td className="py-4 px-2"> lorem</td>
                                                <td className="py-4 px-2"> lorem</td>
                                                <td className="py-4 px-2"> lorem</td>
                                            </tr>
                                            <tr className=" text-zinc-100 border-b border-colorLine text-sm">
                                                <td className="py-4 px-2"> lorem</td>
                                                <td className="py-4 px-2"> lorem</td>
                                                <td className="py-4 px-2"> lorem</td>
                                                <td className="py-4 px-2"> lorem</td>
                                            </tr>
                                            <tr className=" text-zinc-100 border-b border-colorLine text-sm">
                                                <td className="py-4 px-2"> lorem</td>
                                                <td className="py-4 px-2"> lorem</td>
                                                <td className="py-4 px-2"> lorem</td>
                                                <td className="py-4 px-2"> lorem</td>
                                            </tr>
                                            <tr className=" text-zinc-100 border-b border-colorLine text-sm">
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
                                            </tr>
                                            <tr className=" text-zinc-100 border-b border-colorLine text-sm">
                                                <td className="py-4 px-2">lorem</td>
                                                <td className="py-4 px-2"> lorem</td>
                                                <td className="py-4 px-2"> lorem</td>
                                                <td className="py-4 px-2"> lorem</td>
                                            </tr>
                                            <tr className=" text-zinc-100 border-b border-colorLine text-sm">
                                                <td className="py-4 px-2">lorem</td>
                                                <td className="py-4 px-2"> lorem</td>
                                                <td className="py-4 px-2"> lorem</td>
                                                <td className="py-4 px-2"> lorem</td>
                                            </tr>
                                            <tr className=" text-zinc-100 border-b border-colorLine text-sm">
                                                <td className="py-4 px-2">lorem</td>
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
            ) : (
                < div className='flex  items-center justify-center  ' >
                    <div className="flex items-center justify-center min-h-[450px]">
                        <div className="overflow-x-auto relative shadow-md rounded-md sm:rounded-lg">
                            <div style={{ maxHeight: maxHeight, overflowY: 'auto', overflowX: "auto" }} className="overflow-x-auto scrollbar relative   ">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-white uppercase bg-waterGreenBlack">
                                        <tr>
                                            <th scope="col" className="py-3 px-3">Id</th>
                                            <th scope="col" className="py-3 px-3">Apellido y Nombre</th>
                                            <th scope="col" className="py-3 px-3">Dni</th>
                                            <th scope="col" className="py-3 px-3">Mas Datos</th>
                                        </tr>
                                    </thead>
                                    {excludes ? (
                                        <>
                                            <tbody >
                                                {/* MAPEO */}
                                                {excludes.map((exclude) => (
                                                    <tr key={exclude.id_autoexcluido} className="bg-waterGreenWhite text-black border-b text-xs border-colorLine sm:text-sm">
                                                        <td className="py-4 px-2">{exclude.id_autoexcluido}</td>
                                                        <td className="py-4 px-2">{exclude.apellido_nombre}</td>
                                                        <td className="py-4 px-2">{exclude.n_documento}</td>
                                                        <td className="py-4 px-2"><h1 onClick={() => openModal(exclude)} className=' cursor-pointer text-waterGreenShadow'>VER</h1></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan={4}>
                                                <div className="max-w-sm rounded bg-backgroundGrayBlack text-white overflow-hidden shadow-lg">
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
                    {modal && (
                        <Modal isOpen={true} onClose={closeModal}>
                            <ModalExcludeMobile onClose={closeModal} body={dataModal} />
                        </Modal>
                    )}
                </div>
            )}

        </>
    )
}

