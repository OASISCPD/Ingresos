/* import Swal from "sweetalert2"; */
import { ChangeEvent, useState } from "react";
import { baseUrl } from "../../BaseUrl"
/* import { SwalMobile } from "../mod/SwalMobile"; */

export function Test1() {
    const requestOptions: RequestInit = {
        method: "GET",
        credentials: "include" as RequestCredentials, // Agrega esta línea para incluir las cookies en la solicitud
        mode: "cors" as RequestMode, // Agrega esta línea para permitir solicitudes entre dominios
    };
    const test = async (value: number, description: any) => {
        /* await SwalMobile('success', `Cliente ${description} cargado correctamente`, 1000) */
        /* await SwalMobile('success', `Cliente ya cargado anteriormente`, 2000) */
        /*  await SwalMobile('error', `Error al cargar el cliente`, 3000) */
        try {
            const response = await fetch(`${baseUrl}/actualizar_flag?id=1&value=${value}&description=${description}`, requestOptions)
            if (response.status === 200) {
                console.log('valor cambiado a ', value)
            }
            else {
                console.log('error  ')
            }
        } catch (error) {
            console.error(error)
        }
    }
    const test2 = async () => {
        /*    let timerInterval: any; */
        const backgroundOverlay = document.createElement('div');
        backgroundOverlay.classList.add('background-overlay'); // Añade una clase para aplicar estilos

        document.body.appendChild(backgroundOverlay); // Añade el div al final del cuerpo del documento

    };
    const [cadena, setCadena] = useState<string>(''); // Estado para almacenar el valor del input


    // Función para manejar el cambio en el input
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value; // Obtener el nuevo valor del input
        setCadena(newValue); // Actualizar el estado con el nuevo valor
        procesarCadena(newValue); // Llamar a la función para procesar la cadena
        console.log(cadena)
    };
    function procesarCadena(cadena: any) {
        cadena = cadena.replaceAll('"', "@");
        let codigo = cadena.split("@");
        if (codigo[2].length == 1) {
            console.log("Número de documento:", codigo[1]);
            console.log("Apellido:", codigo[4]);
            console.log("Nombre:", codigo[5]);
            console.log("Género:", codigo[8]);
            console.log("Fecha de nacimiento:", codigo[7]
                .replaceAll("-", "/")
                .split("/")
                .reverse()
                .join("-"));
        } else {
            if (codigo[1].length == 1) {
                console.log("Número de documento:", codigo[8]);
                console.log("Apellido:", codigo[5]);
                console.log("Nombre:", codigo[6]);
                console.log("Género:", codigo[7]);
                console.log("Fecha de nacimiento:", codigo[10]
                    .replaceAll("-", "/")
                    .split("/")
                    .reverse()
                    .join("-"));
            } else {
                console.log("Número de documento:", codigo[4]);
                console.log("Apellido:", codigo[1]);
                console.log("Nombre:", codigo[2]);
                console.log("Género:", codigo[3]);
                console.log("Fecha de nacimiento:", codigo[6]
                    .replaceAll("-", "/")
                    .split("/")
                    .reverse()
                    .join("-"));
            }
        }
    }


    return (
        <div>

            <div>
                <button onClick={() => test(1, 27386276)}>CAMBIAR ESTADO a 1</button>
                <button onClick={() => test(1, 29589948)}>CAMBIAR ESTADO a 1 nuevo valor</button>
                <button onClick={() => test(0, 44301493)}>CAMBIAR ESTADO a 0</button>
                <button onClick={() => test2()}>CAMBIAR ESTADO a 0</button>
            </div>
            <div>
                <label htmlFor="cadena">Cadena</label>
                {/* El input llama a handleChange cuando cambia su valor */}
                <input type="text" id="cadena" required onChange={handleChange} />
            </div>
        </div>
    )
}