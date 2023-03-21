<!--
 发送短信
 -->
<template>
  <div>
    <el-dialog
      v-if="isShow"
      title="设置二审"
      :visible.sync="isShow"
      width="600px"
      @close="closeFn"
      append-to-body
      style="text-align: left">
      <el-form ref="form1" label-width="120px" size="small">
        <el-form-item label="短信模板" prop="userNameCn">
          <el-select v-model="sms.id" filterable placeholder="请选择短信模板">
          <el-option
            v-for="item in list"
            :key="item.tplId"
            @click.native ="change(item)"
            :label="item.smsType"
            :value="item.tplId">
          </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板内容" prop="userNameCn">
          <span>{{ sms.content == null?"请选择发送模板":sms.content }}</span>
        </el-form-item>
        <template v-for="item in params">
          <el-form-item :label="item.key" prop="userNameCn">
            <el-input
              placeholder="这里是替换模板的内容"
              v-model="parameters[item.key]">
            </el-input>
          </el-form-item>
        </template>
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
  import {getList,getcanUserList} from "@/api/parameter/buyunsmstemplate";
  import {send} from "../../api/parameter/buyunsmstemplate";
  import {Message} from 'element-ui'

  export default {
    name: 'dialog',
    data () {
      return {
        param:null,
        isShow:false,
        sms: {
          id:null,
          content:null,
        },
        list:[],
        parameters: {},
        options: [{
          value: '选项1',
          label: '审核主管'
        }, {
          value: '选项2',
          label: '审核员工'
        }],
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
      getcanUserList(1, 1000, Object.assign({}, {})).then(res => {
        this.list= res.data.data;
      })
    },
    activated () { },
  computed: {
    params() {
      var items = [];
      if (this.sms.content){
        var regex = /\#(.+?)\#/g; // [] 中括号
        var reasult = this.sms.content.match(regex);
        for (const item of reasult) {
          items.push({key:item,value:null})
        }
      }
      return items;
    }
  },
    methods: {
      headers(){
        return headers()
      },
      change(data){
        this.sms.content = data.content
      },
      closeFn () {
      },
      confirm(){
        const  paras = {clientId:this.param.clientId,orderId:this.param.id};
        Object.assign(paras,this.parameters)
        paras.id = this.sms.id;
        send(paras).then(res => {
          console.log(res.data.data)
          this.$message("发送成功")
          this.isShow = false
        })
        console.log(paras)
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
