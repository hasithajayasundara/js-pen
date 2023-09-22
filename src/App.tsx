import { useEffect, useState } from 'react';

import CodeEditor from './components/code-editor';
import CodePreview from './components/code-preview';
import { Bundler } from './bundler';

const App = () => {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');

  useEffect(() => {
    Bundler.getInstance();
  }, []);

  const handleOnChange = (value: string) => {
    setInput(value);
    Bundler
      .getInstance()
      .transform(value)
      .then((result) => setCode(result.outputFiles[0].text));
  };

  return (
    <div>
      <CodeEditor value={input} onChange={handleOnChange} />
      <CodePreview code={code} />
    </div>
  )
}

export default App
