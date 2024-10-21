import { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../BaseUrl";

interface IsAuthProps {
  children: ReactNode;
  route: string;
}

export const IsAuth = ({ children, route }: IsAuthProps) => {
  const requestOptions: RequestInit = {
    method: "GET",
    credentials: "include" as RequestCredentials, // Agrega esta línea para incluir las cookies en la solicitud
    mode: "cors" as RequestMode, // Agrega esta línea para permitir solicitudes entre dominios
    headers: {},
  };
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/check_session`,
          requestOptions
        );
        if (response.status === 401) {
          // Redirect to login page if not authenticated
          navigate("/");
        } else if (response.status === 200) {
          navigate(route);
        } else {
          console.log("Unhandled status:", response.status);
          navigate("/");
        }
      } catch (error) {
        console.error("Error verifying session:", error);
      }
    };
    checkSession();
  }, [navigate, route]);

  return children;
};

export const IsAuthLogin = ({ children, route }: IsAuthProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${baseUrl}/check_session`, {
          credentials: "include" as RequestCredentials,
        });
        if (response.status === 200) {
          // Redireccionar a la página de inicio de sesión si no hay sesión
          navigate(route);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
      }
    };
    checkSession();
  }, [navigate]);

  return children;
};
