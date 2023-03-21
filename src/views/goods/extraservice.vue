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
        <el-button type="primary"
                   size="small"
                   icon="el-icon-plus"
                   v-if="permission.extraservice_add"
                   @click="handleAdd">新增
        </el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.extraservice_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="{type,disabled}" slot="infoForm">
        <div v-if="type=='add'">
        <avue-ueditor v-model="text"
                      v-bind="editor_options"></avue-ueditor>
        </div>
        <div v-if="type=='edit'">
          <avue-ueditor v-model="text"
                        v-bind="editor_options"></avue-ueditor>
        </div>
        <div v-else-if="type=='view'">
          <div v-html="form.info"></div>
        </div>
      </template>
      <template slot="info" slot-scope="{row,index}">
        <div v-html="row.info.replace(/<[^>]+>/g, '')" class="info"></div>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/goods/extraservice";
  import {mapGetters} from "vuex";
  import avueUeditor from 'avue-plugin-ueditor'

  export default {
    component:{
      avueUeditor
    },
    data() {
      return {
        text: '',
        editor_options: {
          //普通上传地址
          action: "https://api.avuejs.com/imgupload",
          customConfig: {
            pasteFilterStyle:false
          },//wangEditor编辑的配置
          //是否启用oss(qiniu/ali)
          oss:'ali',
          headers:{},
          data:{},
          propsHttp: {
            home:'',
            url:'url',
            res: 'data'
          },
          //阿里云oss配置
          ali: {
            region: "",
            endpoint: "",
            accessKeyId: "",
            accessKeySecret: "",
            bucket: ""
          }
        },
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
          labelWidth: 120,
          height: 'auto',
          calcHeight: 210,
          searchShow: true,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          index: true,
          addBtn: false,
          viewBtn: true,
          selection: true,
          column: [
            {
              label: "增值服务名",
              prop: "name",
              row: true,
              span: 24,
              rules: [{
                required: true,
                message: "请输入增值服务名",
                trigger: "blur"
              }]
            },
            {
              label: "增值服务内容",
              prop: "content",
              row: true,
              span: 24,
              rules: [{
                required: true,
                message: "请输入增值服务内容",
                trigger: "blur"
              }]
            },
            {
              label: "增值服务价格",
              prop: "price",
              row: true,
              span: 24,
              rules: [{
                required: true,
                message: "请输入增值服务价格",
                trigger: "blur"
              }]
            },
            {
              label: "增值服务说明",
              prop: "info",
              row: true,
              span: 24
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
          addBtn: this.vaildData(this.permission.extraservice_add, false),
          viewBtn: this.vaildData(this.permission.extraservice_view, false),
          delBtn: this.vaildData(this.permission.extraservice_delete, false),
          editBtn: this.vaildData(this.permission.extraservice_edit, false)
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
      handleAdd() {
        this.text = null;
        this.$refs.crud.rowAdd();
      },
      rowSave(row, done, loading) {
        row.info = this.text
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
        row.info = this.text
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
            this.text = this.form.info
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

<style scoped>
  .info {
    overflow: hidden;
    overflow-wrap: break-word;
    text-overflow: ellipsis;
    display: -webkit-box;
    font-size: 14px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>
