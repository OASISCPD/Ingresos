import { FiSlash } from 'react-icons/fi'
import { income_register_not_dni } from '../../logic/Aforo'



export function Button1AforoNotDni() {
    async function send() {
       /*  const res = */ await income_register_not_dni();
        /*   console.log(res) */
        window.location.reload()
    }
    return (
        <button type="button" style={{ textShadow: "1px 2px 2px rgba(0,0,0,0.5)" }} onClick={send} className={`flex justify-center items-center shadow-md shadow-backgroundGrayBlack text-base sm:text-lg lg:text-sm xl:text-xl py-2.5 mx-auto w-full bg-gradient-to-b from-backgroundButtonOraenge to-backgroundButtonOraengeGradient rounded-lg text-white shadowText`}>
            <FiSlash className="mx-1" size={20} /> <h1>Ingreso sin DNI</h1>
        </button>
    )
}
