# OZone Store (syllexdeals.com)

Bilingual (French/English) catalog of brand-new, sealed items available locally.
Public, read-only static website hosted on GitHub Pages with no build step.

## GitHub Pages Configuration

The site is served directly from the `/docs` folder:
1. In your GitHub repository settings, go to **Pages**.
2. Under **Build and deployment > Source**, select **Deploy from a branch**.
3. Choose branch `main` and directory `/docs`, then save.
4. Custom domain is configured via `docs/CNAME` (`syllexdeals.com`).
5. `docs/.nojekyll` prevents GitHub Pages from running Jekyll processing.

## Updating the Catalog

1. **Items (`docs/items.json`)**:
   - Update product details, prices (in FCFA), or stock status directly in `docs/items.json`.
   - The store fetches and renders from `docs/items.json` on every page visit.

2. **Photos (`docs/img/`)**: illustrations are `OZ-xxx.webp`; real photos uploaded from the admin are `OZ-xxx.jpg` and switch on when the item's `photo` flag is true.
   - Each photo corresponds to an item ID (e.g. `OZ-001.webp`).
   - Photos are 4:3 (640x480).

## Helper Tools (`tools/`)

Local-only maintenance scripts (never deployed to production):

- **`tools/generate_gemini_images.py`**:
  Generates clean photorealistic studio product photos using Google Gemini / Imagen 3 API.
  ```bash
  export GEMINI_API_KEY="your-api-key"

  # Review prompts before spending credits (dry run):
  python tools/generate_gemini_images.py --dry-run

  # Generate a single item:
  python tools/generate_gemini_images.py --only OZ-001

  # Batch range:
  python tools/generate_gemini_images.py --start 1 --end 20
  ```

- **`tools/mirror_images.py`**:
  Downloads and resizes photos listed in `tools/image_sources.csv` to `docs/img/`.
  ```bash
  python tools/mirror_images.py
  ```

## Admin Portal (`docs/admin/index.html`)

OZone includes a client-only single-file administration page located at `/admin/` (or `docs/admin/index.html`) to manage inventory, pricing, product descriptions, and photos directly through the GitHub Contents API without any backend or developer intervention.

### Setup Instructions

1. **Enable Two-Factor Authentication (2FA)**:
   - On GitHub, go to **Settings > Password and authentication**.
   - Ensure two-factor authentication is enabled on your GitHub account.

2. **Generate a Fine-Grained Personal Access Token**:
   - In GitHub, navigate to **Settings > Developer Settings > Personal access tokens > Fine-grained tokens**.
   - Click **Generate new token**.
   - Set **Token name** to something recognizable (e.g. `OZone Store Admin`).
   - Set **Expiration** to **90 days** (maximum recommended for security).
   - Under **Repository access**, select **Only select repositories** and pick this store's repository (e.g. `owner/repo`).
   - Under **Permissions > Repository permissions**, locate **Contents** and set access to **Read and write**. Leave all other permissions as *No access*.
   - Click **Generate token** and copy the resulting `github_pat_...` string.

3. **Log in to the Admin Panel**:
   - Open `/admin/` in your browser (e.g. `https://syllexdeals.com/admin/`).
   - Enter your repository path (e.g. `owner/repo`) and branch (`main`).
   - Paste your fine-grained Personal Access Token.
   - Click **Connect to Repository**. The token is kept exclusively in `sessionStorage` (cleared whenever you close the tab) and is transmitted only to `https://api.github.com`.

4. **Adding Additional Admins**:
   - Go to your repository settings on GitHub: **Settings > Collaborators > Add people**.
   - Invite the new admin as a collaborator with write access.
   - Have them log into GitHub and follow Step 1 and Step 2 above to generate their own personal fine-grained token for this repository. They then sign into `/admin/` with their own token.

5. **Undoing Changes & Audit Trail (Git History)**:
   - Git commit history serves as your complete undo and revision history.
   - Catalog saves create a single commit modifying `docs/items.json`.
   - Photo uploads immediately commit the 640x480 cover-cropped image to `docs/img/OZ-xxx.jpg`.
   - To roll back any mistaken change, open the repository commit history on GitHub or use `git revert <commit-sha>`.
