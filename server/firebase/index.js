var admin = require("firebase-admin");
const uuid = require("uuid-v4");

// CHANGE: The path to your service account
var serviceAccount = require("./nodejs---storage-firebase-adminsdk-hf6ci-3f626564eb.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://nodejs---storage.appspot.com",
});

var bucket = admin.storage().bucket();
// var filename = "public/uploads/images/avatar-cdb9af037b3f56aa.png";
// function getPathStorageFromUrl(url) {
//   const file = bucket.file();
//   file.createWriteStream()
//   const baseUrl =
//     "https://storage.googleapis.com/download/storage/v1/b/nodejs---storage.appspot.com/o/";

//   let imagePath = url.replace(baseUrl, "");

//   const indexOfEndPath = imagePath.indexOf("?");

//   imagePath = imagePath.substring(0, indexOfEndPath);

//   imagePath = imagePath.replace(/%2F/g, "/");

//   return imagePath;
// }
// async function uploadFile() {
//   const metadata = {
//     metadata: {
//       // This line is very important. It's to create a download token.
//       firebaseStorageDownloadTokens: uuid(),
//     },
//     contentType: "image/jpg",
//     cacheControl: "public",
//   };

//   // Uploads a local file to the bucket
//   const storage = await bucket.upload(filename, {
//     // Support for HTTP requests made with `Accept-Encoding: gzip`
//     gzip: true,
//     public: true,
//     destination: `/public/a/msPsis.png`,
//     metadata: metadata,
//   });
//   console.log(storage[0].metadata.mediaLink);

//   return getPathStorageFromUrl(storage[0].metadata.mediaLink);
// }
// (async () => {
//   const url = await uploadFile();
//   console.log(url);
// })();

// bucket
//   .file("/public/a/msPsis.png")
//   .delete()
//   .catch((e) => {
//     console.log(e);
//   });
module.exports = { bucket };
