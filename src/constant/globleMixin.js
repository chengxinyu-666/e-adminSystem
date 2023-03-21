const version_ability = {
  "custom_rent":["vip"],//自定义租金
}

const globleMixin = {
  methods : {
    enable(key){
      if (version_ability[key]&&version_ability[key].includes(process.env.VUE_APP_VERSION)){
        return true;
      }
      return false;
    }
  }
}

export default globleMixin
