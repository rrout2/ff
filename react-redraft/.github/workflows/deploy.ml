name: Deploy to GitHub Pages (redraft + weekly)

on:
  push:
    branches: [ main ]     # or your default branch
  workflow_dispatch:       # allow manual runs

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
        working-directory: ff/react-redraft   # 👈 your project lives here
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
          cache-dependency-path: ff/react-redraft/package.json

      - name: Install deps
        run: npm ci

      - name: Build (Vite)
        run: npm run build
        # vite.config.js already has:
        # base: "/ff/react-redraft/"
        # rollupOptions.input: { index: "index.html", weekly: "weekly.html" }

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ff/react-redraft/dist   # 👈 publish this folder

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
