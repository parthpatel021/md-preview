import * as vscode from "vscode";
import { getHtmlTemplate } from "./html-template";

let markedPromise: Promise<any> | null = null;

async function getMarked() {
	if (!markedPromise) {
		markedPromise = import("marked");
	}
	return markedPromise;
}

export async function updateContent(
	panel: vscode.WebviewPanel,
	markdown: string,
) {
	const { marked } = await getMarked();
	const html = marked.parse(markdown, { async: false }) as string;
	panel.webview.html = getHtmlTemplate(html);
}
