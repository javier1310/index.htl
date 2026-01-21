import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KaraokeLine from './components/KaraokeText';

// Letras con tiempos y duraciones
const lyricsData = [
  { time: 0, text: "Si perdiera el arco iris, su belleza", duration: 4.5 },
  { time: 4.5, text: "Y las flores, su perfume y su color", duration: 4.0 },
  { time: 8.5, text: "No sería tan inmensa mi tristeza", duration: 4.5 },
  { time: 13.0, text: "Como aquella de quedarme sin tu amor", duration: 4.5 },
  { time: 17.5, text: "Me importas tú, y tú, y tú", duration: 4.0 },
  { time: 21.5, text: "Y solamente tú, y tú, y tú", duration: 4.5 },
  { time: 26.0, text: "Me importas tú, y tú, y tú", duration: 4.0 },
  { time: 30.0, text: "Y nadie más que tú", duration: 4.5 },
  { time: 34.5, text: "Ojos negros, piel canela", duration: 3.5 },
  { time: 38.0, text: "Que me llegan a desesperar", duration: 4.5 },
  { time: 42.5, text: "Me importas tú, y tú, y tú", duration: 4.5 },
  { time: 47.0, text: "Y solamente tú, y tú, y tú", duration: 4.0 },
  { time: 51.0, text: "Me importas tú, y tú, y tú", duration: 4.5 },
  { time: 55.5, text: "Y nadie más que tú", duration: 5.0 },
];

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); 
  
  // Simular el avance del tiempo de la canción
  useEffect(() => {
    if (!isPlaying) return;
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000; // Convertir a segundos
      setCurrentTime(elapsed);
      
      // Detener cuando termine la última línea
      if (elapsed > lyricsData[lyricsData.length - 1].time + lyricsData[lyricsData.length - 1].duration) {
        setIsPlaying(false);
        clearInterval(interval);
      }
    }, 50); // Actualizar cada 50ms para animación suave
    
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  // Encontrar la línea activa basada en el tiempo actual
  let activeLineIndex = lyricsData.findIndex((line, index) => {
    const nextLine = lyricsData[index + 1];
    if (nextLine) {
      return currentTime >= line.time && currentTime < nextLine.time;
    }
    return currentTime >= line.time;
  });

  if (activeLineIndex === -1) activeLineIndex = 0;
  const activeLine = lyricsData[activeLineIndex] || null;

  // Calcular el progreso de la línea actual (0 a 1)
  let progress = 0;
  if (activeLine) {
    const timeInLine = currentTime - activeLine.time;
    progress = Math.min(timeInLine / activeLine.duration, 1);
  }

  return (
    <div className="h-screen w-full bg-black text-[#f3e5ab] flex flex-col items-center justify-center overflow-hidden font-serif relative">
      
      {/* Ambiente de fondo */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 text-4xl animate-bounce delay-1000">♪</div>
        <div className="absolute top-1/3 right-1/4 text-6xl animate-pulse">♫</div>
        <div className="absolute bottom-1/4 left-1/3 text-5xl animate-bounce">♪</div>
      </div>

      {/* Interfaz principal */}
      {!isPlaying ? (
        <div className="text-center z-10 flex flex-col items-center justify-center h-full">
          <button 
            onClick={() => setIsPlaying(true)}
            className="text-9xl mb-8 text-[#f3e5ab] hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_25px_rgba(243,229,171,0.6)] cursor-pointer"
          >
            ▶
          </button>
          
          <h1 className="text-5xl md:text-6xl italic font-bold mb-4 text-[#f3e5ab]">
            Piel Canela
          </h1>
          <p className="text-xl tracking-widest uppercase opacity-70">Experiencia Karaoke</p>
          
          <p className="mt-8 text-yellow-400 text-sm opacity-70">
            Presiona el botón para comenzar
          </p>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 absolute inset-0 text-center z-10">
           
           <div className="max-w-5xl z-20 relative px-4 flex flex-col gap-6 items-center min-h-[50vh] justify-center">
             
             {/* Contenedor de línea activa */}
             <div className="flex flex-col items-center mb-12 min-h-[200px] justify-center relative w-full">
                
                {/* Animación principal de letras */}
                <AnimatePresence mode="wait">
                  {activeLine ? (
                    <motion.div
                      key={activeLineIndex}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -30, scale: 1.1, filter: 'blur(8px)' }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="w-full flex justify-center py-4" 
                    >
                      <div className="text-6xl md:text-8xl font-bold leading-tight drop-shadow-[0_0_30px_rgba(243,229,171,0.4)] text-center px-4">
                         <KaraokeLine 
                            text={activeLine.text} 
                            progress={progress} 
                         />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.span 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 0.5 }}
                      className="text-4xl"
                    >
                      ♪
                    </motion.span>
                  )}
                </AnimatePresence>
             </div>

             {/* Próximas líneas (vista previa) */}
             <div className="flex flex-col gap-4 text-center items-center h-[140px] overflow-hidden">
                <AnimatePresence>
                  {[1, 2].map((offset) => {
                      const nextLine = lyricsData[activeLineIndex + offset];
                      if (!nextLine) return null;
                      return (
                          <motion.p 
                            key={activeLineIndex + offset}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ 
                              opacity: offset === 1 ? 0.5 : 0.25, 
                              y: 0,
                              scale: offset === 1 ? 1 : 0.92
                            }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.6 }}
                            className={`font-medium ${offset === 1 ? 'text-3xl' : 'text-2xl'}`}
                          >
                              {nextLine.text}
                          </motion.p>
                      );
                  })}
                </AnimatePresence>
             </div>

           </div>
           
           {/* Barra de progreso */}
           <div className="absolute bottom-10 left-0 w-full flex justify-center opacity-30 z-10">
             <div className="w-3/4 h-2 bg-gray-800 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-gradient-to-r from-[#f3e5ab] to-[#d4af37]"
                 initial={{ width: '0%' }}
                 animate={{ width: `${(currentTime / 60.5) * 100}%` }}
                 transition={{ duration: 0.1 }}
               />
             </div>
           </div>

           {/* Botón de reinicio */}
           <button 
             onClick={() => {
               setIsPlaying(false);
               setCurrentTime(0);
             }}
             className="absolute top-5 right-5 text-sm opacity-60 hover:opacity-100 z-50 text-[#f3e5ab] border border-[#f3e5ab] px-4 py-2 rounded-full transition-opacity"
           >
             ⟲ REINICIAR
           </button>
           
           {/* Indicador de tiempo */}
           <div className="absolute top-5 left-5 text-sm opacity-40 font-mono text-[#f3e5ab]">
             {Math.floor(currentTime)}s / 60s
           </div>
        </div>
      )}
    </div>
  );
}

export default App;
