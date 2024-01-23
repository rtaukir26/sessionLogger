const express = require("express");
const {
  createLog,
  getSessionLogFiles,
  getSessionLogAllFiles,
  getSessionLogFilesReact,
} = require("../controllers/logController");

const router = express.Router();

//Logg creating
router.post("/log", createLog);
router.get("/get-files", getSessionLogFiles);
router.get("/files", getSessionLogAllFiles);
router.post("/send-file", getSessionLogFilesReact);

module.exports = router;
