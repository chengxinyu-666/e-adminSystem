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
                   v-if="permission.clientcoupon_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/client/clientcoupon";
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
              label: "id",
              prop: "id",
              rules: [{
                required: true,
                message: "请输入id",
                trigger: "blur"
              }]
            },
            {
              label: "用户",
              prop: "clientId",
              rules: [{
                required: true,
                message: "请输入用户",
                trigger: "blur"
              }]
            },
            {
              label: "优惠券id",
              prop: "couponId",
              rules: [{
                required: true,
                message: "请输入优惠券id",
                trigger: "blur"
              }]
            },
            {
              label: "优惠券名称",
              prop: "name",
              rules: [{
                required: true,
                message: "请输入优惠券名称",
                trigger: "blur"
              }]
            },
            {
              label: "优惠券类别",
              prop: "type",
              rules: [{
                required: true,
                message: "请输入优惠券类别",
                trigger: "blur"
              }]
            },
            {
              label: "优惠券面额",
              prop: "money",
              rules: [{
                required: true,
                message: "请输入优惠券面额",
                trigger: "blur"
              }]
            },
            {
              label: "优惠券说明",
              prop: "content",
              rules: [{
                required: true,
                message: "请输入优惠券说明",
                trigger: "blur"
              }]
            },
            {
              label: "金额限制 0无限制",
              prop: "moneyLimit",
              rules: [{
                required: true,
                message: "请输入金额限制 0无限制",
                trigger: "blur"
              }]
            },
            {
              label: "生效条件 0无限制 1未满多少天付款不可使用 2提交多少付款可以使用",
              prop: "typeLimit",
              rules: [{
                required: true,
                message: "请输入生效条件 0无限制 1未满多少天付款不可使用 2提交多少付款可以使用",
                trigger: "blur"
              }]
            },
            {
              label: "限制日期",
              prop: "typeLimitDate",
              rules: [{
                required: true,
                message: "请输入限制日期",
                trigger: "blur"
              }]
            },
            {
              label: "开始时间",
              prop: "startDate",
              rules: [{
                required: true,
                message: "请输入开始时间",
                trigger: "blur"
              }]
            },
            {
              label: "结束时间",
              prop: "endDate",
              rules: [{
                required: true,
                message: "请输入结束时间",
                trigger: "blur"
              }]
            },
            {
              label: "适用范围 0全场通用 1分类限制 2商品限制",
              prop: "rangeLimit",
              rules: [{
                required: true,
                message: "请输入适用范围 0全场通用 1分类限制 2商品限制",
                trigger: "blur"
              }]
            },
            {
              label: "范围ids",
              prop: "rangeIds",
              rules: [{
                required: true,
                message: "请输入范围ids",
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
          addBtn: this.vaildData(this.permission.clientcoupon_add, false),
          viewBtn: this.vaildData(this.permission.clientcoupon_view, false),
          delBtn: this.vaildData(this.permission.clientcoupon_delete, false),
          editBtn: this.vaildData(this.permission.clientcoupon_edit, false)
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
