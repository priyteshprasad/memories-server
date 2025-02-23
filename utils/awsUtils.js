import dotenv from "dotenv";
import aws from "aws-sdk";
dotenv.config();

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECERT_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new aws.S3({
  region: process.env.AWS_REGION,
});

export async function getObjectsWithUpdatedUrls(posts) {
  return Promise.all(
    posts.map(async (post) => {
      let plainObj = post.toObject();

      if (
        (plainObj.selectedFile?.startsWith("data:image/") &&
          plainObj.selectedFile?.length > 50) ||
        !plainObj.selectedFile ||
        plainObj.selectedFile?.length === 0 // Check for null or undefined as well.
      ) {
        return plainObj;
      } else {
        try {
          // Construct the command
          const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: plainObj.selectedFile, // Extracts file name from URL
            Expires: 60 * 60, // URL expires in 1 hr
          };

          // Get the signed URL
          const signedUrl = await s3.getSignedUrlPromise("getObject", params);

          plainObj.selectedFile = signedUrl;

          return plainObj;
        } catch (error) {
          console.error("Error generating signed URL:", error);
          // Handle the error appropriately, e.g., return the original object or throw an error
          return plainObj; // Return the original object in case of error
        }
      }
    })
  );
}

export async function getObjectWithUpdatedUrl(post) {
  let plainObj = post.toObject();

  if (
    (plainObj.selectedFile?.startsWith("data:image/") &&
      plainObj.selectedFile?.length > 50) ||
    !plainObj.selectedFile ||
    plainObj.selectedFile?.length === 0
  ) {
    return plainObj;
  } else {
    try {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: plainObj.selectedFile, // Extracts file name from URL
        Expires: 60 * 60, // URL expires in 1 hr
      };
      // Get the signed URL
      const signedUrl = await s3.getSignedUrlPromise("getObject", params);
      plainObj.selectedFile = signedUrl;
      return plainObj;
    } catch (error) {
      console.error("Error generating signed URL:", error);
      // Handle the error appropriately, e.g., return the original object or throw an error
      return plainObj; // Return the original object in case of error
    }
  }
}
