# Deployment Guide

This app is a static frontend-only application that can be deployed to any static hosting service.

## Quick Deploy Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   npm run build
   vercel --prod
   ```

3. Or connect your GitHub repo to Vercel for automatic deployments

### Option 2: Netlify

1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Deploy:
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. Or drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

### Option 3: GitHub Pages

1. Install gh-pages:
   ```bash
   npm i -D gh-pages
   ```

2. Add to package.json scripts:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```

3. Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/'
   })
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

### Option 4: Any Static Host

Just upload the contents of the `dist` folder to:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Cloudflare Pages
- Firebase Hosting
- Surge.sh
- Any web server (Apache, Nginx, etc.)

## Build Process

```bash
npm install      # Install dependencies
npm run build    # Build for production
```

The build output will be in the `dist` directory.

## Environment

No environment variables needed - everything runs client-side!

## Post-Deployment

1. Open the deployed URL in a browser
2. Create a test trip
3. Add a few test transactions
4. Verify calculations work correctly
5. Test on mobile devices
6. Clear browser data and verify it works from scratch

## Updating

To update the deployed app:
1. Make your changes
2. Run `npm run build`
3. Deploy the new `dist` folder

## Custom Domain

Most hosting providers support custom domains:
- Vercel: Project Settings → Domains
- Netlify: Site Settings → Domain Management
- GitHub Pages: Repository Settings → Pages → Custom Domain

## Performance

The built app is very small:
- JavaScript: ~52 KB gzipped
- CSS: ~4 KB gzipped
- Total: ~56 KB

This means fast load times even on slow connections!

## Browser Support

The app works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

**Issue**: App shows blank screen after deployment
- **Solution**: Check browser console for errors. Make sure `base` in vite.config.ts is set correctly.

**Issue**: Data not persisting
- **Solution**: Verify LocalStorage is enabled in the browser. Some privacy modes block LocalStorage.

**Issue**: 404 errors on page refresh
- **Solution**: Configure your host to redirect all routes to index.html (SPA routing)

## Security

Since this is a client-side only app:
- ✅ No API keys to secure
- ✅ No database to protect
- ✅ No server to maintain
- ✅ All data stays in user's browser
- ✅ No CORS issues
- ✅ No authentication needed

## Monitoring

No backend means no server monitoring needed! The app will work as long as the static files are served.

Optional: Add Google Analytics or similar to track usage.
