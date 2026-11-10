'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import { SquadMember } from '@/types';
import {
  ShieldCheck,
  CheckCircle,
  Share2,
  Copy,
  MessageCircle,
  FileCheck,
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INTEREST_OPTIONS = [
  'Ground Reporting',
  'Social Media Promotion',
  'Public Issue Reporting',
  'Video Reporting',
  'Photography',
  'Community Activities',
  'News Research'
];

export default function SquadRegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    whatsappNumber: '',
    email: '',
    age: '',
    gender: 'Prefer not to say',
    city: '',
    areaLocality: '',
    state: 'Maharashtra',
    profession: '',
    interests: [] as string[],
    reasonToJoin: '',
    profilePhotoUrl: '',
    verificationDocUrl: '',
    termsAgreed: false,
  });

  const [registeredMember, setRegisteredMember] = useState<SquadMember | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest]
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAgreed) {
      alert('Please agree to the MBN Squad terms and privacy policy.');
      return;
    }
    if (formData.interests.length === 0) {
      alert('Please select at least one area of interest.');
      return;
    }

    setIsSubmitting(true);

    // Generate unique MBN Member ID: e.g. MBN-2026-XXXXX
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const generatedMemberId = `MBN-2026-${randomNum}`;

    const newMember: SquadMember = {
      id: `squad-${Date.now()}`,
      member_id: generatedMemberId,
      full_name: formData.fullName,
      mobile_number: formData.mobileNumber.startsWith('+91')
        ? formData.mobileNumber
        : `+91${formData.mobileNumber.replace(/\D/g, '')}`,
      whatsapp_number: formData.whatsappNumber.startsWith('+91')
        ? formData.whatsappNumber
        : `+91${formData.whatsappNumber.replace(/\D/g, '')}`,
      email: formData.email || undefined,
      age: parseInt(formData.age, 10) || 25,
      gender: formData.gender,
      city: formData.city,
      area_locality: formData.areaLocality,
      state: formData.state,
      profession: formData.profession,
      interests: formData.interests,
      reason_to_join: formData.reasonToJoin,
      profile_photo_url:
        formData.profilePhotoUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      verification_doc_url: formData.verificationDocUrl || undefined,
      terms_agreed: true,
      status: 'pending', // Starts pending until reviewed by Admin
      created_at: new Date().toISOString(),
    };

    setTimeout(() => {
      storage.saveSquadMember(newMember);
      setRegisteredMember(newMember);
      setIsSubmitting(false);

      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // fallback
      }
    }, 600);
  };

  const copyMemberId = () => {
    if (registeredMember) {
      navigator.clipboard.writeText(registeredMember.member_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    if (!registeredMember) return;
    const text = `I just joined the MBN Squad to stand for citizen rights & ground journalism! My MBN Member ID is *${registeredMember.member_id}*. Join the movement at https://mbnnews.in/squad`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* If Registration Successful */}
      {registeredMember ? (
        <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 sm:p-10 shadow-2xl text-center animate-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
            REGISTRATION SUBMITTED
          </span>

          <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight mt-3 mb-2">
            Welcome to MBN Squad, {registeredMember.full_name}!
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto mb-6">
            Your application has been logged into the national citizen roster. To maintain journalistic trust, our desk conducts a quick verification before your public badge goes live.
          </p>

          {/* Member Card Preview */}
          <div className="max-w-md mx-auto bg-gradient-to-br from-neutral-900 to-neutral-950 text-white rounded-2xl p-6 border-2 border-red-600 shadow-xl mb-6 text-left">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="bg-red-600 font-black px-2 py-0.5 rounded text-xs text-white">MBN</span>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">Squad Membership Pass</span>
              </div>
              <span className="text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded">
                STATUS: {registeredMember.status.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-mono">Official Member ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-wider">
                    {registeredMember.member_id}
                  </span>
                  <button
                    onClick={copyMemberId}
                    className="p-1 text-neutral-400 hover:text-white"
                    title="Copy ID"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="w-14 h-14 rounded-xl overflow-hidden border border-amber-400 bg-neutral-800">
                <img
                  src={registeredMember.profile_photo_url}
                  alt={registeredMember.full_name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-300 border-t border-neutral-800 pt-3">
              <div>
                <span className="text-neutral-500 block text-[10px]">Location:</span>
                <span className="font-semibold">{registeredMember.area_locality}, {registeredMember.city}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Profession:</span>
                <span className="font-semibold">{registeredMember.profession}</span>
              </div>
            </div>
          </div>

          {/* Social Share & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={shareWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>

            <Link
              href="/squad/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all"
            >
              <span>Go to Member Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="border-b border-neutral-200 pb-6 mb-8">
            <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              OFFICIAL ENROLLMENT FORM
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
              Join The MBN Squad
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-medium">
              "Sirf News Dekhna Nahi, Badlav Ka Hissa Banna Hai!" Fill out your details below to become an accredited citizen contributor.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Personal Basic Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  1. Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Ramesh Shankar Rao"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  2. Mobile Number (OTP Login) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  3. WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="For investigative alerts"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  4. Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  5. Age *
                </label>
                <input
                  type="number"
                  min="16"
                  max="100"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="e.g. 24"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  6. Gender (Optional)
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                >
                  <option value="Prefer not to say">Prefer not to say</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                </select>
              </div>
            </div>

            {/* 2. Location & Profession */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  7. City / Town *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Mumbai / Pune / Nagpur"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  8. Area / Locality / Ward *
                </label>
                <input
                  type="text"
                  required
                  value={formData.areaLocality}
                  onChange={(e) => setFormData({ ...formData, areaLocality: e.target.value })}
                  placeholder="e.g. Dadar West, Ward G/N"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  9. State *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Maharashtra"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                10. Profession / Occupation *
              </label>
              <input
                type="text"
                required
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                placeholder="e.g. Student / Teacher / Lawyer / IT Professional / Business"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
              />
            </div>

            {/* 3. Areas of Interest */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                11. Interested In (Select all that apply) *
              </label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((opt) => {
                  const selected = formData.interests.includes(opt);
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => toggleInterest(opt)}
                      className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all border ${
                        selected
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '} {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Reason to Join */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                12. Why do you want to join MBN Squad? *
              </label>
              <textarea
                required
                rows={3}
                value={formData.reasonToJoin}
                onChange={(e) => setFormData({ ...formData, reasonToJoin: e.target.value })}
                placeholder="Share the local issues you care about, your motivation, or what change you wish to bring..."
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
              />
            </div>

            {/* 5. Optional Upload URL placeholders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  13. Profile Photo URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.profilePhotoUrl}
                  onChange={(e) => setFormData({ ...formData, profilePhotoUrl: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  14. ID Verification Document URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.verificationDocUrl}
                  onChange={(e) => setFormData({ ...formData, verificationDocUrl: e.target.value })}
                  placeholder="Document link (Aadhaar / Voter ID preview)"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.termsAgreed}
                  onChange={(e) => setFormData({ ...formData, termsAgreed: e.target.checked })}
                  className="mt-1 w-4 h-4 text-red-600 rounded border-neutral-300 focus:ring-red-500"
                />
                <span className="text-xs text-neutral-600 leading-relaxed font-medium">
                  I agree to the <strong>MBN Squad terms and privacy policy</strong>. I commit to reporting truthful, verified civic information without personal malice or fabrication.
                </span>
              </label>
            </div>

            {/* Submit CTA */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-sm sm:text-base py-4 rounded-xl shadow-lg transition-all active:scale-[0.99] uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <span>{isSubmitting ? 'GENERATING SQUAD CREDENTIALS...' : 'JOIN MBN SQUAD'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
