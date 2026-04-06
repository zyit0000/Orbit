# Orbit Editor Build Instructions (Tauri v2)

To build Orbit as a high-performance desktop application with a custom frameless topbar for macOS (Intel, ARM, Universal) and Windows 11, follow these steps.

## 1. Prerequisites
- **Rust**: Install Rust from [rustup.rs](https://rustup.rs/).
- **Node.js**: Install Node.js.
- **Tauri CLI**: Install the Tauri v2 CLI globally or use `npx`.

```bash
npm install -g @tauri-apps/cli@latest
```

## 2. Local Development
To run the app in development mode:

```bash
npm run dev # Start the frontend
npx tauri dev # Start the Tauri desktop window
```

## 3. GitHub Workflow (`.github/workflows/tauri-build.yml`)
Use this workflow to build for all platforms automatically.

```yaml
name: Build Desktop App (Tauri v2)
on: [push]

jobs:
  build:
    strategy:
      fail-fast: false
      matrix:
        platform: [macos-latest, windows-latest]
    runs-on: ${{ matrix.platform }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Install Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install Rust
        uses: dtolnay/rust-toolchain@stable
      - name: Install Frontend Dependencies
        run: npm install
      - name: Build App
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tagName: v__VERSION__
          releaseName: "Orbit v__VERSION__"
          releaseBody: "See the assets below to download the latest version of Orbit."
          releaseDraft: true
          prerelease: false
```

## 4. Configuration Highlights
- **Tauri v2**: The app is built using Tauri v2 for better performance and security.
- **Frameless Window**: Configured in `src-tauri/tauri.conf.json` with `"decorations": false` and `"transparent": true`.
- **Drag Region**: The topbar in `App.tsx` uses `style={{ WebkitAppRegion: 'drag' }}` to allow moving the window.
- **Multi-Arch macOS**: The GitHub Action handles building for both Intel and Apple Silicon.
