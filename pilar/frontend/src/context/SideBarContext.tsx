import React, { createContext, useContext, useState } from 'react';
// Definición de tipo para el contexto
interface SidebarContextType {
    selectedLink: string | null;
    setSelectedLink: React.Dispatch<React.SetStateAction<string | null>>;
}
// Creamos el contexto con el tipo definido
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
// Componente de contexto
export const SideBarContex: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedLink, setSelectedLink] = useState<string | null>(null);
    // Retornamos el proveedor de contexto con los valores de estado
    return (
        <SidebarContext.Provider value={{ selectedLink, setSelectedLink }}>
            {children}
        </SidebarContext.Provider>
    );
};
// Hook personalizado para acceder al contexto
export const useSidebar = (): SidebarContextType => {
    // Usamos el hook useContext con el contexto que creamos
    const context = useContext(SidebarContext);
    // Si el contexto es undefined, lanzamos un error
    if (context === undefined) {
        throw new Error('useSidebar debe ser usado dentro de un SideBarContex.Provider');
    }
    // Retornamos el contexto
    return context;
};
