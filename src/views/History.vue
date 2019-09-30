<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <canvas></canvas>
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
export default {
  name: 'history',
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

    // Тут сразу пропускаем через метод для пагинации 
    this.setupPagination(this.records.map(record => {
      return {
        ...record,
        categoryName: categories.find(c => c.id === record.categoryId).title, // Тут мы получаем имя категории
        typeClass: record.type === 'income' ? 'green' : 'red', // Ставим цвет колонки
        typeText: record.type === 'income' ? 'Доход' : 'Расход', // Ставим нужный текст



      }
    }))
    

    this.loading = false
    
  },
}
</script>