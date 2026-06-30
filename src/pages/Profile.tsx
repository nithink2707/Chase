import React, { useState, useEffect, useRef } from "react";
import { 
  Smartphone, 
  BadgeCheck, 
  Camera, 
  Upload, 
  ShieldCheck,
  MoreHorizontal,
  ArrowRight,
  CheckCircle2,
  Lock,
  Loader2
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase";

export default function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingAge, setSavingAge] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [age, setAge] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfileData(data);
          setAge(data.age?.toString() || "");
        } else {
          // Initialize user document if it doesn't exist
          const initialData = {
            uid: user.uid,
            name: user.displayName || "Athlete",
            email: user.email,
            photoURL: user.photoURL || "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(doc(db, "users", user.uid), initialData);
          setProfileData(initialData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateAge = async () => {
    if (!user || age === profileData?.age?.toString()) return;
    
    setSavingAge(true);
    try {
      const ageNum = parseInt(age);
      if (isNaN(ageNum)) throw new Error("Invalid age");
      
      await updateDoc(doc(db, "users", user.uid), {
        age: ageNum,
        updatedAt: serverTimestamp(),
      });
      setProfileData({ ...profileData, age: ageNum });
    } catch (error) {
      console.error("Error updating age:", error);
      alert("Failed to save age. Please try again.");
    } finally {
      setSavingAge(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Max size is 5MB.');
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `profiles/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "users", user.uid), {
        photoURL: downloadURL,
        updatedAt: serverTimestamp(),
      });

      setProfileData({ ...profileData, photoURL: downloadURL });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12 pb-24 md:pb-12 text-white">
      <header className="space-y-4">
        <h1 className="text-5xl font-black font-display text-white italic">Identity & Security</h1>
        <p className="text-on-surface-variant max-w-2xl text-lg font-medium">
          Welcome back, <span className="text-white">{user?.displayName || "Athlete"}</span>. Complete your verification to ensure competitive integrity and unlock full tournament participation.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Verification Cards */}
        <div className="lg:col-span-8 space-y-8">
          {/* Active Sessions / Account Security */}
          <div className="bg-[#334155] border border-outline-variant/30 rounded-2xl p-8 relative overflow-hidden group shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between relative z-10">
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/30 shadow-inner">
                  <ShieldCheck className="text-primary" size={28} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold font-display text-white italic">Account Security</h2>
                    <span className={cn(
                      "bg-surface-container-highest/50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-outline-variant/20 backdrop-blur-sm",
                      user?.emailVerified ? "text-primary" : "text-error"
                    )}>
                      {user?.emailVerified ? "Google Verified" : "Unverified"}
                    </span>
                  </div>
                  <p className="text-on-surface-variant font-medium">Primary identity: <span className="text-white/80">{user?.email}</span></p>
                </div>
              </div>
              <button className="shrink-0 px-8 py-3 bg-surface-container text-white border border-outline-variant/30 rounded-lg font-display text-sm font-bold hover:bg-surface-container-highest transition-all uppercase tracking-tight shadow-md">
                Settings
              </button>
            </div>
          </div>

          {/* Mobile Number Verification */}
          <MobileVerificationCard />

          {/* Age Verification / Settings */}
          <div className="bg-[#334155] border border-outline-variant/30 rounded-2xl p-8 relative overflow-hidden group shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between relative z-10">
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/30 shadow-inner text-primary">
                  <BadgeCheck size={28} />
                </div>
                <div className="space-y-4 flex-1">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold font-display text-white italic">Personal Information</h2>
                    <p className="text-on-surface-variant font-medium">Verify your age for competitive age-restricted brackets.</p>
                  </div>
                  
                  <div className="flex items-end gap-4 max-w-xs">
                    <div className="flex-1 space-y-2">
                       <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">Entry Age</label>
                       <input 
                         type="number" 
                         value={age}
                         onChange={(e) => setAge(e.target.value)}
                         placeholder="Years"
                         className="w-full bg-surface-container border border-outline-variant/30 rounded-lg py-2.5 px-4 text-white font-display text-sm focus:outline-none focus:border-primary/50 transition-all"
                       />
                    </div>
                    <button 
                      onClick={handleUpdateAge}
                      disabled={savingAge || age === profileData?.age?.toString()}
                      className="px-6 py-2.5 bg-primary text-background rounded-lg font-bold font-display text-xs uppercase tracking-widest hover:bg-primary-light transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {savingAge && <Loader2 size={14} className="animate-spin" />}
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DigiLocker Verification */}
          <div className="bg-[#334155] border border-outline-variant/30 rounded-2xl p-8 relative overflow-hidden flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between shadow-2xl group">
             <div className="absolute top-0 left-0 w-1 h-full bg-error/50"></div>
             
             <div className="flex gap-6 items-start relative z-10">
               <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/30 shadow-inner">
                 <BadgeCheck className="text-primary" size={28} />
               </div>
               <div className="space-y-1">
                 <div className="flex items-center gap-3">
                   <h2 className="text-2xl font-bold font-display text-white italic">DigiLocker Verification</h2>
                   <span className="bg-error/20 px-3 py-1 rounded-full text-[10px] font-bold text-error uppercase tracking-widest border border-error/30 backdrop-blur-sm">
                     Pending
                   </span>
                 </div>
                 <p className="text-on-surface-variant font-medium">Official ID verification via DigiLocker API required for prize pools.</p>
               </div>
             </div>
             
             <button className="shrink-0 px-8 py-3 bg-white text-background rounded-lg font-display text-sm font-bold hover:bg-primary transition-all uppercase tracking-tight shadow-lg relative z-10">
               Connect ID
             </button>

             {/* Background glow */}
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[60px]"></div>
          </div>
        </div>

        {/* Right Column: Profile Appearance */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-[#334155] border border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl">
            <h2 className="text-xl font-bold font-display text-white mb-8 w-full text-left italic border-b border-outline-variant/10 pb-4 flex justify-between items-center">
               Profile Picture
               <MoreHorizontal size={20} className="text-on-surface-variant" />
            </h2>
            
            <div className="relative mb-10 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-40 h-40 rounded-full bg-surface-container overflow-hidden border-4 border-surface-container-highest shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center justify-center">
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                ) : profileData?.photoURL || user?.photoURL ? (
                  <img 
                    src={profileData?.photoURL || user?.photoURL} 
                    alt="Avatar" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary uppercase font-bold text-4xl">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-background/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-white/10 p-3 rounded-full backdrop-blur-md border border-white/20">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />

            <p className="text-on-surface-variant text-sm font-medium italic mb-8 leading-relaxed">
              Upload or change athlete avatar. This image will represent you in brackets and leaderboards across the platform.
            </p>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full px-8 py-3.5 bg-surface-container text-white border border-outline-variant/30 rounded-lg font-display text-sm font-bold hover:bg-surface-container-highest transition-all flex items-center justify-center gap-3 uppercase tracking-tight shadow-lg disabled:opacity-50"
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              {uploading ? "Uploading..." : "Upload New Image"}
            </button>
          </div>
          
          <div className="mt-8 bg-surface-container-highest/20 rounded-2xl p-6 border border-outline-variant/10 text-center">
             <div className="flex items-center gap-2 justify-center text-primary mb-2">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Account Protected</span>
             </div>
             <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-medium">Last Security Sync: 2 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileVerificationCard() {
  const { user, sendOTP } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"input" | "otp" | "verified">(user?.phoneNumber ? "verified" : "input");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (phone.length >= 10) {
      try {
        const fullPhone = `+91${phone}`;
        const result = await sendOTP(fullPhone, "recaptcha-container");
        setConfirmationResult(result);
        setStep("otp");
      } catch (err: any) {
        setError(err.message || "Failed to send OTP. Ensure your domain is authorized in Firebase.");
      }
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (confirmationResult && otp.length === 6) {
      try {
        await confirmationResult.confirm(otp);
        setStep("verified");
      } catch (err: any) {
        setError("Invalid code. Please try again.");
      }
    }
  };

  if (step === "verified" || user?.phoneNumber) {
    return (
      <div className="bg-[#334155] border border-primary/30 rounded-2xl p-8 relative overflow-hidden shadow-2xl group transition-all duration-500">
        <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between relative z-10">
          <div className="flex gap-6 items-start">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30 shadow-inner">
              <CheckCircle2 className="text-primary" size={28} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold font-display text-white italic">Mobile verified</h2>
                <span className="bg-primary/20 px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/30 backdrop-blur-sm">
                  Identity Secured
                </span>
              </div>
              <p className="text-on-surface-variant font-medium">Secured with {user?.phoneNumber || `+91 ${phone}`}</p>
            </div>
          </div>
          <button 
            disabled
            className="shrink-0 px-8 py-3 bg-surface-container/50 text-on-surface-variant border border-outline-variant/10 rounded-lg font-display text-sm font-bold uppercase tracking-tight"
          >
            Confirmed
          </button>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <Smartphone size={120} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-[#334155] border rounded-2xl p-8 relative overflow-hidden shadow-2xl transition-all duration-500",
      isVerifying ? "border-primary/50 shadow-primary/10" : "border-outline-variant/30"
    )}>
      <div id="recaptcha-container"></div>
      <div className="flex flex-col md:flex-row gap-8 items-start justify-between relative z-10">
        <div className="flex gap-6 items-start">
          <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/30 shadow-inner">
            <Smartphone className={cn("transition-colors", isVerifying ? "text-primary" : "text-on-surface-variant")} size={28} />
          </div>
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold font-display text-white italic">Mobile Number</h2>
              <span className="bg-on-surface-variant/20 px-3 py-1 rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border border-outline-variant/10 backdrop-blur-sm">
                Required
              </span>
            </div>
            <p className="text-on-surface-variant font-medium text-sm leading-relaxed">
              Enable SMS notifications for match alerts and prize pool distributions. High-stakes gaming requires a verified identity.
            </p>
            
            {error && (
              <p className="text-xs text-error font-medium bg-error/10 p-2 rounded border border-error/20">
                {error}
              </p>
            )}

            {!isVerifying ? (
              <button 
                onClick={() => setIsVerifying(true)}
                className="mt-4 flex items-center gap-2 text-primary font-bold font-display text-sm uppercase tracking-widest hover:translate-x-1 transition-transform cursor-pointer"
              >
                Secure Account <ArrowRight size={16} />
              </button>
            ) : (
              <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                {step === "input" ? (
                  <form onSubmit={handleSendOTP} className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-sm">+91</span>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Mobile Number"
                        className="w-full bg-surface-container border border-outline-variant/30 rounded-lg py-2.5 pl-12 pr-4 text-white font-display text-sm focus:outline-none focus:border-primary/50 transition-all"
                        autoFocus
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={phone.length < 10}
                      className="px-6 py-2.5 bg-primary text-background rounded-lg font-bold font-display text-xs uppercase tracking-widest hover:bg-primary-light transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      Verify
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-3">
                     <p className="text-[10px] text-primary font-bold uppercase tracking-widest">OTP sent to +91 {phone}</p>
                     <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={14} />
                          <input 
                            type="text" 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="6-digit OTP"
                            className="w-full bg-surface-container border border-outline-variant/30 rounded-lg py-2.5 pl-10 pr-4 text-white font-display text-sm focus:outline-none focus:border-primary/50 transition-all"
                            autoFocus
                          />
                        </div>
                        <button 
                          type="submit"
                          disabled={otp.length < 6}
                          className="px-6 py-2.5 bg-white text-background rounded-lg font-bold font-display text-xs uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-50"
                        >
                          Confirm
                        </button>
                     </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <Smartphone size={120} />
        </div>
      </div>
    </div>
  );
}
