const fs = require("fs").promises;
const path = require("path");
const folderPath = "/srv/BlueBinaries/Diagnostics/React_Application_Logs"; //create in local
// const folderPath = "/home/dev2/log/sessionLogFiles";//create in server
let filePath;

//create logger file - post Method
exports.createLog = async (req, res) => {
  try {
    let { isLogin, user, isLogout } = req.body.response.data;
    let allFiles;
    //After user login - file created base on user name & time
    if (isLogin) {
      //Check if files length greater than 4 then delete old file

      const files = await fs.readdir(folderPath);
      // Read JSON data from each file
      allFiles = await Promise.all(
        files.map(async (file, i) => {
          return file;
        })
      );

      if (allFiles.length > 4) {
        const delateFile = await path.join(folderPath, allFiles[0]);
        await fs.unlink(delateFile);
      }

      //Set file name
      const formattedLoginTime = new Date()
        .toLocaleString()
        .replace(/[/:.,]/g, "-");
      const fileName = `${user}_${formattedLoginTime}.json`;
      filePath = path.join(folderPath, fileName);
    }
    // Ensure the folder exists
    await fs.mkdir(folderPath, { recursive: true });

    // Check if the file exists
    const fileExists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false);
    let dataList = [];

    if (fileExists) {
      // Read the existing data from the file
      const existingData = await fs.readFile(filePath, "utf8");

      // Parse the existing JSON data
      dataList = await JSON.parse(existingData);

      await dataList.push(req.body);
    } else {
      // If the file doesn't exist, start a new list with the new data
      dataList = await [req.body];
    }

    // Convert the data list to a string
    const dataListString = await JSON.stringify(dataList, null, 2);

    // Write the data list back to the file
    await fs.writeFile(filePath, dataListString, "utf8");

    console.log("Data has been appended to", filePath);
    res.status(201).json({
      success: true,
      message: "Data has been saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in session log",
      error,
    });
  }
};

//get all files name - Get Method
exports.getSessionLogAllFiles = async (req, res) => {
  try {
    // Read the contents of the folder
    const files = await fs.readdir(folderPath);

    // Read JSON data from each file
    let allFiles = await Promise.all(
      files.map(async (file, i) => {
        return file;
      })
    );
    console.log("allFiles", allFiles);

    // Send the JSON data as the response
    res.status(200).json({
      success: true,
      message: "Data has been retrieved successfully",
      totalFiles: allFiles?.length,
      data: allFiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in get all session log files",
      error,
    });
  }
};

//get files data - Get Method
exports.getSessionLogFiles = async (req, res) => {
  try {
    // Read the contents of the folder
    const files = await fs.readdir(folderPath);

    // Read JSON data from each file
    const jsonData = await Promise.all(
      files.map(async (file) => {
        const filePath = `${folderPath}/${file}`;
        const fileData = await fs.readFile(filePath, "utf-8");
        console.log("file", file);
        return JSON.parse(fileData);
      })
    );

    // Send the JSON data as the response
    res.status(200).json({
      success: true,
      message: "Data has been retrieved successfully",
      data: jsonData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in get session log file",
      error,
    });
  }
};


//get files from React offline - Post Method
exports.getSessionLogFilesReact = async (req, res) => {
  try {
    console.log("body", req.body);
    const { allFiles } = req.body;
    // Read the contents of the folder
    const files = await fs.readdir(allFiles);

    // Read JSON data from each file
    const jsonData = await Promise.all(
      files.map(async (file) => {
        // const filePath = `${folderPath}/${file}`;
        const fileData = await fs.readFile(files, "utf-8");
        console.log("file", file);
        return JSON.parse(fileData);
      })
    );
    console.log("Node response--file received successfully", req.body);
    // Send the JSON data as the response
    res.status(200).json({
      success: true,
      message: "Node response--file received successfully",
      data: jsonData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in get session log file from React offline",
      error,
    });
  }
};
