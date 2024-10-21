import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface BooleanContextType {
    booleanValue: boolean;
    toggleBooleanValue: () => void;
}
// Creamos el contexto
const BooleanContext = createContext<BooleanContextType>({
    booleanValue: false,
    toggleBooleanValue: () => { }
});
// Hook personalizado para acceder al contexto
export const useBooleanContext = () => useContext(BooleanContext);
// Proveedor del contexto
export const BooleanProvider = ({ children }: { children: ReactNode }) => {
    // Estado para almacenar el booleano
    const [booleanValue, setBooleanValue] = useState(() => {
        // Intentamos obtener el valor del localStorage al inicio
        const storedValue = localStorage.getItem('booleanValue');
        // Si hay un valor en el localStorage, lo devolvemos parseado como booleano, de lo contrario, devolvemos false
        return storedValue ? JSON.parse(storedValue) : false;
    });
    // Función para cambiar el valor del booleano
    const toggleBooleanValue = () => {
        setBooleanValue((prevValue: boolean) => {
            const newValue = !prevValue;
            // Guardamos el nuevo valor en el localStorage
            localStorage.setItem('booleanValue', JSON.stringify(newValue));
            return newValue;
        });
    };
    // Efecto para guardar el valor del booleano en el localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('booleanValue', JSON.stringify(booleanValue));
    }, [booleanValue]);
    return (
        <BooleanContext.Provider value={{ booleanValue, toggleBooleanValue }}>
            {children}
        </BooleanContext.Provider>
    );
};
