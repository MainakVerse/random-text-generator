// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface RequestBody {
  text: string;
  wordCount: number;
}

interface HuggingFaceResponse {
  generated_text: string;
}

interface ErrorResponse {
  error: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<HuggingFaceResponse | ErrorResponse>> {
  try {
    const body = await req.json();
    const { text, wordCount } = body as RequestBody;

    if (!text) {
      return NextResponse.json(
        { error: 'Text field is required' },
        { status: 400 }
      );
    }

    const validatedWordCount = Math.min(Math.max(Number(wordCount) || 100, 50), 5000);

    const apiKey = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;
    if (!apiKey) {
      throw new Error('Hugging Face API key is not configured');
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ 
          inputs: text,
          parameters: {
            max_new_tokens: Math.floor(validatedWordCount * 1.5),
            return_full_text: false,
            do_sample: true,
            temperature: 0.7,
            top_p: 0.95,
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    // Return the first result directly as an object, not an array
    return NextResponse.json({
      generated_text: data[0].generated_text
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}