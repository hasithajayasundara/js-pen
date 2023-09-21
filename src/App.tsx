import { useEffect, useRef, useState } from 'react';
import * as esbuild from 'esbuild-wasm';

import { unpkgPathPlugin, fetchPlugin } from './plugins';

const App = () => {
  const [input, setInput] = useState('');
  const esbuildInitialized = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const effectCalled = useRef(false);

  const html = `
    <html>
      <head></head>
        <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event)=>{
            try{
              eval(event.data);
            }catch(err){
              console.error(err);
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color:red"><h4>Runtime error</h4>' + err + '</div>';
            }
          }, false);
        </script>
        </body>
    </html>
  `;

  const onClick = async () => {
    if (!esbuildInitialized.current
      || !iframeRef.current
      || !iframeRef.current.contentWindow
    ) {
      return;
    }
    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        global: 'window',
      },
    });
    iframeRef.current.srcdoc = html;
    iframeRef.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
  };

  const startService = async () => {
    try {
      await esbuild.initialize({
        wasmURL: 'https://unpkg.com/esbuild-wasm@0.19.3/esbuild.wasm',
      });
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
      <iframe
        title="code preview"
        ref={iframeRef}
        sandbox="allow-scripts"
        srcDoc={html}
      />
    </div>
  )
}

export default App
