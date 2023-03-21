<template>
  <basic-container>
    <el-descriptions
      class="margin-top"
      title="在线充值"
      :column="1"
      :size="size"
    >
      <el-descriptions-item label="充值账号" labelClassName="fwBlock">{{
        this.rechargeObj.number
      }}</el-descriptions-item>
      <el-descriptions-item label="可用额度" labelClassName="fwBlock">{{
        this.rechargeObj.quota
      }}</el-descriptions-item>
      <el-descriptions-item label="充值方式" labelClassName="fwBlock">
        <div>
          <el-image
            :lazy="true"
            :src="this.rechargeObj.bankPic"
            style="width: 150px; height: 50px"
          />
          <el-descriptions class="margin-top" :column="1" :size="size">
            <el-descriptions-item label="单位名称" labelClassName="fwBlock">{{
              this.rechargeObj.unitName
            }}</el-descriptions-item>
            <el-descriptions-item label="开户行支行" labelClassName="fwBlock">{{
              this.rechargeObj.bankName
            }}</el-descriptions-item>
            <el-descriptions-item label="银行卡号" labelClassName="fwBlock"
              >{{ this.rechargeObj.bankNum }}
              <a href="javascript:;" class="copyBtn" @click="copyFn()">复制</a>
            </el-descriptions-item>
          </el-descriptions>
          <div class="fwyellow">请使用公司账号转账</div>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="温馨提示" labelClassName="fwBlock">
        <div class="tipbox">
          <p>1、支付时请备注 小程序名称，注明 租物宝账户充值;</p>
          <p>2、充值后24小时到账户余额;</p>
          <p>
            3、关于发票:若有开票需求请联系租物宝财务部门，租物宝将提供技术服务类发票(票)，税率1%，可以按次开发票，也可以累计几次后一起开发票。
          </p>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </basic-container>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      rechargeObj: {
        number: "13736581669",
        quota: "41234.43",
        unitName: "武汉租物宝科技有限公司",
        bankPic:
          "https://img0.baidu.com/it/u=981218435,2998857702&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1679072400&t=47e1061d2822fd1f5bd3c5df635f0e46",
        bankName: "建设银行城际花园支行",
        bankNum: "42050110508700000699",
      },
    };
  },
  watch: {},
  computed: {},
  methods: {
    copyFn() {

      const el = document.createElement("input"); 
      el.setAttribute("value", this.rechargeObj.bankNum);  
      document.body.appendChild(el); 
      el.select(); 
      document.execCommand("copy"); 
      document.body.removeChild(el);
      alert("复制成功");
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="css">
.fwBlock {
  color: #303133;
  font-weight: 700;
}
.fwyellow {
  color: orange;
}
.copyBtn {
  margin-left: 20px;
  color: rgb(40, 120, 255);
  font-weight: 700;
}
.tipbox {
  margin-top: 30px;
  margin-left: -70px;
}
.tipbox p {
  margin: 0;
  padding: 0;
  font-size: 12px;
}
</style>
