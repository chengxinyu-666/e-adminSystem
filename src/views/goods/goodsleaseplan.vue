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
                   v-if="permission.goodsleaseplan_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/goods/goodsleaseplan";
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
          index: true,
          viewBtn: true,
          selection: true,
          column: [
            {
              label: "主键",
              prop: "id",
              rules: [{
                required: true,
                message: "请输入主键",
                trigger: "blur"
              }]
            },
            {
              label: "租赁方案(字典)(租满归还/租满买断/灵活租)",
              prop: "type",
              rules: [{
                required: true,
                message: "请输入租赁方案(字典)(租满归还/租满买断/灵活租)",
                trigger: "blur"
              }]
            },
            {
              label: "租金系数",
              prop: "rentRate",
              rules: [{
                required: true,
                message: "请输入租金系数",
                trigger: "blur"
              }]
            },
            {
              label: "日滞纳金系数",
              prop: "lateFeeRate",
              rules: [{
                required: true,
                message: "请输入日滞纳金系数",
                trigger: "blur"
              }]
            },
            {
              label: "续租系数",
              prop: "renewalRate",
              rules: [{
                required: true,
                message: "请输入续租系数",
                trigger: "blur"
              }]
            },
            {
              label: "最低租期",
              prop: "miniLease",
              rules: [{
                required: true,
                message: "请输入最低租期",
                trigger: "blur"
              }]
            },
            {
              label: "最低租期单位(字典)(日/月/年)",
              prop: "miniType",
              rules: [{
                required: true,
                message: "请输入最低租期单位(字典)(日/月/年)",
                trigger: "blur"
              }]
            },
            {
              label: "最高租期",
              prop: "maxLease",
              rules: [{
                required: true,
                message: "请输入最高租期",
                trigger: "blur"
              }]
            },
            {
              label: "最高租期单位(字典)(日/月/年)",
              prop: "maxType",
              rules: [{
                required: true,
                message: "请输入最高租期单位(字典)(日/月/年)",
                trigger: "blur"
              }]
            },
            {
              label: "买断尾款",
              prop: "buyoutBalancePayment",
              rules: [{
                required: true,
                message: "请输入买断尾款",
                trigger: "blur"
              }]
            },
            {
              label: "商品",
              prop: "goodsId",
              rules: [{
                required: true,
                message: "请输入商品",
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
          addBtn: this.vaildData(this.permission.goodsleaseplan_add, false),
          viewBtn: this.vaildData(this.permission.goodsleaseplan_view, false),
          delBtn: this.vaildData(this.permission.goodsleaseplan_delete, false),
          editBtn: this.vaildData(this.permission.goodsleaseplan_edit, false)
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
