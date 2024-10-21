import { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io';
import { update_security } from '../../../logic/Security';
import { useForm } from 'react-hook-form';
import { SwalMobile } from '../SwalMobile';

type Inputs = {
    apellido_nombre: string;
    emisor: any;
    seguridad: any;
};
interface propModal {
    closeModal: () => void;
    data: any
}

export function ModalEdit(prop: propModal) {
    const valores_Estado = [{ 'value': 'Si', 'string': 'Si' }, { 'value': 'No', 'string': 'No' }]
    const [maxHeight, setMaxHeight] = useState('800px');
    const { register, setValue, getValues } = useForm<Inputs>()
    const handleSave = async () => {
        const updatedData = getValues();
        // Verificar si los campos emisor y seguridad están presentes
        if (!updatedData.emisor || !updatedData.seguridad) {
            await SwalMobile('warning', 'Faltan campos obligatorios', 2000)
            return;
        }
        const id = prop.data.id.toString()
        const response = await update_security(id, updatedData)
        if (!response.ok) {
            await SwalMobile('error', "error al actualizar el personal seleccionado", 3000)
            return
        }
        prop.closeModal()
        await SwalMobile('success', 'Personal actualizado correctamente', 2000)
        window.location.reload()
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia("(orientation: portrait)");
        const handleOrientationChange = (mediaQueryList: MediaQueryListEvent | MediaQueryList) => {
            setMaxHeight(mediaQueryList.matches ? '600px' : '400px');
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
                    <p className='text-center my-2 text-white text-2xl'>Editar Seguridad </p>

                    {prop.data && (
                        <div style={{ maxHeight: maxHeight, overflowY: 'auto', overflowX: "auto" }} className="p-4 scrollbar text-gray-200">
                            <div className="mb-5">
                                <label className="block mb-2 text-sm">Apellido y nombre</label>
                                <input type="input" id="apellido_nombre" {...register('apellido_nombre')} defaultValue={prop.data.apellido_nombre} className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="completa este campo" required />
                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm">Es Emisor</label>
                                <select onChange={(e) => setValue("emisor", e.target.value)} id="emisor" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                    <option  disabled selected>Elegir opción</option>
                                    {valores_Estado.map((data, index) => (
                                        <option key={index} value={data.value}>{data.string}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm">Es Seguridad</label>
                                <select onChange={(e) => setValue("seguridad", e.target.value)} id="seguridad" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                    <option  disabled selected>Elegir opción</option>
                                    {valores_Estado.map((data, index) => (
                                        <option key={index} value={data.value}>{data.string}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex justify-between items-center text-sm'>
                                <div className="modal-footer mt-3 mx-auto  flex justify-center">
                                    <button style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} onClick={prop.closeModal} className="bg-backgroundButtonRed shadow-md hover:bg-red-500 text-white py-2 px-8 rounded-md">
                                        Cancelar
                                    </button>
                                </div>
                                <div className="modal-footer mt-3 mx-auto flex justify-center">
                                    <button style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} onClick={handleSave} className="bg-backgroundButtonGreen shadow-md hover:bg-green-500 text-white py-2 px-8 rounded-md">
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );

}
