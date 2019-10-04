<template>
  <div>
    <div class="page-title">
      <h3>{{ 'ProfileTitle' | localize}}</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input
            id="description"
            type="text"
            v-model="name"
            :class="{invalid: $v.name.$dirty && !$v.name.required}"
        >
        <label for="description">{{ 'Name' | localize }}</label>

        <!-- Выводим это сообщение если пользователь пытается стереть имя -->
        <small 
          class="helper-text invalid"
          v-if="$v.name.$dirty && !$v.name.required"
        >{{'Enter_name' | localize}}
        
        </small>
      </div>

      <!-- Переключение англ / русс -->
      <div class="switch">
        <label>
          English
          <input type="checkbox" v-model="isRuLocale">
          <span class="lever"></span>
          Русский
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{'Update' | localize}}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators' // Подключаем валидацию на внесение имени
import localeFilter from '@/filters/localize.filter'

export default {
  // metaInfo сделана методом для того, чтобы реактивно отрисововался компонент, при смене с англ на русс
  metaInfo() {
    return {
      title: this.$title('ProfileTitle')
    }
  },
  data: () => ({
    name: '', // Имя пользователя
    isRuLocale: true, // Для локализации
  }),
  validations: {
    name: { required },
  },
  mounted() {
    // Получаем имя пользователя из $store
    this.name = this.info.name

    // Проверяем включен ли русский в $store
    this.isRuLocale = this.info.locale === 'ru-RU' 

    // Сет таймаут, нужен, чтобы эта функция сработала в самом конце всего стека
    setTimeout(() => {
      // Тут мы вызываем глобальный объект из материалайза, чтобы оживить инпуты
      window.M.updateTextFields()
    })
  },
  computed:{
    ...mapGetters(['info'])
  },
  methods: {
    ...mapActions(['updateInfo']), // Вызываем экшн из vuex
    // Метод для обновления имени
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      try {
        await this.updateInfo({
          name: this.name, // Обновляем имя
          locale: this.isRuLocale ? 'ru-RU' : 'en-US', // Обновляем локализацию
        })
      } catch(e) {}
      
    }
  }
}
</script>


<style scoped>
  .switch {
    margin-bottom: 2rem;
  } 


</style>