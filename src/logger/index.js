 import { projectLogger } from "./projectLogger.js";
 import { productionLogger } from "./productionLogger.js";
 
let logger = null;

if (process.env.NODE_ENV !== "project") {
  logger = projectLogger();
}

// if (process.env.NODE_ENV !== "production") {
//   logger = productionLogger();
// }

export {logger}