const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, '../' ,'temp')

const storageConfig = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => {
        // const date = new Date()
        // const time = date.getTime()
        // const filename = `${time}_${file.originalname}`
        // cb(null, filename);
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage : storageConfig
})

module.exports = upload