/**
 * 订单页面的各种计算和状态
 */

import {calculateBuyoutMoney, checkNumber, floatObj, toFixed} from "../constant/goods/constant";
import {DateAdd} from "./date";

const buyoutStatus = ["未申请","已申请","已驳回","买断通过","待结算","待支付","成功"]
const returnStatus = ["未申请","已申请","已驳回","待发货","待收货","待结算","拒收","待支付","成功"]


/**
 * 解析审核状态
 * @param val
 * @returns {string}
 */
export const examines = (examine) => {
  //test3_1_1,test3_2_1
  if (!examine){
    return "";
  }
  var examines = {};
  var str = examine.split(",");
  for (const item of str) {
    const  datas = item.split("_");
    if (datas.length == 3){
      examines[datas[1]]={
        "userName":datas[0],
        "status":datas[2] == 1?"未审核":(datas[2]==2?"审核通过":"审核驳回")
      }
    }
  }
  return examines
}

/**
 * 列表上的到期买断价
 * @param order
 * @returns {string|*|number}
 */
export const calculateOrderBuyoutMoney = (order) => {
  var totalPricesRate = toFixed(parseFloat(order.totalPricesRate),2);
  var websitePrice = toFixed(parseFloat(order.websitePrice),2);
  var rentMoney = toFixed(parseFloat(order.rentMoney),2);
  var allMoney = floatObj.multiply(totalPricesRate,websitePrice)
  return floatObj.subtract(allMoney,rentMoney);
}

export const checkThreeAddress = (order) => {

  if (!order.province||order.province.length<1||order.idCardAddress.indexOf(order.province)==-1){
    return false;
  }
  if (!order.province||order.province.length<1||order.sendUserAddress.indexOf(order.province)==-1){
    return false;
  }

  if (!order.city||order.city.length<1||order.idCardAddress.indexOf(order.city)==-1){
    return false;
  }
  if (!order.city||order.city.length<1||order.sendUserAddress.indexOf(order.city)==-1){
    return false;
  }

  if (!order.district||order.district.length<1||order.idCardAddress.indexOf(order.district)==-1){
    return false;
  }
  if (!order.district||order.district.length<1||order.sendUserAddress.indexOf(order.district)==-1){
    return false;
  }



  return true
}

export const checkBuyoutStatus = (order) => {
   var statusBuyout = order.statusBuyout
  return buyoutStatus[statusBuyout-1]
}
export const checkReturnStatus = (order) => {
  var statusReturn = order.statusReturn
  return returnStatus[Number.parseInt(statusReturn)-1]
}


/**
 * 获取租期单位，月，日
 * @param val
 * @returns {string}
 */
export const buyoutBalancePayment = (val) => {
  const obj = JSON.parse(val);
  var packageName  = obj.packageName;
  return packageName.buyoutBalancePayment&&Number.parseInt(packageName.buyoutBalancePayment)>=0?packageName.buyoutBalancePayment:0;
}

/**
 * 获取二次押金
 * @param val
 * @returns {string}
 */
export const secondDeposit = (val) => {
  for (const bill of val) {
    if (Number.parseInt(bill.type) == 3){
      return bill.money
    }
  }
  return 0;
}


/**
 * 获取规格尺寸 空格拼接
 * @param val
 * @returns {string}
 */
export const combinationTitle = (val) => {
  if (!val)
    return "";
  const obj = JSON.parse(val);
  let title = "";
  for (const valKey in obj) {
    if (valKey.startsWith("specification")){
      title = title +" "+ obj[valKey].name
    }
  }
  return title
}

/**
 * 获取方案名称
 * @param val
 * @returns {string}
 */
export const packageName = (val) => {
  if (!val)
    return "";
  const obj = JSON.parse(val);
  if (obj.packageName)
    return obj.packageName.name
  return ""
}

/**
 * 获取当前套餐的期数
 * @param startTime 合同开始时间
 * @param endTime 合同结束时间
 * @param rentNumber 租期，几期
 * @param type 租期单位 2 月 1 日
 * @returns {string}
 */
