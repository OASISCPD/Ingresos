import Swal, { SweetAlertIcon } from "sweetalert2";
import "../../index.css";

export function SwalMobile(type: SweetAlertIcon, title: string, time: number): Promise<void> {
    return new Promise((resolve) => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: time,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            },
            heightAuto: true,
            background: "#FFF",
            color: "#FFFFFF",
            customClass: {
                container: 'swal-mobile', // Define una clase personalizada para el contenedor del modal
            },
        });
        Toast.fire({
            icon: type,
            title: title
        }).then(() => {
            resolve();
        });
        // Establecer el zIndex para el modal
        const modalContainer = document.querySelector('.swal-mobile .swal2-container') as HTMLElement;
        if (modalContainer) {
            modalContainer.style.zIndex = '9999'; // Establecer un valor alto para el zIndex
        }
    });
}
