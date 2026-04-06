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
Use this workflow to build for all platforms automatically. It is configured to generate:
- **`Orbit_intel.dmg`**: For Intel-based Macs.
- **`Orbit_arm.dmg`**: For Apple Silicon (M1/M2/M3) Macs.
- **`Orbit_universal.dmg`**: A single binary that runs on both Intel and Apple Silicon.
- **`Orbit_windows_installer.msi`**: For Windows 11.

```yaml
name: Build Desktop App (Tauri v2)
on: [push]

jobs:
  build:
    strategy:
      fail-fast: false
      matrix:
        include:
          - platform: windows-latest
            args: ""
          - platform: macos-latest
            args: "--target x86_64-apple-darwin"
            suffix: "intel"
          - platform: macos-latest
            args: "--target aarch64-apple-darwin"
            suffix: "arm"
          - platform: macos-latest
            args: "--target universal-apple-darwin"
            suffix: "universal"
    # ... (see .github/workflows/tauri-build.yml for full source)
```

## 4. Configuration Highlights
- **Tauri v2**: The app is built using Tauri v2 for better performance and security.
- **Frameless Window**: Configured in `src-tauri/tauri.conf.json` with `"decorations": false` and `"transparent": true`.
- **Drag Region**: The topbar in `App.tsx` uses `style={{ WebkitAppRegion: 'drag' }}` to allow moving the window.
- **Multi-Arch macOS**: The GitHub Action handles building for both Intel and Apple Silicon.
