'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import { PublicIssue, IssueCategory } from '@/types';
import { JAN_AAWAAZ_CATEGORIES } from '@/lib/janAawaazData';
import { InteractiveLocationMap } from '@/components/InteractiveLocationMap';
import {
  MapPin,
  Crosshair,
  Upload,
  Video,
  Camera,
  CheckCircle2,
  Share2,
  Copy,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReportPublicIssuePage() {
  const [formData, setFormData] = useState({
    reporterName: '',
    mobileNumber: '',
    whatsappNumber: '',
    title: '',
    category: 'Road & Potholes' as IssueCategory,
    description: '',
    area: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '',
    locationAddress: '',
    termsAgreed: false,
  });

  // Coordinates state
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 19.0760,
    lng: 72.8777
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);

  // Photos & Video state
  const [photoUrls, setPhotoUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
  ]);
  const [photoInput, setPhotoInput] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Submission result
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIssue, setSubmittedIssue] = useState<PublicIssue | null>(null);
  const [copied, setCopied] = useState(false);

  // Browser Geolocation API
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setLocationCaptured(true);
        setIsLocating(false);

        // Reverse geocode fallback
        if (!formData.area) {
          setFormData(prev => ({
            ...prev,
            locationAddress: `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)} (GPS Marked)`
          }));
        }
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Unable to fetch your GPS coordinates.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location access was denied. Please allow location permissions or enter your area manually.';
        }
        alert(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleAddPhoto = () => {
    if (photoInput.trim() && photoUrls.length < 5) {
      setPhotoUrls([...photoUrls, photoInput.trim()]);
      setPhotoInput('');
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotoUrls(photoUrls.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mobileNumber || formData.mobileNumber.replace(/\D/g, '').length < 10) {
      alert('Please provide a valid 10-digit mobile number for report verification.');
      return;
    }
    if (!formData.termsAgreed) {
      alert('Please confirm that your submission is accurate and agree to MBN privacy policy.');
      return;
    }

    setIsSubmitting(true);

    // Generate unique tracking ID: MBN-ISSUE-2026-XXXXX
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const trackingId = `MBN-ISSUE-2026-${randomNum}`;

    const newIssue: PublicIssue = {
      id: `issue-${Date.now()}`,
      tracking_id: trackingId,
      title: formData.title,
      category: formData.category,
      description: formData.description,
      latitude: coords.lat,
      longitude: coords.lng,
      location_address: formData.locationAddress || `${formData.area}, ${formData.city}`,
      area: formData.area,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      reporter_name: formData.reporterName || 'Anonymous Citizen',
      mobile_number: formData.mobileNumber,
      whatsapp_number: formData.whatsappNumber || formData.mobileNumber,
      media_urls: photoUrls.length > 0 ? photoUrls : ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'],
      video_url: videoUrl || undefined,
      status: 'Submitted',
      verification_status: 'pending',
      is_published: false, // Protected: Admin reviews before publishing publicly
      updates: [
        {
          id: `upd-${Date.now()}`,
          issue_id: `issue-${Date.now()}`,
          status: 'Submitted',
          update_description: `Citizen report submitted with ${photoUrls.length} photo(s) and GPS verification pin. Queued for desk inspection.`,
          updated_by: 'MBN Jan Aawaaz Engine',
          created_at: new Date().toISOString()
        }
      ],
      upvotes: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setTimeout(() => {
      storage.saveIssue(newIssue);
      setSubmittedIssue(newIssue);
      setIsSubmitting(false);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }
    }, 600);
  };

  const copyTrackingId = () => {
    if (submittedIssue && submittedIssue.tracking_id) {
      navigator.clipboard.writeText(submittedIssue.tracking_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    if (!submittedIssue) return;
    const text = `I just reported a critical civic issue to MBN Jan Aawaaz: *${submittedIssue.title}*. Tracking ID: *${submittedIssue.tracking_id}*. Track its progress on MBN: https://mbnnews.in/track`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      {submittedIssue ? (
        /* Post-Submission Success Screen */
        <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-10 shadow-2xl text-center animate-in zoom-in-95">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="bg-neutral-100 text-black border border-neutral-300 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
            REPORT LOGGED IN MBN NATIONAL GRIEVANCE ROSTER
          </span>

          <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight mt-3 mb-2">
            Your Voice Has Been Heard!
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto mb-8 font-medium">
            Thank you for reporting this issue. The MBN Jan Aawaaz desk and local ward squad will verify the coordinates and photos before forwarding formal inspection notices to the municipal authority.
          </p>

          {/* Tracking ID Badge Card */}
          <div className="max-w-md mx-auto bg-black text-white rounded-2xl p-6 border border-neutral-800 shadow-xl mb-8 text-left">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-3">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Official Tracking Credential
              </span>
              <span className="text-[10px] font-mono bg-neutral-900 border border-neutral-700 text-white px-2 py-0.5 rounded">
                STAGE: SUBMITTED
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase font-mono">Unique Tracking ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wider">
                    {submittedIssue.tracking_id}
                  </span>
                  <button
                    onClick={copyTrackingId}
                    className="p-1.5 text-neutral-400 hover:text-white"
                    title="Copy Tracking ID"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-xs text-neutral-300 space-y-1 border-t border-neutral-800 pt-3">
              <div><strong>Issue:</strong> {submittedIssue.title}</div>
              <div><strong>Location:</strong> {submittedIssue.area}, {submittedIssue.city}</div>
              <div><strong>Category:</strong> {submittedIssue.category}</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={shareWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Tracking ID on WhatsApp</span>
            </button>

            <Link
              href={`/track?id=${submittedIssue.tracking_id}&phone=${submittedIssue.mobile_number}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-black hover:bg-neutral-100 text-black font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all"
            >
              <span>Track My Issue Live</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* Submission Form */
        <div className="bg-white border border-neutral-300 rounded-3xl p-6 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="border-b border-neutral-200 pb-6 mb-8">
            <div className="inline-flex items-center gap-1.5 bg-black text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <FileCheck className="w-4 h-4" />
              MBN JAN AAWAAZ • CITIZEN REPORTING DESK
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
              Your Area. Your Voice. Your MBN.
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-medium">
              See a problem? Don't just complain. Report it to MBN and help bring change. Anyone can submit — no Squad registration needed.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Contact Verification Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                  1. Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.reporterName}
                  onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                  placeholder="Leave blank to remain anonymous"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                  2. Mobile Number (Required) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  placeholder="10-digit mobile for tracking verification"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-black font-mono"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Never made public. Used strictly for status updates.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                  3. WhatsApp Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="For instant verification alert"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-black font-mono"
                />
              </div>
            </div>

            {/* 2. Issue Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                  4. Issue Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Hazardous deep road cave-in outside Metro Station Pillar 42"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                  5. Select Issue Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as IssueCategory })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-black font-medium"
                >
                  {JAN_AAWAAZ_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                  City / District *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Mumbai, Pune, Thane, Nagpur"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                6. Describe Your Issue In Detail *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what happened: how many people are affected? Has any accident occurred? How long has this been unresolved?"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-black leading-relaxed"
              />
            </div>

            {/* 3. Media Uploads */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-black" />
                  <span className="text-xs font-bold text-black uppercase tracking-wider">
                    7. Upload Evidence Photos (Up to 5)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-neutral-500">
                  {photoUrls.length}/5 uploaded
                </span>
              </div>

              {/* Photo Previews */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {photoUrls.map((url, i) => (
                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-neutral-300 bg-neutral-200">
                    <img src={url} alt={`Evidence ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(i)}
                      className="absolute top-1 right-1 bg-black/80 hover:bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Photo Input */}
              {photoUrls.length < 5 && (
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={photoInput}
                    onChange={(e) => setPhotoInput(e.target.value)}
                    placeholder="Enter image URL or paste camera photo link..."
                    className="flex-1 bg-white border border-neutral-300 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Add Photo
                  </button>
                </div>
              )}

              {/* Video URL */}
              <div className="pt-2 border-t border-neutral-200">
                <label className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                  <Video className="w-4 h-4 text-black" />
                  8. Upload Video / Reel Link (Optional)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="YouTube, Google Drive or raw MP4 video URL"
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* 4. GPS Location & Interactive Map */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-black uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-black" />
                    9. Exact Problem Location & GPS Verification
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Capture your current coordinates or correct the pin on the map.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow shrink-0"
                >
                  <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Detecting GPS...' : 'Use Current GPS Location'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Area / Ward / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g. Dadar TT Circle, near railway flyover"
                    className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    PIN Code (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="e.g. 400014"
                    className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-black font-mono"
                  />
                </div>
              </div>

              {/* Interactive OpenStreetMap preview */}
              <InteractiveLocationMap
                latitude={coords.lat}
                longitude={coords.lng}
                address={formData.area ? `${formData.area}, ${formData.city}` : undefined}
                interactive={true}
                onCoordinatesChange={(lat, lng) => setCoords({ lat, lng })}
              />
            </div>

            {/* 5. Accuracy & Privacy Confirmation */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.termsAgreed}
                  onChange={(e) => setFormData({ ...formData, termsAgreed: e.target.checked })}
                  className="mt-1 w-4 h-4 text-black rounded border-neutral-400 focus:ring-black"
                />
                <span className="text-xs text-neutral-600 leading-relaxed font-medium">
                  10. I confirm that the information submitted is accurate and I agree to <strong>MBN's privacy policy</strong>. I understand that false or defamatory complaints will be rejected by administrators.
                </span>
              </label>
            </div>

            {/* Submit CTA */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-neutral-800 text-white font-black text-sm sm:text-base py-4 rounded-xl shadow-lg transition-all active:scale-[0.99] uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <FileCheck className="w-5 h-5 text-white" />
                <span>{isSubmitting ? 'VERIFYING & GENERATING TRACKING ID...' : '11. SUBMIT PUBLIC ISSUE'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
