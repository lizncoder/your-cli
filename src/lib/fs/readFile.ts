import { readFile } from "node:fs/promises";
export const readFileAsync = async (targetFile: string, options?: object) => {
  return await readFile(targetFile, options ?? { encoding: "utf8" });
};

//测试
// import { join } from "../path/join";
// (async () => {
//   const aa = await readFileAsync(join(__dirname, "./exist.ts"));
//   console.log("aa:", aa);
// })();
