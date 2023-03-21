<template>
  <div style="height: 100%;">
    <el-dialog
      v-if="isShow"
      v-model="form"
      title="收货确认"
      :visible.sync="isShow"
      width="800px"
      @close="closeFn"
      append-to-body
      style="text-align: left">
      <avue-form ref="form" class="bill_info" v-model="form" :option="option" @submit="submit" @reset-change="cancle">
        <template slot-scope="{disabled,size}" slot="goodsTitle">
          {{param.goodsTitle+getCombinationTitle(param.goodsCombinationJson)}}
        </template>
        <template slot-scope="{disabled,size}" slot="goodsSn">
          {{param.goodsSn+"/"+param.goodsIme}}
        </template>
        <template slot-scope="{disabled,size}" slot="sendVoucher">
          <el-image
            v-for="image in imagesList"
            style="width: 100px; height: 100px;margin-left: 10px"
            :src="image"
            :preview-src-list="imagesList">
          </el-image>
        </template>
        <template slot-scope="{disabled,size}" slot="destroyJson">
          <avue-crud ref="crud" :data="tableData" :option="table" @row-dblclick="handleRowClick"  @row-save="handleRowSave" @row-update="handleRowUpdate">
            <template #menu="{row,index,size}">
              <div style="display: inline-flex">
                <el-button type="primary" v-if="row.image" style="margin-right: 5px;" icon="el-icon-view"  @click="viewImage()">查看附件</el-button>
                <el-upload
                  class="upload-demo"
                  :headers="headers"
                  :show-file-list="false"
                  :on-success="function (res, file){return handleAvatarSuccess(res, file, row)}"
                  action="/api/blade-resource/oss/endpoint/put-file">
                  <el-button size="small" type="primary">{{row.image?"替换附件":"添加附件"}}</el-button>
                </el-upload>
              </div>
            </template>
          </avue-crud>
        </template>

        <template slot-scope="{size}" slot="menuForm">
          <div slot="footer" class="dialog-footer" style="text-align: end;">
            <el-button size="medium" @click="$refs.form.resetForm()">取 消</el-button>
            <el-button size="medium" type="primary"  @click="submit(5)">通 过</el-button>
            <el-button size="medium" type="danger"  @click="submit(6)">驳 回</el-button>
          </div>
        </template>
      </avue-form>
      <el-image-viewer
        class="imageview"
        v-if="showViewer"
        :on-close="() => {showViewer = false;}"
        :url-list="srcList">
      </el-image-viewer>
    </el-dialog>
  </div>
</template>

