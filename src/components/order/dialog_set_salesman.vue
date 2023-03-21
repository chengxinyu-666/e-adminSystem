<!--
 分配业务员
 -->
<template>
  <div>
    <el-dialog
      v-if="isShow"
      title="分配业务员"
      :visible.sync="isShow"
      width="500px"
      @close="closeFn"
      append-to-body
      style="text-align: left">
      <el-form ref="form1" label-width="120px" size="small">
        <el-form-item label="当前业务员" prop="userNameCn">
          <span>张三</span>
        </el-form-item>
        <el-form-item label="分配业务员" prop="userNameCn">
          <el-select v-model="value" filterable placeholder="请选择业务员">
            <el-option
              v-for="item in users"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <span>如果当前订单已经分配业务员，再次分配会取消之前的业务员</span>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="isShow = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  import {headers} from "../../util/auth";

  export default {
    name: 'dialog',
    data () {
      return {
        param:null,
        isShow:false,
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
    activated () { },
    methods: {
      headers(){
        return headers()
      },
      closeFn () {
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
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
