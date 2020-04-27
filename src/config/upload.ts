import multer from 'multer';
import path from 'path';

export default multer({
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'tmp'),
    filename: (request, file, cb) => {
      return cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),

  fileFilter: (request, file, cb) => {
    const extension = file.originalname.split('.')[1];
    if (extension !== 'csv') {
      cb(null, false);
    } else {
      return cb(null, true);
    }

    return file;
  },
});
