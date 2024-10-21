import { baseUrl } from "../BaseUrl";

export interface dataSecurityDto {
  apellido_nombre: string;
  emisor: string;
  estado: string;
  fecha_actualizacion: any;
  fecha_creacion: any;
  id: number;
  seguridad: string;
}

const requestOptionsGet: RequestInit = {
  method: "GET",
  credentials: "include" as RequestCredentials, // Agrega esta línea para incluir las cookies en la solicitud
  mode: "cors" as RequestMode, // Agrega esta línea para permitir solicitudes entre dominios
};

export async function getSecuritys() {
  try {
    const response = await fetch(
      `${baseUrl}/traer_seguridad`,
      requestOptionsGet
    );
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error(error);
  }
}

interface Security {
  apellido_nombre: string;
  emisor: string;
  seguridad: string;
}

export async function add_security(data: Security) {
  try {
    const body = new URLSearchParams();
    body.append("apellido_nombre", data.apellido_nombre);
    body.append("emisor", data.emisor);
    body.append("seguridad", data.seguridad);

    const requestOptions = {
      method: "POST",
      body: body,
      credentials: "include" as RequestCredentials,
      redirect: "follow" as RequestRedirect,
      mode: "cors" as RequestMode,
      headers: {},
    };
    const response = await fetch(
      `${baseUrl}/agregar_seguridad`,
      requestOptions
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function delete_security(
  id: string,
  estado: string
): Promise<any> {
  try {
    const body = new URLSearchParams();
    body.append("id", id);
    body.append("estado", estado);
    const requestOptions = {
      method: "POST",
      body: body,
      credentials: "include" as RequestCredentials,
      redirect: "follow" as RequestRedirect,
      mode: "cors" as RequestMode,
      headers: {},
    };
    const response = await fetch(
      `${baseUrl}/eliminar_seguridad`,
      requestOptions
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}

interface updateSecuriry {
  apellido_nombre: string;
  emisor: any;
  seguridad: any;
}
export async function update_security(id:string,data: updateSecuriry): Promise<any> {
  try {
    const body = new URLSearchParams();
    body.append("id", id);
    body.append("apellido_nombre", data.apellido_nombre);
    body.append("emisor", data.emisor);
    body.append("seguridad", data.seguridad);
    const requestOptions = {
      method: "POST",
      body: body,
      credentials: "include" as RequestCredentials,
      redirect: "follow" as RequestRedirect,
      mode: "cors" as RequestMode,
      headers: {},
    };

    const response = await fetch(
      `${baseUrl}/actualizar_seguridad`,
      requestOptions
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}
