<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePagesStore } from '@/stores/pages'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const pagesStore = usePagesStore()

const templates = ref<any[]>([])
const loadingTemplate = ref<string | null>(null)

onMounted(async () => {
  await Promise.all([
    pagesStore.fetchUserPages(),
    pagesStore.fetchTemplates(),
  ])
  templates.value = pagesStore.templates
})

function navigateToCanvas(uuid?: string) {
  if (uuid) {
    router.push(`/canvas?uuid=${uuid}`)
  } else {
    router.push('/canvas')
  }
}

async function toggleStatus(page: any) {
  const prev = page.status
  page.status = !page.status
  try {
    await pagesStore.togglePageStatus(page.id)
  } catch {
    page.status = prev
  }
}

async function useTemplate(template: any) {
  loadingTemplate.value = template.id
  try {
    const page = await pagesStore.createFromTemplate(template.id)
    router.push(`/canvas?uuid=${page.uuid}`)
  } catch (err: unknown) {
    alert(err instanceof Error ? err.message : 'Error creating page from template')
  } finally {
    loadingTemplate.value = null
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-12">
    <div class="mb-10 text-center">
      <h1 class="text-4xl font-bold text-slate-900 dark:text-slate-100">
        Welcome, {{ authStore.user?.name }} 👋
      </h1>
      <p class="mt-2 text-slate-500 dark:text-slate-400">
        QRCanvasPlatform — Create and share beautiful pages
      </p>
    </div>

    <!-- Templates section -->
    <div class="mb-12">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">Templates ✨</h2>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Start quickly with a pre-designed composition — edit it to your liking.
        </p>
      </div>

      <div v-if="templates.length > 0" class="grid gap-4 sm:grid-cols-2">
        <BaseCard
          v-for="t in templates"
          :key="t.id"
          class="group shadow-sm transition hover:shadow-md"
        >
          <div class="mb-3 flex items-start gap-3">
            <div class="text-3xl">{{ t.emoji }}</div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ t.name }}</h3>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ t.description }}</p>
            </div>
          </div>
          <BaseButton
            variant="primary"
            class="w-full"
            :disabled="loadingTemplate === t.id"
            @click="useTemplate(t)"
          >
            {{ loadingTemplate === t.id ? 'Creating...' : 'Use template' }}
          </BaseButton>
        </BaseCard>
      </div>

      <p v-else class="text-sm italic text-slate-400">No templates available right now.</p>
    </div>

    <!-- Your pages section -->
    <div class="mb-8 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">Your pages</h2>
      <router-link to="/canvas" class="rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 transition">
        + New blank page
      </router-link>
    </div>

    <div v-if="pagesStore.userPages.length === 0" class="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 p-16 text-center bg-white dark:bg-slate-800">
      <p class="text-lg text-slate-500 dark:text-slate-400">You don't have any pages yet</p>
      <BaseButton variant="primary" class="mt-4" @click="navigateToCanvas">
        Create your first page
      </BaseButton>
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2">
      <BaseCard
        v-for="p in pagesStore.userPages"
        :key="p.uuid"
        class="group shadow-sm transition hover:shadow-md"
      >
        <div class="mb-3 flex items-start justify-between">
          <div>
            <h3 class="truncate text-lg font-semibold text-slate-900 dark:text-slate-100">{{ p.title }}</h3>
            <p class="text-xs text-slate-400">{{ new Date(p.updated_at).toLocaleDateString() }}</p>
          </div>
          <button
            class="flex-shrink-0 ml-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition"
            :class="p.status ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'"
            @click="toggleStatus(p)"
          >
            {{ p.status ? 'Active' : 'Disabled' }}
          </button>
        </div>
        <div class="flex gap-2">
          <a
            :href="`/page?uuid=${p.uuid}`"
            target="_blank"
            class="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            View
          </a>
          <router-link
            :to="`/canvas?uuid=${p.uuid}`"
            class="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-600 transition"
          >
            Edit
          </router-link>
        </div>
      </BaseCard>
    </div>
  </div>
</template>