import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { ExpenseCategory, ExpenseItems } from '../types/types';

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const uploadImageToS3 = async (imageBuffer: Buffer): Promise<String> => {
  try {
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `receipts/${uuidv4()}.jpg`,
      Body: imageBuffer,
      ContentType: 'image/jpeg',
    };

    const command = new PutObjectCommand(s3Params);
    await s3.send(command);

    return `https://${s3Params.Bucket}.s3.${s3.config.region}.amazonaws.com/${s3Params.Key}`;
  } catch (error) {
    throw new Error('Error uploading image to S3');
  }
}

export const processReceiptImage = async (imageBuffer: Buffer): Promise<{amount: number, receiptImageUrl: String, details: Array<ExpenseCategory>}> => {
  try {
    const receiptImageUrl = await uploadImageToS3(imageBuffer);

    // Optionally, call the LLM endpoint if needed
    // const response = await axios.post('LLM_ENDPOINT_URL', imageBuffer, {
    //   headers: {
    //     'Content-Type': 'application/octet-stream',
    //   },
    // });

    const amount = 123; // Get the amount from the LLM response
    const items : Array<ExpenseItems> = [
      { name: 'Food', amount: 50 },
      { name: 'Transport', amount: 20 },
      { name: 'Misc', amount: 53 },
    ]
    const details : Array<ExpenseCategory> = [
      { name: 'Food', amount: 50, items },
      { name: 'Transport', amount: 20, items },
      { name: 'Misc', amount: 53, items },
    ]; // Get the details from the LLM response

    return {amount, receiptImageUrl, details}; // Return the S3 URL
  } catch (error) {
    throw new Error('Error processing receipt image');
  }
};