export const indexNumber = (order,bills) => {
  var index = 0;
  var last = 0;
  if (order.leaseType == 2 && bills){
    for (const bill of bills) {
      if (bill.type != 5){
        continue;
      }
      var start = new Date(bill.startTime);  //字符串转化成时间
      var end = new Date(bill.endTime);  //字符串转化成时间
      var now = new Date().getTime();
      if (start.getTime()<now&&now<=end.getTime()){
        index = Number.parseInt(bill.orderNumber);
      }
      if (last < Number.parseInt(bill.orderNumber)){
        last = Number.parseInt(bill.orderNumber);
      }
    }
    if (index == 0){
      index = last
    }
  }
  return index
}

/**
 * 买断总价
 * @param val
 * @returns {string}
 */
export const buyoutPrice = (val,totalPricesRate) => {
  if (!val)
    return "";
  const obj = JSON.parse(val);
  return obj.websitePrice*totalPricesRate
}

/**
 * 判断成色
 */
export const secondHandTitle = (val) => {
  if (val == 100)
    return "全新"
  return val/10+"成新";
}

/**
 * 获取租期单位，月，日
 * @param val
 * @returns {string}
 */
export const leaseTypeTitle = (val) => {
  if (val == 2)
    return "月"
  return "日";
}

/**
 *  买断价的公式：
 3个月之内的买断价 系数都是 1.25
 3个月之后的买断价：
 增长幅度公式： A = （总价系数 - 1.255）/ 3
 第4个月系数：1.25 + A
 第5个月系数：1.25 + A * 2
 第6个月系数：1.25 + A * 3
 后面6到12个月买断  都和第6个月一样
 */

export const calcBuyoutMoney = (order,bills)=>{
  //先判断是第几期
  var index = indexNumber(order,bills);
  console.log("index",index,bills)
  var last = 0;
  for (const bill of bills) {//如果选中了后面几期，那么index要跟着变
    if (bill.type != 5){
      continue;
    }
    if (bill.hasPay&&last < Number.parseInt(bill.orderNumber)){
      last = Number.parseInt(bill.orderNumber);
    }
  }
  console.log("last",index)
  if (last>index){
    index = last;
  }
  var lease = 12;
  var miniRate = 1.25;
  var nowRate = 1.25;
  var maxRate = toFixed(Number.parseFloat(order.totalPricesRate),2);
  var lease_type = order.lease_type;
  var websitePrice = toFixed(Number.parseFloat(order.websitePrice),2);
  var rentMoney = 0;
  var number = index<=3?3:index;
  for (const bill of bills) {
    if (Number.parseInt(bill.type)!=5||Number.parseInt(bill.orderNumber)>number){
      continue;
    }
    rentMoney = toFixed(floatObj.add(rentMoney,bill.money),2);
    console.log("第"+bill.orderNumber+"期",bill.money,rentMoney)
  }
  console.log("计算租期",index,lease)
  if (index<lease){//说明没到期就停止了
      if (index <= 3){ //3期以内，官网价*1.25 - 3个月租金
        return floatObj.subtract(floatObj.multiply(websitePrice,miniRate),rentMoney)
      }else if( index <= 6 && index > 3){
        var betweenRate = floatObj.subtract(maxRate,miniRate);
        var increase = toFixed(floatObj.divide(betweenRate,3),2);//增幅
        nowRate = toFixed(floatObj.add(nowRate,floatObj.multiply(increase,index-3)),2)
        var buyout = toFixed(floatObj.subtract(floatObj.multiply(nowRate,websitePrice),rentMoney),2);
        console.log("买断尾款",nowRate,websitePrice,floatObj.multiply(nowRate,websitePrice),rentMoney)
        return buyout;
        // var betweenRate = floatObj.subtract(maxRate,miniRate);
        // var betweenLease = Number.parseInt(lease) - 3;
        // var increase = toFixed(floatObj.divide(betweenRate,betweenLease),2);//增幅
        // nowRate = toFixed(floatObj.add(nowRate,floatObj.multiply(increase,index-3)),2)
        // var buyout = floatObj.subtract(floatObj.multiply(nowRate,websitePrice),rentMoney);
        // console.log("买断尾款",nowRate,buyout)
        // //计算已收租金
        // return buyout;
      }else{
        nowRate = toFixed(maxRate,2)
        console.log("买断尾款",floatObj.multiply(nowRate,websitePrice),rentMoney)
        var buyout = toFixed(floatObj.subtract(floatObj.multiply(nowRate,websitePrice),rentMoney),2);
        return buyout;
      }
  }
  /**
   * 到期了，并且满足了
   */
  if (index == lease){
    var allmoney = floatObj.multiply(maxRate,websitePrice)
    var buyoutBalancePayment = order.goodsCombinationJson.buyoutBalancePayment;
    buyoutBalancePayment =buyoutBalancePayment<0?0:buyoutBalancePayment;
    console.log("买断尾款",maxRate,allmoney,rentMoney,buyoutBalancePayment)
    return floatObj.subtract(allmoney,rentMoney)
  }
}

