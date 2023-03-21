import vue from 'vue'

function show({component,key,data,fn}){
  // 设置全局配置信息
  component.prototype.config = function config(options) {
  };

  // 初始化加载进度条
  component.prototype.start = function init(data) {
    if (fn&&fn.start)fn.start();
    this.isShow = true
    this.param = data
    this.vm = this.$mount();
    document.body.appendChild(this.vm.$el);
    return this;
  };

  // 关闭加载进度条
  component.prototype.end = function end(call = false) {
    document.body.removeChild(this.vm.$el);
    console.log("结束",key,fn)
    if (fn&&call)fn.end(key);
  };

  const instance = new component();
  instance.start(data);
}

// 全局注册
function registryPop() {
  vue.prototype.$showPop = show;
}

export default registryPop;
