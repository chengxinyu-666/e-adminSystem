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
                   v-if="permission.goodscombination_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/goods/goodscombination";
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
              label: "方案ID",
              prop: "planId",
              rules: [{
                required: true,
                message: "请输入方案ID",
                trigger: "blur"
              }]
            },
            {
              label: "缺货(字典)(是/否)",
              prop: "stockout",
              rules: [{
                required: true,
                message: "请输入缺货(字典)(是/否)",
                trigger: "blur"
              }]
            },
            {
              label: "库存",
              prop: "inventory",
              rules: [{
                required: true,
                message: "请输入库存",
                trigger: "blur"
              }]
            },
            {
              label: "官网价",
              prop: "websitePrice",
              rules: [{
                required: true,
                message: "请输入官网价",
                trigger: "blur"
              }]
            },
            {
              label: "溢价金",
              prop: "premiumMoney",
              rules: [{
                required: true,
                message: "请输入溢价金",
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
              label: "押金",
              prop: "depositMoney",
              rules: [{
                required: true,
                message: "请输入押金",
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
              label: "租金",
              prop: "rentMoney",
              rules: [{
                required: true,
                message: "请输入租金",
                trigger: "blur"
              }]
            },
            {
              label: "日滞纳金",
              prop: "lateFeeMoney",
              rules: [{
                required: true,
                message: "请输入日滞纳金",
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
              label: "方案组合",
              prop: "planData",
              rules: [{
                required: true,
                message: "请输入方案组合",
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
          addBtn: this.vaildData(this.permission.goodscombination_add, false),
          viewBtn: this.vaildData(this.permission.goodscombination_view, false),
          delBtn: this.vaildData(this.permission.goodscombination_delete, false),
          editBtn: this.vaildData(this.permission.goodscombination_edit, false)
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
