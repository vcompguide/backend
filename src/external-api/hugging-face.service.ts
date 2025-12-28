import { InferenceClient } from '@huggingface/inference';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface Message {
    role: string;
    content: string;
    [key: string]: string;
}

@Injectable()
export class HuggingFaceService {
    private readonly MODEL_ID = 'meta-llama/Llama-3.2-3B-Instruct';
    private readonly VISION_MODEL_ID = 'Qwen/Qwen2.5-VL-72B-Instruct';
    private readonly client: InferenceClient;

    constructor(private readonly configService: ConfigService) {
        const apiToken = this.configService.get<string>('HUGGINGFACE_TOKEN');
        if (!apiToken) {
            throw new Error('HUGGINGFACE_TOKEN is not configured');
        }
        this.client = new InferenceClient(apiToken);
    }

    create_system_prompt(): string {
        return `You are a helpful travel and location assistant. You specialize in:
- Providing information about tourist destinations and attractions
- Suggesting travel itineraries and routes
- Answering questions about local culture, food, and customs
- Recommending places to visit, eat, and stay
- Giving directions and location-based advice
- Sharing tips for travelers and tourists

Be concise, friendly, and informative. If you don't know specific details about a location, provide general helpful advice and suggest the user verify current information.`;
    }

    async chat(userMessage: string, conversationHistory?: Message[], maxToken?: 200, temperature?: 0.7): Promise<any> {
        // Add system prompt to conversation context
        const messages: Message[] = [
            {
                role: 'system',
                content: this.create_system_prompt(),
            },
        ];

        // Add conversation history if provided
        if (conversationHistory && conversationHistory.length > 0) {
            messages.push(...conversationHistory.slice(-5));
        }

        // Add current user message
        messages.push({
            role: 'user',
            content: userMessage,
        });

        try {
            const response = await this.client.chatCompletion({
                model: this.MODEL_ID,
                messages,
                max_tokens: maxToken,
                temperature,
                top_p: 0.9,
            });

            const generated_text = response.choices[0].message.content;

            return {
                success: true,
                response: generated_text?.trim(),
                model: this.MODEL_ID,
            };
        } catch (error) {
            throw new HttpException(
                `Failed to get response from Hugging Face: ${error.message || 'Unknown error'}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getLocationRecommendations(
        location: string,
        category: 'attractions' | 'restaurants' | 'hotels' | 'activities',
    ): Promise<any> {
        const prompts = {
            attractions: `What are the top 5 must-see attractions in ${location}? Please be specific and concise.`,
            restaurants: `Recommend 5 great restaurants or local food spots in ${location}. Include cuisine types.`,
            hotels: `What are some good accommodation options in ${location} for different budgets?`,
            activities: `What are the best activities and experiences to have in ${location}?`,
        };

        const prompt = prompts[category] ?? `Tell me about ${location} and what makes it special for travelers.`;

        return this.chat(prompt);
    }

    async analyzeImageLocation(imageURL: string, additionalContext?: string): Promise<any> {
        try {
            const prompt = additionalContext
                ? `Analyze this image and identify the location. ${additionalContext}. Please provide: 1) The name of the location or landmark, 2) Detailed description of the place, 3) If possible, the exact geographical coordinates (latitude and longitude). Format your response as JSON with keys: locationName, description, latitude, longitude.`
                : 'Analyze this image and identify the location or landmark shown. Please provide: 1) The name of the location or landmark, 2) Detailed description of the place, 3) If possible, the exact geographical coordinates (latitude and longitude). Format your response as JSON with keys: locationName, description, latitude, longitude.';

            const response = await this.client.chatCompletion({
                model: this.VISION_MODEL_ID,
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: prompt },
                            { type: 'image_url', image_url: { url: imageURL } },
                        ],
                    },
                ],
                max_tokens: 500,
            });

            const generatedText = response.choices[0].message.content?.trim();

            // Try to parse JSON response
            let parsedData: any;
            try {
                // Extract JSON from the response if it's wrapped in text
                const jsonMatch = generatedText?.match(/\{[^}]+\}/);
                if (jsonMatch) {
                    parsedData = JSON.parse(jsonMatch[0]);
                } else {
                    // If no JSON found, create structured response from text
                    parsedData = {
                        locationName: 'Unknown Location',
                        description: generatedText || 'Unable to identify the location from the image.',
                    };
                }
            } catch {
                parsedData = {
                    locationName: 'Unknown Location',
                    description: generatedText || 'Unable to identify the location from the image.',
                };
            }

            return {
                success: true,
                locationName: parsedData.locationName || 'Unknown Location',
                description: parsedData.description || 'No description available',
                coordinates:
                    parsedData.latitude && parsedData.longitude
                        ? {
                              lat: Number.parseFloat(parsedData.latitude),
                              lon: Number.parseFloat(parsedData.longitude),
                          }
                        : undefined,
                imageURL,
            };
        } catch (error) {
            throw new HttpException(
                `Failed to analyze image: ${error.message || 'Unknown error'}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
