import * as path from "path";
import * as globby from "globby";
import { program } from "commander";
import { fs, error, chalk } from "./lib";
let commandsPath = [];

//获取src/command路径下的命令
const getCommand = () => {
  commandsPath = globby.sync("./commands/**", { cwd: __dirname, deep: 1 });
  return commandsPath;
};

//获取当前本地包的信息
const getPkgInfo = () => {
  const jsonPath = path.join(__dirname, "../package.json");
  const jsonContent = fs.readFileSync(jsonPath, "utf-8");
  const jsonResult = JSON.parse(jsonContent);
  const pkgVsersion = jsonResult.version;
  const pkgName = jsonResult.NONAME;
  return { pkgVsersion, pkgName };
};

//启动程序
const start = () => {
  const { pkgVsersion, pkgName } = getPkgInfo();

  //获取命令文件路径
  const commandsPath = getCommand();
  program.version(pkgVsersion);

  //获取全部命令
  commandsPath.forEach((commandPath) => {
    const commandObj = require(commandPath);
    const { command, description, optionList, action } = commandObj.default;
    const curp = program
      .command(command)
      .description(description)
      .action(action);

    optionList &&
      optionList.map((option: [string]) => {
        curp.option(...option);
      });
  });

  //检测未知命令
  program.on("command:*", async ([cmd]) => {
    program.outputHelp();
    error(`未知命令command ${chalk.yellow(cmd)}`);
    process.exitCode = 1;
  });

  program.parse();
};

start();
