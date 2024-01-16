import chalk from "chalk";

//警告
export const warn = (text: string) => {
  console.log(chalk.red(`\n${text}\n`));
};

//信息
export const info = (text: string) => {
  console.log(chalk.cyan(`\n ${text}\n`));
};

//错误
export const error = (text: string) => {
  console.log(chalk.red(`\n${text}\n`));
};

//成功
export const success = (text: string) => {
  console.log(chalk.green(`\n${text}\n`));
};
