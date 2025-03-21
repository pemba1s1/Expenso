import OpenAI from 'openai';
import { config } from '../config/env';
import { ExpenseItemWithoutId, ExtendedExpenseCategory } from '../types/types';

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: config.OPENROUTER_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': 'https://expen.so', // Optional. Site URL for rankings on openrouter.ai.
        'X-Title': 'Expenso', // Optional. Site title for rankings on openrouter.ai.
    },
});

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
    month: number,
    year: number
) => {
    try {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const monthName = monthNames[month - 1];
        
        const categoryList = [
            'Groceries',
            'Rent',
            'Utilities',
            'Entertainment',
            'Savings',
            'Transportation',
            'Misc',
            'Others'
        ];
        
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
            model: 'anthropic/claude-3-opus',
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

        const insights = JSON.parse(response.choices[0].message.content || '{}');
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
        const categoryList = [
            'Groceries',
            'Rent',
            'Utilities',
            'Entertainment',
            'Savings',
            'Transportation',
            'Misc',
            'Others'
        ];

        const prompt = `
            You are a receipt analysis assistant. Your task is to extract all items and their prices from the provided receipt image.
            
            Instructions:
            1. Identify each item on the receipt and its corresponding price
            2. Categorize each item into one of the following categories: ${categoryList.join(', ')}
            3. Calculate the total amount from all items
            4. Return ONLY a JSON object with the following structure, nothing else:
            
            {
                "items": [
                    {
                        "name": "Item name",
                        "price": 10.99,
                        "category": "Category name"
                    },
                    ...
                ],
                "total": 123.45
            }
            
            Important:
            - Be precise with item names and prices
            - If you cannot read part of the receipt clearly, make your best guess but include a "confidence" field with a value between 0-1
            - Do not include any explanations, notes, or text outside the JSON structure
            - Ensure the JSON is valid and properly formatted
        `;

        const response = await openai.chat.completions.create({
            model: 'anthropic/claude-3-opus',
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
                                url: receiptImage
                            }
                        }
                    ]
                }
            ],
            response_format: { type: 'json_object' }
        });

        const extractedData = JSON.parse(response.choices[0].message.content || '{}');
        
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
