import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { ExpenseItemWithoutId, ExtendedExpenseCategory } from '../types/types';
import { getReceiptData } from './openai';

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const uploadImageToS3 = async (imageBuffer: Buffer): Promise<string> => {
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

export const processReceiptImage = async (imageBuffer: Buffer): Promise<{amount: number, receiptImageUrl: string, details: Array<ExtendedExpenseCategory>}> => {
  try {
    const receiptImageUrl = await uploadImageToS3(imageBuffer);
    // const receiptData = getReceiptData

    // Fetch all the categories from the database
    // const categories = await prisma.expenseCategory.findMany();
    // and pass it to the LLM endpoint

    // Optionally, call the LLM endpoint if needed
    // const response = await axios.post('LLM_ENDPOINT_URL', imageBuffer, {
    //   headers: {
    //     'Content-Type': 'application/octet-stream',
    //   },
    // });

    const amount = 123; // Get the amount from the LLM response
    const items : Array<ExpenseItemWithoutId> = [
      {
        name: 'Food', 
        amount: 50,
      },
      {
        name: 'Transport',
        amount: 20,
      },
      {
        name: 'Misc', 
        amount: 53,
      },
    ]
    const details : Array<ExtendedExpenseCategory> = [
      {
        amount: 50,
        categoryId: '1',
        items,
      },
      {
        amount: 20,
        categoryId: '2',
        items
      },
      {
        amount: 53,
        categoryId: '3',
        items
      },
    ]; // Get the details from the LLM response

    return {amount, receiptImageUrl, details}; // Return the S3 URL
  } catch (error) {
    throw new Error('Error processing receipt image');
  }
};
