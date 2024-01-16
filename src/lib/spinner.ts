import ora from "ora";
import chalk from "chalk";

const spinner = ora();

//开始
export const startSpinner = (text?: string) => {
  const msg = `${text}...\n`;
  spinner.start(msg);
};

//成功
export const successSpinner = (text?: string, symbol = "🦄") => {
  const msg = `${text}`;
  spinner.stopAndPersist({
    symbol,
    text: msg,
  });
};

//失败
export const failSpinner = (text?: string) => {
  spinner.fail(chalk.red(text));
};
// setTimeout(() => {
//   failSpinner("失败");
// }, 3000);
