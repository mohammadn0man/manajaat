# Force update (store releases)

When you release a new version to the Play Store and App Store, you can require all users to update before continuing to use the app.

## How it works

1. On launch, the app fetches `version.json` from the URL in `app.json` → `extra.versionCheckUrl`.
2. It compares the app’s current version with `minVersion` in that file (semver: e.g. `1.2.0`).
3. If the current version is **lower** than `minVersion`, a full-screen “Update required” screen is shown with a button that opens the correct store (Play Store or App Store).

## When you release a new version

1. **Bump the app version** in `package.json` and `app.json` (e.g. to `1.2.0`).
2. **Update the minimum required version** in `version.json` in the repo:
   - Set `minVersion` to the new version (e.g. `"1.2.0"`).
   - Optionally set `message` to a custom string for the update screen.
3. **Commit and push** `version.json` so the URL used by the app (e.g. GitHub raw) serves the new `minVersion`.
4. **Build and submit** the new app to the stores as usual.

After that, any user still on an older version will see the update screen and must open the store to update.

## Configuration

- **`app.json` → `extra.versionCheckUrl`**  
  URL that returns JSON with `minVersion` (and optional `message`).  
  Example: `https://raw.githubusercontent.com/mohammadn0man/manajaat/master/version.json`  
  If your default branch is `main`, change `master` to `main` in the URL.

- **`app.json` → `extra.iosAppStoreId`**  
  Your app’s numeric App Store ID (from App Store Connect). Once set, the “Open App Store” button will open your app’s page directly. Until then, it opens a search for “Munajaat Nomani”.

- **`version.json`** (at repo root)  
  Must be committed and available at `versionCheckUrl`. Example:

```json
{
  "minVersion": "1.2.0",
  "message": "A new version of Munajaat Nomani is available. Please update to continue."
}
```

## Notes

- The version check is **skipped in development** (`__DEV__`), so local builds are never forced to update.
- If the remote request fails (e.g. no network), the app continues as normal (fail-open).
- Android uses the package ID from `app.json` (`com.nomani.munajaat`) for the Play Store link.
