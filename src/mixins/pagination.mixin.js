import _ from 'lodash'

export default {
  data() {
    return {
      page: +this.$route.query.page || 1, // Страница на которой находимся, по дефолту равна 1
      pageSize: 5, // Сколько записей показывать на одной странице
      pageCount: 0, // Количество страниц
      allItems: [], // Многомерный массив в котором лежат массивы с элементами
      items: [], // Тут те элементы которые мы в данный момент показываем на странице
    }
  },
  methods: {
    setupPagination(allItems) {
      // Здесь разбиваем массив allItems на подмассивы с количеством элементов которое у нас стоит в pageSize
      this.allItems = _.chunk(allItems, this.pageSize)
      // Считаем колличество страниц
      this.pageCount = _.size(this.allItems)
      // Заносим в массив items текущие элементы которые надо показать
      this.items = this.allItems[this.page - 1] || this.allItems[0]
    },
    // Логика для переключения страниц в пагинации
    pageChangehandler(page) {
      // Задаем квери параметры для страницы на которой находимся переключая пагинацию
      this.$router.push(`${this.$route.path}?page=${page}`)
      this.items = this.allItems[page - 1] || this.allItems[0]
    }
  },
}