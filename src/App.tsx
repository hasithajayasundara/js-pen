import { useEffect, useRef, useState } from 'react';
import * as esbuild from 'esbuild-wasm'
  ;
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
const App = () => {
  const [input, setInput] = useState('');
  const esbuildInitialized = useRef(false);
  const effectCalled = useRef(false);
  const [code, setCode] = useState('');

  const onClick = async () => {
    if (!esbuildInitialized.current) {
      return;
    }
    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
      define: {
        global: 'window',
      },
    });
    setCode(result.outputFiles[0].text);
  };

  const startService = async () => {
    try {
      await esbuild.initialize({ wasmURL: '/esbuild.wasm' });
      esbuildInitialized.current = true;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!effectCalled.current) {
      startService();
      effectCalled.current = true;
    }
  }, []);

  return (
    <div>
      <textarea onChange={(e) => setInput(e.target.value)} />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  )
}

export default App
