<template>
  <basic-container>
<!--    <el-button type="danger" @click="onLoad(true)">获取最新报告数据</el-button>-->
    <el-divider></el-divider>
    <avue-form :option="option"
               v-loading="loading"
               v-model="form"
               ref="form">
    </avue-form>
    <el-divider></el-divider>
    <avue-form :option="dataOption"
               v-loading="loading"
               v-model="dataForm"
               ref="dataForm">
    </avue-form>
  </basic-container>
</template>

<script>
import {getDetail} from "@/api/order/clientcredit";

export default {
  props: ["clientId"],
  data() {
    return {
      form: {},
      dataForm: {},
      loading: true,
      option: {
        detail: true,
        height: 'auto',
        calcHeight: 210,
        tip: false,
        border: true,
        labelWidth: 120,
        column: [
          {
            label: "查询订单号",
            span: 24,
            prop: "respOrder"
          },
          {
            label: "返回代码",
            prop: "respCode"
          },
          {
            label: "返回信息",
            prop: "respMsg"
          },
          {
            label: "查询时间",
            prop: "updateTime"
          },
          {
            label: "审核建议",
            prop: "rules"
          },
          {
            label: "风控分数",
            prop: "score"
          },
          {
            label: "押金建议",
            prop: "modelType"
          },
        ]
      },
      dataOption: {
        detail: true,
        height: 'auto',
        calcHeight: 210,
        tip: false,
        border: true,
        labelWidth: 320,
        column: [
          {
            label: "无信贷记录",
            span:24,
            prop: "j0006"
          },
        ],
        group:[
          {
            label: '非循环贷账户信息',
            icon:'el-icon-info',
            collapse:false,
            prop: 'group1',
            column: [
              {
                label: "机构数",
                prop: "c0003"
              },
              {
                label: "账户数",
                prop: "c0002"
              },
              {
                label: "授信总额",
                prop: "c0001"
              },
              {
                label: "贷款余额",
                prop: "c0005"
              },
              {
                label: "最近6个月平均应付款",
                prop: "c0004"
              },
            ]
          },
          {
            label: '循环贷账户信息',
            icon:'el-icon-info',
            collapse:false,
            prop: 'group2',
            column: [
              {
                label: "机构数",
                prop: "c0012"
              },
              {
                label: "账户数",
                prop: "c0011"
              },
              {
                label: "授信总额",
                prop: "c0015"
              },
              {
                label: "贷款余额",
                prop: "c0014"
              },
              {
                label: "最近6个月平均应付款",
                prop: "c0013"
              },
            ]
          },
          {
            label: '循环额度分账户信息',
            icon:'el-icon-info',
            collapse:false,
            prop: 'group3',
            column: [
              {
                label: "机构数",
                prop: "c0009"
              },
              {
                label: "账户数",
                prop: "c0007"
              },
              {
                label: "授信总额",
                prop: "c0008"
              },
              {
                label: "贷款余额",
                prop: "c0010"
              },
              {
                label: "最近6个月平均应付款",
                prop: "c0006"
              },
              {
                label: "未结清贷账户数",
                prop: "xs001"
              },
              {
                label: "房贷账户数",
                prop: "xs002"
              },
              {
                label: "未结清房贷账户总余额",
                prop: "xs003"
              },
              {
                label: "除房贷以外未结清抵押/质押类贷款账户数",
                prop: "xs004"
              },
              {
                label: "除房贷以外未结清抵押/质押类贷款余额",
                prop: "xs005"
              },
              {
                label: "经营类贷款账户数",
                prop: "xs006"
              },
              {
                label: "未结清经营类贷款账户余额",
                prop: "xs007"
              },
              {
                label: "近一个月要到期贷款账户数",
                prop: "xs008"
              },
              {
                label: "近一个月要到期贷款账户余额",
                prop: "xs009"
              },
            ]
          },
          {
            label: '贷记卡账户信息',
            icon:'el-icon-info',
            collapse:false,
            prop: 'group4',
            column: [
              {
                label: "发卡机构数",
                prop: "c0022"
              },
              {
                label: "账户数",
                prop: "c0023"
              },
              {
                label: "账户数",
                prop: "c0020"
              },
              {
                label: "授信总额",
                prop: "c0018"
              },
              {
                label: "已使用额度",
                prop: "c0017"
              },
              {
                label: "额度使用率（总）",
                prop: "xs010"
              },
              {
                label: "额度使用率（单张最高）",
                prop: "xs011"
              },
            ]
          },
          {
            label: '对外担保',
            icon:'el-icon-info',
            collapse:false,
            prop: 'group5',
            column: [
              {
                label: "是否存在对外担保",
                prop: "xs012"
              },
              {
                label: "担保金额",
                prop: "xs013"
              },
              {
                label: "剩余担保金额",
                prop: "xs014"
              },
            ]
          },
          {
            label: '查询记录',
            icon:'el-icon-info',
            collapse:false,
            prop: 'group6',
            column: [
              {
                label: "近六个月贷款、信用卡、融资审批查询次数",
                span:24,
                prop: "j0021"
              },
              {
                label: "近三个月贷款、信用卡、融资审批查询次数",
                span:24,
                prop: "j0022"
              },
              {
                label: "近一个月本人查询次数",
                span:24,
                prop: "a0017"
              },
            ]
          },
          {
            label: '其他',
            icon:'el-icon-info',
            collapse:false,
            prop: 'group6',
            column: [
              {
                label: "是否当前逾期",
                prop: "xs015"
              },
              {
                label: "是否存在低保救助记录",
                prop: "xs016"
              },
            ]
          }
        ]
      },
    };
  },
  mounted() {
    this.onLoad(false);
  },
  methods: {
    onLoad(isNew){
      this.loading = true;
      this.$refs.form.resetForm();
      this.$refs.dataForm.resetForm();
      getDetail(this.clientId,isNew).then(res => {
        this.form = res.data.data;
        this.form.rules = this.form.rules.replaceAll("AGREE","通过").replaceAll("REJECT","拒绝")
        if(this.form.modelType == "M1"){
          this.form.modelType += "(白户评分卡)";
        }else if(this.form.modelType == "M2"){
          this.form.modelType += "(少信用记录评分卡)";
        }else if(this.form.modelType == "M3"){
          this.form.modelType += "(多信用记录评分卡)";
        }
        if (this.form.respData){
          this.dataForm = JSON.parse(this.form.respData)["labels"];
        }
        this.loading = false;
      });
    }
  },
  watch: {
    clientId: function () {
      this.onLoad(false);
    }
  }
};
</script>

<style>
</style>
