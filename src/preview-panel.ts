import * as vscode from "vscode";
import { registerScrollSync } from "./preview/scroll-sync";
import { updateContent } from "./preview/content";

let currentPanel: vscode.WebviewPanel | undefined;
let changeListener: vscode.Disposable | undefined;

export function createPreviewPanel(context: vscode.ExtensionContext) {
	const editor = vscode.window.activeTextEditor;

	if (!editor || editor.document.languageId !== "markdown") {
		vscode.window.showErrorMessage("Open a .md file to preview.");
		return;
	}

	// If panel already exists, reveal it
	if (currentPanel) {
		currentPanel.reveal(vscode.ViewColumn.Beside);
		void updateCurrentContent(editor.document.getText());
		return;
	}

	currentPanel = vscode.window.createWebviewPanel(
		"markdownPreview",
		"Markdown Preview",
		vscode.ViewColumn.Beside,
		{
			enableScripts: true,
			retainContextWhenHidden: true,
		},
	);

	currentPanel.onDidDispose(() => {
		currentPanel = undefined;

		// Dispose listener when panel closes
		if (changeListener) {
			changeListener.dispose();
			changeListener = undefined;
		}
	});

	registerScrollSync(currentPanel, context);

	// Auto refresh while typing
	const docChangeListener = vscode.workspace.onDidChangeTextDocument(event => {
		if (
			currentPanel &&
			event.document === vscode.window.activeTextEditor?.document &&
			event.document.languageId === "markdown"
		) {
			void updateCurrentContent(event.document.getText());
		}
	});

	changeListener = docChangeListener;
	context.subscriptions.push(docChangeListener);

	void updateCurrentContent(editor.document.getText());
}

async function updateCurrentContent(markdown: string) {
	if (!currentPanel) return;
	await updateContent(currentPanel, markdown);
}

export function closePreviewPanel() {
	if (currentPanel) {
		currentPanel.dispose();
		currentPanel = undefined;
	}
}
