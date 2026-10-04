<script setup lang="ts">
import { ref } from 'vue'
import QrImage from './QrImage.vue'

const showQr = ref(false)
const pageUrl = window.location.href
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-red-50 to-rose-100 p-4">
    <div class="w-full max-w-2xl rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur sm:p-12">
      <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex-1 text-center sm:text-left">
          <h1 class="text-3xl font-bold text-pink-600 sm:text-4xl">For you ❤️</h1>
          <p class="mt-4 text-lg leading-relaxed text-gray-700">
            You are the reason my world makes sense.
            Every day by your side is a treasure I hold dear.
            Your smile lights up my mornings and your love
            fills every corner of my being with warmth.
          </p>
          <p class="mt-2 text-lg leading-relaxed text-gray-700">
            Thank you for existing, for being you, for loving me.
            This small gesture is just a glimpse
            of how immense my love is for you.
          </p>
          <p class="mt-6 text-xl font-semibold text-pink-500">I love you with all my heart 💖</p>
        </div>

        <div class="flex flex-col items-center gap-3">
          <button
            type="button"
            class="rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-pink-600 active:scale-95"
            @click="showQr = !showQr"
          >
            {{ showQr ? 'Hide QR' : 'View QR' }}
          </button>
          <p class="text-xs text-gray-400">Scan to view this page</p>
        </div>
      </div>
    </div>

    <div
      v-if="showQr"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      @click.self="showQr = false"
    >
      <div class="flex flex-col items-center gap-4 rounded-xl bg-white p-8 shadow-2xl">
        <QrImage :text="pageUrl" class="h-64 w-64" />
        <p class="max-w-64 break-all text-center text-sm text-gray-500">{{ pageUrl }}</p>
        <button
          type="button"
          class="rounded-lg bg-gray-200 px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
          @click="showQr = false"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
