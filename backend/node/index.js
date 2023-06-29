let { PythonShell } = require("python-shell");

DB_PATH =
  "/Users/danielgeorge/Documents/work/ml/hypolab/Synapse/backend/node/db";

PYTHON_PATH =
  "/Users/danielgeorge/Documents/work/ml/hypolab/Synapse/backend/node/scripts";

let options = {
  mode: "text",
  pythonPath: "/Users/danielgeorge/miniforge3/envs/synapse/bin/python3",
  pythonOptions: ["-u"], // get print results in real-time
  scriptPath: PYTHON_PATH,
  args: [DB_PATH, "value2", "value3"],
};

// This script needs to always be run before the query script. You need to look at all the error cases returned by the python script and handle them here.
PythonShell.run("update_index.py", options).then((messages) => {
  // results is an array consisting of messages collected during execution
  console.log("messages: %j", messages);
});

// query = "How can I use AAV to edit the genome of a cell?";

// let query_options = {
//   mode: "text",
//   pythonPath: "/Users/danielgeorge/miniforge3/envs/synapse/bin/python3",
//   pythonOptions: ["-u"], // get print results in real-time
//   scriptPath: PYTHON_PATH,
//   args: [DB_PATH, query, PYTHON_PATH],
// };

// PythonShell.run("query_to_sources.py", query_options).then((messages) => {
//   // results is an array consisting of messages collected during execution
//   console.log("messages: %j", messages);
// });
