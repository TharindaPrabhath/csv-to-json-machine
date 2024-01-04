# CSV to JSON

In this script, the below processes will be occurred within a cron job.

- Pick the recently added csv file from the given directory
- Parse the csv to json
- Upload the data to the given REST API endpoint
- Log the status of the process into a given txt file

# Prerequisite

The host machine (the machine where the script is executed) should have installed node.js (>v14).
If it doesn't have, you can install it from [here](https://nodejs.org/en).

# Configuration

All the important parameters are defined in the .env file as shown below

```
	EMAIL=
	PASSWORD=

	CSV_DIR_PATH=
	LOG_FILE_PATH=
	CRON_SCHEDULE=
```

NOTE: All the paths should be absolute paths.

`EMAIL` - Email of the API credentials
`PASSWORD` - Password of the API credentials
`CSV_DIR_PATH` - Define the path of the csv files directory
`LOG_FILE_PATH` - Define the path to the log file
`CRON_SCHEDULE` - Define the cron schedule

# Installation

- Clone the git repo from [here](https://github.com/TharindaPrabhath/csv-to-json-machine.git) or simply download the zip to any location as your preference in your local machine
- Place the .env file into the root directory of the project
- Then run the below command from the root dir to install all the dependencies
  `npm i`
- If you want to configure the settings of the script, please refer to the Configuration section before executing the script.
- Run the below command to execute the script
- `npm run start`

That's it!
