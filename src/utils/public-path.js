import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const projectRoot = path.join(__dirname, "..", "..");

export const getFilePath = (resourcePath) => {
  return path.join(projectRoot, resourcePath);
};

export const getPublicDirectoryPath = () => {
  return path.join(projectRoot, "public");
};
