import { useState, useEffect } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const Timer = ({ session, tbreak, play, label }) => {
  const [key, setKey] = useState(0); // Estado para el key

  // Función useEffect para actualizar el key cuando time cambia
  useEffect(() => {
    // Incrementa el key para forzar la actualización del componente
    setKey(prevKey => prevKey + 1);
  }, [session, tbreak, label]);


  return (
    <CountdownCircleTimer
      key={key} // Key dinámico
      isPlaying={play}
      duration={label == 'Session' ? session : tbreak} 
      colors={['#F44336']}
      size={250}
      strokeWidth={5}
    />
  );
};

export default Timer;