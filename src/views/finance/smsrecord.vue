<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.smsrecord_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot="statusCode" slot-scope="scope">
        <span >{{ scope.label == 0?"成功":"失败" }}</span>
      </template>
      <template slot="balance" slot-scope="scope">
        <span >{{ Number.parseInt(scope.label)/1000}}</span>
      </template>
      <template slot="orderId" slot-scope="scope">
        <span v-if="scope.label != -1" style="color: #169BD5">{{scope.label}} </span>
        <span v-else>无</span>
      </template>

    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/finance/smsrecord";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          height: 'auto',
          calcHeight: 210,
          searchShow: true,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          viewBtn: true,
          addBtn: false,
          editBtn:false,
          delBtn:false,
          index: false,
          menuWidth:100,
          selection: true,
          column: [
            {
              label: "短信编号",
              prop: "smsCode",
              width: 70,
              rules: [{
                required: true,
                message: "请输入短信编号",
                trigger: "blur"
              }]
            },
            {
              label: "短信参数",
              prop: "params",
              width:300,
              rules: [{
                required: true,
                message: "请输入短信参数",
                trigger: "blur"
              }]
            },
            {
              label: "手机号",
              prop: "mobile",
              rules: [{
                required: true,
                message: "请输入接收人手机号",
                trigger: "blur"
              }]
            },
            {
              label: "结果码",
              prop: "statusCode",
              width: 60,
              slot: true,
              rules: [{
                required: true,
                message: "请输入发送结果返回码",
                trigger: "blur"
              }]
            },
            {
              label: "余额(元)",
              prop: "balance",
              slot: true,
              rules: [{
                required: true,
                message: "请输入当前账户余额，单位厘",
                trigger: "blur"
              }]
            },
            {
              label: "渠道编号",
              prop: "channelId",
              rules: [{
                required: true,
                message: "请输入渠道编号",
                trigger: "blur"
              }]
            },

            {
              label: "用户名",
              prop: "clientName",
              rules: [{
                required: true,
                message: "请输入用户ID 如果有就记录",
                trigger: "blur"
              }]
            },
            {
              label: "订单ID",
              prop: "orderId",
              width: 120,
              slot: true,
              rules: [{
                required: true,
                message: "请输入订单ID 如果有则记录",
                trigger: "blur"
              }]
            },
            {
              label: "发送人",
              prop: "userName",
              width: 80,
              rules: [{
                required: true,
                message: "请输入订单ID 如果有则记录",
                trigger: "blur"
              }]
            },
            {
              label: "发送时间",
              prop: "createTime",
              width: 150,
              rules: [{
                required: true,
                message: "请输入订单ID 如果有则记录",
                trigger: "blur"
              }]
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.smsrecord_add, false),
          viewBtn: this.vaildData(this.permission.smsrecord_view, false),
          delBtn: this.vaildData(this.permission.smsrecord_delete, false),
          editBtn: this.vaildData(this.permission.smsrecord_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      rowSave(row, done, loading) {
        add(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
          loading();
        });
      },
      rowUpdate(row, index, done, loading) {
        update(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
          loading();
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style>
</style>
