import store from '../store' // Импортируем сюда стор, для того, чтобы подставлять нужный формат под локализацию

export default function dateFilter(value, format = 'date') {
  const options = {}

  if (format.includes('date')) {
    options.day = 'numeric'
    options.month = 'long'
    options.year = 'numeric'
  }

  if (format.includes('time')) {
    options.hour = '2-digit'
    options.minute = '2-digit'
    options.second = '2-digit'
  }

  // В зависимости от выбранной локализации, ставим нужный формат даты
  const locale = store.getters.info.locale || 'ru-RU'

  return new Intl.DateTimeFormat(locale, options).format(new Date(value))
}