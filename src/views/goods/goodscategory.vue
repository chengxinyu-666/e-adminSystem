<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
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
                   v-if="permission.goodscategory_add"
                   @click="handleAdd">新增
        </el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.goodscategory_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          icon="el-icon-circle-plus-outline"
          size="small"
          @click.stop="handleAddChild(scope.row,scope.index)"
          v-if="scope.row.parentId == '0'"
        >新增二级
        </el-button>
      </template>
      <template slot-scope="{type,disabled}" slot="tagsForm">
        <div v-if="type=='add'">
          <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增标签</el-button>
        </div>
        <div v-if="type=='edit'">
          <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
        </div>
        <div v-else-if="type=='view'">
          <el-tag v-if="form.tags.length>0" v-for="tag in form.tags.split(',')">{{tag}}</el-tag>
        </div>
      </template>
      <template slot="tags" slot-scope="{row,index}">
        <el-tag v-if="row.tags.length>0" v-for="tag in row.tags.split(',')">{{tag}}</el-tag>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/goods/goodscategory";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
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
          searchShow: true,
          searchMenuSpan: 6,
          rowKey:'id',
          rowParentKey:'parentId',
          tip: false,
          border: true,
          tree: true,
          index: true,
          viewBtn: true,
          editBtn: true,
          addBtn: false,
          delBtn: true,
          menuWidth:300,
          selection: true,
          column: [
            {
              size: 'mini',
              label: "类型名称",
              prop: "name",
              row: true,
              span: 24,
              rules: [{
                required: true,
                message: "请输入类型名称",
                trigger: "blur"
              }]
            },
            {
              label: "父级分类",
              prop: "parentId",
              row: true,
              type: "tree",
              addDisabled:true,
              dicUrl: "/api/blade-goods/goodscategory/tree",
              hide: true,
              span: 24,
              props: {
                label: "title"
              },
              rules: [{
                required: false,
                message: "请选择上级分类",
                trigger: "click"
              }]
            },
            {
              label: "标签",
              prop: "tags",
              row: true,
              span: 24
            },
            {
              label: "排序",
              prop: "sort",
              row: true,
              span: 24,
              rules: [{
                required: true,
                message: "请输入排序",
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
          addBtn: this.vaildData(this.permission.goodscategory_add, false),
          viewBtn: this.vaildData(this.permission.goodscategory_view, false),
          delBtn: this.vaildData(this.permission.goodscategory_delete, false),
          editBtn: this.vaildData(this.permission.goodscategory_edit, false)
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
        this.$refs.crud.value.parentId = null;
        this.$refs.crud.option.column.filter(item => {
          if (item.prop === "parentId") {
            item.value = null;
            item.addDisabled = false;
          }
        });
        console.log(this.$refs.crud.option.column)
        this.$refs.crud.rowAdd();
      },
      handleAddChild(row) {
        console.log(row)
        this.$refs.crud.value.parentId = row.id;
        this.$refs.crud.option.column.filter(item => {
          if (item.prop === "parentId") {
            item.value = row.id;
            item.addDisabled = true;
          }
        });
        this.$refs.crud.rowAdd();
      },
      rowSave(row, done, loading) {
        if (this.dynamicTags.length>0){
          row.tags = this.dynamicTags.join()
        }else{
          row.tags = ""
        }
        console.log("rowSave",row)
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
        console.log("rowUpdate",row,this.dynamicTags)
        if (this.dynamicTags.length>0){
          row.tags = this.dynamicTags.join()
        }else{
          row.tags = ""
        }
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
        console.log(type,done)
        this.dynamicTags.splice(0,this.dynamicTags.length);
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
            if(this.form.tags){
              this.dynamicTags =this.form.tags.split(",")
            }
            console.log(this.form)
          });
        }
        done();
      },
      // beforeClose(done,type){
      //   console.log(type)
      //   if (["add"].includes(type)) {
      //     this.$refs.crud.value.parentId = '';
      //   }
      //   done();
      // },
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
          this.data = res.data.data;
          this.loading = false;
          this.selectionClear();
        });
      },
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
    }
  };
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
