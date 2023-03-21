<!--
 备注
 -->
<template>
  <div id="key">
    <el-dialog
      title="备注"
      v-if="isShow"
      :visible.sync="isShow"
      width="600px"
      @close="closeFn"
      append-to-body
      style="text-align: left">
      <avue-crud ref="crud" :key="table_key" :option="option5" :data="orderNotes" :page="note" @on-load="onNotesLoad">
      </avue-crud>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  import {add as noteAdd} from "@/api/order/ordernote";
  import {getList as getNoteList} from "@/api/order/ordernote";

  export default {
    name: 'dialog',
    data () {
      return {
        param:null,
        call:false,
        isShow:false,
        noteInfo:'',
        table_key:1111,
        orderNotes:[],
        note:{
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        option5: {
          searchShow: false,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          editBtn:false,
          addBtn:false,
          delBtn:false,
          index: false,
          viewBtn: false,
          selection: false,
          searchBtn: false,
          filterBtn: false,
          refreshBtn: false,
          columnBtn: false,
          menu: false,
          headerAlign: 'center',
          align: 'center',
          column: [
            {
              label: "订单状态",
              width:100,
              prop: "orderStatus",
              type: "select",
              dicUrl: "/api/blade-system/dict/dictionary?code=order_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入订单编号",
                trigger: "blur"
              }]
            },
            {
              label: "备注信息",
              prop: "note",
              slot: true,
              rules: [{
                required: true,
                message: "请输入商品ID",
                trigger: "blur"
              }]
            },
            {
              label: "备注人",
              prop: "userName",
              width:100,
              slot: true,
              rules: [{
                required: true,
                message: "请输入商品ID",
                trigger: "blur"
              }]
            },
            {
              label: "备注时间",
              prop: "createTime",
              width:150,
              slot: true,
              rules: [{
                required: true,
                message: "请输入租期起始日",
                trigger: "blur"
              }]
            }
          ]
        },
      };
    },
    watch: {
      isShow(val, oldVal) {
        if (!val){
          this.$nextTick(() => {
            this.end(this.call);
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
      onNotesLoad(page, params = {}) {
        var param = {orderId:this.param.id};
        getNoteList(this.note.currentPage, this.note.pageSize,param).then(res => {
          const data = res.data.data;
          this.note.total = data.total;
          this.orderNotes = data.records;
        }).catch(res => {

        })
      },
      confirm(){
        const  paras = {note:this.noteInfo,orderId:this.param.id,noteType:1};
        noteAdd(paras).then(res => {
          console.log(res.data.data)
          this.$message("备注成功")
          this.call = false;
          this.isShow = false
        });
        console.log(paras)
      },
    },
  };
</script>
<style lang="scss" scoped>
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
  :deep .avue-crud__menu {
    display: none !important;
  }
  :deep .el-dialog__body {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
  }
</style>
