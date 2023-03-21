<template>
  <fragment v-if="type == 'orderInfo'">
    <el-button type="primary"   @click="sendSMS(order)" size="mini"  v-if="order.status < 9">推送消息</el-button>
    <el-button type="primary"  @click="note(order)" size="mini">备注信息</el-button>
    <el-button type="danger"  @click="cancle(order)"  v-if="order.status == 1 || order.status == 3 || order.status == 4 || order.status == 5  || order.status == 6" size="mini">取消订单</el-button>
<!--    <el-button type="danger"   @click="block(order)" v-if="order.status != 7 && order.status != 8"  size="mini">拉黑用户</el-button>-->

    <el-button type="primary" @click="edit(order)"  v-if="order.status == 2 || order.status == 4" size="mini">修改订单</el-button>
<!--    <el-button type="primary" @click="edit(order)"  size="mini">修改订单</el-button>-->
    <el-button type="warning" @click="refused(order)"  v-if="order.status == 2" size="mini">审核拒绝</el-button>
    <el-button type="primary" @click="pass(order)"  v-if="order.status == 2" size="mini">审核通过</el-button>
    <el-button type="primary" @click="entry_Form(order)"  v-if="order.status == 2" size="mini">填写进件单</el-button>

    <el-button type="primary" @click="returnApprove(order)"  v-if="order.status == 8 && order.statusReturn == 2" size="mini">归还申请审核</el-button>
    <el-button type="primary" @click="buyoutCheck(order)"  v-if="order.status == 8 && order.statusBuyout == 2" size="mini">买断申请通过</el-button>
    <el-button type="primary" @click="buyoutRefused(order)"  v-if="order.status == 8 && order.statusBuyout == 2" size="mini">买断申请拒绝</el-button>

    <el-button type="primary" @click="checkFirst(order)"  v-if="order.status == 2 && order.examineFirst == 1" size="mini">设置一审</el-button>
    <el-button type="primary" @click="resetFirst(order)"   v-if="order.status == 2 &&order.examineFirst == 2" size="mini">一审转交</el-button>
    <el-button type="primary" @click="checkSecond(order)"  v-if="order.status == 2 && order.examineSecond == 1" size="mini">设置二审</el-button>
    <el-button type="primary" @click="resetSecond(order)"  v-if="order.status == 2 &&order.examineSecond == 2" size="mini">二审转交</el-button>

    <el-button type="primary" @click="express(order)"  v-if=" order.status == 7 || order.status == 8" size="mini">查看物流</el-button>

    <el-button type="warning" @click="orderCollection(order)"  v-if="order.status == 8" size="mini" >设置催款员</el-button>

    <el-button type="primary" size="mini" v-if="showBt('buyout')" @click="orderBuyout(order)" >买断结算</el-button>
    <el-button type="primary" size="mini" v-if="showBt('return')" @click="orderReturn(order)"  >归还结算</el-button>
    <el-button type="primary" size="mini" v-if="showBt('openReturn')" @click="changeBt(order,3,order.openReturn==1?0:1)" >{{order.openReturn == 0?"打开归还":"关闭归还"}}</el-button>
    <el-button type="primary" size="mini" v-if="showBt('openBuyout')" @click="changeBt(order,2,order.openBuyout==1?0:1)" >{{order.openBuyout == 0?"打开买断":"关闭买断"}}</el-button>
    <el-button type="primary" size="mini" v-if="showBt('openRenewal')" @click="changeBt(order,1,order.openRenewal==1?0:1)" >{{order.openRenewal == 0?"打开续租":"关闭续租"}}</el-button>
  </fragment>
  <fragment v-else-if="type == 'orderList'">
    <el-button type="text" icon="el-icon-view"  size="mini" @click="orderView(order)" style="padding: 2px 0px;">查看详情</el-button>
<!--    <el-button type="text" icon="el-icon-chat-round"  size="mini" @click="sendSMS(order)"  v-if="false" style="padding: 2px 0px;">推送消息</el-button>-->
    <el-button type="text" icon="el-icon-tickets"  size="mini" @click="note(order)" style="padding: 2px 0px;">备注信息</el-button>
    <el-button type="text" icon="el-icon-s-release"  size="mini" @click="cancle(order)" style="padding: 2px 0px;" v-if="order.status == 1 || order.status == 3 || order.status == 4 || order.status == 5">取消订单</el-button>
