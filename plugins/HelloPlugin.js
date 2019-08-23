const chalk = require("chalk");

class HelloPlugin {
  constructor(opts) {
    console.log(chalk.blue("new Hello Plugin"));
  }

  apply(compiler) {
    // compiler.hooks.entryOption.tap("HelloPlugin", (context, entry) => {
    //   console.log(chalk.yellow("run Hello Plugin"));
    //   console.log(chalk.yellow(context));
    //   console.log(entry);
    // });
    // compiler.hooks.emit.tap("HelloPlugin", compilation => {
    //   console.log(compilation.assets);
    // });
    this.checkPlugin("CleanWebpackPlugin", compiler) &&
      console.log(chalk.blue("CleanWebpackPlugin exit!"));
    this.logHooksOrder(compiler);
  }

  checkPlugin(pluginName, compiler) {
    // 检查插件是否被注册
    return !!compiler.options.plugins.find(
      plugin => plugin.constructor.name === pluginName
    );
  }

  logHooksOrder(compiler) {
    let num = 1;
    const hooks = Object.keys(compiler.hooks);
    hooks.forEach(hook => {
      if (hook === "compilation") {
        compiler.hooks[hook].tap(hook, compilation => {
          // console.log(chalk.blue(`${num++}.${hook}`));
          console.log(chalk.blue(hook));
          const compilationHooks = Object.keys(compilation.hooks);
          compilationHooks.forEach(compilationHook => {
            compilation.hooks[compilationHook].tap(compilationHook, () => {
              // console.log(chalk.blue(`${num++}.${hook}`));
              console.log(chalk.green(compilationHook));
            });
          });
          return;
        });
      }
      compiler.hooks[hook].tap(hook, () => {
        // console.log(chalk.blue(`${num++}.${hook}`));
        console.log(chalk.blue(hook));
      });
    });
  }
}

module.exports = HelloPlugin;
