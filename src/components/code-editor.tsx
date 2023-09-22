import Editor from '@monaco-editor/react';
import * as prettier from 'prettier';
import babel from 'prettier/plugins/babel';
import estree from 'prettier/plugins/estree';

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }) => {

  const handleOnChange = (value?: string) => {
    if (value) {
      onChange(value);
    }
  };

  const onFormatClick = async () => {
    const formatted = await prettier.format(value, {
      parser: 'babel',
      plugins: [babel, estree],
      useTabs: false,
      semi: true,
      singleQuote: true,
    });
    onChange(formatted);
  };

  return (
    <div>
      <button onClick={onFormatClick}>
        Format
      </button>
      <Editor
        onChange={handleOnChange}
        value={value}
        options={{
          tabSize: 2,
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        theme="vs-dark"
        height="50vh"
        defaultLanguage="javascript" />
    </div>
  );
};

export default CodeEditor;