<!--    <el-button type="text" icon="el-icon-lock"  size="mini" @click="block(order)"  v-if="order.status < 7" style="padding: 2px 0px;">拉黑客户</el-button>-->

    <el-button type="text" icon="el-icon-edit"  size="mini" @click="edit(order)" style="padding: 2px 0px;" v-if="order.status == 2 || order.status == 4">修改订单</el-button>
    <el-button type="text" icon="el-icon-view"  size="mini" @click="refused(order)" style="padding: 2px 0px;" v-if="order.status == 2">审核拒绝</el-button>
    <el-button type="text" icon="el-icon-coordinate"  size="mini" @click="pass(order)" style="padding: 2px 0px;" v-if="order.status == 2">审核通过</el-button>
    <el-button type="text" icon="el-icon-user-solid"  size="mini" @click="checkFirst(order)" style="padding: 2px 0px;" v-if="order.status == 2 && order.examineFirst == 1">设置一审</el-button>
    <el-button type="text" icon="el-icon-s-check"  size="mini" @click="checkSecond(order)" style="padding: 2px 0px;" v-if="order.status == 2 && order.examineSecond == 1">设置二审</el-button>

    <el-button type="text" icon="el-icon-view"  size="mini" @click="express(order)" style="padding: 2px 0px;" v-if="order.status == 6 || order.status == 7 || order.status == 8">查看物流</el-button>
    <el-button type="text" icon="el-icon-s-open"  size="mini" @click="openRenewal(order)" style="padding: 2px 0px;" v-if="false">打开续租</el-button>
    <el-button type="text" icon="el-icon-s-open"  size="mini" @click="openReturn(order)" style="padding: 2px 0px;" v-if="false">打开归还</el-button>
    <el-button type="text" icon="el-icon-s-open"  size="mini" @click="openBuyout(order)" style="padding: 2px 0px;" v-if="false">打开买断</el-button>
    <el-button type="text" icon="el-icon-mouse"  size="mini" @click="setSalesman(order)" style="padding: 2px 0px;" v-if="false">分配业务员</el-button>
  </fragment>
  <fragment v-else-if="type == 'audit'"><!-- 待审核 -->
    <el-button type="text" icon="el-icon-view"  size="mini" @click="orderView(order)" style="padding: 2px 0px;">查看详情</el-button>
    <el-button type="text" icon="el-icon-tickets"  size="mini" @click="note(order)" style="padding: 2px 0px;">添加备注</el-button>
    <el-button type="text" icon="el-icon-user-solid"  size="mini" @click="pass(order)" style="padding: 2px 0px;" v-if="order.status == 2">审核通过</el-button>
    <el-button type="text" icon="el-icon-user-solid"  size="mini" @click="refused(order)" style="padding: 2px 0px;" v-if="order.status == 2">审核拒绝</el-button>
  </fragment>
  <fragment v-else-if="type == 'unDistribution'"><!-- 审核未分配 -->
    <el-button type="text" icon="el-icon-view"  size="mini" @click="orderView(order)" style="padding: 2px 0px;">查看详情</el-button>
