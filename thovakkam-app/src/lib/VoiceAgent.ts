// VoiceAgent helper wrapping the Web Speech API for Tamil ta-IN

export interface VoiceAgentConfig {
  locale?: string;
  onListeningStateChange?: (isListening: boolean) => void;
  onSpeakingStateChange?: (isSpeaking: boolean) => void;
}

class VoiceAgent {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private locale: string = "ta-IN";
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private voicesLoadedPromise: Promise<SpeechSynthesisVoice[]> | null = null;
  private activeAudio: HTMLAudioElement | null = null;

  public onListeningStateChange: ((isListening: boolean) => void) | null = null;
  public onSpeakingStateChange: ((isSpeaking: boolean) => void) | null = null;

  constructor(config?: VoiceAgentConfig) {
    if (config?.locale) {
      this.locale = config.locale;
    }
    this.onListeningStateChange = config?.onListeningStateChange || null;
    this.onSpeakingStateChange = config?.onSpeakingStateChange || null;

    if (typeof window !== "undefined") {
      this.synthesis = window.speechSynthesis;
      if (this.synthesis) {
        // Trigger loading voices list early
        this.synthesis.getVoices();
        
        // Define the promise to track voice loading
        this.voicesLoadedPromise = new Promise((resolve) => {
          const checkVoices = () => {
            const list = this.synthesis?.getVoices() || [];
            if (list.length > 0) {
              resolve(list);
              return true;
            }
            return false;
          };

          if (checkVoices()) return;

          if (this.synthesis) {
            if (typeof this.synthesis.addEventListener === "function") {
              const handler = () => {
                if (checkVoices()) {
                  this.synthesis?.removeEventListener("voiceschanged", handler);
                }
              };
              this.synthesis.addEventListener("voiceschanged", handler);
            } else {
              this.synthesis.onvoiceschanged = () => {
                checkVoices();
              };
            }
          }

          // Fallback timeout so we never hang indefinitely (e.g. if the system has no voices at all)
          setTimeout(() => {
            resolve(this.synthesis?.getVoices() || []);
          }, 1000);
        });
      }
      
      // Check for SpeechRecognition
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = this.locale;
      } else {
        console.warn("Web Speech Recognition API is not supported in this browser.");
      }
    }
  }

  // Captures Tamil speech and returns a promise resolving to the transcribed text
  public listen(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error("Speech recognition is not supported in this browser."));
        return;
      }

      this.stopSpeaking();

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.onListeningStateChange) this.onListeningStateChange(true);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        if (this.onListeningStateChange) this.onListeningStateChange(false);
        reject(event);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.onListeningStateChange) this.onListeningStateChange(false);
      };

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      try {
        this.recognition.start();
      } catch {
        // Recognition might already be running
        this.recognition.stop();
        setTimeout(() => {
          try {
            this.recognition.start();
          } catch (err) {
            reject(err);
          }
        }, 300);
      }
    });
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Speaks text aloud using SpeechSynthesis, falling back to online TTS if no Tamil voice is available
  public async speak(text: string): Promise<void> {
    if (this.voicesLoadedPromise) {
      await this.voicesLoadedPromise;
    }

    let hasTamilVoice = false;
    if (this.synthesis) {
      const voices = this.synthesis.getVoices();
      const tamilVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("ta"));
      if (tamilVoices.length > 0) {
        hasTamilVoice = true;
      }
    }

    if (!hasTamilVoice && typeof window !== "undefined") {
      console.log("No Tamil SpeechSynthesis voices found. Falling back to Google Translate TTS API.");
      return this.playGoogleTTS(text);
    }

    return this.speakWithRetry(text, 0);
  }

  private playGoogleTTS(text: string): Promise<void> {
    return new Promise((resolve) => {
      try {
        this.stopListening();
        this.stopSpeaking(); // clean up any running speaking instances

        // Clean up text for speech
        const cleanText = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*#_`]/g, "");

        // Split text into chunks of under 180 characters, breaking at sentence/phrase boundaries
        // to comply with Google Translate TTS character limit and prevent truncation/failures.
        const chunks: string[] = [];
        const parts = cleanText.split(/([.,!?;|()]+|\s{2,})/g);
        
        let currentChunk = "";
        for (const part of parts) {
          if ((currentChunk + part).length > 180) {
            if (currentChunk.trim()) {
              chunks.push(currentChunk.trim());
            }
            currentChunk = part;
          } else {
            currentChunk += part;
          }
        }
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }

        if (chunks.length === 0) {
          resolve();
          return;
        }

        this.isSpeaking = true;
        if (this.onSpeakingStateChange) this.onSpeakingStateChange(true);

        const langCode = this.locale.split("-")[0];
        let chunkIndex = 0;

        const playNextChunk = () => {
          if (chunkIndex >= chunks.length || !this.isSpeaking) {
            this.isSpeaking = false;
            if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
            this.activeAudio = null;
            resolve();
            return;
          }

          const chunkText = chunks[chunkIndex];
          // Use the proxy endpoint to avoid CORS and Google's referrer blocking
          const url = `/api/voice/tts?lang=${langCode}&text=${encodeURIComponent(chunkText)}`;

          const audio = new Audio(url);
          this.activeAudio = audio;

          audio.onended = () => {
            chunkIndex++;
            playNextChunk();
          };

          audio.onerror = (err) => {
            console.warn("Google TTS audio chunk playback failed:", err);
            chunkIndex++;
            playNextChunk();
          };

          audio.play().catch((err) => {
            console.warn("Failed to play Google TTS chunk (requires user interaction first):", err);
            this.isSpeaking = false;
            if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
            this.activeAudio = null;
            resolve();
          });
        };

        playNextChunk();
      } catch (err) {
        console.warn("Error setting up Google TTS:", err);
        this.isSpeaking = false;
        if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
        resolve();
      }
    });
  }

  private speakWithRetry(text: string, attempt: number): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synthesis) {
        console.warn("Speech synthesis is not supported.");
        resolve();
        return;
      }

      this.stopListening();
      
      // Clear the queue only on the initial attempt. Calling cancel recursively inside error handlers
      // can cause the browser's speech queue to lock up.
      if (attempt === 0) {
        this.synthesis.cancel();
      }

      // Clean up text for speech if needed (e.g. remove markdown links/formatting)
      const cleanText = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*#_`]/g, "");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = this.locale;

      // Find all available Tamil voices
      const voices = this.synthesis.getVoices();
      const tamilVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("ta"));
      
      let selectedVoice = null;
      if (tamilVoices.length > 0) {
        if (attempt < tamilVoices.length) {
          selectedVoice = tamilVoices[attempt];
          utterance.voice = selectedVoice;
          console.log(`Using Tamil voice (attempt ${attempt + 1}/${tamilVoices.length}): ${selectedVoice.name} (${selectedVoice.lang})`);
        } else {
          console.log("All matching Tamil voices failed or tried. Retrying with default system voice.");
        }
      } else {
        if (attempt === 0) {
          console.warn(`No Tamil voice found. Fallback to default system voice. Total voices available: ${voices.length}`);
          if (voices.length > 0) {
            console.warn("Available voices list:", voices.map(v => `${v.name} (${v.lang})`));
          }
        }
      }

      // Voice speed adjustments for accessibility (slightly slower for elder clarity)
      utterance.rate = 0.9; 
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (this.onSpeakingStateChange) this.onSpeakingStateChange(true);
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
        this.activeUtterance = null;
        resolve();
      };

      utterance.onerror = (e) => {
        const expectedErrors = ["canceled", "interrupted", "not-allowed"];
        if (expectedErrors.includes(e.error)) {
          console.log(`Speech synthesis status: ${e.error}`);
          this.isSpeaking = false;
          if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
          this.activeUtterance = null;
          resolve();
        } else if (e.error === "synthesis-failed" && attempt <= tamilVoices.length) {
          // If a specific Tamil voice (e.g. Google network voice) failed, retry with next available voice or system default
          console.warn(`Speech synthesis failed (synthesis-failed) with voice: ${selectedVoice ? selectedVoice.name : "default"}. Retrying with next voice fallback...`);
          this.isSpeaking = false;
          if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
          this.activeUtterance = null;
          this.speakWithRetry(text, attempt + 1).then(resolve);
        } else {
          console.warn("Speech synthesis status/error:", e.error, e);
          this.isSpeaking = false;
          if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
          this.activeUtterance = null;
          resolve(); // Resolve anyway so the application doesn't hang
        }
      };

      // Unpause the synthesis engine if it is in a paused state
      if (this.synthesis.paused) {
        this.synthesis.resume();
      }

      // On initial attempt, add a small 150ms delay to allow the browser's audio queue
      // to fully process the cancel() command and release the sound hardware.
      const delay = attempt === 0 ? 150 : 0;
      setTimeout(() => {
        try {
          if (this.synthesis?.paused) {
            this.synthesis.resume();
          }
          this.activeUtterance = utterance;
          this.synthesis?.speak(utterance);
        } catch (err) {
          console.warn("Error calling speak:", err);
          resolve();
        }
      }, delay);
    });
  }

  public stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
      } catch (err) {
        console.warn("Error pausing active audio:", err);
      }
      this.activeAudio = null;
    }
    this.isSpeaking = false;
    if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
  }

  public cancelAll(): void {
    this.stopListening();
    this.stopSpeaking();
  }
}

export default VoiceAgent;
