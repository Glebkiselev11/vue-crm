<template>
  <div>
    <Loader v-if="loading" />
    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">История</router-link>
        <!-- Тут в зависимости от типа ставим название (по верстке материалайза этот тег должен быть ссылкой, 
        но чтобы по клику ничего не просходило добавили атребут @click.prevent)-->
        <a @click.prevent class="breadcrumb">
          {{record.type === 'income' ? 'Доход' : 'Расход' }}
        </a>       
      </div>
      <div class="row">
        <div class="col s12 m6">
          <!-- Тут в зависимости от типо красим карточку (красный если расход, зеленый если доход) -->
          <div class="card" :class="{
            'red' : record.type === 'outcome',
            'green' : record.type === 'income'
          }">
            <div class="card-content white-text">
              <p>Описание: {{record.description}}</p>
              <p>Сумма: {{record.amount | currency }}</p>
              <p>Категория: {{record.categoryName}}</p>

              <small>{{record.date | date('datetime')}}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="center" v-else>Запись с id: <strong>{{$route.params.id}}</strong> не найдена</p>
  </div>
</template>

<script>
export default {
  name: 'detail',
  data: () => ({
    record: null,
    loading: true,

  }),
  async mounted() {
    // Получаем из $route айди (почему именно id? Потому, что так у нас прописано в файле router.js в таком значении path: '/detail/:id')
    const id = this.$route.params.id
    // Вызываем из $стора метод, который нам найдет эту запись в базе данных по этому айди
    const record = await this.$store.dispatch('fetchRecordById', id)
    // А тут вызываем из $стора метод, который найдет нам нужную категорию по айди
    const category = await this.$store.dispatch('fetchCategoryById', record.categoryId)

    this.record = {
      ...record,
      categoryName: category.title
    }

    this.loading = false
  }
}
</script>