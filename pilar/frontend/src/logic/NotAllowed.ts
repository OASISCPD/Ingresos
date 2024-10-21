import { baseUrl } from "../BaseUrl";

export function formatFecha(fecha: string): string {
  // Separar la fecha y la hora
  const [fechaPart, horaPart] = fecha.split(" ");
  // Separar el día, mes y año
  const [dia, mes, año] = fechaPart.split("/");

  // Crear una nueva fecha en el formato deseado
  const nuevaFecha = `${año}-${mes}-${dia} ${horaPart}`;

  return nuevaFecha;
}

export type client_not_allowed_DTO = {
  nombre: string;
  apellido: string;
  n_documento: any;
  genero: string;
  fecha_nacimiento: string;
  caracteristicas_fisicas: string;
  tiempo_exclusion: string;
  motivo: string;
  emitido_por: string;
  responsable_seguridad: string;
  estado: string;
  id_imagen: string;
};
export async function insert_client_not_allowed(
  client: client_not_allowed_DTO
) {
  try {
    const body = new URLSearchParams();
    body.append("nombre", client.nombre);
    body.append("apellido", client.apellido);
    body.append("n_documento", client.n_documento);
    body.append("genero", client.genero);
    body.append("fecha_nacimiento", client.fecha_nacimiento);
    body.append("cadena", "manual");
    body.append("tipo_documento", "test");
    // aca se insertaria el cliente y se retornaria el id del ccliente el cual se le pasa la otra funcion
    const requestOptions = {
      method: "POST",
      body: body,
      credentials: "include" as RequestCredentials,
      redirect: "follow" as RequestRedirect,
      mode: "cors" as RequestMode,
      headers: {},
    };
    const response = await fetch(
      `${baseUrl}/intertar_cliente_no_permitido`,
      requestOptions
    );
    return response;
  } catch (error) {
    console.error(error);
  }
} 

export interface InterfaceClient {
  id_cliente: number;
  apellido_nombre: string;
  n_documento: any;
  caracteristicas_fisicas: string;
  tiempo_exclusion: string;
  motivo: string;
  emitido_por: string;
  estado: string;
  responsable_seguridad: string;
  fecha_creacion: string;
  id_image: string;
}

export async function client_not_allowed_complete_values(
  data: InterfaceClient
) {
  try {
    // Formatear la fecha
    const fechaFormateada = formatFecha(data.fecha_creacion);

    const body = new URLSearchParams();
    body.append("apellido_nombre", data.apellido_nombre);
    body.append("id_foreign_key", data.id_cliente.toString()); //id del cliente
    body.append("n_documento", data.n_documento);
    body.append("fecha_hora_ingreso", fechaFormateada);
    body.append("caracteristicas_fisicas", data.caracteristicas_fisicas);
    body.append("tiempo_exclusion", data.tiempo_exclusion);
    body.append("motivo", data.motivo);
    body.append("emitido_por", data.emitido_por);
    body.append("responsable_seguridad", data.responsable_seguridad);
    body.append("estado", data.estado);
    body.append("id_image", data.id_image);

    const requestOptions = {
      method: "POST",
      body: body,
      credentials: "include" as RequestCredentials,
      redirect: "follow" as RequestRedirect,
      mode: "cors" as RequestMode,
      headers: {},
    };
    const response = await fetch(
      `${baseUrl}/insertar_no_permitido`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error("Error en la solicitud.");
    }
    if (response.status === 200 || response.status === 204) {
      return response;
    }
  } catch (error) {
    console.error(error);
  }
}
