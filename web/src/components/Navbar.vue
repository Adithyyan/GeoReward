<template>
  <header class="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
    <div
      class="mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between"
      :class="$route.path === '/admin' ? 'max-w-4xl' : 'max-w-md'"
    >
      <!-- Brand Logo -->
      <router-link to="/" class="flex items-center space-x-2 group">
        <div class="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
          <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-emerald-400">
            <Zap class="w-3.5 h-3.5 fill-emerald-400" />
          </div>
        </div>
        <div class="flex flex-col">
          <span class="text-xs font-black text-white tracking-tight leading-none">
            Refer<span class="text-emerald-400">&amp;Win</span>
          </span>
          <span class="text-[9px] text-emerald-400/80 font-medium tracking-wider flex items-center space-x-1 mt-0.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            <span>VERIFIED REWARDS</span>
          </span>
        </div>
      </router-link>

      <!-- Right Header Item: NO admin button on regular app! Only show if on /admin -->
      <div v-if="$route.path === '/admin'">
        <router-link
          to="/"
          class="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition flex items-center space-x-1.5"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>Exit to App</span>
        </router-link>
      </div>

      <!-- On user app: Clean security badge, NO confusing admin toggle -->
      <div v-else class="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
        <ShieldCheck class="w-3.5 h-3.5" />
        <span>GPS Protected</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { Zap, ShieldCheck, ArrowLeft } from 'lucide-vue-next';

const route = useRoute();
</script>
