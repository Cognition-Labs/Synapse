const express = require("express");
const cors = require("cors");
let { PythonShell } = require("python-shell");

const app = express();
const port = 1200;

app.use(cors());

DB_PATH =
  "/Users/danielgeorge/Documents/work/ml/hypolab/Synapse/backend/node/db";

PYTHON_PATH =
  "/Users/danielgeorge/Documents/work/ml/hypolab/Synapse/backend/node/scripts";

// Add an endpoint that receives a query and passes it to the Python script
app.get("/query", (req, res) => {
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

  let query = req.query.q;

  let query_options = {
    mode: "text",
    pythonPath: "/Users/danielgeorge/miniforge3/envs/synapse/bin/python3",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: PYTHON_PATH,
    args: [DB_PATH, query, PYTHON_PATH],
  };

  PythonShell.run("query_to_sources.py", query_options)
    .then((messages) => {
      // results is an array consisting of messages collected during execution
      console.log("messages: %j", messages);
      console.log("Response headers: ", res.getHeaders()); // Add this line
      res.send(messages);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
