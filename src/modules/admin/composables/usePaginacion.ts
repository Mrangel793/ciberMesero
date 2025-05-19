import { ref, computed, watch } from 'vue'

export function usePaginacion<T>(items: () => T[]) {
  const currentPage = ref(1)
  const pageSize = ref(7)

  const totalPages = computed(() =>
    Math.ceil(items().length / pageSize.value)
  )

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return items().slice(start, start + pageSize.value)
  })

  const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
  }

  const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
  }

  const goToPage = (page: number) => {
    currentPage.value = page
  }

  watch([pageSize, items], () => {
    currentPage.value = 1
  })

  return {
    currentPage,
    pageSize,
    totalPages,
    paginatedItems,
    nextPage,
    prevPage,
    goToPage
  }
}
