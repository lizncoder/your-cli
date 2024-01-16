import { access } from "node:fs/promises";
import { join } from "../path/join";

export const exist = async (...targetDir: string[]): Promise<boolean> => {
  try {
    const isUndefined = await access(join(...targetDir));
    if (isUndefined === undefined) return true;
    return false;
  } catch (e) {
    return false;
  }
};
// 测试
// (async () => {
//   console.log(await exist(process.cwd(), "./demo2"));
// })();
