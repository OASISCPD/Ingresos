import { useForm } from "react-hook-form";
import { SwalMobile } from "../mod/SwalMobile";
import { getNosis, sendClient, sendClientSala4 } from "../../logic/Clients";
import Swal from "sweetalert2";
/* import alertSound from '../../sounds/sonidoAlerta.mp3' */
import { useState } from "react";
type Inputs = {
    n_documento: string;
    tipo_documento: string;
    genero: string;
    fecha_nacimiento: string;
    cadena: string;
    nombre: string;
    apellido: string;
};

interface ClientNosis {
    VI_DNI: string;
    VI_Apellido: string;
    VI_Nombre: string;
    VI_Sexo: string;
    VI_FecNacimiento: string;
}

interface propManual {
    lugar: string;
}
export function FormManual({ lugar }: propManual) {
    const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm<Inputs>();
    const [moreValues, setMoreValues] = useState<boolean>(false)
    const [clientNosis, setClientNosis] = useState<ClientNosis>()
    const [loading, setLoading] = useState<boolean>(false);
    // reproduce el sonido de alerta
    /* const audio = new Audio(alertSound); */
    //function para detener la rerpoduccion del sonido
    /*  function stopSound() {
         if (audio) {
             audio.pause()
             audio.currentTime = 0
         }
     } */
    async function sendManual() {
        handleSubmit(onSubmit)();

    }

    // Función para manejar el cambio en los inputs
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setValue(name as keyof Inputs, value); // Actualiza el valor del campo en el estado
        setValue('cadena', 'Manual')
    };

    async function getDataNosis() {
        setLoading(true)
        const value = getValues();
        try {
            const res = await getNosis(value.n_documento);
            const data = await res?.json();
            // Verificar si el objeto tiene datos
            if (data && Object.keys(data).length > 0) {
                await setClientNosis(data)
                setMoreValues(true)
                // Aquí puedes manejar el caso cuando el objeto tiene datos
            } else {
                setMoreValues(true)
                setLoading(false)
                await SwalMobile('error', 'No se pudo completar los valores automaticamente, llenarlos a mano', 3000)

                // Aquí puedes manejar el caso cuando el objeto está vacío
            }
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
        finally {
            setLoading(false)
        }
    }

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
                            }
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
                            }
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
                            }
                        },
                        willClose: () => {
                            window.location.reload()
                        }
                    });
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
                            window.location.reload()
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
                const res = await sendClientSala4(data);
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
                            }
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
                            }
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
                            }
                        },
                        willClose: () => {
                            window.location.reload()
                        }
                    });
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
                            window.location.reload()
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

    return (
        <>
            <div className="mx-auto my-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:text-lg items-center">
                <div className="grid grid-cols-1   items-center">
                    {/* <button type="button" onClick={() => setLoading(!loading)}>testing</button> */}
                    <div className="flex flex-col justify-start items-center ">
                        {/* Nro de documento */}
                        <label className="mr-auto text-white">N° de documento: </label>
                        <input autoComplete="off" className="w-full p-2 rounded-lg" defaultValue="" {...register("n_documento")} onChange={handleChange} />
                        {errors.n_documento && <span>This field is required</span>}
                    </div>
                    {!moreValues && (
                        <div>
                            {loading ? (
                                <button
                                    style={{
                                        textShadow: "1px 2px 2px rgba(0,0,0,0.5)",
                                        width: "fit-content", // Usar un ancho fijo o autoajustable
                                    }}
                                    disabled
                                    type="button"
                                    className="flex items-center justify-center mr-auto my-2 sm:my-4 p-2 px-8 bg-buttonSend shadow-md shadow-backgroundGray text-white rounded-lg"
                                >
                                    <svg
                                        aria-hidden="true"
                                        role="status"
                                        className="inline w-4 h-4 text-white animate-spin mr-2"
                                        viewBox="0 0 100 100"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="#E5E7EB"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Buscando...
                                </button>
                            ) : (
                                <button
                                    onClick={getDataNosis}
                                    style={{
                                        textShadow: "1px 2px 2px rgba(0,0,0,0.5)",
                                        width: "fit-content", // Usar un ancho fijo o autoajustable
                                    }}
                                    className="mr-auto my-2 mt-4 sm:my-4  p-2 px-16 bg-buttonSend shadow-md shadow-backgroundGray text-white rounded-lg"
                                    type="button"
                                >
                                    Buscar
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {moreValues && clientNosis && (
                    <>
                        <div className="flex flex-col justify-start items-center ">
                            {/* Nombre */}
                            <label className="mr-auto text-white">Nombre: </label>
                            <input autoComplete="off" className="w-full p-2 rounded-lg" defaultValue={clientNosis.VI_Nombre} {...register("nombre")} onChange={handleChange} />
                            {errors.nombre && <span>This field is required</span>}
                        </div>
                        <div className="flex flex-col justify-start items-center ">
                            {/* Apellido */}
                            <label className="mr-auto text-white">Apellido: </label>
                            <input autoComplete="off" className="w-full p-2 rounded-lg" defaultValue={clientNosis.VI_Apellido} {...register("apellido")} onChange={handleChange} />
                            {errors.apellido && <span>This field is required</span>}
                        </div>
                        <div className="flex flex-col justify-start items-center ">
                            {/* Apellido */}
                            <label className="mr-auto text-white">Genero: </label>
                            <input autoComplete="off" className="w-full p-2 rounded-lg" defaultValue={clientNosis.VI_Sexo} {...register("genero")} onChange={handleChange} />
                            {errors.apellido && <span>This field is required</span>}
                        </div>
                        <div className="flex flex-col justify-start items-center ">
                            {/* Apellido */}
                            <label className="mr-auto text-white">Fecha de nacimiento: </label>
                            <input type="date" autoComplete="off" className="w-full p-2 rounded-lg" defaultValue={clientNosis.VI_FecNacimiento} {...register("fecha_nacimiento")} onChange={handleChange} />
                            {errors.apellido && <span>This field is required</span>}
                        </div>
                        {loading ? (
                            <button
                                style={{
                                    textShadow: "1px 2px 2px rgba(0,0,0,0.5)",
                                    width: "fit-content", // Usar un ancho fijo o autoajustable
                                }}
                                disabled
                                type="button"
                                className="flex items-center justify-center mr-auto my-2 sm:my-4 p-2 px-8 bg-buttonSend shadow-md shadow-backgroundGray text-white rounded-lg"
                            >
                                <svg
                                    aria-hidden="true"
                                    role="status"
                                    className="inline w-4 h-4 text-white animate-spin mr-2"
                                    viewBox="0 0 100 100"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="#E5E7EB"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Enviando...
                            </button>
                        ) : (
                            <button
                                onClick={sendManual}
                                style={{
                                    textShadow: "1px 2px 2px rgba(0,0,0,0.5)",
                                    width: "fit-content", // Usar un ancho fijo o autoajustable
                                }}
                                className="mr-auto my-2 sm:my-4 sm:mt-10 sm:mx-auto p-2 px-16 bg-buttonSend shadow-md shadow-backgroundGray text-white rounded-lg"
                                type="button"
                            >
                                Enviar
                            </button>
                        )}
                        {/*    <button onClick={sendManual} style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} className="mr-auto  my-2 sm:mt-6 sm:mx-auto p-2 px-12 bg-buttonSend shadow-md shadow-backgroundGray text-white rounded-lg" type="button">Guardar</button> */}

                    </>
                )}
                {moreValues && !clientNosis && (
                    <>
                        <div className="flex flex-col justify-start items-center ">
                            {/* Nombre */}
                            <label className="mr-auto text-white">Nombre: </label>
                            <input autoComplete="off" className="w-full p-2 rounded-lg" defaultValue={''} {...register("nombre")} onChange={handleChange} />
                            {errors.nombre && <span>This field is required</span>}
                        </div>
                        <div className="flex flex-col justify-start items-center ">
                            {/* Apellido */}
                            <label className="mr-auto text-white">Apellido: </label>
                            <input autoComplete="off" className="w-full p-2 rounded-lg" defaultValue={''} {...register("apellido")} onChange={handleChange} />
                            {errors.apellido && <span>This field is required</span>}
                        </div>
                        <div className="flex flex-col justify-start items-center ">
                            {/* Apellido */}
                            <label className="mr-auto text-white">Genero: </label>
                            <input autoComplete="off" className="w-full p-2 rounded-lg" defaultValue={''} {...register("genero")} onChange={handleChange} />
                            {errors.apellido && <span>This field is required</span>}
                        </div>
                        <div className="flex flex-col justify-start items-center ">
                            {/* Apellido */}
                            <label className="mr-auto text-white">Fecha de nacimiento: </label>
                            <input type="date" autoComplete="off" className="w-full p-2 rounded-lg" defaultValue={''} {...register("fecha_nacimiento")} onChange={handleChange} />
                            {errors.apellido && <span>This field is required</span>}
                        </div>
                        {loading ? (
                            <button
                                style={{
                                    textShadow: "1px 2px 2px rgba(0,0,0,0.5)",
                                    width: "fit-content", // Usar un ancho fijo o autoajustable
                                }}
                                disabled
                                type="button"
                                className="flex items-center justify-center mr-auto my-2 sm:my-4 p-2 px-8 bg-buttonSend shadow-md shadow-backgroundGray text-white rounded-lg"
                            >
                                <svg
                                    aria-hidden="true"
                                    role="status"
                                    className="inline w-4 h-4 text-white animate-spin mr-2"
                                    viewBox="0 0 100 100"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="#E5E7EB"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Enviando...
                            </button>
                        ) : (
                            <button
                                onClick={sendManual}
                                style={{
                                    textShadow: "1px 2px 2px rgba(0,0,0,0.5)",
                                    width: "fit-content", // Usar un ancho fijo o autoajustable
                                }}
                                className="mr-auto my-2 sm:my-4 sm:mt-10 sm:mx-auto p-2 px-16 bg-buttonSend shadow-md shadow-backgroundGray text-white rounded-lg"
                                type="button"
                            >
                                Enviar
                            </button>
                        )}

                    </>
                )}
            </div>
        </>
    )
}