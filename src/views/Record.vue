<template>
  <div>
    <div class="page-title">
      <h3>{{"New_entry" | localize}}</h3>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!categories.length" >{{"No_categories_yet" | localize}}. <router-link to="/categories">Добавить новую категорию</router-link></p>

    <form class="form" v-else @submit.prevent="handlerSubmit">
      <div class="input-field" >
        <select ref="select" v-model="category">
          <option
            v-for="c in categories"
            :key="c.id"
            :value="c.id"
          >{{c.title}}</option>
        </select>
        <label>{{"Select_a_category" | localize}}</label>
      </div>

      <p>
        <label>
          <input
              class="with-gap"
              name="type"
              type="radio"
              value="income"
              v-model="type"
          />
          <span>{{"Income" | localize}}</span>
        </label>
      </p>

      <p>
        <label>
          <input
              class="with-gap"
              name="type"
              type="radio"
              value="outcome"
              v-model="type"
          />
          <span>{{"Outcome" | localize}}</span>
        </label>
      </p>

      <div class="input-field">
        <input
            id="amount"
            type="number"
            v-model.number="amount"
            :class="{invalid: $v.amount.$dirty && !$v.amount.minValue}"
        >
        <label for="amount">{{"Amount" | localize}}</label>
        <span 
            class="helper-text invalid"
            v-if="$v.amount.$dirty && !$v.amount.minValue"
          >
            {{"Minimum_value" | localize}} {{$v.amount.$params.minValue.min}}
        </span>
      </div>

      <div class="input-field">
        <input
            id="description"
            type="text"
            v-model="description"
            :class="{invalid: $v.description.$dirty && !$v.description.required}"
        >
        <label for="description">{{"Description" | localize}}</label>
        <span 
            class="helper-text invalid"
            v-if="$v.description.$dirty && !$v.description.required"
          >
            {{"Enter_a_description" | localize}}
        </span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{"Create" | localize}}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import {required, minValue} from 'vuelidate/lib/validators'
import {mapGetters} from 'vuex'

export default {
  name: 'record',
  metaInfo() {
    return {
      title: this.$title('Menu_NewRecord')
    }
  },
  data: () => ({
    loading: true,
    select: null,
    categories: [],
    category: null,
    type: 'outcome',
    amount: 1,
    description: ''
  }),
  validations: {
    description: {required},
    amount: {minValue: minValue(1)}
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord() {
      if (this.type === 'income') {
        return true
      }

      return this.info.bill >= this.amount
    }
  },
  methods: {
    async handlerSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      if (this.canCreateRecord) {

        try {
          await this.$store.dispatch('createRecord', {
          categoryId: this.category,
          amount: this.amount,
          description: this.description,
          type: this.type,
          date: new Date().toJSON()
        })

          // здесь мы в зависимости от того расход это или приход
          // отнимаем или прибавляем к текущему счету сумму
          const bill = this.type === 'income'
            ? this.info.bill + this.amount
            : this.info.bill - this.amount


          // а здесь мы обновляем это уже в базе данных
          await this.$store.dispatch('updateInfo', {bill})
          
          // здесь обращаемся к нашему плагину с тостами для вывода сообщения
          this.$message(`Запись успешно обновлена`)

          // здесь обращаемся к форме, чтобы вью ее очистил
          this.$v.$reset()
          
          this.amount = 1
          this.description = ''

        } catch (e) {}
        
      } else {
        this.$message(`Для данного расхода вам не хватает: ${this.amount - this.info.bill} рублей`)
      }

    }
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    this.loading = false

    if(this.categories.length) {
      this.category = this.categories[0].id
    }


    // небольшой js hack чтобы с небольшой задержкой (ставит в очередь) отрисивать селект
    setTimeout(() => {
      this.select = window.M.FormSelect.init(this.$refs.select);
      window.M.updateTextFields()
    }, 0)

    
  },
  // нужен чтобы очистить память
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  }
}
</script>