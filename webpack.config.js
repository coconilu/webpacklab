const path = require("path");
const fs = require("fs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

function multipleEntry() {
  const projectsBaseDir = path.resolve(__dirname, "projects");
  const projects = fs.readdirSync(projectsBaseDir);
  const entryObj = {};
  projects.forEach(project => {
    const projectDir = path.resolve(projectsBaseDir, project);
    if (
      fs.statSync(projectDir).isDirectory() &&
      fs.readdirSync(projectDir).indexOf("index.js") > -1
    ) {
      // projects下的文件夹有index.js文件
      entryObj[project] = path.resolve(projectDir, "index.js");
    } else if (!fs.statSync(projectDir).isDirectory()) {
      if (!entryObj["others"]) entryObj["others"] = [];
      entryObj["others"].push(projectDir);
    }
  });
  console.log(`TCL: multipleEntry -> entryObj`, entryObj);
  return entryObj;
}
// multipleEntry();

module.exports = {
  mode: "development",
  context: path.resolve(__dirname),
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "lib")],
    extensions: [".js", ".json", ".jsx", ".css"],
    alias: {
      "lib/utils$": path.resolve(__dirname, "lib/utils.js")
    }
  },
  entry: multipleEntry(),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]/bundle.[hash:5].js"
  },
  module: {
    noParse: /jquery|lodash/,
    rules:[]
  },
  plugins: [new CleanWebpackPlugin()],
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    hot: true,
    // lazy: true,
    open: true,
  }
};
