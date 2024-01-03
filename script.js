const fs = require("fs");

fs.readFile("./EFFICIENCY_REPORT_2024-1-1 19-0.csv", "utf8", (err, data) => {
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
  console.log("output", output);
});
