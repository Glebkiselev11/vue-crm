<template>
  <div>
    <Loader v-if="loading" />

    <div v-else class="app-main-layout">

      <Navbar @click="isOpen = !isOpen" />

      <!-- Компонента сайд бара, :key нужен для того, чтобы динамически менять локализацию меню (отрисовывать по новой компонент при смене языка) -->
      <Sidebar v-model="isOpen" :key="locale" />

      <main class="app-content" :class="{full: !isOpen}">
        <div class="app-page">
          <router-view />
        </div>
      </main>

      <div class="fixed-action-btn">
        <router-link class="btn-floating btn-large blue" to="/record" v-tooltip="'CreateNewRecord'">
          <i class="large material-icons">add</i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/app/Navbar'
import Sidebar from '@/components/app/Sidebar'
import messages from '@/utils/messages'
export default {
  name: 'main-layout',
  data: () => ({
    isOpen: true,
    loading: true
  }),
  async mounted() {
    if (!Object.keys( this.$store.getters.info).length) {
      await this.$store.dispatch('fetchInfo')
    }

    this.loading = false
  },
  components: {
    Navbar, Sidebar

  },
  computed: {
		error() {
			return this.$store.getters.error
    },
    locale() {
      // Вызывает перерисовку компонента сайд бара, когда мы в профиле меняем язык, нужно чтобы реактивно менялся язык
      return this.$store.getters.info.locale
    }
	},
	watch: {
		error(fbError) {
			this.$error(messages[fbError.code] || 'что-то пошло не так')
		}
	}
}
</script>
