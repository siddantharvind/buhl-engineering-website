# Buhl Engineering - Deployment & SEO Setup Guide

## Part 1: CloudFlare DNS Cleanup (BEFORE deployment)

### Step 1: Backup Current Setup
1. Go to CloudFlare Dashboard → Select `buhlengineering.in`
2. Go to **DNS** section
3. Take a screenshot of ALL current records
4. Note down any A, CNAME, MX, TXT records

### Step 2: Remove Old Records

**Delete these records:**
- ❌ Any **A records** pointing to old hosting (NOT GitHub Pages IPs)
- ❌ Any **CNAME records** from old hosting
- ❌ Any **TXT records** for verification (unless actively needed)
- ❌ Any **NS records** pointing to other nameservers

**Keep these records:**
- ✅ CloudFlare's **Nameserver (NS) records** - Do NOT delete
- ✅ **MX records** - Only if you need email routing

### Step 3: Verify Current State
After deletion, you should have a mostly empty DNS zone with only CloudFlare NS records.

---

## Part 2: Fresh GitHub Pages Setup

### Prerequisites
- GitHub repository: `<your-username>/<your-repo>`
- Your Astro site built locally ✓
- CloudFlare DNS now cleaned ✓

### Step 1: Configure Astro (Already Done ✓)
✅ `astro.config.mjs` has:
```javascript
export default defineConfig({
  site: 'https://buhlengineering.in',
  output: 'static',
});
```

### Step 2: Create/Update GitHub Actions Workflow

File: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Astro site
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: './dist'

  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### Step 3: Configure GitHub Pages

1. **Go to GitHub Repository Settings**
2. **Left sidebar → Pages**
3. **Source section:**
   - Deploy from branch: Select `main` (or your branch)
   - Folder: Select `/ (root)`
4. **Custom domain:**
   - Enter: `buhlengineering.in`
   - GitHub creates a `CNAME` file automatically
5. **Enforce HTTPS:** Check this box ✅
6. **Click Save**

### Step 4: CloudFlare DNS Configuration (FINAL STEP)

1. **Go to CloudFlare Dashboard → DNS**
2. **Create NEW records:**

**Option A: Using CNAME (Recommended for GitHub Pages)**
```
Type: CNAME
Name: @ (or buhlengineering.in)
Content: <your-username>.github.io
TTL: Auto
Proxy status: DNS only (Grey cloud)
```

**Option B: Using A Records (If CNAME doesn't work)**
```
Type: A
Name: buhlengineering.in
Content: 185.199.108.153 (GitHub IP)
TTL: Auto
Proxy status: DNS only (Grey cloud)

Type: A
Name: buhlengineering.in
Content: 185.199.109.153
TTL: Auto
Proxy status: DNS only (Grey cloud)

Type: A
Name: buhlengineering.in
Content: 185.199.110.153
TTL: Auto
Proxy status: DNS only (Grey cloud)

Type: A
Name: buhlengineering.in
Content: 185.199.111.153
TTL: Auto
Proxy status: DNS only (Grey cloud)
```

⚠️ **IMPORTANT**: Use **DNS only (Grey cloud)**, NOT Proxied (Orange cloud) for GitHub Pages

### Step 5: Verify Setup

```bash
# Check DNS propagation
nslookup buhlengineering.in

# Should return GitHub Pages IP or your username.github.io
```

---

## Part 3: SEO Optimization (Already Configured ✓)

✅ **Implemented:**
- Meta tags with keywords, author, robots
- Open Graph tags for social sharing
- Twitter Card tags
- JSON-LD schema (Organization)
- Mobile web app meta tags
- robots.txt (allows all, no restrictions)
- sitemap.xml (dynamic, includes all pages + job listings)

✅ **SEO Files:**
- `public/robots.txt` - For search engine crawling
- `src/pages/sitemap.xml.ts` - Dynamic sitemap (includes job pages)
- Meta tags in `src/layouts/BaseLayout.astro`

---

## Part 4: Post-Deployment Testing

### 1. Test DNS Resolution
```bash
# Check if domain resolves to GitHub Pages
dig buhlengineering.in
nslookup buhlengineering.in
```

### 2. Test SEO
- **Google Search Console:**
  1. Go to https://search.google.com/search-console
  2. Add property: `buhlengineering.in`
  3. Verify ownership (via TXT record or HTML tag)
  4. Submit sitemap: `https://buhlengineering.in/sitemap.xml`
  5. Request indexing of main pages

- **Bing Webmaster Tools:**
  1. Go to https://www.bing.com/webmasters
  2. Add site: `buhlengineering.in`
  3. Submit sitemap

### 3. Test Lighthouse SEO
- Open DevTools (F12)
- Lighthouse tab → Mobile/Desktop
- Run audit → Check Performance, SEO scores

### 4. Test Open Graph
- https://www.opengraphcheck.com/
- Enter: `https://buhlengineering.in`
- Verify og:title, og:description, og:image

---

## Part 5: SSL Certificate (Automatic)

GitHub Pages automatically provides SSL via Let's Encrypt when:
1. Custom domain is set in GitHub Pages settings ✓
2. "Enforce HTTPS" is checked ✓
3. DNS is configured correctly ✓

**Troubleshooting HTTPS:**
- If certificate doesn't appear after 24h, check DNS configuration
- Ensure CloudFlare DNS is set to "DNS only" (grey cloud)
- Remove proxy/firewall rules temporarily to test

---

## Deployment Checklist

- [ ] Delete old DNS records from CloudFlare
- [ ] Verify CloudFlare has ONLY nameserver records
- [ ] Build Astro: `npm run build`
- [ ] Push to GitHub: `git push origin main`
- [ ] GitHub Actions deploys automatically
- [ ] Configure GitHub Pages (Settings → Pages)
- [ ] Set custom domain in GitHub Pages settings
- [ ] Create CloudFlare DNS CNAME record (DNS only - grey cloud)
- [ ] Wait 24-48 hours for SSL certificate
- [ ] Test at https://buhlengineering.in
- [ ] Add to Google Search Console
- [ ] Submit sitemap to Google & Bing
- [ ] Monitor first search results

---

## SEO Keywords to Target

1. "Buhl Engineering" - Brand name
2. "Maritime Engineering" - Service
3. "Blue Economy" - Industry vertical
4. "Sovereign Maritime Technology" - Unique position
5. "Subsea Engineering India" - Location + Service
6. "Precision Maritime Solutions" - Service type

Monitor these in Google Search Console Analytics section.
