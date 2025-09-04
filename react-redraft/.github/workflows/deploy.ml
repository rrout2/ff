name: Deploy to GitHub Pages (redraft + weekly)

on:
  push:
    branches: [ main ]            # <- or your default branch
  workflow_dispatch:              # allow manual runs from the Actions tab

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ff/react-redraft  # <- your project folder
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      # Optional: show where we are and what files exist
      - name: Debug paths
        run: |
          pwd
          ls -la
          echo "node version:"
          node -v || true
          echo "npm version:"
          npm -v || true

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: ff/react-redraft/package-lock.json

      - name: Install deps (ci with fallback)
        run: |
          if [ -f package-lock.json ]; then
            npm ci || npm install
          else
            npm install
          fi

      # Helpful: fail early on common case-sensitivity issues (Linux is strict)
      - name: Case-sensitive import sanity check
        run: |
          # Fail if any file imports weeklyboard with wrong case
          if git grep -n "weekly/weeklyboard/weeklyboard.jsx" -- .; then
            echo "Found wrong-case import of WeeklyBoard.jsx. Fix to ../weekly/weeklyboard/WeeklyBoard.jsx"
            exit 1
          fi

      - name: Build (Vite)
        run: npm run build

      - name: List dist (verify weekly.html exists)
        run: |
          ls -la dist
          test -f dist/weekly.html || (echo "weekly.html missing from dist" && exit 1)
          test -f dist/index.html  || (echo "index.html missing from dist" && exit 1)

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ff/react-redraft/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
