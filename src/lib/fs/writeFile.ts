import { writeFile } from "node:fs/promises";
export const writeFileAsync = async (targetFile: string, data: any) => {
  return await writeFile(targetFile, data, "utf8");
};

//测试
// import { join } from "../path/join";
// (async () => {
//   const ww = await writeFileAsync(
//     join(__dirname, "./demo.ts"),
//     '{name:"lizn"}'
//   );
// })();
