// login.ts

import Swal from "sweetalert2";
import { baseUrl } from "../BaseUrl";

export const login = async (
  id_usuario: string,
  contraseña: string,
  navigate: any
) => {
  try {
    const body = new URLSearchParams();
    body.append("id_usuario", id_usuario);
    body.append("contraseña", contraseña);
    const requestOptions = {
      method: "POST",
      body: body,
      credentials: "include" as RequestCredentials,
      redirect: "follow" as RequestRedirect,
      mode: "cors" as RequestMode,
      headers: {},
    };
    const response = await fetch(`${baseUrl}/hacer_login`, requestOptions);
    if (!response.ok) {
      throw new Error("Error en la solicitud.");
    }
    const cookies = response.headers.get("Set-Cookie");
    // Guardar las cookies en el almacenamiento local (localStorage)
    if (cookies) {
      localStorage.setItem("cookies", cookies);
    }
    if (response.status === 200) {
      const result = await response.json();
      if (id_usuario === "seguridad.s4" && contraseña === "1234") {
        navigate("/sala4");
        return result;
      }
      navigate("/home");
      return result;
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      title: "<strong style='color: #FC0D1B'>Credenciales Invalidas</strong>",
      icon: "error",
      iconColor: "#ff0000",
      html: `
          
          <button id="closeBtn" class="w-full text-white bg-gradient-to-r from-backgroundBlack to-backgroundRed focus:ring-4 focus:outline-none focus:ring-primary-300 my-8 rounded-md  px-5 py-2.5 text-center text-xl">Cerrar</button>
        `,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
    });

    document.getElementById("closeBtn")?.addEventListener("click", () => {
      Swal.close();
    });
  }
};
