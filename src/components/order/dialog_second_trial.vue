<!--
 设置一审
 -->
<template>
  <div>
    <el-dialog
      v-if="isShow"
      :title="!param.reset ?'设置二审':'二审转移'"
      :visible.sync="isShow"
      width="400px"
      @close="closeFn"
      append-to-body
      style="text-align: left">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="审核角色" prop="roleAlias" >
          <el-select v-model="form.roleAlias" filterable placeholder="请选择审核角色">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人员" prop="userId" >
          <el-select v-model="form.userId" filterable placeholder="请选择审核人员">
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.realName"
              :value="item.id">
            </el-option>
          </el-select>
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
  import {distribute, getAuditorUserList} from "../../api/audit/orderexamine";
  import {entryForm} from "../../api/order/order";

  export default {
    name: 'dialog',
    data () {
      return {
        form:{
          roleAlias:null,
          userId:null,
        },
        rules: {
          roleAlias: [
            { required: true, message: '请选择审核角色', trigger: 'change' }
          ],
          userId: [
            {  required: true, message: '请选择审核人员', trigger: 'change' }
          ],
        },
        param: {reset:false},
        isShow:false,
        options: [{
          value: 'auditor_director',
          label: '审核主管'
        }, {
          value: 'auditor',
          label: '审核员工'
        }],
        users: [],
      };
    },
    watch: {
      isShow(val, oldVal) {
        if (!val){
          this.$nextTick(() => {
            this.end(true);
          })
        }
      },
      'form.roleAlias': function (val) {
        const param = {roleAlias: this.form.roleAlias};
        this.form.userId = null;
        getAuditorUserList(param).then(res => {
          this.users = res.data.data
        })
      },
    },
    mounted() {
      console.log(this.param)

    },
    created () {
      console.log(this.param)
    },
    activated () { },
    methods: {
      confirm(){
        this.$refs.form.validate((valid) => {
          console.log(valid)
          if (!valid) {
            console.log('请选择参数');
            return false;
          }
          const  paras = {userId:this.form.userId,orderIds:this.param.orderIds,type:2,reset:this.param.reset};
          distribute(paras).then(res => {
            console.log(res.data.data)
            this.$message("提交成功")
            this.isShow = false
          }).catch(res=>{
            console.log("失败")
          });
        });
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
