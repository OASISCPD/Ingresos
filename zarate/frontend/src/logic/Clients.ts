import { baseUrl } from "../BaseUrl";
import { InterfaceClient } from "../components/windows/NotAllowedDesktop";

const requestOptions: RequestInit = {
  method: "GET",
  credentials: "include" as RequestCredentials, // Agrega esta línea para incluir las cookies en la solicitud
  mode: "cors" as RequestMode, // Agrega esta línea para permitir solicitudes entre dominios
};

export async function getClients() {
  try {
    const response = await fetch(`${baseUrl}/eventos`, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
export async function getAllClient() {
  try {
    const response = await fetch(
      `${baseUrl}/traer_cliente_x_dni?dni=`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error(error);
  }
}
export async function getClientsExclude(n_documento: any) {
  try {
    const response = await fetch(
      `${baseUrl}/traer_autoexcluidos?nro_doc=${n_documento}`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error", error);
  }
}
export async function get_clients_not_allowed() {
  try {
    const response = await fetch(
      `${baseUrl}/traer_no_permitidos`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
//http://127.0.0.1:5000/actualizar_flag_minors?id=4&value=1&n_documento=412412412&apellido_nombre=asdasdsadas adasioda&fecha_nacimiento=124244
export async function minorsData(
  id: number,
  value: number,
  nro_doc: any,
  apellido_nombre: string,
  fecha_nacimiento: string
) {
  try {
    const response = await fetch(
      `${baseUrl}/actualizar_flag_minors?id=${id}&value=${value}&n_documento=${nro_doc}&apellido_nombre=${apellido_nombre}&fecha_nacimiento=${fecha_nacimiento}`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error(error);
  }
}
export async function getClientByDni(dni: number) {
  try {
    const response = await fetch(
      `${baseUrl}/traer_cliente_x_dni?dni=${dni}`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error(error);
  }
}
export async function changeData(
  id: number,
  value: number,
  nro_doc: any,
  apellido_nombre: string,
  fecha_nacimiento: string,
  sitio: string
) {
  try {
    const response = await fetch(
      `${baseUrl}/actualizar_flag?id=${id}&value=${value}&n_documento=${nro_doc}&apellido_nombre=${apellido_nombre}&fecha_nacimiento=${fecha_nacimiento}&sitio=${sitio}`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function isExclude(dni: any) {
  try {
    const response = await fetch(
      `${baseUrl}/autoexcluido_check?nro_doc=${dni}`,
      requestOptions
    );

    if (response.ok) {
      // Si la respuesta es exitosa (código de estado 200)
      const resultado = await response.json();
      if (resultado.error) {
        // Si la respuesta contiene un mensaje de error
        console.error("Error:", resultado.error);
        return true; // O realiza alguna otra acción apropiada
      } else {
        // Si la respuesta es exitosa y no contiene errores
        return resultado;
      }
    } else if (response.status === 401) {
      // Si la respuesta indica que el recurso no se encontró en autoexcluidos (código de estado 401)
      return false; // O realiza alguna otra acción apropiada
    } else {
      // Si la respuesta no es exitosa y no es código de estado 401
      console.error("Error de solicitud:", response.status);
      return null; // O realiza alguna otra acción apropiada
    }
  } catch (error) {
    // Si ocurre un error durante la solicitud
    console.error("Error:", error);
    throw error;
  }
}
export async function searchByDniNotAllowed(dni: any) {
  try {
    const res = await fetch(
      `${baseUrl}/traer_no_permitidos_x_dni?dni=${dni}`,
      requestOptions
    );
    return res;
  } catch (error) {
    console.error(error);
  }
}
export async function sendClient(dataClient: any) {
  try {
    const body = new URLSearchParams();
    body.append("n_documento", dataClient.n_documento);
    body.append("tipo_documento", dataClient.tipo_documento);
    body.append("apellido", dataClient.apellido);
    body.append("nombre", dataClient.nombre);
    body.append("genero", dataClient.genero);
    body.append("fecha_nacimiento", dataClient.fecha_nacimiento);
    body.append("cadena", dataClient.cadena);

    const requestOptions = {
      method: "POST",
      body: body,
      credentials: "include" as RequestCredentials,
      redirect: "follow" as RequestRedirect,
      mode: "cors" as RequestMode,
      headers: {},
    };
    const response = await fetch(
      `${baseUrl}/registrar_ingreso`,
      requestOptions
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}

function formatFecha(fecha: string): string {
  // Separar la fecha y la hora
  const [fechaPart, horaPart] = fecha.split(" ");
  // Separar el día, mes y año
  const [dia, mes, año] = fechaPart.split("/");

  // Crear una nueva fecha en el formato deseado
  const nuevaFecha = `${año}-${mes}-${dia} ${horaPart}`;

  return nuevaFecha;
}

export async function sendClientSala4(dataClient: any) {
  try {
    const body = new URLSearchParams();
    body.append("n_documento", dataClient.n_documento);
    body.append("tipo_documento", dataClient.tipo_documento);
    body.append("apellido", dataClient.apellido);
    body.append("nombre", dataClient.nombre);
    body.append("genero", dataClient.genero);
    body.append("fecha_nacimiento", dataClient.fecha_nacimiento);
    body.append("cadena", dataClient.cadena);
    const requestOptions = {
      method: "POST",
      body: body,
      credentials: "include" as RequestCredentials,
      redirect: "follow" as RequestRedirect,
      mode: "cors" as RequestMode,
      headers: {},
    };
    const response = await fetch(
      `${baseUrl}/registrar_ingreso_sala4`,
      requestOptions
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function sendClientNotAllowed(data: InterfaceClient) {
  try {
    // Formatear la fecha
    const fechaFormateada = formatFecha(data.fecha_creacion);
    const body = new URLSearchParams();
    body.append("id", data.id_cliente + data.id_cliente);
    body.append("apellido_nombre", data.apellido + data.nombre);
    body.append("id_foreign_key", data.id_cliente);
    body.append("n_documento", data.n_documento);
    body.append("fecha_hora_ingreso", fechaFormateada);
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

export async function getClientNotAllowed(id: number) {
  try {
    const response = await fetch(
      `${baseUrl}/traer_cliente_no_permitido_x_id?id=${id}`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error("Error en la solicitud.");
    }
    if (response.status === 200) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function checkAllowed(dni: any) {
  const requestOptions: RequestInit = {
    method: "GET",
    credentials: "include" as RequestCredentials, // Agrega esta línea para incluir las cookies en la solicitud
    mode: "cors" as RequestMode, // Agrega esta línea para permitir solicitudes entre dominios
  };
  try {
    const res = await fetch(
      `${baseUrl}/check_permitido?n_documento=${dni}`,
      requestOptions
    );
    return res;
  } catch (error) {
    console.error(error);
  }
}

export async function checkDni(dni: any) {
  const requestOptions: RequestInit = {
    method: "GET",
    credentials: "include" as RequestCredentials, // Agrega esta línea para incluir las cookies en la solicitud
    mode: "cors" as RequestMode, // Agrega esta línea para permitir solicitudes entre dominios
  };

  try {
    const res = await fetch(`${baseUrl}/dni_check?dni=${dni}`, requestOptions);
    return res;
  } catch (error) {
    console.error(error);
  }
}

export async function getNosis(dni: any) {
  try {
    const res = await fetch(
      `${baseUrl}/traer_datos_nosis?dni=${dni}`,
      requestOptions
    );
    return res;
  } catch (error) {
    console.error(error);
  }
}

export async function getNotAllowedType(type: any, input: string) {
  try {
    const res = await fetch(
      `${baseUrl}/traer_no_permitidos_x_${type}?${type}=${input}`,
      requestOptions
    );
    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }
    return res;
  } catch (error) {
    throw error;
  }
}
export async function getSecuritysType(type: any, input: string) {
  try {
    const res = await fetch(
      `${baseUrl}/traer_seguridad_x_${type}?${type}=${input}`,
      requestOptions
    );
    if (!res.ok) {
      throw new Error(`Http Error! STatus: ${res.status}`);
    }
    return res;
  } catch (error) {
    throw error;
  }
}
export async function get_client_x_id(id: number) {
  try {
    const res = await fetch(
      `${baseUrl}/traer_cliente_x_id?id=${id}`,
      requestOptions
    );
    if (!res.ok) {
      throw new Error(`Http Error! STatus: ${res.status}`);
    }
    return res;
  } catch (error) {
    console.error(error);
  }
}
