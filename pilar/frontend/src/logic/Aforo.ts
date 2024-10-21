import { baseUrl } from "../BaseUrl";

export interface AforoOccupation {
  total_dataaforo: number;
}
const requestOptions: RequestInit = {
  method: "GET",
  credentials: "include" as RequestCredentials,
  mode: "cors" as RequestMode,
};
export async function income_register(value: number) {
  try {
    const res = await fetch(
      `${baseUrl}/registrar_ingreso_aforo?cantidad_ingreso=${value}`,
      requestOptions
    );
    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }
    return res;
  } catch (error) {
    console.error(error);
  }
}

export async function income_register_sala4(value: number) {
  try {
    const res = await fetch(
      `${baseUrl}/registrar_ingreso_aforo_sala4?cantidad_ingreso=${value}`,
      requestOptions
    );
    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }
    return res;
  } catch (error) {
    console.error(error);
  }
}

export async function egress_register(value: number) {
  try {
    const res = await fetch(
      `${baseUrl}/registrar_egreso?cantidad_egreso=${value}`,
      requestOptions
    );
    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }
    return res;
  } catch (error) {
    console.error(error);
  }
}
export async function egress_register_sala4(value: number) {
  try {
    const res = await fetch(
      `${baseUrl}/registrar_egreso_sala4?cantidad_egreso=${value}`,
      requestOptions
    );
    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }
    return res;
  } catch (error) {
    console.error(error);
  }
}

export async function currentOccupation() {
  try {
    const res = await fetch(`${baseUrl}/ocupacion_actual`, requestOptions);
    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }
    const data = await res?.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function income_register_not_dni() {
  try {
    const res = await fetch(
      `${baseUrl}/registrar_ingreso_aforo_nodni?cantidad_ingreso=1`,
      requestOptions
    );
    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }
    return res;
  } catch (error) {
    console.error(error);
  }
}

//sala4
export async function income_register_not_dni_sala4() {
  try {
    const res = await fetch(
      `${baseUrl}/registrar_ingreso_aforo_nodni_sala4?cantidad_ingreso=1`,
      requestOptions
    );
    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }
    return res;
  } catch (error) {
    console.error(error);
  }
}

export interface capacity_of_the_day_interface {
  aforo_maximo: number;
  egresos: number;
  fecha: string;
  hora: number;
  ingresos: number;
}
export interface total_of_the_day_interface {
  egresos: number;
  ingresos: number;
}
//consumir valores

export async function capacity_of_the_day() {
  try {
    const res = await fetch(`${baseUrl}/aforo_del_dia`, requestOptions);
    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }
    return res;
  } catch (error) {
    console.error(error);
  }
}

export async function total_of_the_day() {
  try {
    const res = await fetch(`${baseUrl}/totales_del_dia`, requestOptions);
    if (!res.ok) {
      throw new Error(`Http Error! Status: ${res.status}`);
    }
    return res;
  } catch (error) {
    console.error(error);
  }
}
export async function total_ocupation() {
  try {
    const res = await fetch(`${baseUrl}/ocupacion_actual`, requestOptions);
    if (!res.ok) {
      throw new Error(`Http Error! Status: ${res.status}`);
    }
    return res;
  }
  catch (error) {
    console.error(error);
  }
}
export interface Dates {
  fecha_desde: string;
  fecha_hasta: string;
}

export function getExportParams(date: Dates): URLSearchParams {
  const params = new URLSearchParams();
  params.append("fecha_desde", date.fecha_desde);
  params.append("fecha_hasta", date.fecha_hasta);

  return params;
}
