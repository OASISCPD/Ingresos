import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AutoExcluidoContextType {
    autoExcluidoData: { nombre: string; fecha: string; motivo: string };
    updateAutoExcluidoData: (newData: { nombre: string; fecha: string; motivo: string }) => void;
    clearAutoExcluidoData: () => void;
    registerObserver: (observer: () => void) => () => void;
    dataUpdated: boolean;
    setDataUpdated: (value: boolean) => void;
}

const AutoExcluidoContext = createContext<AutoExcluidoContextType | undefined>(undefined);

export const AutoExcluidoContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [autoExcluidoData, setAutoExcluidoData] = useState<{ nombre: string; fecha: string; motivo: string }>(() => {
        const storedData = localStorage.getItem("autoExcluidoData");
        return storedData ? JSON.parse(storedData) : { nombre: '', fecha: '', motivo: '' };
    });

    const [dataUpdated, setDataUpdated] = useState(false); // Mover aquí

    const [observers, setObservers] = useState<(() => void)[]>([]);

    const updateAutoExcluidoData = (newData: { nombre: string; fecha: string; motivo: string }) => {
        setAutoExcluidoData(newData);
        setDataUpdated(true); // Establecer dataUpdated en true cuando se actualicen los datos
        localStorage.setItem("autoExcluidoData", JSON.stringify(newData));
        // Llamar a todos los observadores registrados cuando cambia autoExcluidoData
        observers.forEach(observer => observer());
    };


    const clearAutoExcluidoData = () => {
        setAutoExcluidoData({ nombre: '', fecha: '', motivo: '' });
        localStorage.removeItem("autoExcluidoData");
        setDataUpdated(false);
        // Llamar a todos los observadores registrados cuando cambia autoExcluidoData
        observers.forEach(observer => observer());
    };

    useEffect(() => {
        localStorage.setItem("autoExcluidoData", JSON.stringify(autoExcluidoData));
    }, [autoExcluidoData]);

    // Función para registrar un observador
    const registerObserver = (observer: () => void) => {
        setObservers(prevObservers => [...prevObservers, observer]);
        // Devolver una función para desregistrar el observador
        return () => {
            setObservers(prevObservers => prevObservers.filter(prevObserver => prevObserver !== observer));
        };
    };

    return (
        <AutoExcluidoContext.Provider value={{ autoExcluidoData, updateAutoExcluidoData, clearAutoExcluidoData, registerObserver, dataUpdated, setDataUpdated }}>
            {children}
        </AutoExcluidoContext.Provider>
    );
};

export const useAutoExcluidoContext = () => {
    const context = useContext(AutoExcluidoContext);
    if (!context) {
        throw new Error("useAutoExcluidoContext debe ser usado dentro de un AutoExcluidoContextProvider");
    }
    return context;
};
