// import multer from "multer";

// const storage =(email:string,folderName)=> multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, `../dummyS3/${email}/${folderName}`);
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now());
//   },
// });

// export const upload = multer({ storage: storage() });
