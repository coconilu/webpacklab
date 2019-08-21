const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");
const MultiEntryPlugin = require("webpack/lib/MultiEntryPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const middlewareConfig = require("./webpack.middleware.config");

const express = require("express");
const app = express();

const projectsBaseDir = path.resolve(__dirname, "projects");
const page_total = getPages();
const page_loaded = [];
let hasLoadWebpackMiddle = false;

let devMiddlewareInstance = null;
let compiler = null;

app.get("/:page/*", function(req, res, next) {
  const page = req.params.page;
  if (page_loaded.indexOf(page) > -1) {
    next();
  } else if (page_total.indexOf(page) > -1) {
    // webpack添加entry
    if (!hasLoadWebpackMiddle) {
      middlewareConfig.entry = {};
      middlewareConfig.entry[page] = [
        path.resolve(projectsBaseDir, page, "index.js"),
        "webpack-hot-middleware/client?reload=true"
      ];
      middlewareConfig.plugins.push(
        new HtmlWebpackPlugin({
          title: page,
          filename: `${page}/index.html`,
          chunks: [page]
        })
      );
      compiler = webpack(middlewareConfig);
      devMiddlewareInstance = devMiddleware(compiler, {
        publicPath: middlewareConfig.output.publicPath,
        watchOptions: {
          aggregateTimeout: 1000
        }
      });

      app.use(devMiddlewareInstance);

      app.use(
        hotMiddleware(compiler, {
          heartbeat: 2000
        })
      );
      hasLoadWebpackMiddle = true;
      next();
    } else {
      // 更新entry和添加plugin
      compiler.apply(
        new MultiEntryPlugin(
          projectsBaseDir,
          [`./${page}/index.js`, "webpack-hot-middleware/client?reload=true"],
          page
        )
      );

      compiler.apply(
        new HtmlWebpackPlugin({
          title: page,
          filename: `${page}/index.html`,
          chunks: [page]
        })
      );

      devMiddlewareInstance && devMiddlewareInstance.invalidate();
      devMiddlewareInstance.waitUntilValid(() => {
        console.log("Package is in a valid state");
        next();
      });
    }
    page_loaded.push(page);
  }
});

function getPages() {
  const projects = fs.readdirSync(projectsBaseDir);
  const pages = [];
  projects.forEach(project => {
    const projectDir = path.resolve(projectsBaseDir, project);
    if (
      fs.statSync(projectDir).isDirectory() &&
      fs.readdirSync(projectDir).indexOf("index.js") > -1
    ) {
      // projects下的文件夹有index.js文件
      pages.push(project);
    }
  });
  return pages;
}

app.listen(3000, () => console.log("Example app listening on port 3000!"));
