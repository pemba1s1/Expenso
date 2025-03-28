import OpenAI from 'openai';
import { config } from '../config/env';
import { ExpenseItemWithoutId, ExtendedExpenseCategory } from '../types/types';
import { getAllCategories } from '../services/category.service';

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: config.OPENROUTER_API_KEY,
    // baseURL: 'https://ollama.rukh.me/v1',
    // apiKey: 'ollama',
    defaultHeaders: {
        'HTTP-Referer': 'https://expen.so', // Optional. Site URL for rankings on openrouter.ai.
        'X-Title': 'Expenso', // Optional. Site title for rankings on openrouter.ai.
    },
});

async function imageUrlToBase64(imageUrl: string): Promise<string | null> {
    try {
        const response = await fetch(imageUrl);

        if (!response.ok) {
            console.error(`Error fetching image from ${imageUrl}: ${response.statusText}`);
            return null; // Or throw an error if you prefer
        }

        const buffer = await response.arrayBuffer(); // Get the raw binary data
        const base64String = Buffer.from(buffer).toString('base64');
        return base64String;
    } catch (error) {
        console.error(`Error converting image to Base64: ${error}`);
        return null; // Handle errors gracefully
    }
}



/**
 * Generates insights about monthly expenses based on provided data
 * @param expenseData Object containing total amount and category breakdown
 * @param month Month for which insights are generated
 * @param year Year for which insights are generated
 * @returns Object containing insights and recommendations
 */
export const generateMonthlyExpenseInsights = async (
    expenseData: {
        totalAmount: number;
        totalAmountPerCategory: Array<{ name: string; amount: number }>;
    },
    monthName: string,
    year: string
) => {
    try {
        // const categoryList = await getAllCategories();

        const prompt = `
            You are a financial advisor analyzing expense data for ${monthName} ${year}.
            
            Here is the expense data:
            - Total expenses: $${expenseData.totalAmount.toFixed(2)}
            - Breakdown by category:
            ${expenseData.totalAmountPerCategory.map(cat =>
            `  * ${cat.name}: $${cat.amount.toFixed(2)} (${((cat.amount / expenseData.totalAmount) * 100).toFixed(2)}%)`
        ).join('\n')}
            
            Based on this data, provide the following insights:
            1. A summary of the spending pattern for ${monthName} ${year}
            2. Identify the top spending categories and if they seem reasonable
            3. Suggest areas where the user might be able to save money
            4. Provide 2-3 actionable tips for better financial management next month
            
            Format your response as a JSON object with the following structure:
            {
                "summary": "Overall summary of the month's spending",
                "topCategories": "Analysis of the highest spending categories",
                "savingOpportunities": "Areas where spending could be reduced",
                "tips": ["Tip 1", "Tip 2", "Tip 3"]
            }
        `;

        const response = await openai.chat.completions.create({
            model: 'openai/gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a financial analysis assistant that provides insights on spending patterns and offers practical advice for better financial management.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            response_format: { type: 'json_object' }
        });

        const insights = JSON.parse(response.choices[0]?.message?.content || '{}');
        return insights;
    } catch (error) {
        console.error('Error generating expense insights:', error);
        throw new Error('Failed to generate expense insights');
    }
};


/**
 * Extracts data from a receipt image
 * @param receiptImage Base64 encoded image of the receipt
 * @returns Extracted receipt data including items and prices
 */
export const getReceiptData = async (receiptImage: string) => {
    try {
        const categoryList = await getAllCategories().then((categories) => categories.map((category) => category.name));

        const prompt = `
            You are a receipt analysis assistant. Your task is to extract all items and their prices from the provided receipt image.
            
            Instructions:
            1. Identify each item on the receipt and its corresponding price
            2. Categorize each item into one of the following categories: ${categoryList.join(', ')}
            3. If item name contains numbers and alphabets, only use the alphabets
            4. Fetch the total tax amount if available, otherwise set it to 0.00
            5. Return ONLY a JSON object with the following structure, nothing else:
            
            {
                "items": [
                    {
                        "name": "Item name",
                        "price": 10.99,
                        "category": "Category name"
                    },
                    ...
                ],
                "tax": 0.00,
            }
            
            Important:
            - Be precise with item names and prices
            - If you cannot read part of the receipt clearly, make your best guess but include a "confidence" field with a value between 0-1
            - Do not include any explanations, notes, or text outside the JSON structure
            - Ensure the JSON is valid and properly formatted
        `;


        // console.log(await imageUrlToBase64(receiptImage));

        const response = await openai.chat.completions.create({
            model: 'google/gemini-pro-1.5',
            messages: [
                {
                    role: 'system',
                    content: 'You are a receipt analysis assistant that extracts structured data from receipt images with high accuracy.'
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: prompt
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                // url: `data:image/png;base64,${await imageUrlToBase64(receiptImage)}`
                                url: receiptImage
                            }
                        }
                    ]
                }
            ],
            response_format: { type: 'json_object' }
        });
        console.log(response);

        const extractedData = JSON.parse(response.choices[0]?.message?.content || '{}');

        // Process the extracted data to match the expected format
        const items: ExpenseItemWithoutId[] = extractedData.items.map((item: any) => ({
            name: item.name,
            amount: item.price
        }));

        // Group items by category
        const categorizedItems: Record<string, ExtendedExpenseCategory> = {};

        extractedData.items.forEach((item: any) => {
            if (!categorizedItems[item.category]) {
                categorizedItems[item.category] = {
                    categoryId: categoryList.indexOf(item.category) + 1 + '', // Convert to string ID
                    amount: 0,
                    items: []
                };
            }

            categorizedItems[item.category].items.push({
                name: item.name,
                amount: item.price
            });

            categorizedItems[item.category].amount += item.price;
        });

        const details: ExtendedExpenseCategory[] = Object.values(categorizedItems);

        return {
            amount: extractedData.total,
            details,
            rawExtractedData: extractedData // Include the raw data for debugging or additional processing
        };
    } catch (error) {
        console.error('Error extracting receipt data:', error);
        throw new Error('Failed to extract data from receipt image');
    }
};


