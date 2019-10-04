<template>
  <div>
    <div class="page-title">
      <h3>{{"Planning" | localize}}</h3>
      <h4>{{info.bill | currency('RUB')}}</h4>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!categories.length" >{{"No_categories_yet" | localize}}. <router-link to="/categories">{{"Add_New_Category" | localize}}</router-link></p>


    <section v-else>
      <div v-for="cat of categories" :key="cat.id">
        <p>
          <strong>{{cat.title}}:</strong>
          {{cat.spend | currency('RUB')}} {{"of" | localize}} {{cat.limit | currency('RUB')}}
        </p>
        <div class="progress" v-tooltip="cat.tooltip">
          <div
              class="determinate"
              :class="[cat.progressColor]"
              :style="{width: cat.progressPercent + '%'}"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import localizeFilter from '@/filters/localize.filter'

// Здесь пришлось импортировать фильтр для tooltip (Потому что его нельзя вызвать в дерективе)
import currencyFilter from '@/filters/currency.filter' 
export default {
  name: 'planing',
  metaInfo() {
    return {
      title: this.$title('Menu_Planning')
    }
  },
  data: () => ({
    loading: true,
    categories: []
  }),
  computed: {
    ...mapGetters(['info'])
  },
  async mounted() {
    const records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')

    // Тут мы обрабатываем приходные значения для корректного отображения
    this.categories = categories.map(cat => {
      const spend = records
        .filter(r => r.categoryId === cat.id)
        .filter(r => r.type === 'outcome')
        .reduce((total, record) => {
          return total += +record.amount
        }, 0)
      
      // Здесь мы получаем процент
      const percent = 100 * spend / cat.limit
      // А тут проверяем, что если вдруг процентов больше 100, то ставим ему принудительно 100
      // Если же меньше, то ничего не делаем
      const progressPercent = percent > 100 ? 100 : percent

      // Тут вычисляем цвет для прогресс бара (если процентов меньше  
      // 60, то зеленый, если больше то желтый, а если 100 то красный)
      const progressColor = percent < 60
        ? 'green'
        : percent < 100
          ? 'yellow'
          : 'red'
      
      // Здесь мы добавляем данные в tooltip (эта штука которая появляется при наведении на прогресс бар)
      // А так же проводим цифру через фильтр currencyFilter, потому что его нельзя вызвать в шаблоне, так как
      // tooltip это деректива
      const tooltipValue = cat.limit - spend
      const tooltip = `${tooltipValue < 0 ? localizeFilter("Excess_by") : localizeFilter("Stayed")} ${currencyFilter(Math.abs(tooltipValue))}`
      
      return {
        ...cat,
        progressPercent,
        progressColor,
        spend,
        tooltip
      }
    })

    this.loading = false
  },
}

</script>