<template>
  <div class="max-w-4xl mx-auto min-h-[calc(100vh-3.5rem)] px-3.5 xs:px-4 sm:px-6 pb-safe pb-12 pt-3 relative">
    <!-- Ambient Background Glows -->
    <div class="absolute -top-24 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-10 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Toast Notification -->
    <Toast
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="toast.show = false"
    />

    <!-- VIEW 1: Glassmorphism Login Card (When Unauthenticated) -->
    <div v-if="!isAuthenticated" class="min-h-[75vh] flex flex-col justify-center items-center py-6">
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
        class="w-full max-w-sm xs:max-w-md"
      >
        <!-- Icon & Header -->
        <div class="text-center mb-5 xs:mb-6">
          <div class="w-13 h-13 xs:w-14 xs:h-14 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-950/40">
            <ShieldCheck class="w-7 h-7" />
          </div>
          <h2 class="text-2xl xs:text-3xl font-black text-white tracking-tight">Admin Portal</h2>
          <p class="text-xs text-slate-400 mt-1">
            Access real-time referral verification logs.
          </p>
        </div>

        <!-- Glass Card -->
        <div class="glass-panel rounded-3xl p-5 xs:p-7 sm:p-8 shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <form @submit.prevent="handleLogin" class="space-y-4 relative z-10">
            <!-- Email -->
            <div>
              <label class="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div class="relative rounded-2xl shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail class="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  v-model="loginEmail"
                  :disabled="loginLoading"
                  required
                  autocomplete="email"
                  class="block w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div class="relative rounded-2xl shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock class="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  v-model="loginPassword"
                  :disabled="loginLoading"
                  required
                  autocomplete="current-password"
                  class="block w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <!-- Submit Button (Minimum 48px height) -->
            <button
              type="submit"
              :disabled="loginLoading"
              class="w-full min-h-[50px] mt-2 py-3.5 px-4 rounded-2xl text-white font-bold text-sm bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 active:scale-[0.98] shadow-lg shadow-indigo-600/30 transition disabled:opacity-75 flex items-center justify-center space-x-2"
            >
              <Loader2 v-if="loginLoading" class="w-4 h-4 animate-spin" />
              <span>{{ loginLoading ? 'Authenticating...' : 'Sign In to Dashboard' }}</span>
            </button>
          </form>

          <div class="mt-4 text-center">
            <button
              type="button"
              @click="fillDefaultCredentials"
              class="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition"
            >
              Auto-fill Admin Credentials
            </button>
            <div class="text-[10px] text-slate-500 mt-1">
              Email: <code class="text-indigo-300">admin@example.com</code> | Password: <code class="text-indigo-300">Admin@123</code>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW 2: Admin Dashboard (When Authenticated) -->
    <div v-else class="space-y-4 xs:space-y-5">
      <!-- Dashboard Header -->
      <header class="glass-panel p-4 xs:p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
        <div>
          <div class="flex items-center space-x-2">
            <span class="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] xs:text-[11px] font-bold border border-indigo-500/30">
              Admin Session Active
            </span>
            <span class="text-xs text-slate-400 truncate max-w-[170px] xs:max-w-[220px]">
              {{ adminInfo?.email || 'admin@example.com' }}
            </span>
          </div>
          <h1 class="text-xl xs:text-2xl font-black text-white tracking-tight mt-1 leading-snug">
            Referral Verification Logs
          </h1>
          <p class="text-[11px] xs:text-xs text-slate-400 mt-0.5">
            Real-time anti-fraud location logs for submitted referrals.
          </p>
        </div>

        <div class="flex items-center space-x-2 pt-1 sm:pt-0">
          <button
            @click="fetchReferrals"
            :disabled="fetchLoading"
            type="button"
            class="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-600 active:scale-95 transition flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': fetchLoading }" />
            <span>Refresh</span>
          </button>

          <button
            @click="handleLogout"
            type="button"
            class="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-bold text-rose-300 hover:bg-rose-500/25 active:scale-95 transition flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <LogOut class="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <!-- Metric Stat Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 xs:gap-3.5">
        <div class="glass-panel p-3.5 xs:p-4 rounded-3xl flex items-center space-x-3">
          <div class="w-10 h-10 xs:w-11 xs:h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Users class="w-5 h-5" />
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Records</p>
            <p class="text-xl xs:text-2xl font-black text-white mt-0.5">{{ referrals.length }}</p>
          </div>
        </div>

        <div class="glass-panel p-3.5 xs:p-4 rounded-3xl flex items-center space-x-3">
          <div class="w-10 h-10 xs:w-11 xs:h-11 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
            <Gift class="w-5 h-5" />
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Claims</p>
            <p class="text-xl xs:text-2xl font-black text-teal-300 mt-0.5">
              {{ referrals.filter(r => r.type === 'referral' || r.name !== 'Site Visitor').length }}
            </p>
          </div>
        </div>

        <div class="glass-panel p-3.5 xs:p-4 rounded-3xl flex items-center space-x-3">
          <div class="w-10 h-10 xs:w-11 xs:h-11 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <MapPin class="w-5 h-5" />
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GPS Verified</p>
            <p class="text-xl xs:text-2xl font-black text-indigo-300 mt-0.5">
              {{ referrals.filter(r => r.latitude && r.longitude).length }}
            </p>
          </div>
        </div>

        <div class="col-span-2 sm:col-span-1 glass-panel p-3.5 xs:p-4 rounded-3xl flex items-center space-x-3">
          <div class="w-10 h-10 xs:w-11 xs:h-11 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Clock class="w-5 h-5" />
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Latest Activity</p>
            <p class="text-xs font-bold text-slate-200 mt-1 truncate max-w-[140px]">
              {{ referrals.length > 0 ? formatDate(referrals[0].created_at) : 'None' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <div class="glass-panel p-2 xs:p-2.5 rounded-2xl flex items-center">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search class="w-4 h-4" />
          </div>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by Name, Mobile, or IP Address..."
            class="block w-full pl-9 pr-3 py-1.5 bg-transparent border-0 text-white placeholder-slate-500 text-xs focus:ring-0"
          />
        </div>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="text-xs text-slate-400 hover:text-white px-2 py-1 font-bold"
        >
          Clear
        </button>
      </div>

      <!-- DATA PRESENTATION SECTION (Mobile-First Cards on <640px + Table on >=640px) -->
      <div>
        <!-- Loading State -->
        <div v-if="fetchLoading && referrals.length === 0" class="glass-panel rounded-3xl py-16 flex flex-col items-center justify-center space-y-3">
          <Loader2 class="w-8 h-8 text-indigo-400 animate-spin" />
          <p class="text-xs text-slate-400 font-medium">Loading verified referrals...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredReferrals.length === 0" class="glass-panel rounded-3xl py-14 text-center px-4">
          <div class="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto text-slate-500 mb-3 border border-slate-800">
            <Filter class="w-5 h-5" />
          </div>
          <h3 class="text-sm font-bold text-white">
            {{ searchQuery ? 'No matching records found' : 'No entries recorded yet' }}
          </h3>
          <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {{ searchQuery ? 'Try searching by a different name, mobile, or IP.' : 'Visitors and claim submissions will appear here in real-time with their IP and GPS.' }}
          </p>
        </div>

        <!-- Populated State -->
        <div v-else>
          <!-- 1. MOBILE CARDS VIEW (Visible only on mobile screens < 640px) -->
          <div class="space-y-3 sm:hidden">
            <div
              v-for="item in filteredReferrals"
              :key="item.id"
              class="glass-panel p-4 rounded-2xl space-y-3 shadow-lg"
            >
              <!-- Card Header: Name, Type Badge & Date -->
              <div class="flex items-start justify-between gap-2">
                <div>
                  <div class="flex items-center space-x-1.5">
                    <h3 class="font-extrabold text-white text-sm leading-tight">{{ item.name }}</h3>
                    <span
                      class="text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider"
                      :class="item.type === 'visit' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'"
                    >
                      {{ item.type === 'visit' ? 'Visit' : 'Claim' }}
                    </span>
                  </div>
                  <span class="text-[10px] text-slate-500 font-mono">{{ item.id?.slice(0, 8) }}...</span>
                </div>
                <span class="text-[10px] text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800 flex-shrink-0">
                  {{ formatDate(item.created_at) }}
                </span>
              </div>

              <!-- Card Body: Location Name, IP Address, Mobile & Accuracy -->
              <div class="space-y-1.5 text-xs pt-0.5">
                <!-- Human-readable Place Name (e.g. Ottapalam, Thrissur) -->
                <div
                  v-if="item.location_name"
                  class="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl"
                  :class="item.accuracy && item.accuracy <= 250 ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' : 'bg-amber-500/10 border border-amber-500/20 text-amber-300'"
                >
                  <MapPin class="w-3.5 h-3.5 flex-shrink-0" :class="item.accuracy && item.accuracy <= 250 ? 'text-emerald-400' : 'text-amber-400'" />
                  <span class="font-bold text-[11px] truncate">{{ item.location_name }}</span>
                </div>

                <!-- IP Address -->
                <div class="flex items-center justify-between">
                  <span class="text-[10px] text-slate-400 uppercase font-bold">IP Address:</span>
                  <span class="font-mono bg-slate-900 text-indigo-300 px-2 py-0.5 rounded-lg border border-slate-800 text-[11px] font-bold">
                    {{ item.ip_address || 'Unknown IP' }}
                  </span>
                </div>

                <!-- Mobile & Accuracy -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-1.5">
                    <span class="text-[10px] text-slate-400 uppercase font-bold">Mobile:</span>
                    <span class="font-mono bg-slate-900 text-emerald-400 px-2 py-0.5 rounded-lg border border-slate-800 font-bold text-xs">
                      {{ maskMobile(item.mobile) }}
                    </span>
                  </div>
                  <div>
                    <span
                      v-if="item.accuracy"
                      class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold"
                      :class="item.accuracy <= 250 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'"
                    >
                      ±{{ item.accuracy > 1000 ? Math.round(item.accuracy / 1000) + 'km' : Math.round(item.accuracy) + 'm' }}
                      <span class="ml-1 text-[9px] opacity-80">({{ item.accuracy <= 250 ? 'GPS' : 'IP' }})</span>
                    </span>
                    <span v-else class="text-[10px] text-slate-500">No Accuracy</span>
                  </div>
                </div>
              </div>

              <!-- Card Action: Full-width button for thumb friendly navigation -->
              <div class="pt-1">
                <a
                  v-if="item.latitude && item.longitude"
                  :href="`https://www.google.com/maps?q=${item.latitude},${item.longitude}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full min-h-[40px] flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 active:bg-indigo-500/35 text-xs font-bold transition shadow-sm"
                >
                  <MapPin class="w-3.5 h-3.5" />
                  <span>View Map ({{ Number(item.latitude).toFixed(3) }}, {{ Number(item.longitude).toFixed(3) }})</span>
                  <ExternalLink class="w-3.5 h-3.5 ml-1 opacity-70" />
                </a>
                <div v-else class="text-center text-xs text-slate-500 py-1">
                  GPS coordinates unavailable
                </div>
              </div>
            </div>
          </div>

          <!-- 2. TABLE VIEW (Visible on tablets and desktop >= 640px) -->
          <div class="hidden sm:block glass-panel rounded-3xl overflow-hidden shadow-2xl">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-800 text-left text-xs">
                <thead class="bg-slate-900/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th scope="col" class="px-4 py-4">Name &amp; Type</th>
                    <th scope="col" class="px-4 py-4">IP Address</th>
                    <th scope="col" class="px-4 py-4">Mobile</th>
                    <th scope="col" class="px-4 py-4">Date</th>
                    <th scope="col" class="px-4 py-4">GPS Accuracy</th>
                    <th scope="col" class="px-4 py-4 text-right">Location &amp; Map</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  <tr
                    v-for="item in filteredReferrals"
                    :key="item.id"
                    class="hover:bg-slate-800/40 transition-colors"
                  >
                    <!-- Name & Type -->
                    <td class="px-4 py-4 whitespace-nowrap">
                      <div class="flex items-center space-x-2">
                        <span class="font-bold text-white text-sm">{{ item.name }}</span>
                        <span
                          class="text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider"
                          :class="item.type === 'visit' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'"
                        >
                          {{ item.type === 'visit' ? 'Visit' : 'Claim' }}
                        </span>
                      </div>
                      <div class="text-[10px] text-slate-500 font-mono">{{ item.id }}</div>
                    </td>

                    <!-- IP Address -->
                    <td class="px-4 py-4 whitespace-nowrap">
                      <span class="font-mono bg-slate-900/90 text-indigo-300 px-2 py-0.5 rounded-lg border border-slate-800 font-bold text-xs">
                        {{ item.ip_address || '—' }}
                      </span>
                    </td>

                    <!-- Mobile (Masked like 98765*****) -->
                    <td class="px-4 py-4 whitespace-nowrap">
                      <span class="font-mono bg-slate-900/90 text-emerald-400 px-2.5 py-1 rounded-lg border border-slate-800 font-bold">
                        {{ maskMobile(item.mobile) }}
                      </span>
                    </td>

                    <!-- Date -->
                    <td class="px-4 py-4 whitespace-nowrap text-slate-300">
                      {{ formatDate(item.created_at) }}
                    </td>

                    <!-- GPS Accuracy -->
                    <td class="px-4 py-4 whitespace-nowrap">
                      <span
                        v-if="item.accuracy"
                        class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold"
                        :class="item.accuracy <= 250 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'"
                      >
                        ±{{ item.accuracy > 1000 ? Math.round(item.accuracy / 1000) + 'km' : Math.round(item.accuracy) + 'm' }}
                        <span class="ml-1 text-[9px] opacity-80">({{ item.accuracy <= 250 ? 'GPS' : 'IP' }})</span>
                      </span>
                      <span v-else class="text-slate-500">N/A</span>
                    </td>

                    <!-- Action: View Location Button & Place Name -->
                    <td class="px-4 py-4 whitespace-nowrap text-right">
                      <div class="flex flex-col items-end space-y-1">
                        <span
                          v-if="item.location_name"
                          class="font-bold text-xs flex items-center space-x-1"
                          :class="item.accuracy && item.accuracy <= 250 ? 'text-emerald-400' : 'text-amber-400'"
                        >
                          <MapPin class="w-3 h-3 flex-shrink-0" />
                          <span class="truncate max-w-[190px]">{{ item.location_name }}</span>
                        </span>
                        <a
                          v-if="item.latitude && item.longitude"
                          :href="`https://www.google.com/maps?q=${item.latitude},${item.longitude}`"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 text-[11px] font-bold transition shadow-sm"
                        >
                          <span>View Map</span>
                          <ExternalLink class="w-3 h-3" />
                        </a>
                        <span v-else class="text-slate-500 text-[11px]">No GPS</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Loader2, 
  RefreshCw, 
  LogOut, 
  Users, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  ExternalLink 
} from 'lucide-vue-next';
import Toast from '../components/Toast.vue';
import { adminApi, referralApi } from '../services/api';

// Auth State
const isAuthenticated = ref(false);
const adminInfo = ref(null);

// Login Form State
const loginEmail = ref('');
const loginPassword = ref('');
const loginLoading = ref(false);

const fillDefaultCredentials = () => {
  loginEmail.value = 'admin@example.com';
  loginPassword.value = 'Admin@123';
};

// Referrals State
const referrals = ref([]);
const fetchLoading = ref(false);
const searchQuery = ref('');

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
  }, 4000);
};

