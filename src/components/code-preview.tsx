import { useEffect, useRef } from 'react';

type CodePreviewProps = {
  code: string;
};

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

const CodePreview: React.FC<CodePreviewProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.srcdoc = html;
      iframeRef.current.contentWindow.postMessage(code, "*");
    }
  }, [code]);

  return (
    <iframe
      title="code preview"
      ref={iframeRef}
      sandbox="allow-scripts"
      srcDoc={html}
    />
  )
}

export default CodePreview;
