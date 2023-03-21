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
                   v-if="permission.entryformtemplate_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="{type,disabled}" slot="contentForm">
        <div style="border: 1px solid rgba(136, 136, 136, 1.0);padding: 10px;text-align: center;width: 800px">
          <div v-for="(item,index) in form.content" style="margin-bottom: 20px">
            <div style="display: flex;margin-top: 10px">
              <span>类型名称:</span>
              <el-input v-model="item.title" style="flex: 1;margin-left: 10px;margin-right: 10px" placeholder="请输入类型名称"></el-input>
              <el-button @click="removeItem(form.content,index);">删除类型</el-button>
            </div>
            <div v-for="(one,n) in item.value" style="margin-top: 20px;padding-bottom:10px;border-bottom: 1px solid #dddddd;">
              <div style="display: flex;width: auto">
                <span>子项名称:</span>
                <el-input v-model="one.title" placeholder="请输入名称" style="width: 40%;margin-left: 10px"></el-input>
                <span style="margin-left: 10px">子项类型:</span>
                <el-select v-model="one.type" placeholder="请选择" style="flex: 1 !important;margin-left: 10px;margin-right: 10px">
                  <el-option
                    v-for="item in options"
                    @click.native="change(one,item)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-button @click="removeItem(item.value,n);">删除子项</el-button>
              </div>
              <div v-if="one.type == -1" style="width: 100%;display: flex;margin-top: 5px">
                <span>默认数据:</span><el-input v-model="one.value" placeholder="请输入默认值" style="width: 40%;margin-left: 10px"></el-input>
              </div>
              <div v-if="one.type == 1" style="width: 100%;display: flex;margin-top: 5px">
                <span>默认数据:</span><el-input v-model="one.value" placeholder="请输入默认值" style="width: 40%;margin-left: 10px"></el-input>
              </div>
              <div v-else-if="one.type == 0" style="width: 100%;display: flex;margin-top: 5px">
                <span>输入函数:</span><el-input v-model="one.val" placeholder="请输入函数" style="width: 40%;margin-left: 10px"></el-input>
              </div>
              <div v-else-if="one.type == 2" style="width: 100%;display: flex;margin-top: 5px">
                <span>输入选项:</span>
                <div style="margin-left: 10px;display: flex;flex-direction: row;flex-wrap: wrap;">
                  <el-tag
                    :key="tag"
                    v-if="one.option"
                    v-for="tag in one.option"
                    closable
                    style="margin-right: 5px"
                    :disable-transitions="false"
                    @close="handleClose(tag,one.option)">
                    {{tag}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="one.edit"
                    v-model="inputValue"
                    :ref="one.title"
                    size="small"
                    style="width: 90px;"
                    @keyup.enter.native="handleInputConfirm(one)"
                    @blur="handleInputConfirm(one)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(one)">添加值</el-button>
                </div>
                <span style="margin-left: 10px">选择默认值:</span>
                <el-select v-model="one.value" placeholder="请选择" style="flex: 1 !important;margin-left: 10px">
                  <el-option
                    v-for="item in one.option"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </div>
              <div v-else-if="one.type == 5" style="width: 100%;display: flex;margin-top: 5px">
                <span>输入选项:</span>
                <div style="margin-left: 10px;display: flex">
                  <el-tag
                    :key="tag"
                    v-for="tag in one.option"
                    closable
                    style="margin-right: 5px"
                    :disable-transitions="false"
                    @close="handleClose(tag,one.option)">
                    {{tag}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="one.edit"
                    v-model="inputValue"
                    :ref="one.title"
                    size="small"
                    style="width: 90px;"
                    @keyup.enter.native="handleInputConfirm(one)"
                    @blur="handleInputConfirm(one)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(one)">添加值</el-button>
                </div>
                <span style="margin-left: 10px">选择默认值:</span>
                <el-select v-model="one.value" multiple placeholder="请选择" style="flex: 1 !important;margin-left: 10px">
                  <el-option
                    v-for="item in one.option"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div style="text-align: center;margin-top: 10px;">
              <el-button @click="addatr(item.value)">新增子项</el-button>
            </div>
          </div>
          <el-button @click="addItem(form.content)">新增类别</el-button>
        </div>
      </template>
      <template slot="content" slot-scope="{row,index}">
        <div ></div>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/parameter/entryformtemplate";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {content:[]},
        query: {},
        loading: true,
        inputVisible: {},
        inputValue: '',
        options: [{
          value: 1,
          label: '文本输入框'
        }, {
          value: 2,
          label: '单选'
        }, {
          value: 5,
          label: '多选'
        }, {
          value: 4,
          label: '数字输入框'
        }, {
          value: 0,
          label: '函数'
        }, {
          value: -1,
          label: '编辑不显示'
        }],
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
          viewBtn: true,
          selection: true,
          column: [
            {
              label: "模板名称",
              prop: "title",
              span:24,
              rules: [{
                required: true,
                message: "请输入进件单模板",
                trigger: "blur"
              }]
            },
            {
              label: "进件单模板",
              prop: "content",
              hide: true,
              slot: true,
              rules: [{
                required: true,
                message: "请输入进件单模板",
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
          addBtn: this.vaildData(this.permission.entryformtemplate_add, false),
          viewBtn: this.vaildData(this.permission.entryformtemplate_view, false),
          delBtn: this.vaildData(this.permission.entryformtemplate_delete, false),
          editBtn: this.vaildData(this.permission.entryformtemplate_edit, false)
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
      addItem(data){
        data.push({
          "title": "",
          "value": []
        })
      },
      addatr(data){
        data.push({
          "edit": false,
          "type": 1,
          "title": "",
          "value": "",
          "option": []
        })
      },
      removeItem(data,item){
        data.splice(item,1)
      },
      change(one,item){
        if (item.value == 5){
          one.value = []
        }
        console.log(one,item)
      },
      handleClose(tag,one) {
        console.log("删除",JSON.stringify(one),one,tag)
        one.splice(one.indexOf(tag), 1);
        console.log("删除",JSON.stringify(one),one,tag)
      },

      showInput(one) {
        one.edit= true;
        console.log(one)
        this.$nextTick(_ => {
          for (const x in this.$refs) {
            if (x == one.title){
              this.$refs[x][0].$refs.input.focus();
              return
            }
          }
        });
      },
      handleInputConfirm(one) {
        let inputValue = this.inputValue;
        if (inputValue) {
          console.log(one.option)
          if(!(one.option instanceof Array)){
            one.option = []
          }
          one.option.push(inputValue);
        }
        one.edit = false;
        this.inputValue = '';
      },
      rowSave(row, done, loading) {
        let data = Object.assign({},row);
        data.content = JSON.stringify(row.content)
        add(data).then(() => {
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
        let data = Object.assign({},row);
        data.content = JSON.stringify(row.content)
        update(data).then(() => {
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
            let one = res.data.data;
            one.content = JSON.parse(one.content);
            this.form = one;
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
          for (const item of data.records) {
            item.content = JSON.parse(item.content);
          }
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style scoped>
  .button-new-tag{
    height: 32px !important;
  }
</style>
