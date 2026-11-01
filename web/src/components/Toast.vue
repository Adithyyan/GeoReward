<template>
  <transition
    enter-active-class="transform transition ease-out duration-300"
    enter-from-class="-translate-y-6 opacity-0 scale-95"
    enter-to-class="translate-y-0 opacity-100 scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="show"
      class="fixed top-3 xs:top-4 inset-x-3 xs:inset-x-4 max-w-sm mx-auto z-50 rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-2xl border flex items-start space-x-3"
      :class="typeClasses"
    >
      <component :is="iconComponent" class="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div class="flex-1 text-xs sm:text-sm font-semibold leading-relaxed">
        {{ message }}
      </div>
      <button
        @click="$emit('close')"
        type="button"
        class="text-current opacity-70 hover:opacity-100 p-1 rounded-lg transition active:scale-95"
        aria-label="Close notification"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';
import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-vue-next';

const props = defineProps({
  show: { type: Boolean, default: false },
  message: { type: String, default: '' },
  type: { type: String, default: 'info' },
});

defineEmits(['close']);

const iconComponent = computed(() => {
  if (props.type === 'success') return CheckCircle2;
  if (props.type === 'warning') return AlertTriangle;
  return AlertCircle;
});

const typeClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-emerald-950/95 border-emerald-500/60 text-emerald-100 shadow-emerald-950/50';
    case 'error':
      return 'bg-rose-950/95 border-rose-500/60 text-rose-100 shadow-rose-950/50';
    case 'warning':
      return 'bg-amber-950/95 border-amber-500/60 text-amber-100 shadow-amber-950/50';
    default:
      return 'bg-slate-900/95 border-slate-700 text-slate-100 shadow-black/60';
  }
});
</script>
