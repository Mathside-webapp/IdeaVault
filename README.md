# IdeaVault — Interactive Corkboard Productivity App

An offline-first productivity app with two separate tactile corkboards: **To-do** and **Ideas**. Notes, reminders, attachments, board positions, colors, checklists, connections, and preferences live in IndexedDB on the device. The included Capacitor Android project configuration can produce a **debug APK with GitHub Actions**.

## What works

- Separate task and idea boards; drag sticky notes freely across a large 8000 × 6000 canvas.
- Multiple red strings on pins, including **Related** and **Depends on** connections; select Connect and tap two pins. Tap a string to disconnect it. Duplicate and self-links are rejected.
- Wheel zoom and mobile two-finger pinch zoom; drag empty cork to pan. Position and zoom are saved per board.
- Tap a note to open a **clean, read-only preview** of the full title and rich content, including checked checklist and radio options. Tap **Edit note** to change it.
- The note editing dialog floats **in the center** with the corkboard visible behind it. On desktop, **Note details** and **Content** appear side by side; on phones they stack and scroll in the same centered popup. Details contain paper color, note title, priority, grouping, sizing presets, and optional dates/reminders. The Content container contains an unrestricted-length rich text editor (bold/italic/underline, font family, text color and size), checklists, single-choice radio groups, and attachments. No application-enforced character or word limit applies to the text (device storage remains finite).
- Stretch notes by dragging the **lower-right resize handle**; locked notes cannot be dragged or resized. Red strings stay attached to resized notes.
- Complete tasks and checklists and select one radio choice. Attach images or files (10 MB/file); embedded image previews on notes and original files downloadable from the paperclip tool in the Content container.
- Search and filters by board, color, status, priority and last modification date. Jump to a matching note.
- Undo/redo for recent note content, note position, and connection operations. Auto-save without a Save button.
- Complete offline JSON backup/restore (including file blobs), and export either corkboard as a PNG.
- First-run interactive tips, responsive sidebar/mobile navigation, warm light/dark themes, custom app icon and native Android notifications.

The initial corkboards contain **sample notes** so you can learn the interactions. They are locally editable/deletable and not connected to any account.

## Open on a PC without building Android

The ZIP includes **`web-preview/`**, a no-framework standalone version. It uses the same features and storage, except that **native notifications cannot fire in a normal browser while the app is closed**.

From the project root, with Python installed:

```bash
python -m http.server 8000 --directory web-preview
```

Open `http://localhost:8000` in Chrome, Edge or Firefox. Running through localhost gives IndexedDB a stable origin. **Do not rely on double-clicking the HTML file in a browser**: some browsers restrict offline storage for `file://` pages.

## Edit/develop with Vite

Requires **Node.js 22 or later**.

```bash
npm install
npm run dev
```

Then open the local address shown by Vite. Build web assets with:

```bash
npm run build
```

The canonical editable source is in `src/`; generated browser fallback lives in `web-preview/`. After editing source, regenerate the fallback with `python tools/make-preview.py`.

## Build Android APK without Android Studio on your computer

1. Create a new **GitHub repository** and upload the **contents of this ZIP** to the repository root, including `.github/workflows/build-android.yml` (uploading the ZIP itself is not enough).
2. Ensure the default branch is named `main` or `master`, or run the workflow manually.
3. Open **Actions** → **Build IdeaVault Android APK** → **Run workflow**.
4. When the workflow successfully completes, open its run page and download **IdeaVault-Android-Debug-APK** under **Artifacts**.
5. Unzip that artifact and install `app-debug.apk` on your Android phone. Android may ask permission to install from that source.

The workflow checks GitHub's preinstalled Android SDK, instead of invoking the older third-party SDK installation action. It configures API 36/Build Tools 36 only when necessary. The GitHub runner has Java, Node, Android SDK, and Gradle; you do **not** need Android Studio on your own computer for the CI workflow. The CI workflow runs `npm install`, verifies tests, builds the offline web bundle, generates the Capacitor Android folder, adds packaged custom launcher and notification icons, and invokes Gradle `assembleDebug`.

