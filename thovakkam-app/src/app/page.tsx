"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Phone,
  CheckCircle,
  AlertCircle,
  FileText,
  ArrowLeft,
  LogOut,
  Grid,
  BookOpen,
  HelpCircle,
  Camera,
  Check,
  Volume2,
  VolumeX,
  Play,
  Undo2,
  RefreshCw,
  Lock
} from "lucide-react";

// Types
import { UserProfile, MatchResult } from "@/lib/matcher";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function CitizenPortal() {
  // Navigation & User State
  const [step, setStep] = useState<"home" | "auth" | "otp" | "dashboard" | "chat" | "recommendations" | "apply">("home");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [user, setUser] = useState<any>(null);

  // Voice & Chat State
  const [voiceAgent, setVoiceAgent] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [statusText, setStatusText] = useState("READY"); // READY, LISTENING, THINKING, SPEAKING
  const [devInput, setDevInput] = useState(""); // Developer manual text input
  const [lastSpokenText, setLastSpokenText] = useState(""); // Track last spoken text for replay button

  // Conversation/NLU State
  const [currentQuestionId, setCurrentQuestionId] = useState("welcome");
  const [profile, setProfile] = useState<UserProfile>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // Recommendations State
  const [matchedSchemes, setMatchedSchemes] = useState<MatchResult[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [schemeExplanation, setSchemeExplanation] = useState("");
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [isFollowUpListening, setIsFollowUpListening] = useState(false);

  // Apply State
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});
  const [applySuccess, setApplySuccess] = useState(false);
  const [userApplications, setUserApplications] = useState<any[]>([]);
  const [appNumber, setAppNumber] = useState("");

  // Ref to automatically scroll chat to bottom
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize VoiceAgent dynamically to avoid SSR errors
  useEffect(() => {
    if (typeof window !== "undefined") {
      const VoiceAgentClass = require("@/lib/VoiceAgent").default;
      const agent = new VoiceAgentClass({
        onListeningStateChange: (listening: boolean) => {
          setIsListening(listening);
          if (listening) setStatusText("LISTENING");
          else setStatusText("READY");
        },
        onSpeakingStateChange: (speaking: boolean) => {
          setIsSpeaking(speaking);
          if (speaking) setStatusText("SPEAKING");
          else setStatusText("READY");
        }
      });
      setVoiceAgent(agent);
    }
  }, []);

  // Fetch applications if user logs in
  useEffect(() => {
    if (user?.id) {
      fetchUserApplications();
    }
  }, [user]);

  // Scroll chat bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Read aloud first greeting depending on step
  useEffect(() => {
    if (!voiceAgent) return;

    if (step === "home") {
      speakTamil("வணக்கம்! நான் துவக்கம் AI. தமிழக அரசின் திட்டங்கள் மற்றும் உதவித்தொகைகளை எளிதாக கண்டறிய 'தொடங்கவும்' பொத்தானை அழுத்தவும்.");
    } else if (step === "auth") {
      speakTamil("வணக்கம்! தமிழ்நாட்டின் அரசு உதவித்தொகை திட்டங்களைக் கண்டறிய உங்கள் 10 இலக்க அலைபேசி எண்ணை தட்டச்சு செய்யவும்.");
    } else if (step === "otp") {
      speakTamil("கடவுச்சொல்லை உள்ளிடவும். உங்கள் சோதனை கடவுச்சொல் ஒன்று இரண்டு மூன்று நான்கு ஆகும்.");
    } else if (step === "dashboard") {
      speakTamil("வரவேற்கிறோம்! உங்கள் சுயவிவரத்தைக் கண்டறிய 'திட்டங்களை கண்டறி' என்ற பொத்தானை அழுத்தவும், அல்லது உங்கள் விண்ணப்ப நிலையை அறிய கீழே பார்க்கவும்.");
    }
  }, [step, voiceAgent]);

  const fetchUserApplications = async () => {
    try {
      const res = await fetch(`/api/applications?userId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setUserApplications(data.applications || []);
      }
    } catch (e) {
      console.error("Error fetching user applications:", e);
    }
  };

  function speakTamil(text: string) {
    setLastSpokenText(text);
    if (voiceAgent && audioFeedback) {
      voiceAgent.speak(text);
    }
  }

  // Dial Pad Functions for Auth
  const handleDial = (num: string) => {
    // Play beep sound or simple TTS
    if (phone.length < 10) {
      const newPhone = phone + num;
      setPhone(newPhone);
      speakTamil(num);
    }
  };

  const handleDialBackspace = () => {
    if (phone.length > 0) {
      setPhone(phone.slice(0, -1));
    }
  };

  const handleOtpDial = (num: string) => {
    if (otp.length < 4) {
      const newOtp = otp + num;
      setOtp(newOtp);
      speakTamil(num);
    }
  };

  // Auth Actions
  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      speakTamil("மன்னிக்கவும். சரியான 10 இலக்க அலைபேசி எண்ணை உள்ளிடவும்.");
      return;
    }

    setStatusText("THINKING");
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", phone })
      });
      const data = await res.json();
      if (data.success) {
        setStep("otp");
      } else {
        speakTamil("தவறு நிகழ்ந்துள்ளது. மீண்டும் முயலவும்.");
      }
    } catch (err) {
      console.error(err);
      speakTamil("இணைய இணைப்பு சிக்கல்.");
    } finally {
      setStatusText("READY");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      speakTamil("மன்னிக்கவும். 4 இலக்க கடவுச்சொல்லை உள்ளிடவும்.");
      return;
    }

    setStatusText("THINKING");
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", phone, code: otp })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setStep("dashboard");
      } else {
        setOtp("");
        speakTamil("தவறான கடவுச்சொல். சோதனைக்கு 1 2 3 4 ஐ உள்ளிடவும்.");
      }
    } catch (err) {
      console.error(err);
      speakTamil("கடவுச்சொல் சரிபார்ப்பில் தோல்வி.");
    } finally {
      setStatusText("READY");
    }
  };

  // Support physical keyboard inputs for phone and OTP screens
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (step === "auth") {
        if (e.key >= "0" && e.key <= "9") {
          if (phone.length < 10) {
            setPhone(prev => prev + e.key);
            speakTamil(e.key);
          }
        } else if (e.key === "Backspace") {
          setPhone(prev => prev.slice(0, -1));
        } else if (e.key === "Enter" && phone.length === 10) {
          handleSendOtp();
        }
      } else if (step === "otp") {
        if (e.key >= "0" && e.key <= "9") {
          if (otp.length < 4) {
            setOtp(prev => prev + e.key);
            speakTamil(e.key);
          }
        } else if (e.key === "Backspace") {
          setOtp(prev => prev.slice(0, -1));
        } else if (e.key === "Enter" && otp.length === 4) {
          handleVerifyOtp();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [step, phone, otp]);

  // START NEW CONVERSATION
  const startConversation = () => {
    setProfile({});
    setCurrentQuestionId("welcome");
    setMessages([
      {
        sender: "ai",
        text: "வணக்கம்! நான் துவக்கம் AI. தமிழக அரசின் திட்டங்கள் மற்றும் உதவித்தொகைகளை கண்டறிய உங்களுக்கு உதவுகிறேன். உங்கள் பெயரை சொல்லுங்கள்."
      }
    ]);
    setIsComplete(false);
    setMatchedSchemes([]);
    setStep("chat");
    setTimeout(() => {
      speakTamil("வணக்கம்! நான் துவக்கம் AI. தமிழக அரசின் திட்டங்கள் மற்றும் உதவித்தொகைகளை கண்டறிய உங்களுக்கு உதவுகிறேன். உங்கள் பெயரை சொல்லுங்கள்.");
    }, 500);
  };

  // HANDLE USER VOICE INPUT OR TEXT INPUT
  const handleUserInput = async (transcript: string) => {
    if (!transcript.trim()) return;

    // Add message to chat log
    setMessages(prev => [...prev, { sender: "user", text: transcript }]);
    setStatusText("THINKING");

    try {
      // Send transcript and state to API
      const state = {
        currentQuestionId,
        profile,
        previousQuestions: []
      };

      const res = await fetch("/api/voice/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, state })
      });
      const data = await res.json();

      if (data.error) {
        speakTamil("மன்னிக்கவும், புரிந்து கொள்ள முடியவில்லை. மீண்டும் கூறவும்.");
        setMessages(prev => [...prev, { sender: "ai", text: "மன்னிக்கவும், உங்கள் குரல் சரியாகப் புரியவில்லை. மீண்டும் கூறவும்." }]);
        setStatusText("READY");
        return;
      }

      // Recognize navigation command first
      if (data.navigationCommand && data.navigationCommand !== "none") {
        handleNavigation(data.navigationCommand);
        return;
      }

      // Update state
      setProfile(data.profile);
      setCurrentQuestionId(data.nextQuestionId);
      setIsComplete(data.isComplete);

      if (data.tamilResponse) {
        setMessages(prev => [...prev, { sender: "ai", text: data.tamilResponse }]);
        speakTamil(data.tamilResponse);
      }

      // If complete, fetch matches!
      if (data.isComplete) {
        fetchSchemeMatches(data.profile);
      }

    } catch (err) {
      console.error(err);
      speakTamil("இணைப்பில் பிழை ஏற்பட்டது. மீண்டும் முயலவும்.");
    } finally {
      if (statusText === "THINKING") setStatusText("READY");
    }
  };

  // Listen wrapper
  const handleMicTap = async () => {
    if (isListening) {
      voiceAgent?.stopListening();
      return;
    }

    try {
      const transcript = await voiceAgent?.listen();
      handleUserInput(transcript);
    } catch (err: any) {
      const errorType = err?.error || err?.message || "unknown";
      console.warn(`Speech recognition status/error: ${errorType}`, err);
      if (errorType === "not-allowed" || errorType === "audio-capture") {
        speakTamil("உங்கள் மைக்ரோஃபோன் அனுமதியைச் சரிபார்க்கவும்.");
      }
    }
  };

  // Navigation commands recognized globally
  const handleNavigation = (command: string) => {
    speakTamil(`கட்டளை பெறப்பட்டது: ${command}`);
    if (command === "menu") {
      setStep("dashboard");
    } else if (command === "previous") {
      // Simple revert
      startConversation();
    } else if (command === "next" && isComplete) {
      setStep("recommendations");
    } else if (command === "repeat") {
      const lastAiMessage = [...messages].reverse().find(m => m.sender === "ai");
      if (lastAiMessage) speakTamil(lastAiMessage.text);
    }
  };

  // Matching function
  const fetchSchemeMatches = async (completedProfile: UserProfile) => {
    setStatusText("THINKING");
    try {
      // We will match in database
      // First get all active schemes from database
      const resSchemes = await fetch("/api/admin/schemes");
      const schemesData = await resSchemes.json();

      if (schemesData.success) {
        const schemes = schemesData.schemes;
        // Call the client side ranker
        const { rankSchemes } = require("@/lib/matcher");
        const ranked = rankSchemes(completedProfile, schemes);
        setMatchedSchemes(ranked);

        // Inform user they have matches
        const count = ranked.length;
        const msg = count > 0
          ? `உங்களுக்குப் பொருத்தமான ${count} திட்டங்களைக் கண்டறிந்துள்ளேன்! அவற்றைப் பார்க்க 'திட்டங்களை காட்டு' என்று கூறுங்கள் அல்லது பொத்தானை அழுத்தவும்.`
          : "மன்னிக்கவும். உங்களது தகுதிக்கு ஏற்ற திட்டங்கள் எதுவும் தற்போது இல்லை.";

        setMessages(prev => [...prev, { sender: "ai", text: msg }]);
        speakTamil(msg);
      }
    } catch (e) {
      console.error("Error matching schemes:", e);
    } finally {
      setStatusText("READY");
    }
  };

  // View scheme details
  const viewSchemeDetails = async (match: MatchResult) => {
    setSelectedScheme(match);
    setSchemeExplanation("");
    setFollowUpAnswer("");
    setStep("recommendations");

    // Call explain API
    try {
      const res = await fetch("/api/voice/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schemeId: match.schemeId, question: null, isFollowUp: false })
      });
      const data = await res.json();
      if (data.response) {
        setSchemeExplanation(data.response);
        speakTamil(data.response);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Scheme specific follow-up questions
  const askFollowUp = async (questionText: string) => {
    if (!questionText.trim() || !selectedScheme) return;

    setFollowUpQuestion(questionText);
    setFollowUpAnswer("மின்னணு பதில் தேடப்படுகிறது...");

    try {
      const res = await fetch("/api/voice/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemeId: selectedScheme.schemeId,
          question: questionText,
          isFollowUp: true
        })
      });
      const data = await res.json();
      if (data.response) {
        setFollowUpAnswer(data.response);
        speakTamil(data.response);
      }
    } catch (e) {
      console.error(e);
      setFollowUpAnswer("பதில் பெறுவதில் பிழை.");
    }
  };

  const handleFollowUpMicTap = async () => {
    if (isFollowUpListening) {
      voiceAgent?.stopListening();
      return;
    }

    setIsFollowUpListening(true);
    try {
      const transcript = await voiceAgent?.listen();
      askFollowUp(transcript);
    } catch (e: any) {
      const errorType = e?.error || e?.message || "unknown";
      console.warn(`Speech recognition status/error: ${errorType}`, e);
      if (errorType === "not-allowed" || errorType === "audio-capture") {
        speakTamil("உங்கள் மைக்ரோஃபோன் அனுமதியைச் சரிபார்க்கவும்.");
      }
    } finally {
      setIsFollowUpListening(false);
    }
  };

  // Document photo upload simulation
  const handlePhotoCapture = (docName: string) => {
    setUploadedDocs(prev => ({ ...prev, [docName]: true }));
    speakTamil(`${docName} புகைப்படம் எடுக்கப்பட்டது.`);
  };

  const handleApplySubmit = async () => {
    // Verify all docs uploaded
    const requiredDocsList = JSON.parse(selectedScheme.scheme?.requiredDocuments || "[]") as string[];
    const allUploaded = requiredDocsList.every(d => uploadedDocs[d]);

    if (!allUploaded) {
      speakTamil("விண்ணப்பிக்க அனைத்து ஆவணங்களையும் புகைப்படம் எடுக்க வேண்டும்.");
      return;
    }

    setStatusText("THINKING");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          schemeId: selectedScheme.schemeId,
          documents: Object.keys(uploadedDocs).map(d => `/mock_camera/${d.replace(/\s+/g, '_')}.jpg`),
          profileData: profile
        })
      });
      const data = await res.json();
      if (data.success) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        setAppNumber(`APP-${randomNum}`);
        setApplySuccess(true);
        speakTamil("வாழ்த்துகள்! உங்கள் விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது. விரைவில் அதிகாரிகள் தொடர்பு கொள்வார்கள்.");
        fetchUserApplications(); // Refresh history
      } else {
        speakTamil(data.message || "சமர்ப்பிப்பதில் தோல்வி.");
      }
    } catch (e) {
      console.error(e);
      speakTamil("பிழை ஏற்பட்டது.");
    } finally {
      setStatusText("READY");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans">

      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-500/20">
            த
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              துவக்கம் AI
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Thovakkam Tamil Voice Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Spoken Feedback Toggle */}

          <button
            onClick={() => { if (lastSpokenText) speakTamil(lastSpokenText); }}
            disabled={!lastSpokenText}
            className="p-3 rounded-full transition bg-slate-700 text-emerald-400 hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700"
            aria-label="கடைசி செய்தியை மீண்டும் கேட்க (Replay last message)"
            title="Replay last message"
          >
            <Play size={20} />
          </button>

          {/* User Signout */}
          {user && (
            <button
              onClick={() => {
                setUser(null);
                setStep("auth");
                setPhone("");
                setOtp("");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600/20 border border-rose-500/30 text-rose-300 rounded-lg hover:bg-rose-600/30 transition text-sm font-semibold"
              aria-label="வெளியேறு (Logout)"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">வெளியேறு</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex flex-col flex-1 items-center justify-center p-4 max-w-xl mx-auto w-full">

        {/* -------------------- STEP 0: HOME PAGE -------------------- */}
        {step === "home" && (
          <div className="w-full flex flex-col gap-8 text-center animate-fade-in py-6">
            {/* Hero Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider animate-pulse">
                தமிழக அரசு உதவித்தொகை திட்டங்கள்
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                துவக்கம் AI
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed font-medium">
                தமிழக அரசின் திட்டங்கள் மற்றும் கல்வி உதவித்தொகைகளை எளிய முறையில் கண்டறிந்து விண்ணப்பிக்க உதவும் குரல் வழி வழிகாட்டி.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-2">
              <div className="flex flex-col items-center p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-lg hover:border-blue-500/30 transition group">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition mb-3">
                  <Volume2 size={24} />
                </div>
                <h3 className="font-bold text-sm text-slate-100 mb-1">குரல் வழி வழிகாட்டி</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">AI-உடன் தமிழில் பேசி உங்களுக்குத் தேவையான திட்டங்களைத் தேடலாம்.</p>
              </div>

              <div className="flex flex-col items-center p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-lg hover:border-emerald-500/30 transition group">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition mb-3">
                  <Grid size={24} />
                </div>
                <h3 className="font-bold text-sm text-slate-100 mb-1">தகுதி பொருத்தம்</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">உங்கள் விவரங்களுக்குப் பொருத்தமான திட்டங்களை உடனே கண்டறியலாம்.</p>
              </div>

              <div className="flex flex-col items-center p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-lg hover:border-indigo-500/30 transition group">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition mb-3">
                  <FileText size={24} />
                </div>
                <h3 className="font-bold text-sm text-slate-100 mb-1">எளிய விண்ணப்பம்</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">தேவையான ஆவணங்களைப் புகைப்படம் எடுத்து எளிதாக விண்ணப்பிக்கலாம்.</p>
              </div>
            </div>

            {/* CTA Action */}
            <div className="flex flex-col items-center gap-4 mt-4">
              <button
                onClick={() => setStep("auth")}
                className="w-full max-w-xs py-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-lg shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 active:scale-98 transition flex items-center justify-center gap-3"
              >
                <Play size={20} className="fill-white" />
                தொடங்கவும் (Get Started)
              </button>
              <p className="text-xs text-slate-500 font-medium">
                பாதுகாப்பானது மற்றும் எளிமையானது • 100% Secure & Accessible
              </p>
              <a
                href="/admin"
                className="mt-2 text-xs text-slate-500 hover:text-indigo-400 transition font-bold flex items-center gap-1.5 underline underline-offset-4"
              >
                <Lock size={12} />
                அதிகாரிகள் தளம் (Admin Portal)
              </a>
            </div>
          </div>
        )}

        {/* -------------------- STEP 1: AUTH PHONE -------------------- */}
        {step === "auth" && (
          <div className="w-full flex flex-col gap-6 text-center animate-fade-in py-6">
            {/* Back to Homepage */}
            <button 
              onClick={() => setStep("home")}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-200 font-semibold mb-2 self-start text-sm transition"
            >
              <ArrowLeft size={16} />
              <span>முகப்புப் பக்கம் (Home)</span>
            </button>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-inner">
                <Phone size={32} />
              </div>
              <h2 className="text-2xl font-bold">அலைபேசி எண்</h2>
              <p className="text-slate-400 mt-2 text-sm">உள்நுழைய 10 இலக்க அலைபேசி எண்ணை உள்ளிடவும்.</p>
            </div>

            {/* Display digits */}
            <div className="w-full bg-slate-800 border border-slate-700 py-4 px-6 rounded-xl text-3xl font-mono tracking-widest text-blue-400 h-16 flex items-center justify-center shadow-inner">
              {phone || "அலைபேசி எண்"}
            </div>

            {/* Dial pad - Accessible large touch targets */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto w-full">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <button
                  key={num}
                  onClick={() => handleDial(num)}
                  className="h-16 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition font-bold text-xl flex items-center justify-center border border-slate-700/50 shadow"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setPhone("")}
                className="h-16 rounded-xl bg-slate-800/50 text-rose-400 hover:bg-rose-600/20 transition text-sm font-semibold flex items-center justify-center border border-slate-700/50"
              >
                அழி
              </button>
              <button
                onClick={() => handleDial("0")}
                className="h-16 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition font-bold text-xl flex items-center justify-center border border-slate-700/50 shadow"
              >
                0
              </button>
              <button
                onClick={handleDialBackspace}
                className="h-16 rounded-xl bg-slate-800/50 text-slate-300 hover:bg-slate-700 transition flex items-center justify-center border border-slate-700/50"
                aria-label="பின்செல்லவும் (Backspace)"
              >
                <Undo2 size={20} />
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSendOtp}
              disabled={phone.length !== 10}
              className="mt-4 w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-500/20 active:scale-98 transition flex items-center justify-center gap-2"
            >
              தொடரவும் (Next)
            </button>
          </div>
        )}

        {/* -------------------- STEP 2: OTP VERIFY -------------------- */}
        {step === "otp" && (
          <div className="w-full flex flex-col gap-6 text-center animate-fade-in py-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-inner">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold">கடவுச்சொல்</h2>
              <p className="text-slate-400 mt-2 text-sm">4 இலக்க கடவுச்சொல்லை உள்ளிடவும்.<br />(சோதனை எண்: <span className="font-bold text-blue-400">1234</span>)</p>
            </div>

            {/* Display OTP */}
            <div className="w-full bg-slate-800 border border-slate-700 py-4 px-6 rounded-xl text-3xl font-mono tracking-[1rem] text-emerald-400 h-16 flex items-center justify-center shadow-inner">
              {otp ? otp.padEnd(4, "•").split("").map((c, i) => (
                <span key={i} className={otp[i] ? "text-emerald-400" : "text-slate-600"}>{c}</span>
              )) : "••••"}
            </div>

            {/* Dial pad - Accessible large touch targets */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto w-full">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <button
                  key={num}
                  onClick={() => handleOtpDial(num)}
                  className="h-16 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition font-bold text-xl flex items-center justify-center border border-slate-700/50 shadow"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setOtp("")}
                className="h-16 rounded-xl bg-slate-800/50 text-rose-400 hover:bg-rose-600/20 transition text-sm font-semibold flex items-center justify-center border border-slate-700/50"
              >
                அழி
              </button>
              <button
                onClick={() => handleOtpDial("0")}
                className="h-16 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition font-bold text-xl flex items-center justify-center border border-slate-700/50 shadow"
              >
                0
              </button>
              <button
                onClick={() => setOtp(prev => prev.slice(0, -1))}
                className="h-16 rounded-xl bg-slate-800/50 text-slate-300 hover:bg-slate-700 transition flex items-center justify-center border border-slate-700/50"
              >
                <Undo2 size={20} />
              </button>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={otp.length !== 4}
              className="mt-4 w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold text-lg shadow-lg shadow-emerald-500/20 active:scale-98 transition flex items-center justify-center gap-2"
            >
              சரிபார்க்கவும் (Verify)
            </button>

            <button
              onClick={() => { setStep("auth"); setPhone(""); setOtp(""); }}
              className="text-sm text-slate-400 hover:text-slate-200 transition font-semibold"
            >
              எண்ணை மாற்றவும்
            </button>
          </div>
        )}

        {/* -------------------- STEP 3: CITIZEN DASHBOARD -------------------- */}
        {step === "dashboard" && (
          <div className="w-full flex flex-col gap-6 py-4 animate-fade-in">
            {/* User welcome card */}
            <div className="bg-gradient-to-br from-blue-900/60 to-indigo-950/60 border border-blue-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                <Mic size={150} />
              </div>
              <h2 className="text-xl font-bold mb-1">வரவேற்கிறோம், {user?.name || "அன்பர்"}!</h2>
              <p className="text-xs text-blue-300 font-medium">அலைபேசி: {user?.phone}</p>

              <button
                onClick={startConversation}
                className="mt-6 w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-lg shadow-blue-500/30 active:scale-98 transition flex items-center justify-center gap-3"
              >
                <Mic size={24} className="animate-pulse" />
                திட்டங்களை கண்டறி (Start Search)
              </button>
            </div>

            {/* Application history status */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-300">
                <FileText size={20} className="text-blue-400" />
                விண்ணப்பங்களின் நிலை (Application Status)
              </h3>

              {userApplications.length === 0 ? (
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-8 text-center text-slate-500 font-medium">
                  விண்ணப்பங்கள் எதுவும் இல்லை. (No applications found.)
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {userApplications.map((app: any) => {
                    const statusTextMap = {
                      pending: "ஆய்வில் உள்ளது (Pending)",
                      under_review: "சரிபார்ப்பில் உள்ளது (Under Review)",
                      approved: "ஏற்கப்பட்டது (Approved)",
                      rejected: "நிராகரிக்கப்பட்டது (Rejected)",
                      documents_requested: "கூடுதல் ஆவணம் தேவை (Docs Requested)"
                    };
                    const statusColorMap = {
                      pending: "bg-amber-500/10 border-amber-500/30 text-amber-300",
                      under_review: "bg-blue-500/10 border-blue-500/30 text-blue-300",
                      approved: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
                      rejected: "bg-rose-500/10 border-rose-500/30 text-rose-300",
                      documents_requested: "bg-purple-500/10 border-purple-500/30 text-purple-300"
                    };
                    return (
                      <div
                        key={app.id}
                        className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow hover:border-slate-600 transition"
                      >
                        <div>
                          <h4 className="font-bold text-sm text-slate-200 line-clamp-1">{app.scheme.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-1">விண்ணப்பித்த தேதி: {new Date(app.submittedAt).toLocaleDateString("en-GB")}</p>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full border text-xs font-bold shrink-0 self-start sm:self-auto ${statusColorMap[app.status as keyof typeof statusColorMap]}`}>
                          {statusTextMap[app.status as keyof typeof statusTextMap] || app.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* -------------------- STEP 4: ADAPTIVE VOICE CHAT -------------------- */}
        {step === "chat" && (
          <div className="w-full flex flex-col flex-1 h-[70vh] py-2 animate-fade-in">
            {/* Back button */}
            <button
              onClick={() => { voiceAgent?.cancelAll(); setStep("dashboard"); }}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-200 font-semibold mb-3 self-start text-sm"
            >
              <ArrowLeft size={16} />
              முதன்மை மெனு (Main Menu)
            </button>

            {/* Speech Chat Window */}
            <div className="flex-1 overflow-y-auto bg-slate-950/40 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 max-h-[40vh] sm:max-h-[50vh] shadow-inner mb-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed shadow ${m.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none"
                    }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Conversation Progress Tracker */}
            <div className="grid grid-cols-5 gap-2 px-2 py-1 mb-4 border border-slate-800/40 rounded-xl bg-slate-800/10 text-[9px] uppercase font-bold text-center text-slate-500">
              <span className={profile.name ? "text-emerald-400" : ""}>பெயர்</span>
              <span className={profile.age ? "text-emerald-400" : ""}>வயது</span>
              <span className={profile.district ? "text-emerald-400" : ""}>மாவட்டம்</span>
              <span className={profile.isStudent !== undefined ? "text-emerald-400" : ""}>தொழில்</span>
              <span className={profile.annualIncome ? "text-emerald-400" : ""}>வருமானம்</span>
            </div>

            {/* Mic / Action Console */}
            <div className="flex flex-col items-center gap-4 mt-auto">

              {/* Massive Mic Button */}
              <div className="relative">
                {/* Visual pulse indicators for states */}
                {isListening && (
                  <span className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
                )}
                {isSpeaking && (
                  <span className="absolute -inset-3 rounded-full bg-blue-500/10 border-2 border-blue-500/30 animate-pulse pointer-events-none" />
                )}

                <button
                  onClick={handleMicTap}
                  className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition border-4 ${isListening
                    ? "bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white shadow-emerald-600/30"
                    : isSpeaking
                      ? "bg-blue-700 hover:bg-blue-600 border-blue-400 text-white shadow-blue-600/30"
                      : statusText === "THINKING"
                        ? "bg-amber-600 border-amber-400 text-white animate-spin"
                        : "bg-blue-600 hover:bg-blue-500 border-blue-500/50 text-white shadow-blue-500/20"
                    }`}
                  aria-label={isListening ? "கேட்கிறது (Listening - Tap to stop)" : "பேசுவதற்கு அழுத்தவும் (Tap to Speak)"}
                >
                  {statusText === "THINKING" ? (
                    <RefreshCw size={36} className="animate-spin" />
                  ) : isListening ? (
                    <Mic size={36} className="animate-bounce" />
                  ) : (
                    <Mic size={36} />
                  )}
                </button>
              </div>

              {/* Status helper text */}
              <p className={`text-xs font-bold uppercase tracking-wider ${isListening ? "text-emerald-400 animate-pulse" : isSpeaking ? "text-blue-400" : "text-slate-400"
                }`}>
                {isListening
                  ? "துவக்கம் கேட்கிறது... பேசவும்"
                  : isSpeaking
                    ? "துவக்கம் பேசுகிறது... கேட்கவும்"
                    : statusText === "THINKING"
                      ? "பகுப்பாய்வு செய்யப்படுகிறது..."
                      : "பேசுவதற்கு மைக் அழுத்தவும்"}
              </p>

              {/* Developer Input Fallback (for testing speech locally without actual mic) */}
              <div className="w-full flex gap-2 border-t border-slate-800 pt-4 mt-2">
                <input
                  type="text"
                  placeholder="குரலுக்கு பதிலாக தட்டச்சு செய்யவும்... (Dev Mode)"
                  value={devInput}
                  onChange={(e) => setDevInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUserInput(devInput);
                      setDevInput("");
                    }
                  }}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => {
                    handleUserInput(devInput);
                    setDevInput("");
                  }}
                  className="bg-slate-700 hover:bg-slate-600 px-4 rounded-lg text-xs font-bold"
                >
                  அனுப்பு
                </button>
              </div>

              {/* Action buttons (Complete state) */}
              {isComplete && (
                <button
                  onClick={() => setStep("recommendations")}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl active:scale-98 transition flex items-center justify-center gap-2"
                >
                  <BookOpen size={18} />
                  பொருந்தும் திட்டங்களைக் காட்டு (Show Schemes)
                </button>
              )}

            </div>
          </div>
        )}

        {/* -------------------- STEP 5: RECOMMENDATIONS -------------------- */}
        {step === "recommendations" && (
          <div className="w-full flex flex-col gap-6 py-4 animate-fade-in">
            {/* Top Navigation */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <button
                onClick={() => { voiceAgent?.cancelAll(); setStep("chat"); }}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 font-semibold text-sm"
              >
                <ArrowLeft size={16} />
                உரையாடல் (Back to chat)
              </button>
              <h2 className="font-bold text-slate-300">உங்களுக்கான திட்டங்கள்</h2>
            </div>

            {/* Selected Scheme Detail View */}
            {selectedScheme ? (
              <div className="flex flex-col gap-4 bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl animate-scale-in">
                <button
                  onClick={() => { voiceAgent?.cancelAll(); setSelectedScheme(null); }}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold self-start"
                >
                  <ArrowLeft size={14} /> திட்டங்கள் பட்டியல் (All Schemes)
                </button>

                <h3 className="text-xl font-bold leading-tight">{selectedScheme.schemeName}</h3>

                {/* Explanation text */}
                <div className="bg-slate-950/40 border border-slate-700/50 rounded-xl p-4 text-sm leading-relaxed text-slate-200 flex items-start gap-3">
                  <span className="flex-1">{schemeExplanation || "விளக்கம் பெறப்படுகிறது..."}</span>

                  {schemeExplanation && (
                    <button
                      onClick={() => speakTamil(schemeExplanation)}
                      className="shrink-0 w-9 h-9 rounded-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 flex items-center justify-center transition active:scale-90"
                      aria-label="மீண்டும் கேட்க (Replay explanation)"
                      title="மீண்டும் கேட்க"
                    >
                      <Volume2 size={16} className="text-blue-400" />
                    </button>
                  )}
                </div>

                {/* Follow up question section */}
                <div className="border-t border-slate-700 pt-4 flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">திட்டம் பற்றி கேள்வி கேளுங்கள் (Ask Follow-up)</h4>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleFollowUpMicTap}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition border ${isFollowUpListening
                        ? "bg-emerald-600 border-emerald-400 text-white animate-pulse"
                        : "bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200"
                        }`}
                      aria-label="கேள்வி கேட்க மைக் (Mic for follow-up)"
                      title="Tap and ask a follow-up question"
                    >
                      <Mic size={20} />
                    </button>

                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        placeholder="எ.கா. என்ன ஆவணங்கள் தேவை? (Ask a question...)"
                        value={followUpQuestion}
                        onChange={(e) => setFollowUpQuestion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            askFollowUp(followUpQuestion);
                          }
                        }}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none"
                      />
                      <button
                        onClick={() => askFollowUp(followUpQuestion)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold"
                      >
                        தேடு
                      </button>
                    </div>
                  </div>

                  {followUpAnswer && (
                    <div className="bg-blue-950/20 border border-blue-500/20 text-blue-300 rounded-xl p-3 text-xs leading-relaxed animate-fade-in">
                      <span className="font-bold text-[10px] block text-blue-400 uppercase tracking-wider mb-1">பதில் (Answer):</span>
                      {followUpAnswer}
                    </div>
                  )}
                </div>

                {/* Apply wizard trigger */}
                <button
                  onClick={() => {
                    voiceAgent?.cancelAll();
                    setUploadedDocs({});
                    setApplySuccess(false);
                    setStep("apply");
                  }}
                  className="mt-2 w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg active:scale-98 transition flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  இப்போதே விண்ணப்பிக்கவும் (Apply Now)
                </button>
              </div>
            ) : (
              /* All matched schemes listing */
              <div className="flex flex-col gap-4">
                {matchedSchemes.length === 0 ? (
                  <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-8 text-center text-slate-500 font-bold">
                    தகுதிபெறும் திட்டங்கள் எதுவும் கண்டறியப்படவில்லை. (No matched schemes found.)
                  </div>
                ) : (
                  matchedSchemes.map((match) => (
                    <div
                      key={match.schemeId}
                      className="bg-slate-850 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-5 shadow cursor-pointer hover:border-blue-500/40 transition group flex flex-col gap-3"
                      onClick={() => viewSchemeDetails(match)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-base leading-snug group-hover:text-blue-400 transition flex-1">{match.schemeName}</h3>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-1 bg-blue-600/20 border border-blue-500/20 text-blue-300 rounded text-[10px] font-bold shadow-inner">
                            பொருத்தம்: {match.score}%
                          </span>

                          {/* Speak this card's info */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Card click aagama irukka
                              const reasonText = match.reasons.length > 0 ? match.reasons[0] : "";
                              speakTamil(`${match.schemeName}. ${reasonText}`);
                            }}
                            className="w-8 h-8 rounded-full bg-slate-700/60 hover:bg-slate-600 flex items-center justify-center transition active:scale-90"
                            aria-label="இந்த திட்டத்தை பேசிக் காட்டு (Speak this scheme)"
                            title="Speak this scheme"
                          >
                            <Volume2 size={14} className="text-blue-300" />
                          </button>
                        </div>
                      </div>

                      {/* Short reasons snippet */}
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {match.reasons.length > 0 ? match.reasons[0] : "விபரங்களைக் காண தட்டவும்."}
                      </p>

                      <div className="flex items-center justify-between border-t border-slate-700/40 pt-3 mt-1 text-xs text-blue-400 font-bold">
                        <span>விவரம் & கேள்விகள்</span>
                        <Play size={12} className="group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* -------------------- STEP 6: APPLY WIZARD -------------------- */}
        {step === "apply" && selectedScheme && (
          <div className="w-full flex flex-col gap-6 py-4 animate-fade-in">
            {/* Top Navigation */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <button
                onClick={() => { voiceAgent?.cancelAll(); setStep("recommendations"); }}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 font-semibold text-sm"
              >
                <ArrowLeft size={16} />
                திட்டம் விவரங்கள் (Back)
              </button>
              <h2 className="font-bold text-slate-300">விண்ணப்பம் சமர்ப்பித்தல்</h2>
            </div>

            {applySuccess ? (
              /* Success panel */
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center shadow-xl animate-scale-in flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-emerald-600/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mb-2">
                  <CheckCircle size={48} className="animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-400">சமர்ப்பிக்கப்பட்டது!</h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
                  உங்கள் விண்ணப்பம் வெற்றிகரமாகப் பதிவுசெய்யப்பட்டது. உங்கள் விண்ணப்ப எண்: <span className="font-mono text-blue-400 font-bold block text-lg mt-1">{appNumber}</span>
                </p>

                <button
                  onClick={() => {
                    setStep("dashboard");
                    setSelectedScheme(null);
                    setUploadedDocs({});
                  }}
                  className="mt-4 w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition shadow-lg active:scale-98"
                >
                  முதன்மைப் பக்கத்திற்குச் செல்லவும் (Go to Dashboard)
                </button>
              </div>
            ) : (
              /* Step-by-step document uploader */
              <div className="flex flex-col gap-5 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
                <div>
                  <h3 className="font-bold text-base line-clamp-1">{selectedScheme.schemeName}</h3>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">தேவைப்படும் ஆவணங்களை பதிவேற்றவும் (Upload Documents)</p>
                </div>

                <div className="flex flex-col gap-4 border-y border-slate-700/80 py-4">
                  {(JSON.parse(selectedScheme.scheme?.requiredDocuments || "[]") as string[]).map((doc, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${uploadedDocs[doc] ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-400"
                          }`}>
                          {uploadedDocs[doc] ? <Check size={14} /> : idx + 1}
                        </div>
                        <span className="font-bold text-sm text-slate-200">{doc}</span>
                      </div>

                      {/* Mock camera capture button (accessible large target) */}
                      <button
                        onClick={() => handlePhotoCapture(doc)}
                        className={`h-12 px-4 rounded-lg flex items-center gap-1.5 text-xs font-bold transition border ${uploadedDocs[doc]
                          ? "bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-750"
                          : "bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600/20"
                          }`}
                        aria-label={`${doc} புகைப்படம் எடுக்கவும் (Take photo of ${doc})`}
                      >
                        <Camera size={16} />
                        <span>{uploadedDocs[doc] ? "மாற்றுக" : "படம் எடு"}</span>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-[10px] text-slate-400 text-center font-medium">அனைத்து ஆவணங்களையும் புகைப்படம் எடுத்த பின் &quot;சமர்ப்பி&quot; பொத்தானை அழுத்தவும்.</p>

                  <button
                    onClick={handleApplySubmit}
                    className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold text-lg active:scale-98 transition"
                    disabled={
                      !(JSON.parse(selectedScheme.scheme?.requiredDocuments || "[]") as string[]).every(d => uploadedDocs[d])
                    }
                  >
                    விண்ணப்பத்தைச் சமர்ப்பி (Submit Application)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Floating Bottom mic button on non-chat active steps */}
      {step !== "chat" && step !== "auth" && step !== "otp" && (
        <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
          <button
            onClick={startConversation}
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 border border-blue-400/40 text-white flex items-center justify-center shadow-2xl active:scale-95 transition"
            aria-label="துவக்கம் உதவியாளரை அழைக்கவும் (Call Thovakkam Voice Assistant)"
            title="Start Voice Assistant"
          >
            <Mic size={24} className="animate-pulse" />
          </button>
        </div>
      )}

      {/* Footer copyright */}
      <footer className="text-center py-6 text-[10px] text-slate-600 border-t border-slate-800 bg-slate-950/20 mt-auto">
        © 2026 தமிழ்நாடு அரசு. Thovakkam AI — Voice-First Schemes Assistant. (MVP)
      </footer>
    </div>
  );
}
