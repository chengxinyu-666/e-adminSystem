<template>
  <basic-container>
    <h3>标签</h3>
    <el-button type="primary"
               size="small"
               @click="$router.push('/test/index')">打开一个页面
    </el-button>
    <el-button type="primary"
               size="small"
               @click="$router.$avueRouter.closeTag('/tags/index',true,true)">关闭打开的页面
    </el-button>
    <el-button type="primary"
               size="small"
               @click="deleteTag">关闭打开的页面2
    </el-button>
    <el-button type="primary"
               size="small"
               @click="$router.$avueRouter.closeTag()">关闭本标签
    </el-button>

  </basic-container>
</template>

<script>
  export default {
    methods: {
      deleteTag() {
        //打开新的窗口
        //value 新窗口路由地址
        //isOpenTag 关闭后是否打开最近一个tab
        //isMatchAll 是否全词匹配，如果value=/goods/tags/index,则不会匹配/goods/tags/index?clientId=111
        this.$EventBus.$emit('tag', {
          action:"remove",
          value:"/goods/tags/index",
          isOpenTag:true,
          isMatchAll:false
        })
      },
    }
  };
</script>

<style>
</style>
