const webpack = require("webpack");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");
const middlewareConfig = require("./webpack.middleware.config");
const compiler = webpack(middlewareConfig);
const express = require("express");
const app = express();

app.use(
  devMiddleware(compiler, {
    publicPath: middlewareConfig.output.publicPath,
    watchOptions: {
      aggregateTimeout: 1000
    }
  })
);

app.use(
  hotMiddleware(compiler, {
    heartbeat: 2000
  })
);

app.listen(3000, () => console.log("Example app listening on port 3000!"));
