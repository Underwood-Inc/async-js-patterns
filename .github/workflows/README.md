# GitHub Actions Workflows

This directory contains GitHub Actions workflow configurations that automate various tasks in the repository.

## `deploy-docs.yml`

This workflow automatically builds and deploys our VitePress documentation to GitHub Pages.

### Trigger Events

The workflow runs on:

- Every push to the `master` branch
- Manual trigger via GitHub Actions UI (`workflow_dispatch`)

### Workflow Structure

The workflow consists of two main jobs:

#### 1. Build Job

::: code-with-tooltips

```yaml
build:
  runs-on: ubuntu-latest
```

:::

This job:

- Checks out the repository code
- Sets up Node.js v20
- Configures GitHub Pages
- Installs project dependencies
- Builds the VitePress documentation
- Uploads the built site as an artifact

#### 2. Deploy Job

::: code-with-tooltips

```yaml
deploy:
  environment:
    name: github-pages
```

:::

This job:

- Depends on the successful completion of the build job
- Deploys the built documentation to GitHub Pages
- Provides the deployment URL in the job output

### Required Permissions

::: code-with-tooltips

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

:::

These permissions allow the workflow to:

- Read repository contents
- Write to GitHub Pages
- Use GitHub's deployment authentication

### Setup Requirements

To use this workflow:

1. Enable GitHub Pages in your repository settings:

   - Go to Settings > Pages
   - Set "Source" to "GitHub Actions"

2. Ensure your VitePress configuration has the correct base URL:

   ```js:preview
   import { defineConfig } from 'vitepress';

   export default defineConfig({
     base: '/repository-name/',
   });
   ```

3. Push changes to the `master` branch to trigger the deployment

### Deployment URL

Once deployed, your documentation will be available at:
`https://<username>.github.io/<repository-name>/`

### Troubleshooting

If the deployment fails:

1. Check the Actions tab for detailed error logs
2. Verify GitHub Pages is enabled
3. Ensure all repository permissions are correctly set
4. Validate the VitePress build locally using `npm run docs:build`
