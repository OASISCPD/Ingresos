import { useEffect } from 'react';
import io from 'socket.io-client';
import { baseUrl } from '../../BaseUrl';

export const Test3 = () => {
    useEffect(() => {
        const socket = io(`${baseUrl}`); // Cambia la URL a la dirección de tu backend

        socket.on('alert', (data: any) => {
            // Maneja la alerta recibida del backend
            console.log('Alert received:', data);
            // Aquí puedes mostrar una notificación o realizar alguna acción en respuesta a la alerta
        });

        return () => {
            socket.disconnect(); // Desconecta el socket cuando el componente se desmonta
        };
    }, []);

    return (
        <div>
            <h1>App</h1>
            {/* Contenido de tu aplicación */}
        </div>
    );
};
