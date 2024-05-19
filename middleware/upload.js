import multer from "multer";
import path from "node:path";



const multerConfig = multer.diskStorage({
    destination(req, file, cb){
        cb(null, avatarPath.resolve("tmp"));
    },
    filename(req, file, cb){
        cb(null, file.originalname)
    }
})

export default multer({storage});