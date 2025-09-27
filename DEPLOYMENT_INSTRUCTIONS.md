# 部署React应用到GitHub Pages的完整指南

## 1. 本地构建应用

在部署之前，需要先在本地构建应用，将TypeScript和JSX代码编译为浏览器可以理解的JavaScript。

### 构建步骤：

```bash
# 1. 安装依赖
npm install

# 2. 构建应用
npm run build
```

执行这些命令后，Vite会生成一个包含编译后文件的`dist`目录。有效的网站内容位于`dist/static`子目录中。

## 2. 部署构建产物

构建完成后，需要将`dist/static`目录中的内容部署到GitHub Pages。

### 部署步骤：

1. **确保在主分支上**：
   ```bash
   git checkout main  # 或您的主分支名称
   ```

2. **提交构建产物**：
   ```bash
   # 添加构建目录到git跟踪
   git add dist -f
   
   # 提交更改
   git commit -m "Deploy build files"
   ```

3. **使用subtree推送部署内容**：
   ```bash
   # 使用subtree将dist/static目录推送到gh-pages分支
   git subtree push --prefix dist/static origin gh-pages
   ```

4. **配置GitHub Pages**：
   - 进入GitHub仓库的Settings页面
   - 找到Pages设置部分
   - 选择Source为"Deploy from a branch"
   - 选择`gh-pages`分支
   - 选择根目录`/`作为源目录
   - 保存设置

## 3. 自动化部署（可选）

为了简化部署流程，可以配置GitHub Actions实现自动部署。

### 创建GitHub Actions工作流：

在项目根目录创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]  # 或你的主分支名称

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm install

    - name: Build
      run: npm run build

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

配置完成后，每次推送到主分支时都会自动构建并部署应用。

## 4. 访问部署的应用

部署完成后，可以通过以下URL访问您的应用：
```
https://<your-username>.github.io/<repository-name>/
```

例如，如果您的GitHub用户名是`john`，仓库名是`my-react-app`，则访问：
```
https://john.github.io/my-react-app/
```

## 注意事项

1. 确保`package.json`中的`homepage`字段设置正确（如果使用GitHub Pages）：
   ```json
   {
     "homepage": "https://<your-username>.github.io/<repository-name>/"
   }
   ```

2. 如果使用React Router，需要配置`basename`以匹配部署路径：
   ```jsx
   <BrowserRouter basename="/<repository-name>">
     {/* 路由配置 */}
   </BrowserRouter>
   ```

3. 部署后可能需要几分钟时间才能生效，请耐心等待。

通过以上步骤，您就可以成功将React应用部署到GitHub Pages并在线访问了。