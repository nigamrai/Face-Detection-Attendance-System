import multer from 'multer';
const upload = multer({
    limits: {
        fileSize: 1024 * 1024 * 50, // 5MB
    },
    storage: multer.diskStorage({
        destination: 'uploads/',
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    }),
});
export default upload;