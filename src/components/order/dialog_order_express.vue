<!--
 分配业务员
 -->
<template>
  <div>
    <el-dialog
      v-if="isShow"
      title="查看物流"
      :visible.sync="isShow"
      width="600px"
      @close="closeFn"
      append-to-body
      style="text-align: left">
      <div style="width: 100%;height: 100%;position: relative;">
        <div v-loading="loading" style="height:100%;width:100%;z-index: 100;position: absolute" v-if="loading"></div>
        <div v-html="express">
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShow = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  import {expressList} from "../../api/order/order";

  export default {
    name: 'dialog',
    data () {
      return {
        param:null,
        express:null,
        isShow:false,
        loading:false,
        users: [{
          value: '选项1',
          label: '张三'
        }, {
          value: '选项2',
          label: '李四'
        }],
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
    mounted() {
      this.loading = true;
      expressList(this.param).then(res => {
        this.express = res.data.data;
        this.loading = false;
      });
    },
    activated () { },
    methods: {
      closeFn () {

      },
    },
  };
</script>
<style lang="scss" scope>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
