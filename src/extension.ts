import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('Расширение активировано!');

  const sparkleDecorationType = vscode.window.createTextEditorDecorationType({});

  const addSparkleEffect = (editor: vscode.TextEditor, position: vscode.Position) => {
    const afterPosition = position.with(position.line, position.character + 1);

    const range = new vscode.Range(afterPosition, afterPosition);

    const symbols = ['🔥'];
    let currentFrame = 0;

    const animate = () => {
      editor.setDecorations(sparkleDecorationType, [{
        range,
        renderOptions: {
          after: {
            contentText: symbols[currentFrame],
            margin: '0 0 0 3px',
          },
        },
      }]);

      currentFrame = (currentFrame + 1) % symbols.length;
    };

    const intervalId = setInterval(animate, 50);

    setTimeout(() => {
      clearInterval(intervalId);
      editor.setDecorations(sparkleDecorationType, []); // Убираем эффект
    }, 150);
  };

  vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;
    if (editor && event.contentChanges.length > 0) {
      const change = event.contentChanges[0];
      const position = change.range.start;

      console.log('Изменение в документе:', {
        text: change.text,
        position: position,
      });

      addSparkleEffect(editor, position);
    }
  });
}

export function deactivate() {
  console.log('Расширение деактивировано.');
}