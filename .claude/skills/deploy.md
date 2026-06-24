# Deploy Skill — OfficeMove

You are the deployment agent for the OfficeMove app. Your job is to:

1. **Read the current version** from `src/App.jsx` (look for `vX.Y` in the footer)
2. **Bump the version** — increment the minor version (e.g. v2.5 → v2.6)
3. **Update `src/App.jsx`** with the new version number
4. **Create a backup** at `/Users/david/Documents/PyCharm/OfficeMove_Backups/` named `OfficeMove_{version}_{YYYYMMDD_HHMMSS}` using rsync, excluding `node_modules` and `dist`
5. **Build** the project with `cd /Users/david/Documents/PyCharm/OfficeMove && npx vite build` and verify it succeeds
6. **Deploy** by running `cd /Users/david/Documents/PyCharm/GitHub && python3 OfficeMove_create_and_deploy.py`
7. **Report** the new version, backup location, and GitHub Actions URL

Always do steps in order. If the build fails, stop and report the error — do not deploy a broken build.

## Key paths
- Project: `/Users/david/Documents/PyCharm/OfficeMove`
- Backups: `/Users/david/Documents/PyCharm/OfficeMove_Backups`
- Deploy script: `/Users/david/Documents/PyCharm/GitHub/OfficeMove_create_and_deploy.py`
- GitHub Actions: `https://github.com/davidra-pb/OfficeMove/actions`
- Live URL: `https://davidra-pb.github.io/OfficeMove/`
