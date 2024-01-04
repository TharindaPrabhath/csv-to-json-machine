require("dotenv").config();
const fs = require("fs");
const cron = require("node-cron");

// Constants
const CSV_DIR_PATH = process.env.CSV_DIR_PATH;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const CRON_SCHEDULE = process.env.CRON_SCHEDULE;
const LOG_FILE_PATH = process.env.LOG_FILE_PATH;

// This variable is used to keep track of the last file that was processed
// in order to prevent processing the same file multiple times
let lastFile = "";

function main() {
  cron.schedule(CRON_SCHEDULE, () => {
    console.log("Cron job started");
    execute();
  });
}

function execute() {
  // Pick the recently added csv file
  const files = fs.readdirSync(CSV_DIR_PATH);
  const csvFiles = files.filter((file) => file.endsWith(".csv"));
  const latestFile = csvFiles.reduce((prev, curr) => {
    const prevDate = new Date(prev.split(" ")[1]);
    const currDate = new Date(curr.split(" ")[1]);
    return prevDate > currDate ? prev : curr;
  }, csvFiles[0]);

  // Check if the file has already been processed
  if (lastFile === latestFile) {
    console.log("File already processed");
    return;
  }

  // Update the last file reference
  lastFile = latestFile;

  fs.readFile(`${CSV_DIR_PATH}/${latestFile}`, "utf8", async (err, data) => {
    const { success, message } = await processFile(data);

    // Log the status of the transaction to the txt file with the timestamp
    fs.appendFile(
      LOG_FILE_PATH,
      `${new Date().toLocaleString()} | ${lastFile} - ${
        success ? "Success" : "Failed"
      } - ${success ? message : "Error"} \n`,
      (err) => {
        if (err) throw err;
        console.log("Log saved!");
      }
    );
  });
}

async function processFile(data, file) {
  const lines = data.split("\n");
  const output = [];

  // Loop through the data
  for (let i = 5; i < lines.length; i++) {
    let dataPoints = lines[i]
      .split(",")
      .map((dataPoint) => dataPoint.replaceAll('"', ""));

    let object1 = {
      mc_no: dataPoints[0],
      gauge: dataPoints[1],
      efficiency: dataPoints[2],
      mc_status: dataPoints[3],
    };

    let object2 = {
      mc_no: dataPoints[5],
      gauge: dataPoints[6],
      efficiency: dataPoints[7],
      mc_status: dataPoints[8],
    };
    output.push(object1, object2);
  }

  // Get the access token
  const result = await fetch(
    "https://elegantdesigners.info/elegant/api/machine-performance/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: EMAIL,
        password: PASSWORD,
      }),
    }
  );
  const { token } = await result.json();
  // Upload data
  const result2 = await fetch(
    "https://elegantdesigners.info/elegant/api/machine-performance/report",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: output,
      }),
    }
  );
  const { success, message } = await result2.json();
  return { success, message };
}

main();
