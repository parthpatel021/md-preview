# md-preview

Live Markdown preview with tight editor sync. Open a .md file and the preview updates as you type, with bidirectional scroll sync between editor and preview.

## Features

- One-command open preview panel
- Auto-refresh on edit
- Scroll sync: editor -> preview and preview -> editor
- Retains preview state when hidden

## Usage

1. Open any .md file
2. Run command: `Open Markdown Preview` (`md-preview.openPreview`)
3. Edit as usual; the preview updates instantly

The extension also follows the active editor. When you switch to a Markdown file it opens the preview, and when you leave Markdown it closes the preview.

## Commands

- `md-preview.openPreview`: Open or reveal the preview panel

## Requirements

- Visual Studio Code 1.80+ (or your configured `engines.vscode`)
- Uses the `marked` Markdown parser (see Licensing section)

## Extension Settings

This extension does not contribute settings.

## Licensing

This extension bundles and uses the `marked` library. Make sure its license terms are compatible with your distribution and that you preserve any required notices when you package or publish the extension.

## Release Notes

### 0.0.3

- Initial release