<script>
  import {add} from "../../api/express/sendgoods";
  import {combinationTitle} from "../../util/order";
  import vue from '@/main'
  import {headers} from "../../util/auth";
  import ElImageViewer from "element-ui/packages/image/src/image-viewer";
  import {update} from "../../api/express/receivegoods";
  import {cancle} from "../../api/order/order";

  export default {
    name: "",
    components: {
      ElImageViewer,
    },
    watch: {
      tableData:{
        handler:function(newValue,oldValue){
         this.form.destroyJson = JSON.stringify(this.tableData)
        },
        immediate:false,
        deep:true
      },
      isShow(val, oldVal) {
        if (!val){
          this.$nextTick(() => {
            this.end(true);
          })
        }
      }
    },
    data(){
      return {
        form:{
          goodsTitle:null,
          goodsSn:null,
          sendVoucher:null,
          destroyJson:null,
          receivedVoucher:null
        },
        tableData: [],
        table:{
          menu:true,
          editBtn:false,
          delBtn:false,
          dialogType:'drawer',
          dialogWidth:300,
          column:[
            {
              label:'部位',
              prop:'where',
              span: 24,
              rules: [{
                required: true,
                message: "请输入收货说明",
                trigger: "blur"
              }]
            }, {
              label:'详细描述',
              prop:'info',
              type:'textarea',
              span: 24,
              rules: [{
                required: true,
                message: "请输入收货说明",
                trigger: "blur"
              }]
            }
          ]
        },
        param:null,
        isShow:false,
        imagesList:[],
        showViewer:false,
        srcList:[],
        expressList:[],
        domain:vue.$store.state.common.cloudDomain,
        loading:false,
        dialogVisible:false,
        option:{
          submitBtn:false,
          emptyBtn:false,
          labelWidth: 120,
          column: [
            {
              label:'商品名称型号',
              prop:'goodsTitle',
              span: 24,
              type:'title',
            },{
              label:'SN/IME码',
              prop:'goodsSn',
              span: 24,
              type:'title',
            },{
              label:'寄回凭证',
              prop:'sendVoucher',
              span: 24,
              type:'title',
            },{
              label:'收货SN',
              prop:'receiveSn',
              span: 12,
              type:'input',
              rules: [{
                required: true,
                message: "请输入收货SN",
                trigger: "blur"
              }]
            },{
              label:'收货IME',
              prop:'receiveIme',
              span: 12,
              type:'input',
              rules: [{
                required: true,
                message: "请输入收货IME",
                trigger: "blur"
              }]
            },{
              label:'收货凭证',
              prop:'receivedVoucher',
              type: 'upload',
              span: 24,
              listType: 'picture-card',
              tip: '只能上传jpg/png文件，且不超过500kb',
              propsHttp: {
                home: vue.$store.state.common.cloudDomain,
                res: "data",
                url: 'name',
                name: 'originalName'
              },
              action: '/api/blade-resource/oss/endpoint/put-file',
              rules: [{
                required: true,
                message: "请上传收货凭证",
                trigger: "blur"
              }]
            },{
              label:'收货说明',
              span: 24,
              type:'textarea',
              minRows:3,
              maxRows:5,
              prop:'note',
              rules: [{
                required: true,
                message: "请输入收货说明",
                trigger: "blur"
              }]
            },{
              label:'损坏情况',
              prop:'destroyJson',
              span: 24,
              type:'title',
              rules: [{
                required: true,
                message: "请完善损坏情况",
                trigger: "blur"
              }]
            }
          ]
        }
      }
    },
    created () {
    },
    computed: {
      headers(){
        return headers()
      },
    },
    activated () { },
    mounted() {
      if (this.param.returnSendVoucher){
        var list = this.param.returnSendVoucher.split(",")
        for (const item of list) {
          this.imagesList.push(this.domain+item)
        }
      }
    },
    methods:{
      handleRowClick (row, event, column) {
        this.$refs.crud.rowEdit(row,row.$index);
      },
      handleRowSave(row,done,loading){
        console.log(row)
        row.file = null;
        row.image = null;
        this.tableData.push(row)
        done()
      },
      handleRowUpdate(row,index,done,loading){
        this.tableData[index].file = row.file
        this.tableData[index].image = row.image
        this.tableData[index].where = row.where
        this.tableData[index].info = row.info
        done()
      },
      viewImage(){
        this.showViewer = true;
      },
      handleAvatarSuccess(res, file,scope) {
        console.log(res,scope)
        this.tableData[scope.$index].file = res.data.name
        this.tableData[scope.$index].image = res.data.link
        this.srcList = [];
        this.srcList.push(res.data.link)
        // this.$forceUpdate()
      },
      getCombinationTitle(val){
        return combinationTitle(val);
      },
      closeFn () {
        this.isShow = false
        this.$nextTick(() => {
          this.end(false);
        })
      },
      cancle () {
        this.isShow = false
        this.$nextTick(() => {
          this.end(false);
        })
      },
      submit(type){
        this.$refs.form.validate((valid, done,msg) => {
          if (valid) {
            var params = {...this.form}
            params.orderId = this.param.id;
            params.id = this.param.receiveId;
            params.status = type;
            params.goodsSn = params.receiveSn
            params.goodsIme = params.receiveIme
            params.receivedVoucher = params.receivedVoucher.join(",");
            console.log(params)
            update(params).then(res => {
              vue.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.isShow = false;
            }).catch(res => {
            });
          } else {
            return false;
          }
        })
      },
    }
  }
</script>

<style scoped>
  ::v-deep .el-upload--picture-card {
    width: 100px !important;
    height: 100px !important;
    line-height: 100px !important;
  }
  ::v-deep .el-upload-list--picture-card .el-upload-list__item{
    width: 100px !important;
    height: 100px !important;
  }
  ::v-deep .el-image-viewer__wrapper {
    z-index: 9999 !important;
  }

  .imageview{
    z-index: 9999 !important;
  }

  ::v-deep .el-empty {
    padding: 0 0 !important;
  }
</style>
