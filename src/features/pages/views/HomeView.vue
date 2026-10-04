<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/authStore'
import { getErrorMessage } from '@/shared/lib/http'
import { pagesService } from '../pagesService'
import type { PageSummary, TemplateSummary } from '../types'

const auth = useAuthStore()
const router = useRouter()

const pages = ref<PageSummary[]>([])
const templates = ref<TemplateSummary[]>([])
const loading = ref(true)
const error = ref('')
const creatingFrom = ref<string | null>(null)

const relativeTime = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60],
]

function timeAgo(iso: string) {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000
  const [unit, size] = UNITS.find(([, s]) => Math.abs(seconds) >= s) ?? ['second', 1]
  return relativeTime.format(Math.round(seconds / size), unit)
}

onMounted(async () => {
  try {
    ;[pages.value, templates.value] = await Promise.all([pagesService.list(), pagesService.listTemplates()])
  } catch (e) {
    error.value = getErrorMessage(e, 'No se pudieron cargar tus páginas')
  } finally {
    loading.value = false
  }
})

async function toggleStatus(page: PageSummary) {
  page.status = !page.status
  try {
    page.status = (await pagesService.toggleStatus(page.id)).status
  } catch {
    page.status = !page.status
  }
}

async function removePage(page: PageSummary) {
  if (!confirm(`¿Eliminar "${page.title}"? Los QR impresos dejarán de funcionar.`)) return
  try {
    await pagesService.remove(page.id)
    pages.value = pages.value.filter((p) => p.id !== page.id)
  } catch (e) {
    alert(getErrorMessage(e, 'No se pudo eliminar la página'))
  }
}

async function useTemplate(template: TemplateSummary) {
  creatingFrom.value = template.id
  try {
    const page = await pagesService.createFromTemplate(template.id)
    await router.push({ name: 'editor', query: { uuid: page.uuid } })
  } catch (e) {
    alert(getErrorMessage(e, 'Error al crear la página desde la plantilla'))
  } finally {
    creatingFrom.value = null
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-12">
    <div class="mb-10 text-center">
      <h1 class="text-4xl font-bold text-text">Hola, {{ auth.user?.name }} 👋</h1>
      <p class="mt-2 text-text-muted">QRCanvasPlatform: crea y comparte páginas con su propio QR</p>
    </div>

    <p v-if="error" class="mb-6 rounded-lg bg-danger/10 p-3 text-sm text-danger">{{ error }}</p>

    <section class="mb-12">
      <h2 class="text-xl font-semibold text-text">Plantillas ✨</h2>
      <p class="mb-6 mt-1 text-sm text-text-muted">Empieza rápido con una composición prediseñada y edítala a tu gusto.</p>

      <div v-if="templates.length" class="grid gap-4 sm:grid-cols-2">
        <article v-for="t in templates" :key="t.id" class="card">
          <div class="mb-3 flex items-start gap-3">
            <div class="text-3xl">{{ t.emoji }}</div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-text">{{ t.name }}</h3>
              <p class="mt-1 text-sm text-text-muted">{{ t.description }}</p>
            </div>
          </div>
          <button
            type="button"
            :disabled="creatingFrom !== null"
            class="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary-hover active:scale-95 disabled:opacity-50"
            @click="useTemplate(t)"
          >
            {{ creatingFrom === t.id ? 'Creando...' : 'Usar plantilla' }}
          </button>
        </article>
      </div>
      <p v-else-if="!loading" class="text-sm italic text-text-dim">No hay plantillas disponibles.</p>
    </section>

    <section>
      <div class="mb-8 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-text">Tus páginas</h2>
        <RouterLink
          :to="{ name: 'editor' }"
          class="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-primary-hover active:scale-95"
        >
          + Página en blanco
        </RouterLink>
      </div>

      <p v-if="loading" class="text-text-muted">Cargando...</p>

      <div v-else-if="pages.length === 0" class="rounded-2xl border-2 border-dashed border-border bg-surface p-16 text-center">
        <p class="text-lg text-text-dim">Aún no tienes páginas</p>
        <RouterLink
          :to="{ name: 'editor' }"
          class="mt-4 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-primary-hover"
        >
          Crear tu primera página
        </RouterLink>
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2">
        <article v-for="p in pages" :key="p.uuid" class="card">
          <div class="mb-3 flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h3 class="truncate text-lg font-semibold text-text">{{ p.title }}</h3>
              <p class="text-xs text-text-dim">{{ timeAgo(p.updatedAt) }}</p>
            </div>
            <button
              type="button"
              class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition"
              :class="p.status ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'"
              :title="p.status ? 'Desactivar página pública' : 'Activar página pública'"
              @click="toggleStatus(p)"
            >
              {{ p.status ? 'Activa' : 'Desactivada' }}
            </button>
          </div>
          <div class="flex gap-2">
            <RouterLink
              :to="{ name: 'page-show', query: { uuid: p.uuid } }"
              target="_blank"
              class="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-muted transition hover:text-text"
            >
              Ver
            </RouterLink>
            <RouterLink
              :to="{ name: 'editor', query: { uuid: p.uuid } }"
              class="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-hover"
            >
              Editar
            </RouterLink>
            <button
              type="button"
              class="ml-auto rounded-lg px-3 py-1.5 text-xs font-medium text-text-dim transition hover:bg-danger/10 hover:text-danger"
              @click="removePage(p)"
            >
              Eliminar
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.card {
  @apply rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md;
}
</style>
