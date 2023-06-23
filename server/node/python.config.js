import { Options } from "python-shell";

export const config = {
  mode: "json",
  pythonPath: "/Users/danielgeorge/miniforge3/envs/synapse/bin/python3",
  pythonOptions: ["-u"], // get print results in real-time
  scriptPath:
    "/Users/danielgeorge/Documents/work/ml/hypolab/Synapse/server/node/scripts",
  args: ["value1", "value2", "value3"],
  stderrParser: (line) => {
    console.log(line);
  },
};
