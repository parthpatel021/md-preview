import * as vscode from "vscode";
import { marked } from "marked";
import { getHtmlTemplate } from "./html-template";

export function updateContent(panel: vscode.WebviewPanel, markdown: string) {
	const html = marked.parse(markdown, { async: false }) as string;
	panel.webview.html = getHtmlTemplate(html);
}
