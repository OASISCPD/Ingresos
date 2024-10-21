import React, { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io';
import { baseUrl } from '../../BaseUrl';
import { Dates, getExportParams } from '../../logic/Aforo';
import { SwalMobile } from './SwalMobile';

interface propModal {
    closeModal: () => void;
}
export function ModalExport(prop: propModal) {
    const [desde, setDesde] = useState('');
    const [hasta, setHasta] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateDates(desde, hasta)) {
            console.log('La fecha "desde" no puede ser más reciente que la fecha "hasta".');
            SwalMobile('warning', 'Una o ambas fechas no son válidas', 3000);
            return;
        }
        const body: Dates = { fecha_desde: desde, fecha_hasta: hasta };
        const params = getExportParams(body);
        const url = `${baseUrl}/exportar_ingresos`;
        // Crear un formulario dinámico
        const form = document.createElement('form');
        form.action = url;
        form.method = 'POST';
        form.target = '_blank';
        // Agregar los parámetros como campos ocultos
        params.forEach((value: string, key: string) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
    };
    const validateDates = (desde: string, hasta: string): boolean => {
        const fechaDesde = new Date(desde);
        const fechaHasta = new Date(hasta);
        if (isNaN(fechaDesde.getTime()) || isNaN(fechaHasta.getTime())) {
            console.log('Una o ambas fechas no son válidas.');
            return false;
        }
        if (fechaDesde > fechaHasta) {
            return false;
        }
        return true;
    };
    useEffect(() => {
        console.log(desde, hasta)
    }, [desde, hasta])

    return (
        <section  className="fixed top-0 left-0 w-full h-full flex items-center justify-center  z-500">
            <div className="rounded-xl shadow-xl max-w-md w-full mx-4 md:mx-auto ">
                <div className=" bg-backgroundGray  rounded-lg shadow min-h-60 ">
                    <div className="flex items-center justify-between p-4">
                        <h3 className="text-xl strokeWidth text-white"></h3>
                        <button className="text-white bg-transparent hover:bg-gray-200 hover:text-white rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center " onClick={prop.closeModal}>
                            <IoMdClose size={40} />
                        </button>
                    </div>
                    <div className="p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <label className="block mb-2 text-xl text-center font-medium text-white ">EXPORTAR</label>
                                {/*  <select onChange={handleSelectChange} id="countries" className="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                    {campaigns.map((campaign) => (
                                        <option key={campaign.id_campana}>{campaign.nombre_campana}</option>
                                    ))}
                                </select> */}
                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-white ">Fecha Desde</label>
                                <input type="date" name="desde" id="desde_pacientes" value={desde} onChange={(e) => setDesde(e.target.value)} className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="name@flowbite.com" required />
                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-white ">Fecha Hasta</label>
                                <input type="date" name="hasta" id="hasta_pacientes" value={hasta} onChange={(e) => setHasta(e.target.value)} placeholder="Desde DD-MM-AAAA" className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required />
                            </div>
                            <div className="modal-footer mt-3 flex justify-center">
                                <button type="submit" className="bg-buttonRed rounded-full mx-2 px-8 py-1.5 text-sm xl:text-base 2xl:text-lg shadow-xl  flex items-center text-white" id="boton_pacientes">Exportar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
