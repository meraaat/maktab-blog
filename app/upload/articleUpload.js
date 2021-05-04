import multer from 'multer';
import fs from 'fs';
import mkdirp from 'mkdirp';

function getPath() {
    return `./public/uploads/article/image`;
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (!fs.existsSync(getPath())) {
            (async () => {
                await mkdirp(getPath());
            })();
        }
        callback(null, getPath());
    },
    filename: (req, file, callback) => {
        let filename = file.originalname;
        if (fs.existsSync(`${getPath()}/${filename}`)) {
            filename = `${Date.now()}-${filename}`;
        }
        callback(null, filename);
    }
});

export default multer({ storage });
