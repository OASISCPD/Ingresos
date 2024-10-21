import { useState } from 'react'
import img from '../imgs/LogoLoginNew.png'
import { login } from "../logic/Login";
import { useNavigate } from "react-router-dom";

/* import { baseUrl } from '../config/BaseUrl';
import { Loading } from '../components/loading/Loading'; */

export function Login() {
    //navigate
    const navigate = useNavigate();
    //loading
    const [loading, setLoading] = useState(false);
    const [id_usuario, setId_usuario] = useState("");
    const [contraseña, setContraseña] = useState("");

    // Función para manejar el envío del formulario
    async function handleSubmit(e: any) {
        setLoading(true)
        e.preventDefault(); // Evita que el formulario se envíe por defecto
        // Imprime los valores de los inputs en la consola
        const result = await login(id_usuario, contraseña, navigate)
        if (result && result.message) {
            setLoading(false)
        } else {
            setLoading(false)
        }
    };

    return (
        <section className=" uppercase textGothamMedium">
            {loading && ( // Mostrar el componente de carga si loading es true
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000 }} className="flex items-center justify-center bg-black bg-opacity-30">
                    <div className="text-center p-8">
                        <div role="status">
                            <svg aria-hidden="true" className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex flex-col items-center justify-center px-6 mx-auto h-screen py-0 bg-waterGreenShadow">

                <div className="w-full bg-customBlackGray rounded-lg shadow-2xl bg-white max-w-md xl:p-0">
                    <div className="space-y-4 lg:space-y-6 py-8 px-12">
                        <p className="flex  items-center justify-center mb-6 text-2xl  text-black ">
                            <img className="  mr-2 w-[12rem]  sm:w-[16rem]" src={img} alt="logo" />
                        </p>
                        <p className="flex  items-center  justify-center  text-xl  text-black ">
                            <h1 className='font-bold'>APP INGRESOS</h1>
                        </p>
                        <form className=" space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="id_usuario" className="block mb-2 text-sm  text-black text-center">Usuario</label>
                                <input
                                    type="text"
                                    id="id_usuario"
                                    name="id_usuario"
                                    value={id_usuario}
                                    onChange={(e) => setId_usuario(e.target.value)}
                                    className="bg-gray-50 border border-sideBarBackgroundOrange text-black text-sm rounded-3xl leading-tight focus:shadow-outline focus:outline-none focus:border-red-200 focus:ring focus:ring-sideBarBackgroundOrange block w-full p-2.5"
                                    placeholder="Legajo"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label htmlFor="contraseña" className="block mb-2 text-sm  text-black text-center">Contraseña</label>
                                <input
                                    type="password"
                                    id="contraseña"
                                    name="contraseña"
                                    value={contraseña}
                                    onChange={(e) => setContraseña(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-gray-50 border  border-sideBarBackgroundOrange text-black text-sm rounded-3xl leading-tight focus:shadow-outline focus:outline-none focus:border-red-200 focus:ring focus:ring-sideBarBackgroundOrange block w-full p-2.5"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full text-white bg-gradient-to-r from-backgroundBlack to-backgroundRed focus:ring-4 focus:outline-none focus:ring-primary-300  rounded-3xl text-sm px-5 py-2.5 text-center"
                                >
                                    Ingresar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
