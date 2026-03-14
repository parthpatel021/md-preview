import * as vscode from "vscode";
import { createPreviewPanel, closePreviewPanel } from "./preview-panel";

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand("md-preview.openPreview", () =>
			createPreviewPanel(context)
		)
	);

	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(editor => {
			// Ignore focus changes that don't involve a text editor (e.g. webview focus).
			if (!editor) return;

			if (editor.document.languageId === "markdown") {
				createPreviewPanel(context);
				return;
			}

			// Only close when switching to a non-markdown text editor.
			closePreviewPanel();
		})
	);

	const activeEditor = vscode.window.activeTextEditor;
	if (activeEditor?.document.languageId === "markdown") {
		createPreviewPanel(context);
	}
}
