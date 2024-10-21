import { useForm } from "react-hook-form";
import { IoAdd } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { checkDni, sendClient, sendClientSala4 } from "../../logic/Clients";
import { SwalMobile } from "../mod/SwalMobile";
import { FormManual } from "./FormManual";
import Swal from "sweetalert2";
/* import alertSound from '../../sounds/sonidoAlerta.mp3' */
import { useBooleanContext } from "../../context/FormBooleanContext";
import { Button1AforoNotDni } from "../buttons/Button1AforoNotDni";
type Inputs = {
    n_documento: string;
    tipo_documento: string;
    genero: string;
    fecha_nacimiento: string;
    cadena: string;
    nombre: string;
    apellido: string;
};
interface propValue {
    title: string;
    lugar: string
}
export function Form({ title, lugar }: propValue) {
    //boolean del contexto
    const { booleanValue, toggleBooleanValue } = useBooleanContext();
    const [loading, setLoading] = useState<boolean>(false)
    //timeout
    // reproduce el sonido de alerta
    /*  const audio = new Audio(alertSound); */
    //function para detener la rerpoduccion del sonido
    /*     function stopSound() {
            if (audio) {
                audio.pause()
                audio.currentTime = 0
            }
        } */
    //timeout para logica scan
    let timeoutId: number | null = null;
    /*     const { autoExcluidoData, updateAutoExcluidoData, clearAutoExcluidoData } = useAutoExcluidoContext(); */
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<Inputs>();
    const [boolean, setBoolean] = useState<boolean>(false)
    //ref 
    const inputRef = useRef<HTMLInputElement>(null);
    async function onSubmit(data: Inputs) {
        setLoading(true)
        try {
            if (lugar === 'entrada') {
                const res = await sendClient(data)
                if (res?.status === 303) {
                    const body = await res.json();
                    await Swal.fire({
                        title: "<h2 class='error-title'>¡Persona Menor de edad! </h2>",
                        icon: "error",
                        html: `
                          <div class='error-content'>
                              <p><span style='font-size: 15px;'>${body.apellido} ${body.nombre}</span></p>
                              <p><span style='font-size: 15px;'>${body.n_documento}</span></p>
                              <p><span style='font-size: 15px;'>${body.fecha_nacimiento}</span></p>
                              <p style='font-size: 10px;'>Este mensaje desaparecera en  <span><b></b> </span> milisegundos</p>
                          </div>
                      `,
                        showConfirmButton: false,
                        showCloseButton: false,
                        showCancelButton: false,
                        focusConfirm: false,
                        cancelButtonAriaLabel: "Thumbs down",
                        customClass: {
                            icon: 'custom-success-icon',// Clase personalizada para el icono de éxito
                            popup: 'popup-class', // Clase personalizada para el contenedor del modal
                        },
                        buttonsStyling: false,
                        allowOutsideClick: false,
                        timer: 5000, // tiempo de 2000 milisegundos
                        timerProgressBar: true,
                        didOpen: () => {
                            const popup = Swal.getPopup();
                            if (popup) {
                                const timer = popup.querySelector("b");
                                if (timer) {
                                    timer.textContent = `${Swal.getTimerLeft()}`;
                                }
                            }/* {apellido: 'BECCI GATICA', cadena: '00699852110@BECCI GATICA@ALEX MAXIMILIANO@M@44301493@B@08/07/2022@27/01/2023@205', fecha_nacimiento: '2022-07-08', genero: 'M', n_documento: '44301493', …} */
                        },
                        willClose: () => {
                            window.location.reload()
                        }
                    });
                    ///cerra el modal
                    setTimeout(() => {
                        Swal.close(); // Cerrar el modal utilizando swalResult.close()
                    }, 5000);
                }
                else if (res?.status === 302) {
                    const body = await res.json();

                    await Swal.fire({
                        title: "<h2 class='error-title'>¡Persona No permitida! </h2>",
                        icon: "error",
                        html: `
                          <div class='error-content'>
                              <p><span style='font-size: 15px;'>${body.apellido_nombre}</span></p>
                              <p><span style='font-size: 15px;'>${body.n_documento}</span></p>
                              <p><span style='font-size: 15px;'>${body.caracteristicas_fisicas}</span></p>
                              <p><span style='font-size: 15px;'>${body.motivo}</span></p>
                              <p style="margin-top: 4px; margin-bottom: 4px; font-size: 15px;"><a href='/notAllowed' class='error-link'>Lista de No permitidos</a></p>
                              <p style='font-size: 10px;'>Este mensaje desaparecera en  <span><b></b> </span> milisegundos</p>
                          </div>
                      `,
                        showConfirmButton: false,
                        showCloseButton: false,
                        showCancelButton: false,
                        focusConfirm: false,
                        cancelButtonAriaLabel: "Thumbs down",
                        customClass: {
                            icon: 'custom-success-icon',// Clase personalizada para el icono de éxito
                            popup: 'popup-class', // Clase personalizada para el contenedor del modal
                        },
                        buttonsStyling: false,
                        allowOutsideClick: false,
                        timer: 5000, // tiempo de 2000 milisegundos
                        timerProgressBar: true,
                        didOpen: () => {
                            const popup = Swal.getPopup();
                            if (popup) {
                                const timer = popup.querySelector("b");
                                if (timer) {
                                    timer.textContent = `${Swal.getTimerLeft()}`;
                                }
                            }/* {apellido: 'BECCI GATICA', cadena: '00699852110@BECCI GATICA@ALEX MAXIMILIANO@M@44301493@B@08/07/2022@27/01/2023@205', fecha_nacimiento: '2022-07-08', genero: 'M', n_documento: '44301493', …} */
                        },
                        willClose: () => {
                            window.location.reload()
                        }
                    });
                    ///cerra el modal
                    setTimeout(() => {
                        Swal.close(); // Cerrar el modal utilizando swalResult.close()
                    }, 5000);
                }
                else if (res?.status === 301) {
                    const body = await res.json();
                    await Swal.fire({
                        title: "<h2 class='error-title'>¡Persona AutoExcluida! </h2>",
                        icon: "error",
                        html: `
                          <div class='error-content'>
                              <p><span style='font-size: 15px;'>${body.apellido_nombre}</span></p>
                              <p><span style='font-size: 15px;'>${body.n_documento}</span></p>
                              <p><span style='font-size: 15px;'>${body.fecha_carga_loteria}</span></p>
                              <p><span style='font-size: 15px;'>${body.sitio}</span></p>
                              <p style="margin-top: 4px; margin-bottom: 4px; font-size: 15px;"><a href='/autoExclude' class='error-link'>Lista de auto excluidos</a></p>
                              <p style='font-size: 10px;'>Este mensaje desaparecera en  <span><b></b> </span> milisegundos</p>
                          </div>
                      `,
                        showConfirmButton: false,
                        showCloseButton: false,
                        showCancelButton: false,
                        focusConfirm: false,
                        cancelButtonAriaLabel: "Thumbs down",
                        customClass: {
                            icon: 'custom-success-icon',// Clase personalizada para el icono de éxito
                            popup: 'popup-class', // Clase personalizada para el contenedor del modal
                        },
                        buttonsStyling: false,
                        allowOutsideClick: false,
                        timer: 5000, // tiempo de 2000 milisegundos
                        timerProgressBar: true,
                        didOpen: () => {
                            const popup = Swal.getPopup();
                            if (popup) {
                                const timer = popup.querySelector("b");
                                if (timer) {
                                    timer.textContent = `${Swal.getTimerLeft()}`;
                                }
                            }/* {apellido: 'BECCI GATICA', cadena: '00699852110@BECCI GATICA@ALEX MAXIMILIANO@M@44301493@B@08/07/2022@27/01/2023@205', fecha_nacimiento: '2022-07-08', genero: 'M', n_documento: '44301493', …} */
                        },
                        willClose: () => {
                            window.location.reload()
                        }
                    });
                    ///cerra el modal
                    setTimeout(() => {
                        Swal.close(); // Cerrar el modal utilizando swalResult.close()
                    }, 5000);
                }
                else if (res?.status === 304) {
                    await Swal.fire({
                        title: "<h2 class='error-title'>¡Error al escanear! </h2>",
                        icon: "warning",
                        html: `
                          <div class='error-content'>
                              <p><span style='font-size: 15px;'> Por favor escanee nuevamente</span></p>
                              
                              <p style='font-size: 10px;'>Este mensaje desaparecera en  <span><b></b> </span> milisegundos</p>
                          </div>
                      `,
                        showConfirmButton: false,
                        showCloseButton: false,
                        showCancelButton: false,
                        focusConfirm: false,
                        cancelButtonAriaLabel: "Thumbs down",
                        customClass: {
                            icon: 'custom-success-icon',// Clase personalizada para el icono de éxito
                            popup: 'popup-class', // Clase personalizada para el contenedor del modal
                        },
                        buttonsStyling: false,
                        allowOutsideClick: false,
                        timer: 5000, // tiempo de 2000 milisegundos
                        timerProgressBar: true,
                        didOpen: () => {
                            const popup = Swal.getPopup();
                            if (popup) {
                                const timer = popup.querySelector("b");
                                if (timer) {
                                    timer.textContent = `${Swal.getTimerLeft()}`;
                                }
                            }
                        },
                        willClose: () => {
                            /* window.location.reload() */
                        }
                    });
                    ///cerra el modal
                    setTimeout(() => {
                        Swal.close(); // Cerrar el modal utilizando swalResult.close()
                    }, 5000);
                }
                else if (res?.status == 200) {
                    window.location.reload()
                }
                else {
                    console.log('error',)
                }
            }
            else if (lugar === 'sala4') {
                const res = await sendClientSala4(data)
                if (res?.status === 303) {
                    const body = await res.json();
                    await Swal.fire({
                        title: "<h2 class='error-title'>¡Persona Menor de edad! </h2>",
                        icon: "error",
                        html: `
                          <div class='error-content'>
                              <p><span style='font-size: 15px;'>${body.apellido} ${body.nombre}</span></p>
                              <p><span style='font-size: 15px;'>${body.n_documento}</span></p>
                              <p><span style='font-size: 15px;'>${body.fecha_nacimiento}</span></p>
                              <p style='font-size: 10px;'>Este mensaje desaparecera en  <span><b></b> </span> milisegundos</p>
                          </div>
                      `,
                        showConfirmButton: false,
                        showCloseButton: false,
                        showCancelButton: false,
                        focusConfirm: false,
                        cancelButtonAriaLabel: "Thumbs down",
                        customClass: {
                            icon: 'custom-success-icon',// Clase personalizada para el icono de éxito
                            popup: 'popup-class', // Clase personalizada para el contenedor del modal
                        },
                        buttonsStyling: false,
                        allowOutsideClick: false,
                        timer: 5000, // tiempo de 2000 milisegundos
                        timerProgressBar: true,
                        didOpen: () => {
                            const popup = Swal.getPopup();
                            if (popup) {
                                const timer = popup.querySelector("b");
                                if (timer) {
                                    timer.textContent = `${Swal.getTimerLeft()}`;
                                }
                            }/* {apellido: 'BECCI GATICA', cadena: '00699852110@BECCI GATICA@ALEX MAXIMILIANO@M@44301493@B@08/07/2022@27/01/2023@205', fecha_nacimiento: '2022-07-08', genero: 'M', n_documento: '44301493', …} */
                        },
                        willClose: () => {
                            window.location.reload()
                        }
                    });
                    ///cerra el modal
                    setTimeout(() => {
                        Swal.close(); // Cerrar el modal utilizando swalResult.close()
                    }, 5000);
                }
                else if (res?.status === 302) {
                    const body = await res.json();

                    await Swal.fire({
                        title: "<h2 class='error-title'>¡Persona No permitida! </h2>",
                        icon: "error",
                        html: `
                          <div class='error-content'>
                              <p><span style='font-size: 15px;'>${body.apellido_nombre}</span></p>
                              <p><span style='font-size: 15px;'>${body.n_documento}</span></p>
                              <p><span style='font-size: 15px;'>${body.caracteristicas_fisicas}</span></p>
                              <p><span style='font-size: 15px;'>${body.motivo}</span></p>
                              <p style="margin-top: 4px; margin-bottom: 4px; font-size: 15px;"><a href='/notAllowed' class='error-link'>Lista de No permitidos</a></p>
                              <p style='font-size: 10px;'>Este mensaje desaparecera en  <span><b></b> </span> milisegundos</p>
                          </div>
                      `,
                        showConfirmButton: false,
                        showCloseButton: false,
                        showCancelButton: false,
                        focusConfirm: false,
                        cancelButtonAriaLabel: "Thumbs down",
                        customClass: {
                            icon: 'custom-success-icon',// Clase personalizada para el icono de éxito
                            popup: 'popup-class', // Clase personalizada para el contenedor del modal
                        },
                        buttonsStyling: false,
                        allowOutsideClick: false,
                        timer: 5000, // tiempo de 2000 milisegundos
                        timerProgressBar: true,
                        didOpen: () => {
                            const popup = Swal.getPopup();
                            if (popup) {
                                const timer = popup.querySelector("b");
                                if (timer) {
                                    timer.textContent = `${Swal.getTimerLeft()}`;
                                }
                            }/* {apellido: 'BECCI GATICA', cadena: '00699852110@BECCI GATICA@ALEX MAXIMILIANO@M@44301493@B@08/07/2022@27/01/2023@205', fecha_nacimiento: '2022-07-08', genero: 'M', n_documento: '44301493', …} */
                        },
                        willClose: () => {
                            window.location.reload()
                        }
                    });
                    ///cerra el modal
                    setTimeout(() => {
                        Swal.close(); // Cerrar el modal utilizando swalResult.close()
                    }, 5000);
                }
                else if (res?.status === 301) {
                    const body = await res.json();
                    await Swal.fire({
                        title: "<h2 class='error-title'>¡Persona AutoExcluida! </h2>",
                        icon: "error",
                        html: `
                          <div class='error-content'>
                              <p><span style='font-size: 15px;'>${body.apellido_nombre}</span></p>
                              <p><span style='font-size: 15px;'>${body.n_documento}</span></p>
                              <p><span style='font-size: 15px;'>${body.fecha_carga_loteria}</span></p>
                              <p><span style='font-size: 15px;'>${body.sitio}</span></p>
                              <p style="margin-top: 4px; margin-bottom: 4px; font-size: 15px;"><a href='/autoExclude' class='error-link'>Lista de auto excluidos</a></p>
                              <p style='font-size: 10px;'>Este mensaje desaparecera en  <span><b></b> </span> milisegundos</p>
                          </div>
                      `,
                        showConfirmButton: false,
                        showCloseButton: false,
                        showCancelButton: false,
                        focusConfirm: false,
                        cancelButtonAriaLabel: "Thumbs down",
                        customClass: {
                            icon: 'custom-success-icon',// Clase personalizada para el icono de éxito
                            popup: 'popup-class', // Clase personalizada para el contenedor del modal
                        },
                        buttonsStyling: false,
                        allowOutsideClick: false,
                        timer: 5000, // tiempo de 2000 milisegundos
                        timerProgressBar: true,
                        didOpen: () => {
                            const popup = Swal.getPopup();
                            if (popup) {
                                const timer = popup.querySelector("b");
                                if (timer) {
                                    timer.textContent = `${Swal.getTimerLeft()}`;
                                }
                            }/* {apellido: 'BECCI GATICA', cadena: '00699852110@BECCI GATICA@ALEX MAXIMILIANO@M@44301493@B@08/07/2022@27/01/2023@205', fecha_nacimiento: '2022-07-08', genero: 'M', n_documento: '44301493', …} */
                        },
                        willClose: () => {
                            window.location.reload()
                        }
                    });
                    ///cerra el modal
                    setTimeout(() => {
                        Swal.close(); // Cerrar el modal utilizando swalResult.close()
                    }, 5000);
                }
                else if (res?.status === 304) {
                    await Swal.fire({
                        title: "<h2 class='error-title'>¡Error al escanear! </h2>",
                        icon: "warning",
                        html: `
                          <div class='error-content'>
                              <p><span style='font-size: 15px;'> Por favor escanee nuevamente</span></p>
                              
                              <p style='font-size: 10px;'>Este mensaje desaparecera en  <span><b></b> </span> milisegundos</p>
                          </div>
                      `,
                        showConfirmButton: false,
                        showCloseButton: false,
                        showCancelButton: false,
                        focusConfirm: false,
                        cancelButtonAriaLabel: "Thumbs down",
                        customClass: {
                            icon: 'custom-success-icon',// Clase personalizada para el icono de éxito
                            popup: 'popup-class', // Clase personalizada para el contenedor del modal
                        },
                        buttonsStyling: false,
                        allowOutsideClick: false,
                        timer: 5000, // tiempo de 2000 milisegundos
                        timerProgressBar: true,
                        didOpen: () => {
                            const popup = Swal.getPopup();
                            if (popup) {
                                const timer = popup.querySelector("b");
                                if (timer) {
                                    timer.textContent = `${Swal.getTimerLeft()}`;
                                }
                            }
                        },
                        willClose: () => {
                            /* window.location.reload() */
                        }
                    });
                    ///cerra el modal
                    setTimeout(() => {
                        Swal.close(); // Cerrar el modal utilizando swalResult.close()
                    }, 5000);
                }
                else if (res?.status == 200) {
                    window.location.reload()
                }
                else {
                    console.log('error',)
                }
            }

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }

    };
    function booleanModeForm() {
        setBoolean(!boolean)
    }
    //funcion
    const handleCadenaInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        /* procesarCadena(newValue) */
        procesarCadenaNew(newValue)
    }
    function procesarCadenaNew(cadena: any) {
        if (cadena) {
            cadena = cadena.replaceAll('"', "@");
            let codigo = cadena.split("@");
            if (codigo[2].length == 1) {
                let fecha = codigo[7]
                    .replaceAll("-", "/")
                    .split("/")
                    .reverse()
                    .join("-")
                setCadenaValues(cadena, codigo[1], codigo[4], codigo[5], codigo[8], fecha)
            } else {
                if (codigo[1].length == 1) {

                    let fecha = codigo[10]
                        .replaceAll("-", "/")
                        .split("/")
                        .reverse()
                        .join("-")
                    setCadenaValues(cadena, codigo[8], codigo[5], codigo[6], codigo[7], fecha)

                } else {

                    let fecha = codigo[6]
                        .replaceAll("-", "/")
                        .split("/")
                        .reverse()
                        .join("-")
                    setCadenaValues(cadena, codigo[4], codigo[1], codigo[2], codigo[3], fecha)
                }
            }
        }
    }
    async function setCadenaValues(cadena: string, dni: any, apellido: any, nombre: any, genero: any, fecha: any,) {
        await setValue('cadena', cadena)
        await setValue("n_documento", dni);
        await setValue("apellido", apellido);
        await setValue("nombre", nombre);
        await setValue("genero", genero);
        await setValue("fecha_nacimiento", fecha);
        await setValue('tipo_documento', 'DNI');
        if (!isValidDateFormat(fecha)) {
            return
        }

        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(async () => {
            const res = await checkDni(dni);
            if (res?.status === 200) {
                await SwalMobile('success', `Cliente ya cargado anteriormente`, 500)
            }
            else if (res?.status === 404) {
                /* await SwalMobile('success', `Cliente nuevo`, 500) */

            }
            handleSubmit(onSubmit)();
        }, 500)

    }
    //funcion que valida el formato de la fecha
    function isValidDateFormat(dateString: string): boolean {
        // Utiliza expresiones regulares para verificar el formato de fecha YYYY-MM-DD
        const fecha_nacimiento = /^\d{4}-\d{2}-\d{2}$/;
        return fecha_nacimiento.test(dateString);
    }
    useEffect(() => {
        // Función para enfocar el input cuando se monta el componente
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [])
    return (
        <div >
            {/* hero */}
            {loading && (
                <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50 fixed inset-0 z-50">
                    <div role="status" className="flex flex-col items-center">
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
            <div>
                <h1 className="text-3xl mt-8 mb-4 text-black sm:hidden">{title}</h1>
            </div>

            <div className="sm:my-12">
                <h1 className="text-2xl sm:text-3xl font-bold my-2 text-black">
                    Ingresos
                </h1>
                {booleanValue && (
                    <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-waterGreenBlack  rounded-xl shadow-2xl fadeIn">
                        <div onClick={booleanModeForm} style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} className={`flex justify-center focus:outline-none items-center text-base sm:text-xl py-2.5 mx-auto w-full bg-gradient-to-b shadow-md shadow-backgroundGrayBlack ${boolean ? 'from-backgroundButtonRose to-backgroundButtonRed' : 'from-backgroundButtonGreen to-backgroundButtonIngresoManualGradient'} rounded-lg text-white`}>
                            <IoAdd className="mx-1" size={20} /> <h1>{boolean ? 'Ingreso automatico' : 'Ingreso manual'}</h1>
                        </div>
                        <div className="my-4">
                            <Button1AforoNotDni />
                        </div>
                        {/* form automatic */}
                        {boolean ?
                            <>
                                <FormManual lugar={lugar} />
                            </> :
                            <>
                                <div className="my-4 mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:text-xl">
                                    <div className="flex flex-col justify-start items-center sm:col-span-2">
                                        {/* Cadena */}
                                        <label className="mr-auto text-white">Cadena:</label>
                                        <input autoComplete='off' className="w-full p-2 rounded-lg" defaultValue="" {...register("cadena", { onChange: handleCadenaInputChange })} ref={inputRef} />
                                        {errors.cadena && <span>This field is required</span>}
                                    </div>
                                    <div className="flex flex-col justify-start items-center ">
                                        {/* Cadena */}
                                        <label className="mr-auto text-white">Tipo de documento:</label>
                                        <input autoComplete='off' className="w-full p-2 rounded-lg" defaultValue="" {...register("tipo_documento")} />
                                        {errors.tipo_documento && <span>This field is requiredW</span>}
                                    </div>
                                    <div className="flex flex-col justify-start items-center ">
                                        {/* Cadena */}
                                        <label className="mr-auto text-white">N° de documento: </label>
                                        <input autoComplete='off' className="w-full p-2 rounded-lg" defaultValue="" {...register("n_documento")} />
                                        {errors.n_documento && <span>This field is required</span>}
                                    </div>
                                    <div className="flex flex-col justify-start items-center ">
                                        {/* Nombre */}
                                        <label className="mr-auto text-white">Nombre: </label>
                                        <input autoComplete='off' className="w-full p-2 rounded-lg" defaultValue="" {...register("nombre")} />
                                        {errors.nombre && <span>This field is required</span>}
                                    </div>
                                    <div className="flex flex-col justify-start items-center ">
                                        {/* Apellido */}
                                        <label className="mr-auto text-white">Apellido: </label>
                                        <input autoComplete='off' className="w-full p-2 rounded-lg" defaultValue="" {...register("apellido")} />
                                        {errors.apellido && <span>This field is required</span>}
                                    </div>
                                    <div className="flex flex-col justify-start items-center ">
                                        {/* Cadena */}
                                        <label className="mr-auto text-white">Genero: </label>
                                        <input autoComplete='off' className="w-full p-2 rounded-lg" defaultValue="" {...register("genero")} />
                                        {errors.genero && <span>This field is required</span>}
                                    </div>
                                    <div className="flex flex-col justify-start items-center ">
                                        {/* Cadena */}
                                        <label className="mr-auto text-white">Fecha de nacimiento: </label>
                                        <input autoComplete='off' type="date" className="w-full p-2 rounded-lg" defaultValue="" {...register("fecha_nacimiento")} />
                                        {errors.fecha_nacimiento && <span>This field is required</span>}
                                    </div>
                                </div>
                            </>}
                    </form>
                )
                }

                <div className="flex items-center justify-start">
                    <label className="inline-flex items-center cursor-pointer my-4">
                        <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            checked={booleanValue}
                            onChange={toggleBooleanValue}
                        />
                        {/* <div className="relative w-11 h-6 bg-gray-00 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-waterGreenShadow"></div> */}
                        <div className="relative w-11 h-6 bg-waterGreenWhite peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer peer-checked:bg-waterGreenShadow peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>

                    </label>
                    {booleanValue ? (
                        <span className="ms-4  text-base sm:text-xl font-medium text-black">Desactivar toma de datos</span>
                    ) : (
                        <span className="ms-4  text-base sm:text-xl font-medium text-black">Activar toma de datos</span>
                    )}
                </div>
            </div>
        </div>
    )
}
