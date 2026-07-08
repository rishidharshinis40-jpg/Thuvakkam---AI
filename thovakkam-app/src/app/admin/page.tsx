"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  FileCheck, 
  Clock, 
  XOctagon, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Plus, 
  Check, 
  X, 
  AlertCircle, 
  Download, 
  Lock, 
  Layers, 
  MapPin, 
  PlusCircle, 
  Eye, 
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Helper type definitions
type Tab = "overview" | "applications" | "schemes" | "reports";
type ReviewStatus = "pending" | "under_review" | "approved" | "rejected" | "documents_requested";

export default function AdminDashboard() {
  // Session State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // UI Navigation State
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  
  // Data States
  const [stats, setStats] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [schemes, setSchemes] = useState<any[]>([]);

  // Search & Filter States
  const [appSearch, setAppSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("");
  const [appDistrictFilter, setAppDistrictFilter] = useState("");

  // Modals & Action States
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [currentScheme, setCurrentScheme] = useState<any>(null); // For Add/Edit CRUD
  
  // Scheme Form Fields
  const [schemeForm, setSchemeForm] = useState({
    name: "",
    description: "",
    category: "welfare",
    department: "",
    benefits: "",
    requiredDocuments: "",
    applicationProcedure: "",
    lastDate: "",
    officialLink: "",
    minAge: "",
    maxAge: "",
    gender: "any",
    maxIncome: "",
    isStudent: false,
    isFarmer: false,
    disabilityStatus: false,
    isSeniorCitizen: false
  });

  // Load stats and tables on login or tab change
  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchStats();
      fetchApplications();
      fetchSchemes();
    }
  }, [isAdminLoggedIn, appStatusFilter, appSearch, appDistrictFilter]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        setAdminUser(data.admin);
        setIsAdminLoggedIn(true);
      } else {
        setLoginError(data.error || "உள்நுழைவதில் தோல்வி (Login failed)");
      }
    } catch (err) {
      setLoginError("இணைப்பில் பிழை (Connection error)");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchApplications = async () => {
    try {
      let url = `/api/admin/applications?search=${appSearch}`;
      if (appStatusFilter) url += `&status=${appStatusFilter}`;
      if (appDistrictFilter) url += `&district=${appDistrictFilter}`;
      if (adminUser?.role === "district_officer" && adminUser.district) {
        url += `&district=${adminUser.district}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSchemes = async () => {
    try {
      const res = await fetch("/api/admin/schemes");
      const data = await res.json();
      if (data.success) {
        setSchemes(data.schemes || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Application Status Action
  const updateApplicationStatus = async (applicationId: string, status: ReviewStatus) => {
    try {
      const res = await fetch("/api/admin/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedApplication(null);
        fetchApplications();
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Scheme CRUD Handlers
  const handleSaveScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Assemble rules JSON
      const rules = {
        gender: schemeForm.gender,
        minAge: schemeForm.minAge ? parseInt(schemeForm.minAge) : undefined,
        maxAge: schemeForm.maxAge ? parseInt(schemeForm.maxAge) : undefined,
        maxIncome: schemeForm.maxIncome ? parseFloat(schemeForm.maxIncome) : undefined,
        isStudent: schemeForm.isStudent || undefined,
        isFarmer: schemeForm.isFarmer || undefined,
        disabilityStatus: schemeForm.disabilityStatus || undefined,
        isSeniorCitizen: schemeForm.isSeniorCitizen || undefined
      };

      // Split documents list by comma
      const requiredDocuments = schemeForm.requiredDocuments
        .split(",")
        .map(d => d.trim())
        .filter(d => d.length > 0);

      const payload = {
        id: currentScheme?.id,
        name: schemeForm.name,
        description: schemeForm.description,
        category: schemeForm.category,
        department: schemeForm.department,
        benefits: schemeForm.benefits,
        applicationProcedure: schemeForm.applicationProcedure,
        lastDate: schemeForm.lastDate || null,
        officialLink: schemeForm.officialLink || null,
        requiredDocuments: JSON.stringify(requiredDocuments),
        eligibilityRules: JSON.stringify(rules)
      };

      const method = currentScheme ? "PUT" : "POST";
      const res = await fetch("/api/admin/schemes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowSchemeModal(false);
        setCurrentScheme(null);
        fetchSchemes();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditSchemeClick = (scheme: any) => {
    setCurrentScheme(scheme);
    
    // Parse rules
    let rules: any = {};
    try { rules = JSON.parse(scheme.eligibilityRules); } catch (e) {}
    
    // Parse docs
    let docs = "";
    try {
      const parsedDocs = JSON.parse(scheme.requiredDocuments);
      if (Array.isArray(parsedDocs)) docs = parsedDocs.join(", ");
    } catch (e) {
      docs = scheme.requiredDocuments;
    }

    setSchemeForm({
      name: scheme.name,
      description: scheme.description,
      category: scheme.category,
      department: scheme.department,
      benefits: scheme.benefits,
      requiredDocuments: docs,
      applicationProcedure: scheme.applicationProcedure,
      lastDate: scheme.lastDate || "",
      officialLink: scheme.officialLink || "",
      minAge: rules.minAge?.toString() || "",
      maxAge: rules.maxAge?.toString() || "",
      gender: rules.gender || "any",
      maxIncome: rules.maxIncome?.toString() || "",
      isStudent: !!rules.isStudent,
      isFarmer: !!rules.isFarmer,
      disabilityStatus: !!rules.disabilityStatus,
      isSeniorCitizen: !!rules.isSeniorCitizen
    });
    
    setShowSchemeModal(true);
  };

  const handleCreateSchemeClick = () => {
    setCurrentScheme(null);
    setSchemeForm({
      name: "",
      description: "",
      category: "welfare",
      department: "",
      benefits: "",
      requiredDocuments: "",
      applicationProcedure: "",
      lastDate: "",
      officialLink: "",
      minAge: "",
      maxAge: "",
      gender: "any",
      maxIncome: "",
      isStudent: false,
      isFarmer: false,
      disabilityStatus: false,
      isSeniorCitizen: false
    });
    setShowSchemeModal(true);
  };

  const handleToggleSchemeStatus = async (schemeId: string) => {
    try {
      const res = await fetch(`/api/admin/schemes?id=${schemeId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        fetchSchemes();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // CSV Report Generator
  const downloadCSVReport = () => {
    if (applications.length === 0) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Application ID,Applicant Name,Phone Number,Scheme Applied,District,Submitted Date,Status\n";

    applications.forEach(app => {
      const row = [
        app.id,
        `"${app.user.name}"`,
        app.user.phone,
        `"${app.scheme.name}"`,
        app.user.district || "N/A",
        new Date(app.submittedAt).toLocaleDateString("en-GB"),
        app.status
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Thovakkam_AI_Applications_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chart data preppers
  const pieData = stats ? [
    { name: "Pending", value: stats.statusCounts.pending, color: "#F59E0B" },
    { name: "Under Review", value: stats.statusCounts.under_review, color: "#3B82F6" },
    { name: "Approved", value: stats.statusCounts.approved, color: "#10B981" },
    { name: "Rejected", value: stats.statusCounts.rejected, color: "#EF4444" },
    { name: "Requested Docs", value: stats.statusCounts.documents_requested, color: "#8B5CF6" }
  ].filter(d => d.value > 0) : [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-lg">
            அ
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">
              அதிகாரிகள் தளம்
            </h1>
            <p className="text-[9px] text-slate-400 tracking-wider font-semibold uppercase">Thovakkam Admin Dashboard</p>
          </div>
        </div>

        {isAdminLoggedIn && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-200">{adminUser?.name}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{adminUser?.role.replace("_", " ")} {adminUser?.district ? `(${adminUser.district})` : ""}</p>
            </div>
            <button
              onClick={() => {
                setIsAdminLoggedIn(false);
                setAdminUser(null);
                setUsername("");
                setPassword("");
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition text-xs font-semibold"
            >
              வெளியேறு (Logout)
            </button>
          </div>
        )}
      </header>

      {/* BODY PANEL */}
      <div className="flex flex-1 flex-col lg:flex-row">
        
        {/* LOGIN SCREEN */}
        {!isAdminLoggedIn ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent pointer-events-none rounded-2xl" />
              
              <div className="flex flex-col items-center mb-6">
                <div className="w-14 h-14 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
                  <Lock size={24} />
                </div>
                <h2 className="text-xl font-bold">அதிகாரி உள்நுழைவு</h2>
                <p className="text-xs text-slate-400 mt-1">அரசின் சேவைத் தளத்தை நிர்வகிக்க உள்நுழையவும்.</p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4 relative z-10">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">பயனர் பெயர் (Username)</label>
                  <input
                    type="text"
                    required
                    placeholder="எ.கா. superadmin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none transition font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">கடவுச்சொல் (Password)</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none transition"
                  />
                </div>

                {loginError && (
                  <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-2 w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl active:scale-98 transition shadow-lg shadow-indigo-500/20"
                >
                  உள்நுழை (Sign In)
                </button>
              </form>

              {/* Dev hint */}
              <div className="mt-6 border-t border-slate-800/80 pt-4 text-center text-[10px] text-slate-500 leading-relaxed font-semibold uppercase tracking-wider">
                Dev test accounts:<br/>
                superadmin / superadminpassword<br/>
                chennaiofficer / officerpassword
              </div>
            </div>
          </div>
        ) : (
          /* DASHBOARD VIEW */
          <>
            {/* SIDEBAR NAVIGATION */}
            <aside className="w-full lg:w-64 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-row lg:flex-col p-4 gap-2 shrink-0">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                  activeTab === "overview" 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/10" 
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Layers size={18} />
                <span>கண்ணோட்டம் (Overview)</span>
              </button>
              <button
                onClick={() => setActiveTab("applications")}
                className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                  activeTab === "applications" 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/10" 
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <FileCheck size={18} />
                <span>விண்ணப்பங்கள் (Review)</span>
              </button>
              <button
                onClick={() => setActiveTab("schemes")}
                className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                  activeTab === "schemes" 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/10" 
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <TrendingUp size={18} />
                <span>திட்ட மேலாண்மை (CRUD)</span>
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                  activeTab === "reports" 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/10" 
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Download size={18} />
                <span>அறிக்கைகள் (Reports)</span>
              </button>
            </aside>

            {/* CONTENT WRAPPER */}
            <main className="flex-1 p-6 overflow-y-auto max-w-6xl w-full mx-auto">
              
              {/* -------------------- TAB: OVERVIEW -------------------- */}
              {activeTab === "overview" && stats && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <h2 className="text-2xl font-bold tracking-tight">செயல்பாட்டு கண்ணோட்டம்</h2>

                  {/* Metric Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow">
                      <div className="flex justify-between items-center text-slate-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">வழக்கு பயனர்கள்</span>
                        <Users size={18} />
                      </div>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                      <p className="text-[10px] text-slate-500 mt-1">பதிவு செய்த பயனர்கள்</p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow">
                      <div className="flex justify-between items-center text-amber-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">புதிய மனுக்கள்</span>
                        <Clock size={18} />
                      </div>
                      <p className="text-2xl font-bold text-amber-400">{stats.statusCounts.pending}</p>
                      <p className="text-[10px] text-slate-500 mt-1">மதிப்பாய்வு செய்ய வேண்டியவை</p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow">
                      <div className="flex justify-between items-center text-blue-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">ஆய்வில் உள்ளவை</span>
                        <FileCheck size={18} />
                      </div>
                      <p className="text-2xl font-bold text-blue-400">{stats.statusCounts.under_review}</p>
                      <p className="text-[10px] text-slate-500 mt-1">பரிசீலனையில் உள்ள விண்ணப்பங்கள்</p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow">
                      <div className="flex justify-between items-center text-emerald-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">ஏற்கப்பட்டவை</span>
                        <Check size={18} />
                      </div>
                      <p className="text-2xl font-bold text-emerald-400">{stats.statusCounts.approved}</p>
                      <p className="text-[10px] text-slate-500 mt-1">ஒப்புதல் பெற்ற மனுக்கள்</p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow col-span-2 md:col-span-1">
                      <div className="flex justify-between items-center text-rose-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">நிராகரிப்பு</span>
                        <XOctagon size={18} />
                      </div>
                      <p className="text-2xl font-bold text-rose-400">{stats.statusCounts.rejected}</p>
                      <p className="text-[10px] text-slate-500 mt-1">நிராகரிக்கப்பட்ட மனுக்கள்</p>
                    </div>
                  </div>

                  {/* Charts row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    
                    {/* Status pie chart */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow flex flex-col h-[320px]">
                      <h3 className="font-bold text-sm text-slate-300 mb-4">மனுக்களின் நிலை பரவல் (Application Status Status)</h3>
                      <div className="flex-1 flex items-center justify-center">
                        {pieData.length === 0 ? (
                          <p className="text-xs text-slate-500 font-bold">புள்ளிவிவரங்கள் எதுவும் இல்லை</p>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [`${value} விண்ணப்பங்கள்`, "எண்ணிக்கை"]} />
                              <Legend verticalAlign="bottom" height={36} iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    {/* Top schemes bar chart */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow flex flex-col h-[320px]">
                      <h3 className="font-bold text-sm text-slate-300 mb-4">அதிக வரவேற்பைப் பெற்ற 5 திட்டங்கள் (Popular Schemes)</h3>
                      <div className="flex-1">
                        {stats.popularSchemes.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-xs text-slate-500 font-bold">மனுக்கள் எதுவும் இன்னும் பெறப்படவில்லை</div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.popularSchemes} layout="vertical" margin={{ left: 10, right: 10, top: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                              <XAxis type="number" stroke="#64748B" fontSize={10} />
                              <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={8} width={100} />
                              <Tooltip formatter={(value) => [`${value} விண்ணப்பங்கள்`, "விண்ணப்பித்தவை"]} />
                              <Bar dataKey="count" fill="#4F46E5" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    {/* District applicant metrics */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow flex flex-col h-[320px] md:col-span-2">
                      <h3 className="font-bold text-sm text-slate-300 mb-4">மாவட்ட வாரியாக பதிவு செய்த பயனர்கள் (District-wise Users)</h3>
                      <div className="flex-1">
                        {stats.districtStats.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-xs text-slate-500 font-bold">தரவுகள் எதுவும் இல்லை</div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.districtStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                              <XAxis dataKey="district" stroke="#64748B" fontSize={10} />
                              <YAxis stroke="#64748B" fontSize={10} />
                              <Tooltip />
                              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* -------------------- TAB: APPLICATIONS -------------------- */}
              {activeTab === "applications" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h2 className="text-2xl font-bold tracking-tight">விண்ணப்பங்களின் மதிப்பாய்வு</h2>
                    
                    {/* Filters header */}
                    <div className="flex flex-wrap items-center gap-3">
                      
                      {/* Search box */}
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                        <input
                          type="text"
                          placeholder="பெயர், ஐடி அல்லது எண்..."
                          value={appSearch}
                          onChange={(e) => setAppSearch(e.target.value)}
                          className="bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none w-48 transition"
                        />
                      </div>

                      {/* Status select filter */}
                      <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
                        <Filter size={14} className="text-slate-500" />
                        <select
                          value={appStatusFilter}
                          onChange={(e) => setAppStatusFilter(e.target.value)}
                          className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer py-1"
                        >
                          <option value="">அனைத்து நிலைகளும் (All Status)</option>
                          <option value="pending">Pending (Pending)</option>
                          <option value="under_review">Under Review (Under Review)</option>
                          <option value="approved">Approved (Approved)</option>
                          <option value="rejected">Rejected (Rejected)</option>
                          <option value="documents_requested">Docs Requested (Docs Requested)</option>
                        </select>
                      </div>

                      {/* District filter */}
                      {!adminUser?.district && (
                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
                          <MapPin size={14} className="text-slate-500" />
                          <select
                            value={appDistrictFilter}
                            onChange={(e) => setAppDistrictFilter(e.target.value)}
                            className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer py-1"
                          >
                            <option value="">அனைத்து மாவட்டங்களும் (All Districts)</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Madurai">Madurai</option>
                            <option value="Salem">Salem</option>
                            <option value="Trichy">Trichy</option>
                            <option value="Coimbatore">Coimbatore</option>
                          </select>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Applications Table */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-800 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                            <th className="px-6 py-4">மனு ஐடி (App ID)</th>
                            <th className="px-6 py-4">விண்ணப்பதாரர் (Applicant)</th>
                            <th className="px-6 py-4">திட்டத்தின் பெயர் (Scheme)</th>
                            <th className="px-6 py-4">மாவட்டம் (District)</th>
                            <th className="px-6 py-4">தேதி (Date)</th>
                            <th className="px-6 py-4">நிலை (Status)</th>
                            <th className="px-6 py-4 text-center">செயல் (Action)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                          {applications.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-6 py-10 text-center text-slate-500 font-bold">மனுக்கள் எதுவும் இல்லை (No applications match parameters)</td>
                            </tr>
                          ) : (
                            applications.map((app) => (
                              <tr key={app.id} className="hover:bg-slate-850/50 transition">
                                <td className="px-6 py-4 font-mono font-bold text-slate-300">
                                  {app.id.slice(0, 8)}...
                                </td>
                                <td className="px-6 py-4">
                                  <p className="font-bold text-slate-200">{app.user.name}</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{app.user.phone}</p>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-200 line-clamp-1 max-w-[200px]" title={app.scheme.name}>
                                  {app.scheme.name}
                                </td>
                                <td className="px-6 py-4 text-slate-300">{app.user.district || "N/A"}</td>
                                <td className="px-6 py-4 text-slate-400">{new Date(app.submittedAt).toLocaleDateString("en-GB")}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2.5 py-1 rounded-full border font-bold text-[10px] uppercase ${
                                    app.status === "approved" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" :
                                    app.status === "rejected" ? "bg-rose-500/10 border-rose-500/30 text-rose-300" :
                                    app.status === "pending" ? "bg-amber-500/10 border-amber-500/30 text-amber-300" :
                                    "bg-blue-500/10 border-blue-500/30 text-blue-300"
                                  }`}>
                                    {app.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <button
                                    onClick={() => setSelectedApplication(app)}
                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg font-bold hover:border-slate-600 transition flex items-center gap-1 mx-auto"
                                  >
                                    <Eye size={12} />
                                    <span>மதிப்பீடு (Review)</span>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Detail Modal */}
                  {selectedApplication && (
                    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button 
                          onClick={() => setSelectedApplication(null)}
                          className="absolute right-4 top-4 p-2 bg-slate-800 hover:bg-slate-750 rounded-full text-slate-400 transition"
                        >
                          <X size={18} />
                        </button>

                        <h3 className="text-lg font-bold mb-4 pr-10">மனுவின் முழு மதிப்பீடு (Application Review)</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-800 pb-5 mb-5 text-xs">
                          {/* Applicant details */}
                          <div className="flex flex-col gap-2 bg-slate-950/40 p-4 border border-slate-800 rounded-xl">
                            <h4 className="font-bold text-indigo-400 uppercase tracking-wider mb-1 text-[10px]">விண்ணப்பதாரர் சுயவிவரம் (Applicant Profile)</h4>
                            <div className="flex justify-between py-1 border-b border-slate-800/40">
                              <span className="text-slate-400">பெயர்:</span>
                              <span className="font-bold text-slate-200">{selectedApplication.user.name}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-800/40">
                              <span className="text-slate-400">அலைபேசி:</span>
                              <span className="font-bold text-slate-200">{selectedApplication.user.phone}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-800/40">
                              <span className="text-slate-400">வயது:</span>
                              <span className="font-bold text-slate-200">{selectedApplication.user.age || "N/A"}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-800/40">
                              <span className="text-slate-400">பாலினம்:</span>
                              <span className="font-bold text-slate-200">{selectedApplication.user.gender || "N/A"}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-800/40">
                              <span className="text-slate-400">மாவட்டம்:</span>
                              <span className="font-bold text-slate-200">{selectedApplication.user.district || "N/A"}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-800/40">
                              <span className="text-slate-400">ஆண்டு வருமானம்:</span>
                              <span className="font-bold text-slate-200">ரூ. {selectedApplication.user.annualIncome || "0"}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="text-slate-400">விவசாயி / மாணவர்:</span>
                              <span className="font-bold text-slate-200">
                                {selectedApplication.user.isFarmer ? "விவசாயி (Farmer)" : ""}
                                {selectedApplication.user.isStudent ? "மாணவர் (Student)" : ""}
                                {!selectedApplication.user.isFarmer && !selectedApplication.user.isStudent ? "பிற (Others)" : ""}
                              </span>
                            </div>
                          </div>

                          {/* Scheme and documents info */}
                          <div className="flex flex-col gap-3">
                            <div>
                              <h4 className="font-bold text-indigo-400 uppercase tracking-wider text-[10px] mb-1">விண்ணப்பித்த திட்டம் (Applied Scheme)</h4>
                              <p className="font-bold text-slate-200 text-sm leading-snug">{selectedApplication.scheme.name}</p>
                              <p className="text-[10px] text-slate-400 mt-1">துறை: {selectedApplication.scheme.department}</p>
                            </div>

                            <div className="border-t border-slate-800 pt-3">
                              <h4 className="font-bold text-indigo-400 uppercase tracking-wider text-[10px] mb-1.5">பதிவேற்றிய ஆவணங்கள் (Uploaded Photos)</h4>
                              <div className="flex flex-col gap-2">
                                {(JSON.parse(selectedApplication.documents || "[]") as string[]).map((doc, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-800 border border-slate-700 rounded-lg">
                                    <span className="font-semibold text-[11px] truncate max-w-[150px]">{doc.split("/").pop()}</span>
                                    <a
                                      href={doc}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2 py-1 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded text-[10px] font-bold hover:bg-indigo-600/25"
                                    >
                                      ஆவணத்தைக் காட்டு
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Review actions console */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <button
                            onClick={() => updateApplicationStatus(selectedApplication.id, "approved")}
                            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl active:scale-98 transition flex items-center justify-center gap-1.5 text-xs"
                          >
                            <Check size={16} />
                            ஒப்புதல் அளி (Approve)
                          </button>
                          
                          <button
                            onClick={() => updateApplicationStatus(selectedApplication.id, "rejected")}
                            className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl active:scale-98 transition flex items-center justify-center gap-1.5 text-xs"
                          >
                            <X size={16} />
                            நிராகரி (Reject)
                          </button>

                          <button
                            onClick={() => updateApplicationStatus(selectedApplication.id, "documents_requested")}
                            className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl active:scale-98 transition flex items-center justify-center gap-1.5 text-xs"
                          >
                            <AlertCircle size={16} />
                            கூடுதல் ஆவணம் கோரு (Request Docs)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* -------------------- TAB: SCHEMES CRUD -------------------- */}
              {activeTab === "schemes" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">அரசு திட்டங்கள் நிர்வகிப்பு</h2>
                    
                    <button
                      onClick={handleCreateSchemeClick}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition flex items-center gap-2 text-xs shadow-lg shadow-indigo-500/10 active:scale-98"
                    >
                      <Plus size={16} />
                      புதிய திட்டம் உருவாக்கு (Add Scheme)
                    </button>
                  </div>

                  {/* Schemes List Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {schemes.map((scheme) => (
                      <div 
                        key={scheme.id} 
                        className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between gap-4 shadow hover:border-slate-700 transition ${
                          scheme.isActive ? "border-slate-800" : "border-slate-800/40 opacity-60"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-300 rounded text-[10px] font-bold uppercase tracking-wider">
                              {scheme.category}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              scheme.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                            }`}>
                              {scheme.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          
                          <h3 className="font-bold text-sm text-slate-200 line-clamp-1">{scheme.name}</h3>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{scheme.description}</p>
                          <p className="text-[10px] text-slate-500 mt-2 font-bold">துறை: {scheme.department}</p>
                        </div>

                        {/* CRUD actions buttons */}
                        <div className="flex items-center gap-2 border-t border-slate-800/80 pt-3">
                          <button
                            onClick={() => handleEditSchemeClick(scheme)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                          >
                            <Edit3 size={12} />
                            திருத்து (Edit)
                          </button>
                          
                          <button
                            onClick={() => handleToggleSchemeStatus(scheme.id)}
                            className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                              scheme.isActive 
                                ? "bg-rose-600/15 border-rose-500/20 text-rose-400 hover:bg-rose-600/25" 
                                : "bg-emerald-600/15 border-emerald-500/20 text-emerald-400 hover:bg-emerald-600/25"
                            }`}
                          >
                            <Trash2 size={12} />
                            <span>{scheme.isActive ? "முடக்கு (Deactivate)" : "செயல்படுத்து"}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add/Edit Modal Form */}
                  {showSchemeModal && (
                    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button 
                          onClick={() => { setShowSchemeModal(false); setCurrentScheme(null); }}
                          className="absolute right-4 top-4 p-2 bg-slate-800 hover:bg-slate-750 rounded-full text-slate-400 transition"
                        >
                          <X size={18} />
                        </button>

                        <h3 className="text-lg font-bold mb-4">
                          {currentScheme ? "திட்ட திருத்தம் (Edit Scheme)" : "புதிய திட்ட உருவாக்கம் (Add Scheme)"}
                        </h3>

                        <form onSubmit={handleSaveScheme} className="flex flex-col gap-4 text-xs font-medium">
                          
                          {/* Basic Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">திட்டத்தின் பெயர் (Scheme Name)</label>
                              <input
                                type="text"
                                required
                                value={schemeForm.name}
                                onChange={(e) => setSchemeForm({...schemeForm, name: e.target.value})}
                                className="bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">துறை (Department)</label>
                              <input
                                type="text"
                                required
                                value={schemeForm.department}
                                onChange={(e) => setSchemeForm({...schemeForm, department: e.target.value})}
                                className="bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">திட்ட விளக்கம் (Description)</label>
                            <textarea
                              required
                              rows={3}
                              value={schemeForm.description}
                              onChange={(e) => setSchemeForm({...schemeForm, description: e.target.value})}
                              className="bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none"
                            />
                          </div>

                          {/* Category and date details */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="flex flex-col gap-1.5 md:col-span-2">
                              <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">பிரிவு (Category)</label>
                              <select
                                value={schemeForm.category}
                                onChange={(e) => setSchemeForm({...schemeForm, category: e.target.value})}
                                className="bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none cursor-pointer"
                              >
                                <option value="welfare">Welfare (Marriage/General)</option>
                                <option value="education">Education (Scholarships)</option>
                                <option value="agriculture">Agriculture (Farmers)</option>
                                <option value="business">Business (Entrepreneurship)</option>
                                <option value="health">Health (Medical/Insurance)</option>
                              </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">கடைசி தேதி (Deadline)</label>
                              <input
                                type="text"
                                placeholder="DD-MM-YYYY"
                                value={schemeForm.lastDate}
                                onChange={(e) => setSchemeForm({...schemeForm, lastDate: e.target.value})}
                                className="bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">இணைய இணைப்பு (Official Link)</label>
                              <input
                                type="url"
                                placeholder="https://..."
                                value={schemeForm.officialLink}
                                onChange={(e) => setSchemeForm({...schemeForm, officialLink: e.target.value})}
                                className="bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Benefits and required documents list */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">திட்ட பலன்கள் (Benefits Description)</label>
                              <input
                                type="text"
                                required
                                value={schemeForm.benefits}
                                onChange={(e) => setSchemeForm({...schemeForm, benefits: e.target.value})}
                                className="bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">தேவைப்படும் ஆவணங்கள் (Required Documents - Comma separated)</label>
                              <input
                                type="text"
                                required
                                placeholder="Aadhaar Card, Income Certificate, Community Certificate"
                                value={schemeForm.requiredDocuments}
                                onChange={(e) => setSchemeForm({...schemeForm, requiredDocuments: e.target.value})}
                                className="bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">விண்ணப்பிக்கும் முறை (Application Procedure)</label>
                            <input
                              type="text"
                              required
                              value={schemeForm.applicationProcedure}
                              onChange={(e) => setSchemeForm({...schemeForm, applicationProcedure: e.target.value})}
                              className="bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none"
                            />
                          </div>

                          {/* Eligibility rule values config */}
                          <div className="border-t border-slate-800 pt-4 mt-2">
                            <h4 className="font-bold text-indigo-400 uppercase tracking-wider text-[10px] mb-3">தகுதி விதிகள் உள்ளமைப்பு (Eligibility Rules Configuration)</h4>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">குறைந்தபட்ச வயது (Min Age)</label>
                                <input
                                  type="number"
                                  value={schemeForm.minAge}
                                  onChange={(e) => setSchemeForm({...schemeForm, minAge: e.target.value})}
                                  className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">அதிகபட்ச வயது (Max Age)</label>
                                <input
                                  type="number"
                                  value={schemeForm.maxAge}
                                  onChange={(e) => setSchemeForm({...schemeForm, maxAge: e.target.value})}
                                  className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">ஆண்டு வருமான உச்சவரம்பு (Max Income)</label>
                                <input
                                  type="number"
                                  value={schemeForm.maxIncome}
                                  onChange={(e) => setSchemeForm({...schemeForm, maxIncome: e.target.value})}
                                  className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">பாலினம் (Gender)</label>
                                <select
                                  value={schemeForm.gender}
                                  onChange={(e) => setSchemeForm({...schemeForm, gender: e.target.value})}
                                  className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none cursor-pointer"
                                >
                                  <option value="any">அனைத்தும் (Any)</option>
                                  <option value="female">பெண் (Female Only)</option>
                                  <option value="male">ஆண் (Male Only)</option>
                                </select>
                              </div>
                            </div>

                            {/* Boolean condition flags checkbox grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 bg-slate-950/30 p-3 rounded-xl border border-slate-800/60">
                              <label className="flex items-center gap-2 cursor-pointer py-1">
                                <input
                                  type="checkbox"
                                  checked={schemeForm.isStudent}
                                  onChange={(e) => setSchemeForm({...schemeForm, isStudent: e.target.checked})}
                                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 focus:ring-2 cursor-pointer"
                                />
                                <span className="font-bold text-[10px] uppercase text-slate-300">மாணவர் மட்டுமே (Student)</span>
                              </label>

                              <label className="flex items-center gap-2 cursor-pointer py-1">
                                <input
                                  type="checkbox"
                                  checked={schemeForm.isFarmer}
                                  onChange={(e) => setSchemeForm({...schemeForm, isFarmer: e.target.checked})}
                                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 focus:ring-2 cursor-pointer"
                                />
                                <span className="font-bold text-[10px] uppercase text-slate-300">விவசாயி மட்டுமே (Farmer)</span>
                              </label>

                              <label className="flex items-center gap-2 cursor-pointer py-1">
                                <input
                                  type="checkbox"
                                  checked={schemeForm.disabilityStatus}
                                  onChange={(e) => setSchemeForm({...schemeForm, disabilityStatus: e.target.checked})}
                                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 focus:ring-2 cursor-pointer"
                                />
                                <span className="font-bold text-[10px] uppercase text-slate-300">மாற்றுத்திறனாளி (Disability)</span>
                              </label>

                              <label className="flex items-center gap-2 cursor-pointer py-1">
                                <input
                                  type="checkbox"
                                  checked={schemeForm.isSeniorCitizen}
                                  onChange={(e) => setSchemeForm({...schemeForm, isSeniorCitizen: e.target.checked})}
                                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 focus:ring-2 cursor-pointer"
                                />
                                <span className="font-bold text-[10px] uppercase text-slate-300">மூத்த குடிமக்கள் (Senior)</span>
                              </label>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="mt-4 w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl active:scale-98 transition shadow-lg text-xs uppercase tracking-wider"
                          >
                            திட்டத்தை சேமி (Save Scheme Details)
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* -------------------- TAB: REPORTS -------------------- */}
              {activeTab === "reports" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <h2 className="text-2xl font-bold tracking-tight">அறிக்கைகள் பதிவிறக்கம்</h2>
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow max-w-xl">
                    <h3 className="font-bold text-base mb-2">விண்ணப்ப அறிக்கைகள் ஏற்றுமதி (CSV Export)</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6">
                      தற்போது தேர்ந்தெடுக்கப்பட்ட வடிகட்டிகளின் அடிப்படையில் தகுதியான அனைத்து விண்ணப்பதாரர் மற்றும் மனுக்களின் முழுமையான தரவுப் பட்டியலை கோப்பு வடிவில் (CSV) சேமிக்கலாம்.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">ஏற்றுமதிக்கு தயாராக உள்ளவை</span>
                        <span className="text-xl font-bold text-indigo-400">{applications.length} மனுக்கள்</span>
                      </div>
                      <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">வடிப்பான் நிலை (Filter State)</span>
                        <span className="text-xs font-bold text-slate-300">{appStatusFilter ? `Status: ${appStatusFilter}` : "அனைத்து நிலைகளும் (All)"}</span>
                      </div>
                    </div>

                    <button
                      onClick={downloadCSVReport}
                      disabled={applications.length === 0}
                      className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-bold text-sm active:scale-98 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10"
                    >
                      <Download size={18} />
                      CSV அறிக்கை பதிவிறக்கம் செய்
                    </button>
                  </div>
                </div>
              )}

            </main>
          </>
        )}

      </div>
    </div>
  );
}
