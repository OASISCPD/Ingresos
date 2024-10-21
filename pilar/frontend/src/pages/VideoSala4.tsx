import { useEffect, useRef, useState } from "react";
import video1 from "../videos/video1.mp4";
import video2 from "../videos/video2.mp4";
import io from 'socket.io-client';
import { unsubscribeFromRefreshEvent, subscribeToRefreshEvent } from "../services/GlobalEventService";
import Swal from "sweetalert2";
import alertSound from '../sounds/sonidoAlerta.mp3'
import { baseUrl } from "../BaseUrl";

export function VideoSala4() {
    //socket
    const socketRef = useRef<any>(null);
    //variable de sonido
    const audioRef = useRef<HTMLAudioElement>(null);
    const playAlertSound = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };
    const pauseAlertSound = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const vidRef = useRef<HTMLVideoElement>(null);
    const playNextVideo = () => {
        setCurrentVideoIndex(prevIndex => (prevIndex + 1) % videos.length);
    };
    const handleEnded = () => {
        playNextVideo();
    };
    useEffect(() => {
        const videoElement = vidRef.current;
        const handleCanPlay = () => {
            videoElement!.play();
        };
        videoElement!.addEventListener('ended', handleEnded);
        videoElement!.addEventListener('canplay', handleCanPlay);
        return () => {
            videoElement!.removeEventListener('ended', handleEnded);
            videoElement!.removeEventListener('canplay', handleCanPlay);
        };
    }, [currentVideoIndex]);
    useEffect(() => {
        const savedVideoIndex = localStorage.getItem('currentVideoIndex');
        const savedVideoTime = localStorage.getItem('currentVideoTime');

        if (savedVideoIndex !== null && savedVideoTime !== null) {
            const newIndex = parseInt(savedVideoIndex, 10);
            const newTime = parseFloat(savedVideoTime);

            setCurrentVideoIndex(newIndex);

            const videoElement = vidRef.current;
            if (videoElement) {
                videoElement.currentTime = newTime;
            }
        }
    }, []);
    useEffect(() => {
        const videoElement = vidRef.current;
        const saveCurrentTime = () => {
            const currentTime = videoElement?.currentTime || 0;
            localStorage.setItem('currentVideoIndex', String(currentVideoIndex));
            localStorage.setItem('currentVideoTime', String(currentTime));
        };
        const interval = setInterval(saveCurrentTime, 500);
        return () => clearInterval(interval);
    }, [currentVideoIndex]);
    useEffect(() => {
        const refreshCallback = () => {
            playNextVideo();
        };
        subscribeToRefreshEvent(refreshCallback);
        // Devuelve una función de limpieza que cancela la suscripción al evento
        return () => {
            unsubscribeFromRefreshEvent(refreshCallback);
        };
    }, [])

    //webSOcket
    useEffect(() => {
        let timerInterval: any;
        socketRef.current = io(`${baseUrl}`); // Cambia la URL a la dirección de tu servidor Flask
        socketRef.current.on('connect', () => {
            console.log('Conectado al servidor  SALA 4');
        });
        socketRef.current.on('disconnect', () => {
            console.log('Desconectado del servidor  SALA 4');
        });
        socketRef.current.on('no_permitido_sala4', async (data: any) => {
            console.log('SALAAA4')
            console.log('Alerta recibida:', data);
            playAlertSound()
            // Aquí puedes manejar la alerta recibida, por ejemplo, mostrando una notificación
            if (data) {
                const { apellido_nombre, n_documento, motivo, caracteristicas_fisicas } = JSON.parse(data);
                await Swal.fire({
                    title: "<h1  style='font-size: 20px;' class='error-title '>¡Persona No Permitida! </h1>",
                    icon: "error",
                    html: `
                <div class='error-content'>
                  <h2 style='font-size: 15px;'><span>${apellido_nombre}</span></h2>
                  <h2 style='font-size: 15px;'><span>${n_documento}</span></h2>
                  <h2 style='font-size: 15px;'><span>${motivo}</span></h2>
                  <h2 style='font-size: 15px;'><span>${caracteristicas_fisicas}</span></h2>
                </div>
              `,
                    showConfirmButton: false,
                    showCloseButton: false,
                    showCancelButton: false,
                    focusConfirm: false,
                    cancelButtonAriaLabel: "Thumbs down",
                    customClass: {
                        icon: 'custom-success-icon',
                        /*   popup: 'custom-modal-alert', */ // Clase personalizada para el contenedor del modal
                    },
                    buttonsStyling: false,
                    allowOutsideClick: false,
                    timer: 10000,
                    timerProgressBar: true,
                    didOpen: () => {
                        const popup = Swal.getPopup();
                        if (popup) {
                            const timer = popup.querySelector("b");
                            if (timer) {
                                timerInterval = setInterval(() => {
                                    timer.textContent = `${Swal.getTimerLeft()}`;
                                }, 100);
                            }
                        }
                    },
                    willClose: async () => {
                        clearInterval(timerInterval);
                        pauseAlertSound()
                        /* stopSound(); */
                    }
                });
                ///cerra el modal
                setTimeout(() => {
                    Swal.close(); // Cerrar el modal utilizando swalResult.close()
                }, 100);
            }
        });
        socketRef.current.on('autoexcluido_sala4', async (data: any) => {
            console.log('SALAAA4')
            playAlertSound()
            // Aquí puedes manejar la alerta recibida, por ejemplo, mostrando una notificación
            if (data) {
                const { apellido_nombre, n_documento, fecha_carga_loteria, sitio } = JSON.parse(data);
                await Swal.fire({
                    title: "<h1  style='font-size: 20px;' class='error-title '>¡Persona AutoExcluida! </h1>",
                    icon: "error",
                    html: `
                <div class='error-content'>
                  <h2 style='font-size: 15px;'><span>${apellido_nombre}</span></h2>
                  <h2 style='font-size: 15px;'><span>${n_documento}</span></h2>
                  <h2 style='font-size: 15px;'><span>${fecha_carga_loteria}</span></h2>
                  <h2 style='font-size: 15px;'><span>${sitio}</span></h2>
                </div>
              `,
                    showConfirmButton: false,
                    showCloseButton: false,
                    showCancelButton: false,
                    focusConfirm: false,
                    cancelButtonAriaLabel: "Thumbs down",
                    customClass: {
                        icon: 'custom-success-icon',
                        /*   popup: 'custom-modal-alert', */ // Clase personalizada para el contenedor del modal
                    },
                    buttonsStyling: false,
                    allowOutsideClick: false,
                    timer: 10000,
                    timerProgressBar: true,
                    didOpen: () => {
                        const popup = Swal.getPopup();
                        if (popup) {
                            const timer = popup.querySelector("b");
                            if (timer) {
                                timerInterval = setInterval(() => {
                                    timer.textContent = `${Swal.getTimerLeft()}`;
                                }, 100);
                            }
                        }
                    },
                    willClose: async () => {
                        clearInterval(timerInterval);
                        pauseAlertSound()
                        /* stopSound(); */

                    }
                });
                ///cerra el modal
                setTimeout(() => {
                    Swal.close(); // Cerrar el modal utilizando swalResult.close()
                }, 100);
            }

        });

        socketRef.current.on('menor_edad_sala4', async (data: any) => {
            console.log('SALAAA4')
            console.log('Alerta recibida:', data);
            playAlertSound();
            if (data) {
                const { apellido, nombre, n_documento, fecha_nacimiento, genero } = JSON.parse(data);
                await Swal.fire({
                    title: "<h1  style='font-size: 20px;' class='error-title '>¡Persona Menor de edad! </h1>",
                    icon: "error",
                    html: `
                <div class='error-content'>
                  <h2 style='font-size: 15px;'><span>${apellido} ${nombre}</span></h2>
                  <h2 style='font-size: 15px;'><span>${n_documento}</span></h2>
                  <h2 style='font-size: 15px;'><span>${fecha_nacimiento}</span></h2>
                  <h2 style='font-size: 15px;'><span>${genero}</span></h2>
                </div>
              `,
                    showConfirmButton: false,
                    showCloseButton: false,
                    showCancelButton: false,
                    focusConfirm: false,
                    cancelButtonAriaLabel: "Thumbs down",
                    customClass: {
                        icon: 'custom-success-icon',
                        /*   popup: 'custom-modal-alert', */ // Clase personalizada para el contenedor del modal
                    },
                    buttonsStyling: false,
                    allowOutsideClick: false,
                    timer: 10000,
                    timerProgressBar: true,
                    didOpen: () => {
                        const popup = Swal.getPopup();
                        if (popup) {
                            const timer = popup.querySelector("b");
                            if (timer) {
                                timerInterval = setInterval(() => {
                                    timer.textContent = `${Swal.getTimerLeft()}`;
                                }, 100);
                            }
                        }
                    },
                    willClose: async () => {
                        clearInterval(timerInterval);
                        pauseAlertSound()
                        /* stopSound(); */

                    }
                });
                ///cerra el modal
                setTimeout(() => {
                    Swal.close(); // Cerrar el modal utilizando swalResult.close()
                }, 100);
            }

            await Swal.fire({
                title: "<h1  style='font-size: 72px;' class='error-title'>¡Persona Menor de edad! </h1>",
                icon: "error",
                html: `
                <div class='error-content'>
                  <h2 style='font-size: 50px;'><span>${data.apellido_nombre}</span></h2>
                  <h2 style='font-size: 50px;'><span>${data.n_documento}</span></h2>
                  <h2 style='font-size: 50px;'><span>${data.fecha_nacimiento}</span></h2>
                </div>
              `,
                showConfirmButton: false,
                showCloseButton: false,
                showCancelButton: false,
                focusConfirm: false,
                cancelButtonAriaLabel: "Thumbs down",
                customClass: {
                    icon: 'custom-success-icon',
                    popup: 'custom-modal-alert', // Clase personalizada para el contenedor del modal
                },
                buttonsStyling: false,
                allowOutsideClick: false,
                timer: 10000,
                timerProgressBar: true,
                didOpen: () => {
                    const popup = Swal.getPopup();
                    if (popup) {
                        const timer = popup.querySelector("b");
                        if (timer) {
                            timerInterval = setInterval(() => {
                                timer.textContent = `${Swal.getTimerLeft()}`;
                            }, 100);
                        }
                    }
                },
                willClose: async () => {
                    clearInterval(timerInterval);
                    pauseAlertSound()
                    /* stopSound(); */

                }
            });
            ///cerra el modal
            setTimeout(() => {
                pauseAlertSound()
                Swal.close(); // Cerrar el modal utilizando swalResult.close()
            }, 100);
            // Aquí puedes manejar la alerta recibida, por ejemplo, mostrando una notificación
        });
        return () => {
            socketRef.current.disconnect();
        };
    }, []);
    ;
    //logica de modal



    const currentVideoSrc = videos[currentVideoIndex].src;
    return (
        <> <audio ref={audioRef} src={alertSound} preload="auto" />
            <video
                key={currentVideoSrc}
                src={currentVideoSrc}
                ref={vidRef}
                muted
                autoPlay
            />
            {/* Botón oculto para reproducir el sonido */}
            <button style={{ display: 'none' }} onClick={playAlertSound}>Reproducir sonido</button>
        </>
    );
}
const videos = [
    { src: video1, id: 1 },
    { src: video2, id: 2 },
];
