import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text");
    const lang = searchParams.get("lang") || "ta";

    if (!text) {
      return new Response("Missing text parameter", { status: 400 });
    }

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}`;

    const response = await fetch(ttsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      console.error(`Google TTS fetch failed: ${response.status} ${response.statusText}`);
      return new Response("Failed to fetch audio from TTS provider", { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error: any) {
    console.error("Error in proxy TTS route:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}
