<!--
 备注
 -->
<template>
  <div id="key">
    <el-dialog
      title="备注"
      v-if="isShow"
      :visible.sync="isShow"
      width="40%"
      @close="closeFn"
      append-to-body
      style="text-align: left">
      <el-form ref="form1" label-width="120px" size="small">
        <el-form-item label="备注内容" prop="userNameCn">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入备注内容"
            v-model="noteInfo">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  import {headers} from "../../util/auth";
  import {add as noteAdd} from "@/api/order/ordernote";

  export default {
    name: 'dialog',
    data () {
      return {
        param:null,
        isShow:false,
        noteInfo:'',
      };
    },
    watch: {
      isShow(val, oldVal) {
        if (!val){
          this.$nextTick(() => {
            this.end(true);
          })
        }
      }
    },
    created () {
      console.log("created",this.param)
    },
    activated () {
      console.log("activated",this.param)
    },
    beforeUpdate() {
      console.log("beforeUpdate",this.param)
    },
    update() {
      console.log("update",this.param)
    },
    beforeMount () {
      console.log("beforeMount",this.param)
    },
    mounted() {
      console.log("mounted",this,this.param)
    },
    deactivated() {
      console.log("deactivated",this.param)
    },
    methods: {
      closeFn () {
      },
      confirm(){
        const  paras = {note:this.noteInfo,orderId:this.param.id,noteType:1};
        noteAdd(paras).then(res => {
          console.log(res.data.data)
          this.$message("备注成功")
          this.isShow = false
        });
        console.log(paras)
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