<!--    <el-button type="text" icon="el-icon-tickets"  size="mini" @click="note(order)" style="padding: 2px 0px;">备注信息</el-button>-->
<!--    <el-button type="text" icon="el-icon-user-solid"  size="mini" @click="checkFirst(order)" style="padding: 2px 0px;" v-if="order.examineFirst == 1">设置一审</el-button>-->
<!--    <el-button type="text" icon="el-icon-user-solid"  size="mini" @click="resetFirst(order)" style="padding: 2px 0px;" v-if="order.examineFirst == 2">一审转交</el-button>-->
<!--    <el-button type="text" icon="el-icon-s-check"  size="mini" @click="checkSecond(order)" style="padding: 2px 0px;" v-if="order.examineSecond == 1">设置二审</el-button>-->
<!--    <el-button type="text" icon="el-icon-s-check"  size="mini" @click="resetSecond(order)" style="padding: 2px 0px;" v-if="order.examineSecond == 2">二审转交</el-button>-->
  </fragment>
  <fragment v-else-if="type == 'uncollection'"><!-- 催款未分配 -->
    <el-button type="text" icon="el-icon-view"  size="mini" @click="orderView(order)" style="padding: 2px 0px;">查看详情</el-button>
    <el-button type="text" icon="el-icon-user-solid"  size="mini" @click="orderCollection(order)" style="padding: 2px 0px;">设置催款员</el-button>
  </fragment>
  <fragment v-else-if="type == 'sendgoods'"><!-- 发货 -->
    <el-button type="text" icon="el-icon-tickets"  size="mini" @click="note(order)" style="padding: 2px 0px;">备注信息</el-button>
    <el-button type="text" icon="el-icon-user-solid"  size="mini" v-if="order.status == 6" @click="sendConfirmation(order)" style="padding: 2px 0px;" >发货确认</el-button>
    <el-popover
      placement="left"
      width="230"
      v-if="order.status == 7"
      v-model="visible">
      <div><i class="el-icon-warning" style="color: #F56C6C"></i>点击立即签收将马上签收</div>
      <div><i class="el-icon-warning" style="color: #F56C6C"></i>点击等待签收，24小时内未签收则自动收货</div>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" icon="el-icon-close" @click="visible = false">取消操作</el-button>
        <el-button type="text" icon="el-icon-user-solid"  size="mini"  @click="orderReceive(order)" style="padding: 2px 0px;" >立即签收</el-button>
        <el-button type="text" icon="el-icon-user-solid"  size="mini" :disabled="order.sendToTime" @click="orderSendTo(order)" style="padding: 2px 0px;" >等待签收</el-button>
      </div>
      <el-button slot="reference"  type="text" icon="el-icon-goods" v-if="order.status == 7"  size="mini"  tyle="padding: 2px 0px;" >签收处理</el-button>
    </el-popover>

    <el-button type="text" icon="el-icon-picture"  size="mini" v-if="[7,8,9].includes(order.status)" @click="viewVoucher(order)" style="padding: 2px 0px;" >查看凭证</el-button>
  </fragment>
  <fragment v-else-if="type == 'collection'"><!-- 催收 -->
    <el-button type="text" icon="el-icon-view" size="mini" @click="orderView(order)" style="padding: 2px 0px;">查看详情</el-button>
    <el-button type="text" icon="el-icon-tickets" size="mini" @click="note(order)" style="padding: 2px 0px;">备注信息</el-button>
    <el-button type="text" icon="el-icon-user-solid" size="mini" @click="" style="padding: 2px 0px;" >催款记录</el-button>
    <el-button type="text" icon="el-icon-user-solid" size="mini" @click="addCollection(order)" style="padding: 2px 0px;" >增加催款</el-button>
    <el-button type="text" icon="el-icon-user-solid" size="mini" @click="deductMoney(order,'online')" style="padding: 2px 0px;" >线上扣款</el-button>
    <el-button type="text" icon="el-icon-user-solid" size="mini" @click="deductMoney(order,'offline')" style="padding: 2px 0px;" >线下扣款</el-button>
    <el-button type="text" icon="el-icon-user-solid" size="mini" @click="orderBuyout(order)" v-if="order.openBuyout != 0" style="padding: 2px 0px;" >买断结算</el-button>
    <el-button type="text" icon="el-icon-user-solid" size="mini" @click="orderReturn(order)" v-if="order.openReturn != 0" style="padding: 2px 0px;" >归还结算</el-button>
    <el-button type="text" icon="el-icon-user-solid" size="mini" @click="changeBt(order,3,order.openReturn==1?0:1)" style="padding: 2px 0px;" >{{order.openReturn == 0?"打开归还":"关闭归还"}}</el-button>
    <el-button type="text" icon="el-icon-user-solid" size="mini" @click="changeBt(order,2,order.openBuyout==1?0:1)" style="padding: 2px 0px;" >{{order.openBuyout == 0?"打开买断":"关闭买断"}}</el-button>
    <el-button type="text" icon="el-icon-user-solid" size="mini" @click="changeBt(order,1,order.openRenewal==1?0:1)" style="padding: 2px 0px;" >{{order.openRenewal == 0?"打开续租":"关闭续租"}}</el-button>
  </fragment>
  <fragment v-else-if="type == 'receivegoods'"><!-- 收货 -->
    <el-button type="text" icon="el-icon-tickets"  size="mini" @click="note(order)" style="padding: 2px 0px;">备注信息</el-button>
    <el-button type="text" icon="el-icon-user-solid" v-if="order.receivedStatus == 4" size="mini" @click="receiveGoods(order)" style="padding: 2px 0px;" >收货处理</el-button>
  </fragment>