onMounted(() => {
  const token = localStorage.getItem('admin_token');
  const storedInfo = localStorage.getItem('admin_info');

  if (token) {
    isAuthenticated.value = true;
    if (storedInfo) {
      try {
        adminInfo.value = JSON.parse(storedInfo);
      } catch {
        // ignore parse issue
      }
    }
    fetchReferrals();
  }
});

const handleLogin = async () => {
  loginLoading.value = true;
  try {
    const response = await adminApi.login({
      email: loginEmail.value.trim(),
      password: loginPassword.value,
    });

    if (response.token) {
      localStorage.setItem('admin_token', response.token);
      localStorage.setItem('admin_info', JSON.stringify(response.admin));
      isAuthenticated.value = true;
      adminInfo.value = response.admin;
      triggerToast('Welcome back, Admin!', 'success');
      fetchReferrals();
    }
  } catch (err) {
    console.error('Login error:', err);
    const msg = err.response?.data?.message || 'Invalid credentials or server error.';
    triggerToast(msg, 'error');
  } finally {
    loginLoading.value = false;
  }
};

const handleLogout = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_info');
  isAuthenticated.value = false;
  adminInfo.value = null;
  referrals.value = [];
  triggerToast('Signed out successfully.', 'info');
};

const fetchReferrals = async () => {
  fetchLoading.value = true;
  try {
    const response = await referralApi.getReferrals();
    referrals.value = response.data || [];
  } catch (err) {
    console.error('Fetch error:', err);
    const msg = err.response?.data?.message || 'Could not fetch referral list.';
    triggerToast(msg, 'error');
  } finally {
    fetchLoading.value = false;
  }
};

/**
 * Mask mobile number to pattern 98765*****
 * Displays first 5 digits, masks the remaining digits with *
 */
const maskMobile = (mobile) => {
  if (!mobile) return 'N/A';
  const clean = String(mobile).trim();
  if (clean.length <= 5) return clean;
  const visible = clean.slice(0, 5);
  const maskedCount = Math.max(clean.length - 5, 5);
  return `${visible}${'*'.repeat(maskedCount)}`;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d);
  } catch {
    return dateString;
  }
};

const filteredReferrals = computed(() => {
  if (!searchQuery.value.trim()) return referrals.value;
  const q = searchQuery.value.toLowerCase().trim();
  return referrals.value.filter(
    (item) =>
      item.name?.toLowerCase().includes(q) ||
      item.mobile?.toLowerCase().includes(q) ||
      item.ip_address?.toLowerCase().includes(q) ||
      item.location_name?.toLowerCase().includes(q)
  );
});
</script>
