export function getHtmlTemplate(content: string) {
	return `
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style>
			body {
				max-width: 900px;
				margin: 40px auto;
				padding: 20px;
				font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
				line-height: 1.6;
			}
		</style>
	</head>
	<body>
		${content}

	<script>
		const vscode = acquireVsCodeApi();

		let isScrollingFromEditor = false;
		let lastSentPercent = -1;
		let rafId = 0;

		// Preview -> Editor
		window.addEventListener("scroll", () => {
			if (isScrollingFromEditor) return;
			if (rafId) return;

			rafId = requestAnimationFrame(() => {
				rafId = 0;

				const scrollHeight =
					document.body.scrollHeight - window.innerHeight;

				if (scrollHeight <= 0) return;

				const percent = window.scrollY / scrollHeight;

				// Skip tiny deltas to reduce chatter.
				if (Math.abs(percent - lastSentPercent) < 0.002) return;
				lastSentPercent = percent;

				vscode.postMessage({
					command: "scrollEditor",
					percent
				});
			});
		});

		// Editor -> Preview
		window.addEventListener("message", event => {
			const message = event.data;

			if (message.command === "scrollPreview") {
				const scrollHeight =
					document.body.scrollHeight - window.innerHeight;

				isScrollingFromEditor = true;

				window.scrollTo({
					top: scrollHeight * message.percent,
					behavior: "auto"
				});

				setTimeout(() => {
					isScrollingFromEditor = false;
				}, 50);
			}
		});
	</script>
	</body>
	</html>
	`;
}
