<template>
  <director_dashboard v-if="checkRoles"></director_dashboard>
  <div v-else>
    <basic-container>
    欢迎是用{{ title }}租机系统，当前时间：{{time()}}
    </basic-container>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import moment from "moment";
  import director_dashboard from "./director_dashboard";
  import normal_dashboard from "./normal_dashboard";

  export default {
    name: "wel",
    components: {
      director_dashboard,normal_dashboard
    },
    data() {
      return {
        title:process.env.VUE_APP_TITLE,
        activeNames: ['1', '2', '3', '5'],
        logActiveNames: ['31'],
        authority:[],
      };
    },
    computed: {
      ...mapGetters(["userInfo"]),
      checkRoles(){
        console.log("----------------角色",this.authority)
        console.log(this.authority.includes('administrator'))
        console.log(this.authority.includes('platform_admin'))
        console.log(this.authority.includes('finance_director'))
        return this.authority.includes('administrator') || this.authority.includes('platform_admin') || this.authority.includes('finance_director') ;
      }
    },
    created() {
    },
    mounted() {
      if (this.userInfo.authority){
        this.authority = this.userInfo.authority.split(",")
      }
      console.log(this.authority)
    },
    methods: {
      handleChange(val) {
        console.log(val);
      },
      time(){
        console.log("环境变量",process.env)
        return moment().format('YYYY-MM-DD hh:mm:ss');
      },
    }
  };
</script>

<style>
  .el-divider--horizontal {
    margin: 12px 0 !important;
  }

  .el-font-size {
    font-size: 14px;
  }
</style>

