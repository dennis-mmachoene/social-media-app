const router = require('express').Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) =>{
        cb(null, req.body.name);
    },
});

const upload = multer({storage: storage});

router.post('/', upload.single("file", (req, res) => {
    try{
        res.send(200).json("File Upload Successfully")
    }catch(err){
        console.log(err);
    }
}))

module.exports = router;