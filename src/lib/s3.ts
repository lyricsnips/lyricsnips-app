import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.S3_BUCKET!;

export async function uploadToS3({
  buffer,
  key,
  contentType = "image/png",
}: {
  buffer: Buffer;
  key: string;
  contentType?: string;
}) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read", // or remove for privates
  });
  await s3.send(command);
  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export async function removeFromS3ByUrl({ imageUrl }: { imageUrl: string }) {
  try {
    // Extract the key from the S3 URL
    const key = imageUrl.split(".com/")[1];

    const command = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    await s3.send(command);
    console.log(`Successfully deleted ${key} from S3`);
    return true;
  } catch (error) {
    console.error(`Error deleting from S3:`, error);
    throw error;
  }
}
