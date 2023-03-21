<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               :before-open="beforeOpen"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
      <template slot-scope="scope" slot="menu">
        <el-button type="text"
                   size="small"
                   icon="el-icon-link"
                   @click="showDialogPage(scope.row,'indexgoods')">商品列表
        </el-button>
      </template>
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   v-if="permission.indexgoods_delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
    <template>
      <el-dialog :title="indexgoodsPain.title"
                 :visible.sync="indexgoodsPain.visible"
                 width="80%"
                 append-to-body="true"
                 :before-close="beforeCloseDialog">
        <indexgoods :indexgoodsTag="indexgoodsTag"></indexgoods>
      </el-dialog>
    </template>
  </basic-container>
</template>

<script>
  import {add, getDict, dictionary, remove, update} from "@/api/system/dict";
  import indexgoods from "./indexgoods";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        indexgoodsTag:{},
        form: {},
        selectionList: [],
        indexgoodsPain: {title: "", visible: false},
        loading: true,
        option: {
          tip: false,
          border: true,
          selection: true,
          menuWidth: 300,
          column: [
            {
              label: "标签名称",
              prop: "dictValue",
              rules: [{
                required: true,
                message: "请输入标签名称",
                trigger: "blur"
              }]
            },
            {
              label: "子标签",
              prop: "remark",
              rules: [{
                required: true,
                message: "请输入子标签",
                trigger: "blur"
              }]
            },
            {
              label: "排序",
              prop: "sort",
              type: "number",
              rules: [{
                required: true,
                message: "请输入字典排序",
                trigger: "blur"
              }]
            }
          ]
        },
        data: []
      };
    },
    components: {
      indexgoods
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.indexgoods_add, false),
          viewBtn: this.vaildData(this.permission.indexgoods_view, false),
          delBtn: this.vaildData(this.permission.indexgoods_delete, false),
          editBtn: this.vaildData(this.permission.indexgoods_edit, false)
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
        row.code = "index_goods_tag";
        row.parentId = "1589552384215117825";
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
      searchReset() {
        this.onLoad();
      },
      searchChange(params, done) {
        this.onLoad();
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
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
          getDict(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
      },
      beforeCloseDialog(done) {
        done();
      },
      showDialogPage(row, type) {
        this.indexgoodsTag = row;
        if (type == 'indexgoods') {
          this.indexgoodsPain.visible = true;
          this.indexgoodsPain.title = row.dictValue + " - 商品列表";
        }
      },
      onLoad() {
        this.loading = true;
        dictionary("index_goods_tag").then(res => {
          this.data = res.data.data;
          this.loading = false;
        });
      }
    }
  };
</script>

<style>
</style>