</template>

<script>
  import {
    change_bt,
    changeBt,
    deduction,
    dialog_add_collection,
    order_send_to,
    order_cancel,
    order_check_pass,
    order_check_refuse,
    order_collection,
    order_entry_form,
    order_express,
    order_first_trial,
    order_note,
    order_second_trial,
    order_set_salesman,
    order_sms_send,
    order_buyout,
    order_update,
    receive_goods,
    send_confirmation,
    shielding_user,
    order_return,
    buyout_check,
    return_check,
    return_refused,
    buyout_refused,
    return_approve,
    view_voucher, order_receive
  } from "./order_dialog";
  import {distribute} from "../../api/audit/orderexamine";
  import moment from "moment";

  export default {
    name: "",
    props: {
      order: Object,
      type: String,
    },
    data () {
      return{
        visible:false,
       fn:{start:this.start,end:this.end}
      }
    },
    mounted() {
      // console.log(this.order)
    },
    methods:{
      showBt(key){
        switch (key) {
            case 'openReturn':{
                //status_return 归还申请 1 未申请 2 已申请 3 已驳回 4 待发货 5 待收货 6待结算 7 拒收 8 归还成功
                var statusReturn = this.order.statusReturn;
                return this.order.status == 8 && (!statusReturn||statusReturn==3||statusReturn==1)?true:false;
              }
            case 'openBuyout':{
                //status_buyout 买断状态 1 未申请 2 已申请 3 已驳回 4 买断通过 5 待结算 6买断成功
                var statusBuyout = this.order.statusBuyout;
                return this.order.status == 8 && ( !statusBuyout||statusBuyout==3||statusBuyout==1)?true:false;
              }
            case 'openRenewal':
              var status = this.order.status;
              return status == 8?true:false;
              return true;
            case "buyout":{
              var statusBuyout = this.order.statusBuyout;
              return this.order.status == 8 &&statusBuyout == 5?true:false;
            }
            case "return":{
              var statusReturn = this.order.statusReturn;
              return this.order.status == 8 &&statusReturn == 6?true:false;
            }
        }
        return false
      },
      start(){
        this.$emit('start')
      },
      end(key){
        console.log("--333---")
        this.$emit('end',key)
      },
      changeBt(order,type,status){
        var fn = {start:this.start,end:this.end}
        var params = {};
        params.id = order.id;
        params.typeId = type;
        params.status = status;
        change_bt({data:params,key:"changeBt",fn:fn})
      },
      deductMoney(order,type) {
        var fn = {start:this.start,end:this.end}
        order.openType = type
        order.hasBill = false
        console.log(order)
        deduction({data:order,key:"deductMoney",fn:fn});
      },
      /**
       * 发送推送
       * @param order
       */
      sendSMS(order){
        var fn = {start:this.start,end:this.end}
        order_sms_send({data:order,fn:fn})
      },

      orderBuyout(order){
        var fn = {start:this.start,end:this.end}
        order_buyout({data:order,key:"order_buyout",fn:fn})
      },

      orderReturn(order){
        var fn = {start:this.start,end:this.end}
        order_return({data:order,fn:fn})
      },
      /**
       * 设置备注
       * @param order
       * @param index
       */
      note(order){
        var fn = {start:this.start,end:this.end}
        order_note({data:order,fn:fn})
      },
      /**
       * 取消
       * @param order
       */
      cancle(order){
        var fn = {start:this.start,end:this.end}
        order_cancel({data:order,key:"cancle",fn:fn})
      },
      /**
       * 拉黑
       * @param order
       */
      block(order){
        shielding_user({data:order,fn:this.fn})
      },
      /**
       * 编辑
       * @param order
       */
      edit(order){
        var order = Object.assign({},order)
        order.goodsCombinationJson = JSON.parse(order.goodsCombinationJson)
        var fn = {start:this.start,end:this.end}
        order_update({data:order,key:"edit",fn:fn})
      },
      /**
       * 填写进件单
       * @param order
       */
      entry_Form(order){
        var fn = {start:this.start,end:this.end}
        order_entry_form({data:order,key:"entryForm",fn:fn})
      },

      returnApprove(order){
        var fn = {start:this.start,end:this.end}
        return_approve({data:order,key:"return_check",fn:fn})
      },

      returnRefused(order){
        var fn = {start:this.start,end:this.end}
        return_approve({data:order,key:"return_refused",fn:fn})
      },

      buyoutCheck(order){
        var fn = {start:this.start,end:this.end}
        buyout_check({data:order,key:"buyout_check",fn:fn})
      },

      buyoutRefused(order){
        var fn = {start:this.start,end:this.end}
        buyout_refused({data:order,key:"buyout_check",fn:fn})
      },
      /**
       * 审核拒绝
       * @param order
       */
      refused(order){
        var fn = {start:this.start,end:this.end}
        order_check_refuse({data:order,key:"refused",fn:fn})
      },
      /**
       * 审核通过
       * @param order
       */
      pass(order){
        if (order.entryForm.length == 0){
          this.$message({
            type: 'error',
            message: '请填写进件单'
          });
          return;
        }
        var fn = {start:this.start,end:this.end}
        order_check_pass({data:order,key:"pass",fn:fn})
      },
      /**
       * 查看详情
       * @param order
       * @param index
       */
      orderView(order){
        console.log(order)
        this.$router.push({
          path: "/order/view/index",
          query: {
            orderId : order.id,
          },
        });
      },
      orderCollection(order){
        const data = {orderIds:order.id}
        order_collection({data:data,fn:this.fn})
      },
      addCollection(order){
        var fn = {start:this.start,end:this.end}
        dialog_add_collection({data:order,key:"addCollection",fn:fn})
      },
      checkFirst(order){
        const data = {orderIds:order.id,reset:false}
        order_first_trial({data:data,fn:this.fn})
      },

      viewVoucher(order){
        view_voucher({data:order,fn:this.fn})
      },


      resetFirst(order){
        const data = {orderIds:order.id,reset:true}
        order_first_trial({data:data,fn:this.fn})
      },

      /**
       * 设置二审
       * @param order
       */
      checkSecond(order){
        const data = {orderIds:order.id,reset:false}
        order_second_trial({data:data,fn:this.fn})
      },
      /**
       * 二审转交
       * @param order
       */
      resetSecond(order){
        const data = {orderIds:order.id,reset:true}
        order_second_trial({data:data,fn:this.fn})
      },

      /**
       * 查看物流
       * @param order
       */
      express(order){
        var fn = {start:this.start,end:this.end}
        order_express({data:order.id,key:"orderExpress",fn:fn})
      },
      /**
       * 设置业务员
       * @param order
       */
      setSalesman(order){
        order_set_salesman({data:order,fn:this.fn})
      },
      /**
       * 打开续租
       * @param order
       */
      openRenewal(order){

      },
      /**
       * 打开归还
       * @param order
       */
      openReturn(order){

      },
      /**
       * 打开买断
       * @param order
       */
      openBuyout(order){

      },
      sendConfirmation(order){
        const data = {...order}
        data.orderIds = order.id
        data.reset = true
        send_confirmation({data:data,fn:this.fn})
      },
      /**
       * 确认等待签收
       * @param order
       * @param order
       */
      orderSendTo(order){
        const data = {id:order.sendId,sendToTime:moment().format('YYYY-MM-DD HH:mm:ss')}
        order_send_to({data:data,fn:this.fn})
      },
      /**
       * 立即确认收货
       * @param order
       */
      orderReceive(order){
        console.log(JSON.stringify(order))
        const data = {orderId:order.id,clientId:order.clientId}
        order_receive({data:data,fn:this.fn})
      },
      receiveGoods(order){
        const data = {...order}
        data.orderIds = order.id
        data.reset = true
        receive_goods({data:data,fn:this.fn})
      }
    }
  }
</script>

<style scoped>

</style>
