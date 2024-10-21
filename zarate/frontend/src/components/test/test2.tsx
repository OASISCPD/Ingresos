import { useEffect } from 'react';
import { useBooleanContext } from '../../context/FormBooleanContext';

export const Test2 = () => {
    // Usamos el hook useBooleanContext para acceder al contexto
    const { booleanValue, toggleBooleanValue } = useBooleanContext();
    useEffect(() => {
        console.log(booleanValue)
    }, [booleanValue])
    return (
        <div>
            <p>Valor del booleano: {booleanValue.toString()}</p>
            <button onClick={toggleBooleanValue}>Cambiar Valor</button>
        </div>
    );
};

