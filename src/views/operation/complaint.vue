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
      <template slot-scope="{row,index}" slot="menu">
        <el-button type="text"
                   size="small"
                   v-if="permission.complaint_edit && row.status == 1"
                   @click="changeStatus(row,2)">标记处理
        </el-button>
      </template>
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.complaint_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/operation/complaint";
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
          addBtn: false,
          editBtn: false,
          selection: true,
          column: [
            {
              label: "创建时间",
              prop: "createTime",
              display: false
            },
            {
              label: "姓名",
              prop: "name",
              search: true
            },
            {
              label: "手机号码",
              prop: "phone",
              search: true
            },
            {
              label: "订单编号",
              prop: "orderNo",
              search: true
            },
            {
              label: "投诉类型",
              prop: "type",
              type: "select",
              search: true,
              dicUrl: "/api/blade-system/dict/dictionary?code=complaint_type",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
            },
            {
              label: "投诉内容",
              prop: "content",
              span: 24,
              type: "textarea"
            },
            {
              label: "附件",
              prop: "files",
              span: 24,
              type: 'upload',
              dataType: 'string',
              listType: 'picture-card',
              propsHttp: {
                home: this.$store.state.common.cloudDomain,
                res: "data",
                url: 'name',
                name: 'originalName'
              }
            },
            {
              label: "处理状态",
              prop: "status",
              type: "select",
              search: true,
              dicUrl: "/api/blade-system/dict/dictionary?code=dispose",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
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
          addBtn: this.vaildData(this.permission.complaint_add, false),
          viewBtn: this.vaildData(this.permission.complaint_view, false),
          delBtn: this.vaildData(this.permission.complaint_delete, false),
          editBtn: this.vaildData(this.permission.complaint_edit, false)
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
      changeStatus(row,status){
        this.$confirm("确定要标记为已处理吗?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            row.status = status;
            update(row).then(()=>{
              this.onLoad(this.page);
              this.$message({
                type: "success",
                message: "操作成功!"
              });
            });
          });
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
