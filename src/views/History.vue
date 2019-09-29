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
      <HistoryTable :records="records"/>
    </section>
  </div>
</template>

<script>
import HistoryTable from '@/components/HistoryTable'
export default {
  name: 'history',
  data: () => ({
    loading: true,
    records: [],
    categories: []
  }),
  components: {
    HistoryTable, // Компонент таблицы
  },
  async mounted() {
    // Заходя на страницу мы сразу подгружаем нужные данные из api
    // this.records = await this.$store.dispatch('fetchRecords')
    const records = await this.$store.dispatch('fetchRecords')
    this.categories = await this.$store.dispatch('fetchCategories')

    this.records = records.map(record => {
      return {
        ...record,
        categoryName: this.categories.find(c => c.id === record.categoryId).title, // Тут мы получаем имя категории
        typeClass: record.type === 'income' ? 'green' : 'red', // Ставим цвет колонки
        typeText: record.type === 'income' ? 'Доход' : 'Расход', // Ставим нужный текст



      }
    })
    

    this.loading = false
    
  },
}
</script>