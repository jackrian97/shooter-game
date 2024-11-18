import { useEffect, useRef } from 'react';
import createScene from './scenes/Scene';
import './App.css';

function App() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      sceneRef.current = createScene(containerRef.current);
      return () => {
        sceneRef.current.dispose();
        containerRef.current.innerHTML = '';
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}
    ></div>
  );
}

export default App;
