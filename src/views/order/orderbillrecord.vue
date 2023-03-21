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
                   v-if="permission.orderbillrecord_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/order/orderbillrecord";
  import {mapGetters} from "vuex";

  export default {
    props: ["billId"],
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
          menu: false,
          column: [
            {
              label: "账单类型",
              prop: "type",
              type: "select",
              dicUrl: "/api/blade-system/dict/dictionary?code=bill_type",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
            },
            {
              label: "收款金额",
              prop: "money",
              rules: [{
                required: true,
                message: "请输入收款金额",
                trigger: "blur"
              }]
            },
            {
              label: "收款方式",
              type: "select",
              dicData: [
                {
                  label: "支付宝支付",
                  value: 1
                },
                {
                  label: "微信支付",
                  value: 2
                },
                {
                  label: "银行转帐",
                  value: 3
                },
                {
                  label: "微信转账",
                  value: 4
                },
                {
                  label: "支付宝转账",
                  value: 5
                },
                {
                  label: "押金抵扣",
                  value: 6
                },
                {
                  label: "第三方代扣",
                  value: 7
                },
                {
                  label: "其他",
                  value: 100
                }
              ],
              prop: "payType",
              rules: [{
                required: true,
                message: "请选择收款方式",
                trigger: "blur"
              }]
            },
            {
              label: "支付凭证",
              prop: "voucher",
              type: "img",
              propsHttp: {
                home: this.$store.state.common.cloudDomain,
              },
            },
            {
              label: "催收专员",
              prop: "collectionUserId",
              type: "select",
              dicUrl: "/api/blade-user/user-list",
              props: {
                label: "name",
                value: "id"
              }
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
          addBtn: this.vaildData(this.permission.orderbillrecord_add, false),
          viewBtn: this.vaildData(this.permission.orderbillrecord_view, false),
          delBtn: this.vaildData(this.permission.orderbillrecord_delete, false),
          editBtn: this.vaildData(this.permission.orderbillrecord_edit, false)
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
        params.billId = this.billId;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          data.records.forEach(r => {
            if(r.collectionUserId == -1){
              r.collectionUserId = "";
            }
            r.type = Number(r.type);
          })
          this.loading = false;
          this.selectionClear();
        });
      }
    },
    watch: {
      billId: function () {
        this.onLoad(false);
      }
    }
  };
</script>

<style>
</style>
