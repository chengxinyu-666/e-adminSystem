<template>
  <div>
    <el-dialog
      v-if="isShow"
      :visible.sync="isShow"
      width="50%"
      @close="param.seePicUrl = ''"
      append-to-body
      style="text-align: center"
    >
      <img :src="param.seePicUrl" alt="" class="w" />
    </el-dialog>
  </div>
</template>
<script>

  export default {
    name: 'dialog',
    data () {
      return {
        param:null
      };
    },
    watch: {
      isShow(val, oldVal) {
        if (!val){
          this.$nextTick(() => {
            this.end();
          })
        }
      }
    },
    created () {
      console.log(this.param)
    },
    activated () { },
    methods: {
      closeFn () {
        this.$cancelSeePdf();
      },
    },
  };
</script>
<style lang="scss" scope>
</style>