**Troubleshooting:** If an older repository workflow fails at "Install Android SDK tools", replace `.github/workflows/build-android.yml` with the version in this archive, commit it to the default branch, and run the workflow again. If the new workflow fails, inspect the final error lines of the failed step.

**This project archive does not contain an already compiled APK**. The workflow has been prepared but has not run in your own GitHub account. Debug APKs are development installers, not signed Play Store release builds.

### Build manually if desired

```bash
npm install
npm run build
npx cap add android
python tools/patch_android.py
cd android
./gradlew assembleDebug
```

If the Android platform has already been created, run `npm run android:sync` instead of `npx cap add android`. A local manual Android build requires the Android SDK, Java 21, and Gradle (wrapper included after `cap add`).

## Native notifications and Android caveats

To-do notes have an optional local reminder date/time. The Android app requests notification permission when a reminder is scheduled and lets the OS deliver it without relying on a continuously running JavaScript timer. The reminder is cancelled if the note is completed, archived, or trashed.

Android can defer **inexact** reminder delivery (for example, in Doze), and users can deny notifications or force-stop an app. This app does **not** request the restricted `SCHEDULE_EXACT_ALARM` permission and **does not promise minute-perfect notifications**. Test actual timing on the target device, including when it is locked. Browser preview reminders are preserved in storage but **do not** generate native alerts.

## Backup and data safety

Settings → **Download backup** exports notes, rich text, checklists, radio choices, strings, board positions, preferences, and attachments to JSON. Restore replaces local data only after confirmation. Backups from v2–v5 can be imported: obsolete outline sections are discarded, **but notes, positions, strings and attachments are retained**. The IndexedDB v2 schema remains compatible. Uninstalling the APK or erasing browser data can delete local records, so keep backups somewhere safe.

## Testing and usage

Run `npm test` for the unit suite. The optional `python tests/ui_mock_smoke.py` uses Chromium and an in-memory storage adapter to exercise the corkboard and note editor at mobile and desktop widths. A native APK and real-device persistence still require manual verification.

- Tool modes: **Move**, **Pan**, **Connect**. Drag notes individually; drag empty cork to pan.
- Double-click or double-tap empty cork to add a note. Tap a note to preview its contents, then select **Edit note**.
- Undo with Ctrl/Cmd+Z, redo with Ctrl/Cmd+Shift+Z or Ctrl+Y.
- Archiving and Trash remain, along with red-string connections, backup/restore and PNG export.
- Hover and click animations remain on the navigation buttons.

## Project layout

```
index.html                  Vite app shell
src/main.js                 UI, gestures, state and user interactions
src/storage.js              IndexedDB stores and backup helpers
src/geometry.js             Pins, string paths, coordinate transforms
src/export.js               Canvas-based SVG-to-PNG export
src/native.js               Capacitor local notifications adapter
src/icons.js                Inline SVG icon set
src/style.css               Responsive cozy corkboard visual system
public/assets/             Cork texture and SVG launcher illustration
web-preview/                Prebuilt no-install offline browser edition
resources/android/          Android launcher and notification images
tools/                      Offline preview builder + Android patch
.github/workflows/           GitHub Actions debug APK builder
```

© 2026 IdeaVault demo project. All user content remains local until explicitly backed up or exported.

## IdeaVault v6: sections removed

The former section/outline feature has been removed from both boards, including the Section button, outlines, resize handles, titles, membership prompts and section movement logic. Existing notes and their positions, red strings and attachments remain intact. On upgrading, leftover section membership and outline records are cleared. Older backups still restore note contents and connections without recreating sections.

The centered Note Details and Content editor, rich text, checklists, radio choices, paperclip attachments, note resizing, cork textures and navigation animations remain available.


## GitHub Actions Vite CSS build fix

This release removes the invalid placeholder `@import url('data:text/css,');` from `src/style.css`. That line made Vite/PostCSS try to open `data:text/css,` as a local file and caused `npm run build` to fail. Upload **all project files**, retaining the `.github/workflows/build-android.yml` folder. The corrected workflow uses the preinstalled Android SDK. After uploading, run Actions > Build IdeaVault Android APK > Run workflow. An APK is available in the workflow Artifacts only if all steps succeed.
