
interface propModal {
    onClose: () => void;
    body: any;
}

export function ModalExcludeMobile({ onClose, body }: propModal) {
    return (
        <div className="p-4 flex items-center justify-center h-screen text-white">
            <div>
                <div x-show="showModal" className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-backgroundGrayBlack rounded-lg p-6 w-96 max-w-full shadow-lg transform transition-all duration-300">
                        <div className="flex justify-between items-center border-b-2 border-colorLine pb-4">
                            <h2 className="text-xl">{body.apellido_nombre}</h2>
                            <button onClick={onClose} className="text-red-500 hover:text-red-700 focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div className="mt-6 space-y-2 grid grid-cols-2 text-sm ">
                            <div className='col-span-2 border-b border-colorLine flex justify-between items-center'>
                                <p className="">ID</p>
                                <p className="text-left ">{body.id_autoexcluido}</p>
                            </div>
                            <div className='col-span-2 border-b border-colorLine flex justify-between items-center'>
                                <p className="">Dni</p>
                                <p className="text-left ">{body.n_documento}</p>
                            </div>
                            <div className='col-span-2 border-b border-colorLine flex justify-between items-center'>
                                <p className="">Sitio</p>
                                <p className="text-left ">{body.sitio}</p>
                            </div>

                            <div className='col-span-2 border-b border-colorLine flex justify-between items-center'>
                                <p className="">Estado</p>
                                <p className="text-left ">{body.estado}</p>
                            </div>
                            <div className='col-span-2 border-b border-colorLine flex justify-between items-center'>
                                <p className="">Detalle</p>
                                <p className="text-left ">{body.detalle}</p>
                            </div>
                            {/* FECHAS */}
                            <div className='col-span-2 border-b border-colorLine flex justify-between items-center'>
                                <p className="">Fecha de creacion</p>
                                <p className="text-left ">{body.fecha_creacion}</p>
                            </div>
                            <div className='col-span-2 border-b border-colorLine flex justify-between items-center'>
                                <p className="">Fecha de vencimiento</p>
                                <p className="text-left ">{body.fecha_vencimiento}</p>
                            </div>
                            <div className='col-span-2 border-b border-colorLine flex justify-between items-center'>
                                <p className="">Fecha de carga loteria</p>
                                <p className="text-left ">{body.fecha_carga_loteria}</p>
                            </div>
                            <div className='col-span-2 border-b border-colorLine flex justify-between items-center'>
                                <p className="">Fecha de actualizacion</p>
                                <p className="text-left ">{body.fecha_actualizacion}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
