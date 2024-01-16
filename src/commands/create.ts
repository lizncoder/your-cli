import { join } from "path";
import {
  cwd,
  chalk,
  inquirer,
  startSpinner,
  successSpinner,
  failSpinner,
  gitClone,
} from "../lib";
import { exist, rmAny, readFileAsync, writeFileAsync } from "../lib/fs";
import { CreateCondition, CliType } from "./common/create";

//检查是否已经存在相同文件
export const checkProjectExist = async (targetDir: string) => {
  if (await exist(targetDir)) {
    const answer = await inquirer.prompt({
      type: "list",
      name: "checkExist",
      message: `仓库路径${targetDir}已存在，请选择`,
      choices: ["覆盖", "取消"],
    });
    if (answer.checkExist === "覆盖") {
      startSpinner(`开始覆盖${targetDir}`);
      const status = await rmAny(targetDir);
      if (status) return successSpinner("覆盖成功");
      failSpinner("覆盖失败");
      return true;
    } else {
      return true;
    }
  }
  return false;
};

//获取用户指令
export const getCmdArgs = async (projectName: string) => {
  return await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: `package name: (${projectName})`,
      default: projectName,
    },
    {
      type: "input",
      name: "description",
      message: "Please enter a project description:",
    },
    {
      type: "input",
      name: "author",
      message: "Please enter a project author:",
    },
    {
      type: "input",
      name: "version",
      message: "Please enter a project version:",
      default: "1.0.0",
    },
    {
      type: "list",
      name: "umiVersion",
      message: " 🐂 使用 umi@4 还是 umi@3 ?",
      choices: [CreateCondition[3], CreateCondition[4]],
    },
    {
      type: "list",
      name: "cliType",
      message: " 🚀 要全量的还是一个简单的脚手架?",
      choices: [CliType[0], CliType[1]],
    },
    {
      type: "confirm",
      name: "drawerType",
      message: " 🐄 是否选择自定义抽屉?",
      default: false,
    },
  ]);
};

//删除.git文件
const deleteGit = async (targetDir: string) => {
  const gitPath = join(targetDir, ".git");
  if (await exist(gitPath)) {
    await rmAny(gitPath);
    return false;
  }
  return true;
};

//clone模板
export const cloneTemplate = async (
  choices: any,
  targetDir: string,
  projectName: string
) => {
  const {
    name,
    description,
    author,
    version,
    umiVersion,
    cliType,
    drawerType,
  } = choices;
  //选择的模板地址
  let templates = "";

  //umi@3
  if (umiVersion === CreateCondition[3]) {
    if (cliType === CliType[0]) {
      templates = "https://github.com/lizncoder/antd-simple-umi-3.git";
    } else if (cliType === CliType[1]) {
      templates = "https://github.com/lizncoder/antd-complete-umi-4.git";
    }
  }
  //umi@4
  else if (umiVersion === CreateCondition[4]) {
  }

  startSpinner("请耐心等待，正在克隆模板");
  //clone模板
  gitClone(templates, targetDir, async (err: any) => {
    if (!err) {
      //删除.git文件
      deleteGit(targetDir);

      const pakStr = await readFileAsync(join(targetDir, "package.json"));
      const pakJSON = JSON.parse(pakStr.toString());

      const newPakJSON = Object.assign(pakJSON, {
        name,
        description,
        author,
        version,
      }); //{ ..., name, description, author, version };

      //重新写入 package.json文件；
      const wwStatus = await writeFileAsync(
        join(targetDir, "./package.json"),
        JSON.stringify(newPakJSON, null, 2)
      );

      if (wwStatus != undefined) {
        console.log(chalk.red(` 请手动修改package.json文件 \n`));
      }

      successSpinner("克隆成功");

      console.log(chalk.gray(`\n cd ${projectName}`));
      console.log(chalk.gray(` npm i or yarn \n`));
    } else {
      failSpinner("克隆失败，请检查网络");
    }
  });
};

const action = async (projectName: string, cmdArgs?: any) => {
  try {
    const targetDir = join((cmdArgs && cmdArgs.context) || cwd, projectName);
    if (!(await checkProjectExist(targetDir))) {
      const answers = await getCmdArgs(projectName);
      cloneTemplate(answers, targetDir, projectName);
    }
  } catch (e) {}
};

export default {
  command: "create <project-name>",
  description: "请输入项目名称",
  optionList: [["--context <context>", "上下文路径"]],
  action,
};
