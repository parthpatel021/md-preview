import * as vscode from "vscode";
import { registerScrollSync } from "./preview/scroll-sync";
import { updateContent } from "./preview/content";

let currentPanel: vscode.WebviewPanel | undefined;
let changeListener: vscode.Disposable | undefined;
let openPanelsCount = 0;

export function createPreviewPanel(context: vscode.ExtensionContext) {
	const editor = vscode.window.activeTextEditor;

	if (!editor || editor.document.languageId !== "markdown") {
		vscode.window.showErrorMessage("Open a .md file to preview.");
		return;
	}

	// Prevent opening if any panel already exists
	if (openPanelsCount > 0) {
		vscode.window.showWarningMessage("Another preview panel is already open.");
		return;
	}

	// Extra safety: reuse if somehow still referenced
	if (currentPanel) {
		try {
			currentPanel.reveal(vscode.ViewColumn.Beside);
			void updateCurrentContent(editor.document.getText());
			return;
		} catch {
			currentPanel = undefined;
		}
	}

	// Create new panel
	const panel = vscode.window.createWebviewPanel(
		"markdownPreview",
		"Markdown Preview",
		vscode.ViewColumn.Beside,
		{
			enableScripts: true,
			retainContextWhenHidden: true,
		},
	);

	currentPanel = panel;
	openPanelsCount++;

	// Cleanup on dispose
	panel.onDidDispose(() => {
		currentPanel = undefined;
		openPanelsCount = Math.max(0, openPanelsCount - 1);


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
		openPanelsCount = Math.max(0, openPanelsCount - 1);
	}
}
