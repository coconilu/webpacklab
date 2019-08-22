const chalk = require("chalk");

class HelloPlugin {
  constructor(opts) {
    console.log(chalk.blue("new Hello Plugin"));
  }

  apply(compiler) {
    compiler.hooks.entryOption.tap("HelloPlugin", (context, entry) => {
      console.log(chalk.yellow("run Hello Plugin"));
      console.log(chalk.yellow(context));
      console.log(entry);
    });
    compiler.hooks.emit.tap("HelloPlugin", compilation => {
      console.log(compilation.assets);
    });
    this.checkPlugin("CleanWebpackPlugin", compiler) &&
      console.log(chalk.blue("CleanWebpackPlugin exit!"));
  }

  checkPlugin(pluginName, compiler) {
    return !!compiler.options.plugins.find(
      plugin => plugin.constructor.name === pluginName
    );
  }
}

module.exports = HelloPlugin;