/**
 * 编辑订单计算买断价
 */

export const calcUpdateOrderBuyoutMoney = (order,bills,index)=>{
  //先判断是第几期
  var lease = 12;
  var miniRate = 1.25;
  var nowRate = 1.25;
  var maxRate = toFixed(Number.parseFloat(order.totalPricesRate),2);
  var websitePrice = toFixed(Number.parseFloat(order.websitePrice),2);
  var rentMoney = 0;
  var number = index<=3?3:index;
  for (const bill of bills) {
    if (Number.parseInt(bill.type)!=5||Number.parseInt(bill.orderNumber)>number){
      continue;
    }
    rentMoney = toFixed(floatObj.add(rentMoney,bill.money),2);
    console.log("第"+bill.orderNumber+"期",bill.money,rentMoney)
  }
  console.log("计算租期",index,lease)
  if (index<lease){//说明没到期就停止了
    if (index <= 3){ //3期以内，官网价*1.25 - 3个月租金
      return floatObj.subtract(floatObj.multiply(websitePrice,miniRate),rentMoney)
    }else if( index <= 6 && index > 3){
      var betweenRate = floatObj.subtract(maxRate,miniRate);
      var increase = toFixed(floatObj.divide(betweenRate,3),2);//增幅
      nowRate = toFixed(floatObj.add(nowRate,floatObj.multiply(increase,index-3)),2)
      var buyout = toFixed(floatObj.subtract(floatObj.multiply(nowRate,websitePrice),rentMoney),2);
      console.log("买断尾款",nowRate,websitePrice,floatObj.multiply(nowRate,websitePrice),rentMoney)
      return buyout;
      // var betweenRate = floatObj.subtract(maxRate,miniRate);
      // var betweenLease = Number.parseInt(lease) - 3;
      // var increase = toFixed(floatObj.divide(betweenRate,betweenLease),2);//增幅
      // nowRate = toFixed(floatObj.add(nowRate,floatObj.multiply(increase,index-3)),2)
      // var buyout = floatObj.subtract(floatObj.multiply(nowRate,websitePrice),rentMoney);
      // console.log("买断尾款",nowRate,buyout)
      // //计算已收租金
      // return buyout;
    }else{
      nowRate = toFixed(maxRate,2)
      console.log("买断尾款",nowRate,websitePrice,floatObj.multiply(nowRate,websitePrice),rentMoney)
      var buyout = toFixed(floatObj.subtract(floatObj.multiply(nowRate,websitePrice),rentMoney),2);
      return buyout;
    }
  }
  /**
   * 到期了，并且满足了
   */
  if (index == lease){
    var allmoney = floatObj.multiply(maxRate,websitePrice)
    var buyoutBalancePayment = order.goodsCombinationJson.buyoutBalancePayment;
    buyoutBalancePayment =buyoutBalancePayment<0?0:buyoutBalancePayment;
    console.log("买断尾款",maxRate,websitePrice,allmoney,rentMoney,buyoutBalancePayment)
    return floatObj.subtract(allmoney,rentMoney)
  }
}
