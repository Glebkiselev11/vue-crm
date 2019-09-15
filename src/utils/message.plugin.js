export default {
  install(Vue) {

    // обращаясь в скриптах компонентах через this.$message вызываем тостер с тем текстом который туда передали
    Vue.prototype.$message = function (html) {
      window.M.toast({html})
    }

    // обращаясь в скриптах компонентах через this.$error вызываем тостер ошибки с тем текстом который туда передали
    Vue.prototype.$error = function(html) {
      window.M.toast({html: `[Ошибка]: ${html}`})
    }
  }
}