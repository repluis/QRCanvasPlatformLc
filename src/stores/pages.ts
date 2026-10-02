import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Page, Canvas, CanvasElement, Template } from '@/types'
import { pagesService } from '@/services/pages'

export const usePagesStore = defineStore('pages', () => {
  const pages = ref<Page[]>([])
  const currentPage = ref<Page | null>(null)
  const templates = ref<Template[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const userPages = computed(() => pages.value)

  async function fetchUserPages() {
    loading.value = true
    error.value = null
    try {
      pages.value = await pagesService.getUserPages()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch pages'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchTemplates() {
    try {
      templates.value = await pagesService.getTemplates()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch templates'
      error.value = message
      throw err
    }
  }

  async function createPage(data: Partial<Page>) {
    loading.value = true
    error.value = null
    try {
      const page = await pagesService.createPage(data)
      pages.value.unshift(page)
      return page
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create page'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePage(id: number, data: Partial<Page>) {
    loading.value = true
    error.value = null
    try {
      const page = await pagesService.updatePage(id, data)
      const index = pages.value.findIndex(p => p.id === id)
      if (index !== -1) {
        pages.value[index] = page
      }
      if (currentPage.value?.id === id) {
        currentPage.value = page
      }
      return page
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update page'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePage(id: number) {
    loading.value = true
    error.value = null
    try {
      await pagesService.deletePage(id)
      pages.value = pages.value.filter(p => p.id !== id)
      if (currentPage.value?.id === id) {
        currentPage.value = null
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete page'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function togglePageStatus(id: number) {
    const page = pages.value.find(p => p.id === id)
    if (!page) return
    try {
      const updated = await pagesService.togglePageStatus(id)
      const index = pages.value.findIndex(p => p.id === id)
      if (index !== -1) {
        pages.value[index] = updated
      }
      return updated
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to toggle status'
      error.value = message
      throw err
    }
  }

  async function createFromTemplate(templateId: string) {
    loading.value = true
    error.value = null
    try {
      const page = await pagesService.createFromTemplate(templateId)
      pages.value.unshift(page)
      return page
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create from template'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  function setCurrentPage(page: Page | null) {
    currentPage.value = page
  }

  function clearCurrentPage() {
    currentPage.value = null
  }

  return {
    pages,
    currentPage,
    templates,
    loading,
    error,
    userPages,
    fetchUserPages,
    fetchTemplates,
    createPage,
    updatePage,
    deletePage,
    togglePageStatus,
    createFromTemplate,
    setCurrentPage,
    clearCurrentPage,
  }
})