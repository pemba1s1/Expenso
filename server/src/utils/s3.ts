import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-providers';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env';
import { logger } from './logger';

// Create S3 client with credentials from environment variables
const s3Client = new S3Client({
  region: config.AWS_REGION,
  credentials: fromEnv(),
});

/**
 * Uploads an image buffer to S3 and returns the URL
 * @param imageBuffer - The image buffer to upload
 * @param contentType - The content type of the image (default: image/jpeg)
 * @returns Promise with the URL of the uploaded image
 */
export const uploadImageToS3 = async (
  imageBuffer: Buffer,
  contentType: string = 'image/jpeg'
): Promise<string> => {
  try {
    // Generate a unique filename using UUID
    const filename = `${uuidv4()}`;
    const key = `receipts/${filename}${getFileExtension(contentType)}`;

    const s3Params = {
      Bucket: config.S3_BUCKET_NAME,
      Key: key,
      Body: imageBuffer,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(s3Params);
    await s3Client.send(command);

    // Construct the S3 URL
    const imageUrl = `https://${s3Params.Bucket}.s3.${config.AWS_REGION}.amazonaws.com/${s3Params.Key}`;
    
    logger.info(`Image uploaded successfully to ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    logger.error('Error uploading image to S3', error);
    throw new Error(`Error uploading image to S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generates a pre-signed URL for an object in S3
 * @param key - The key of the object in S3
 * @param expiresIn - The number of seconds until the URL expires (default: 3600)
 * @returns Promise with the pre-signed URL
 */
export const getSignedS3Url = async (key: string, expiresIn: number = 3600): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: config.S3_BUCKET_NAME,
      Key: key,
    });

    // Use type assertion to bypass TypeScript type checking for both client and command
    const signedUrl = await getSignedUrl(s3Client as any, command as any, { expiresIn });
    return signedUrl;
  } catch (error) {
    logger.error('Error generating signed URL', error);
    throw new Error(`Error generating signed URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Helper function to get file extension from content type
 * @param contentType - The content type
 * @returns The file extension including the dot
 */
const getFileExtension = (contentType: string): string => {
  const extensions: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'application/pdf': '.pdf',
  };

  return extensions[contentType] || '.jpg';
};
