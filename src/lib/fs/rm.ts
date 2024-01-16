import { rm } from "node:fs/promises";
export const rmAny = async (
  targetDir: string,
  options?: any
): Promise<boolean> => {
  try {
    const status = await rm(
      targetDir,
      options ?? { force: true, recursive: true }
    );
    if (status === undefined) return true;
    return false;
  } catch (e) {
    return false;
  }
};
//测试
// rmAny(join(process.cwd(), "./demo"));
