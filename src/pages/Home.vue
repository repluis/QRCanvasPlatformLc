<template>
  <div class="mx-auto max-w-4xl px-4 py-12">
    <div class="mb-10 text-center">
      <h1 class="text-4xl font-bold text-text">
        Welcome, {{ user?.name }} 👋
      </h1>
      <p class="mt-2 text-text-muted">
        QRCanvasPlatform — Create and share beautiful pages
      </p>
    </div>

    <!-- Templates section -->
    <div class="mb-12">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-text">Templates ✨</h2>
          <p class="mt-1 text-sm text-text-muted">
            Empieza rápido con una composición prediseñada — edítala a tu gusto.
          </p>
        </div>
      </div>

      <div v-if="templates.length > 0" class="grid gap-4 sm:grid-cols-2">
        <div
          v-for="t in templates"
          :key="t.id"
          class="group rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md"
        >
          <div class="mb-3 flex items-start gap-3">
            <div class="text-3xl">{{ t.emoji }}</div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-text">{{ t.name }}</h3>
              <p class="mt-1 text-sm text-text-muted">{{ t.description }}</p>
            </div>
          </div>
          <BaseButton
            :disabled="loadingTemplate === t.id"
            class="w-full"
            @click="useTemplate(t)"
          >
            {{ loadingTemplate === t.id ? 'Creando...' : 'Use template' }}
          </BaseButton>
        </div>
      </div>

      <p v-else class="text-sm italic text-text-dim">
        No templates available right now.
      </p>
    </div>

    <!-- Your pages section -->
    <div class="mb-8 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-text">Your pages</h2>
      <router-link to="/editor" class="rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-primary shadow transition hover:bg-primary-hover active:scale-95">
        + New blank page
      </router-link>
    </div>

    <div
      v-if="pages.length === 0"
      class="rounded-2xl border-2 border-dashed border-border bg-surface p-16 text-center"
    >
      <p class="text-lg text-text-dim">You don't have any pages yet</p>
      <router-link
        to="/editor"
        class="mt-4 inline-block rounded-lg px-6 py-3 text-sm font-semibold text-white bg-primary shadow transition hover:bg-primary-hover"
      >
        Create your first page
      </router-link>
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2">
      <div
        v-for="p in pages"
        :key="p.uuid"
        class="group rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md"
      >
        <div class="mb-3 flex items-start justify-between">
          <div>
            <h3 class="truncate text-lg font-semibold text-text">{{ p.title }}</h3>
            <p class="text-xs text-text-dim">{{ formatDate(p.updated_at) }}</p>
          </div>
          <button
            class="flex-shrink-0 ml-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition"
            :class="p.status ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'"
            @click="toggleStatus(p)"
          >
            {{ p.status ? 'Active' : 'Disabled' }}
          </button>
        </div>
        <div class="flex gap-2">
          <router-link
            :to="`/page?uuid=${p.uuid}`"
            class="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-muted transition hover:bg-surface-alt"
          >
            View
          </router-link>
          <router-link
            :to="`/editor?uuid=${p.uuid}`"
            class="rounded-lg px-3 py-1.5 text-xs font-medium text-white bg-primary transition hover:bg-primary-hover"
          >
            Edit
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@components/ui/BaseButton.vue'
import { useAuthStore } from '@stores/auth'
import { getEditorData, getTemplates, createPageFromTemplate, togglePageStatus } from '@services/canvas'
import type { Page, Template } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const user = ref(authStore.user)
const pages = ref<Page[]>([])
const templates = ref<Template[]>([])
const loadingTemplate = ref<number | null>(null)

const auth = authStore

onMounted(async () => {
  await loadData()
})

async function loadData() {
  try {
    const { images, userPages, page } = await getEditorData()
    pages.value = userPages || []

    const { templates: tmpls } = await getTemplates()
    templates.value = tmpls || []
  } catch (e) {
    console.error('Load data error:', e)
  }
}

async function toggleStatus(page: Page) {
  const prev = page.status
  page.status = !page.status
  try {
    await togglePageStatus(page.id)
  } catch {
    page.status = prev
  }
}

async function useTemplate(template: Template) {
  loadingTemplate.value = template.id
  try {
    const { page } = await createPageFromTemplate(template.id)
    if (page?.uuid) {
      router.push(`/editor?uuid=${page.uuid}`)
    }
  } catch (e) {
    console.error('Template error:', e)
    alert('Error creating page from template')
  } finally {
    loadingTemplate.value = null
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  return date.toLocaleDateString()
}
</script>