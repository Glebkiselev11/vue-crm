import localizeFilter from '@/filters/localize.filter'

// Нужен для вывода всплывающего окна при навидении на элемент в планинге
export default {
  bind(el, { value, modifiers }) {
    window.M.Tooltip.init(el, {
      html: modifiers.noloc ? value : localizeFilter(value)
    })
  },
  // Unbind аналагичен destroyed, то есть вызывается когда деректива уничтожается
  unbind(el) {
    const tooltip = window.M.Tooltip.getInstance(el)

    if (tooltip && tooltip.destroy) {
      tooltip.destroy()
    }
  }
}