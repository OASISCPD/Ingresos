// AppContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

type DataType = {
    nombre: string;
    fecha: string;
    motivo: string;
};

type ContextType = {
    data: DataType;
    updateData: (newData: DataType) => void;
};

const defaultData: DataType = {
    nombre: '',
    fecha: '',
    motivo: ''
};

const AppContext = createContext<ContextType | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext debe ser utilizado dentro de un AppProvider');
    }
    return context;
};

type AppProviderProps = {
    children: React.ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [data, setData] = useState<DataType>(() => {
        const storedData = localStorage.getItem('appData');
        return storedData ? JSON.parse(storedData) : defaultData;
    });

    useEffect(() => {
        localStorage.setItem('appData', JSON.stringify(data));
    }, [data]);

    const updateData = (newData: DataType) => {
        setData(newData);
    };

    return (
        <AppContext.Provider value={{ data, updateData }}>
            {children}
        </AppContext.Provider>
    );
};
