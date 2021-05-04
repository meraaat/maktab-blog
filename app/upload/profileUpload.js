import multer from 'multer';
import fs from 'fs';
import mkdirp from 'mkdirp';


function getPath() {
    return `./public/uploads/user`;
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if(!fs.existsSync(getPath())){
            mkdirp(getPath())
            .then(() => {
                callback(null, getPath());
            });
        }else{
            callback(null, getPath());
        }
    },
    filename: (req, file, callback) => {
        let filename = file.originalname;
        if(fs.existsSync(`${getPath()}/${filename}`)){
            filename = `${Date.now()}-${filename}`;
        }
        callback(null, filename)
    }
});


export default multer({ storage });