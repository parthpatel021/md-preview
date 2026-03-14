import * as vscode from "vscode";

export function registerScrollSync(
	panel: vscode.WebviewPanel,
	context: vscode.ExtensionContext,
) {
	const receiveListener = panel.webview.onDidReceiveMessage(message => {
		if (message.command === "scrollEditor") {
			const activeEditor = vscode.window.activeTextEditor;
			if (!activeEditor) return;

			const totalLines = activeEditor.document.lineCount;
			const maxIndex = Math.max(0, totalLines - 1);
			const safePercent = Math.max(0, Math.min(1, message.percent || 0));
			const line = Math.round(safePercent * maxIndex);

			activeEditor.revealRange(
				new vscode.Range(line, 0, line, 0),
				vscode.TextEditorRevealType.AtTop,
			);
		}
	});

	let pendingPercent: number | null = null;
	let postTimer: NodeJS.Timeout | null = null;
	let lastSentPercent = -1;

	const visibleListener =
		vscode.window.onDidChangeTextEditorVisibleRanges(event => {
			const editor = event.textEditor;

			if (editor.document.languageId !== "markdown") return;

			const totalLines = editor.document.lineCount;
			const maxIndex = Math.max(0, totalLines - 1);
			const firstVisibleLine = editor.visibleRanges[0]?.start.line ?? 0;
			const percent = maxIndex > 0 ? firstVisibleLine / maxIndex : 0;

			pendingPercent = percent;

			if (postTimer) return;

			postTimer = setTimeout(() => {
				postTimer = null;
				if (pendingPercent === null) return;

				if (Math.abs(pendingPercent - lastSentPercent) < 0.002) return;
				lastSentPercent = pendingPercent;

				panel.webview.postMessage({
					command: "scrollPreview",
					percent: pendingPercent,
				});
			}, 16);
		});

	context.subscriptions.push(receiveListener, visibleListener);
}
