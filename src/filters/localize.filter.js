import store from '../store'

// Дабы не засорять сильно этот файл, вынес объект с локализацией в отдельные json
import ru from '../locales/ru.json' 
import en from '../locales/en.json'

const locales = {
  'ru-RU': ru,
  'en-US': en
}

// Метод для локализации (рус/eng)
export default function localizeFilter (key) {

  // Здесь мы определяем из стора, какая сейчас включена локализация, по дефолту русский ставим
  const locale = store.getters.info.locale || 'ru-RU'

  // Тут мы возращаем нужное слово по ключу
  return locales[locale][key] || `[Localize error] : key ${key} not found`
}