# MystBin | VSCode Extension

* [MystBin](https://mystb.in) is an easy way to share text and code online. With this extension you can paste to MystBin directly from Visual Studio Code.
* [API Documentation](https://mystb.in/api/documentation)


## Features

- Paste full files or text of any language to MystBin with ``>Share`` (`mystbin.share`).
- Editor and Explorer Context Menus for ease of use. Right Click to send to MystBin.
- Select up to **5** snippets in an open editor and send them to MystBin as separate files.
- Automatically copies the paste URL and has a button to open it in your browser.


## Planned

- Editor Icon/Button for quickly saving a workspace or file.
- Fetch and edit existing MystBin pastes via ID or URL.
- Ability to provide your API token for saving pastes to your account.


## Settings

**None currently exist.**


## Release Notes


### 0.0.6

- Added: Extension Configuration Settings
  - Added an option to toggle automatically copying the paste URL to clipboard after saving. Defaults to `true`.
  

### 0.0.5

- Changed: File character limit
  - Changed the character limit from `50_000` to `300_000`.


### 0.0.4

- Changed: Domain
  - Changed the domain to `https://mystb.in`


### 0.0.3

- Added: Editor Context Menu.
  - Right click to upload a file or selection(s). (Max Size of 30_000 bytes per selection && Max Selections of 5)


### 0.0.2

- Added: Explorer Context Menu.
  - Right Click a file in the explorer to upload its contents. (Max Size of 30_000 bytes.)

- Fixed: Filename parsing was inaccurate. Added a parser for better results.


### 0.0.1

- Initial release
  - Basic single file pasting functionality.
  - Basic highlighting/selection based pasting.
  - Copy URL to clipboard.
