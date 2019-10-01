<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <!-- Здесь у нас график в виде пирога -->
      <canvas ref="canvas" ></canvas>
    </div>

    <Loader v-if="loading" />

    <!-- Если в таблице ничего нет, то показываем этот текст -->
    <p class="center" v-else-if="!records.length">
      Записей пока нет. 
      <router-link to="/record" >Добавьте первую</router-link>
    </p>  

    <!-- Если же есть, то показываем саму таблицу -->
    <section v-else>
      <HistoryTable :records="items"/>

      <!-- Пагинация ( для визуальной части использовался плагин vuejs-paginate, а вся логика лежит в @/mixins/pagination.mixin) -->
      <Paginate
        v-model="page" 
        :page-count="pageCount"
        :click-handler="pageChangehandler"
        :prev-text="'Назад'"
        :next-text="'Вперёд'"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      />
    </section>
  </div>
</template>

<script>
import paginationMixin from '@/mixins/pagination.mixin' // Миксин в котором описана логика для пагинации
import HistoryTable from '@/components/HistoryTable'
import {Pie} from 'vue-chartjs' // Импортируем круглый график

export default {
  name: 'history',
  extends: Pie,
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    records: []
  }),
  components: {
    HistoryTable, // Компонент таблицы
  },
  async mounted() {
    // Заходя на страницу мы сразу подгружаем нужные данные из api
    this.records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')

    // Тут перенес логику в метод setup (дабы не сильно засорять mounted)
    this.setup(categories)
    
    this.loading = false  
  },
  methods: {
    setup(categories) {
      // Тут сразу пропускаем через метод для пагинации 
      this.setupPagination(this.records.map(record => {
        return {
          ...record,
          categoryName: categories.find(c => c.id === record.categoryId).title, // Тут мы получаем имя категории
          typeClass: record.type === 'income' ? 'green' : 'red', // Ставим цвет колонки
          typeText: record.type === 'income' ? 'Доход' : 'Расход', // Ставим нужный текст
        }
      }))

      // Здесь рендрим график
      this.renderChart({
        labels: categories.map(c => c.title), // Массив с категориями
        datasets: [{
          label: 'Расходы по категориям',
          data: categories.map(c => {
            return this.records.reduce((total, r) => {
              // Относится ли текущая запись к той категории которую мы проверяем
              if (r.categoryId === c.id && r.type === 'outcome') {
                total += +r.amount
              }
              return total
            }, 0)
          }),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      })
    }
  }
}
</script>