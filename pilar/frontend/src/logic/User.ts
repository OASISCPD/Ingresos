import { baseUrl } from "../BaseUrl";
import { NavigateFunction } from "react-router-dom"; // Importa NavigateFunction desde react-router-dom

export async function getUserInSession() {
  try {
    const res = await fetch(`${baseUrl}/user`, {
      method: "GET", // Puedes ajustar el método según tu implementación en el servidor
      credentials: "include", // Asegúrate de incluir las cookies
      redirect: "follow",
    });
    const data = res.text();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function Logout(navigate: NavigateFunction) {
  // Pasa navigate como parámetro
  try {
    const response = await fetch(`${baseUrl}/logout`, {
      method: "GET",
      credentials: "include",
      redirect: "follow",
    });
    if (!response.ok) {
      throw new Error("Error al intentar cerrar sesión.");
    }
    localStorage.removeItem("cookies");
    navigate("/"); // Utiliza navigate para redirigir
  } catch (error) {
    console.error("Error al intentar cerrar sesión:", error);
  }
}
