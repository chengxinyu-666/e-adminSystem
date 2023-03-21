// 商品页面的各种计算

//租满归还
export const defaultReturn = {
  type:1,
  typeName: '租满归还',
  typeTitle: '月供低 年年焕新',
  typeInfo: '（租期到期后需要用户归还商品）',
  rentRate: 0.8, //默认归还租金系数
  lateFeeRate: 0.2, //默认日滞纳金系数
  renewalRate: 0, //默认续租系数
  miniLease: 12, //默认最低租期
  miniType: 2, //默认最低租期单位(字典)(日/月) 1 2
  maxLease: 12, //默认最高租期
  maxType: 2, //默认最高租期单位(字典)(日/月) 1 2
  miniLeaseList: [[10,20,30],[12]], //默认最低租期单位(字典)(日/月/年)
  maxLeaseList: [
    [[20,30,60],[30,60],[60]],
    [[12]]
  ], //默认最低租期单位(字典)(日/月/年)
}
// //租满买断
// export const defaultBuyout = {
//   type:2,
//   typeName: '租满买断',
//   typeInfo: '（租期到期后用户可选择归还或买断的商品）',
//   rentRate: 0.8, //默认归还租金系数
//   lateFeeRate: 0.4, //默认日滞纳金系数
//   renewalRate: 0, //默认续租系数
//   miniLease: 12, //默认最低租期
//   miniType: 2, //默认最低租期单位(字典)(日/月/年)1 2
//   maxLease: 12, //默认最高租期
//   maxType: 2,//默认最高租期单位(字典)(日/月/年) 1 2
//   miniLeaseList: [[10,20,30],[12]], //默认最低租期单位(字典)(日/月/年)
//   maxLeaseList: [
//     [[20,30,60],[30,60],[60]],
//     [[12]]
//   ], //默认最低租期单位(字典)(日/月/年)
// }
//灵活组
export const defaultFlexible = {
  type:3,
  typeName: '租满即送',
  typeTitle: '个月内随时续租/买断/归还/续满即送',
  typeInfo: '（租期到期后用户可付买断尾款获得商品所有权，无需归还)',
  rentRate: 1, //默认归还租金系数
  lateFeeRate: 0.2, //默认日滞纳金系数
  renewalRate: 0, //默认续租系数
  miniLease: 3, //默认最低租期
  miniType: 2, //默认最低租期单位(字典)(日/月/年)1 2
  maxLease: 12, //默认最高租期
  maxType: 2, //默认最高租期单位(字典)(日/月/年)1 2
  miniLeaseList: [[10,20,30],[3,6,12]], //默认最低租期单位(字典)(日/月/年)
  maxLeaseList: [
    [[20,30,60],[30,60],[60]],
    [[12],[12],[12]]
  ], //默认最低租期单位(字典)(日/月/年)
}

export const defaultPlanInfo = {
  type_1:defaultReturn,
  // type_2:defaultBuyout,
  type_3:defaultFlexible,
}

export function selectOpion(){
  var option = [];
  for (const key in defaultPlanInfo) {
    var item = defaultPlanInfo[key];
    option.push({label:item.typeName,value:item.type})
  }
  return option;
}

export const checkNumber = (val) => {
  return parseFloat(val).toString() != "NaN";
}

export const floatObj = function () {

  /*
   * 判断obj是否为一个整数
   */
  function isInteger(obj) {
    return Math.floor(obj) === obj
  }

  /*
   * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
   * @param floatNum {number} 小数
   * @return {object}
   *   {times:100, num: 314}
   */
  function toInteger(floatNum) {
    var ret = {times: 1, num: 0};
    if (isInteger(floatNum)) {
      ret.num = floatNum;
      return ret
    }
    var strfi = floatNum + '';
    var dotPos = strfi.indexOf('.');
    var len = strfi.substr(dotPos + 1).length;
    var times = Math.pow(10, len);
    var intNum = parseInt(floatNum * times + 0.5, 10);
    ret.times = times;
    ret.num = intNum;
    return ret
  }

  /*
   * 核心方法，实现加减乘除运算，确保不丢失精度
   * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
   *
   * @param a {number} 运算数1
   * @param b {number} 运算数2
   * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
   *
   */
  function operation(a, b, op) {
    var o1 = toInteger(a);
    var o2 = toInteger(b);
    var n1 = o1.num;
    var n2 = o2.num;
    var t1 = o1.times;
    var t2 = o2.times;
    var max = t1 > t2 ? t1 : t2;
    var result = null;
    switch (op) {
      case 'add':
        if (t1 === t2) { // 两个小数位数相同
          result = n1 + n2
        } else if (t1 > t2) { // o1 小数位 大于 o2
          result = n1 + n2 * (t1 / t2)
        } else { // o1 小数位 小于 o2
          result = n1 * (t2 / t1) + n2
        }
        return result / max;
      case 'subtract':
        if (t1 === t2) {
          result = n1 - n2
        } else if (t1 > t2) {
          result = n1 - n2 * (t1 / t2)
        } else {
          result = n1 * (t2 / t1) - n2
        }
        return result / max;
      case 'multiply':
        result = (n1 * n2) / (t1 * t2);
        return result;
      case 'divide':
        result = (n1 / n2) * (t2 / t1);
        return result
    }
  }

  // 加减乘除的四个接口
  function add(a, b) {
    return operation(a, b, 'add')
  }

  function subtract(a, b) {
    return operation(a, b, 'subtract')
  }

  function multiply(a, b) {
    return operation(a, b, 'multiply')
  }

  function divide(a, b) {
    return operation(a, b, 'divide')
  }

  // exports
  return {
    add: add,
    subtract: subtract,
    multiply: multiply,
    divide: divide
  }
}();

//每一期租金
export const calculatePerRentMoney  = (data) => {
  if (checkNumber(data.totalPricesRate)&&checkNumber(data.websitePrice)&&checkNumber(data.rentRate)&&checkNumber(data.buyoutBalancePayment)){
    var totalPricesRate = toFixed(parseFloat(data.totalPricesRate),2);
    var websitePrice = toFixed(parseFloat(data.websitePrice),2);
    var rentRate = toFixed(parseFloat(data.rentRate),2);
    var buyoutBalancePayment = toFixed(parseFloat(data.buyoutBalancePayment),2);
    if (data.packageName.type == 1){
      //租满即送 租满归还 是官网价*总价系数除以最低租期
      var one = floatObj.multiply(totalPricesRate,websitePrice);
      var two = floatObj.multiply(one,rentRate)
      data.rentMoney = toFixed(floatObj.divide(two,12.00),2);
      console.log("租满归还 计算每一期租金",totalPricesRate,websitePrice,two,data.rentMoney)
      return data.rentMoney
    } else if (data.packageName.type == 2){
      //租满即送 租满归还 是官网价*总价系数除以最低租期
      var one = floatObj.multiply(totalPricesRate,websitePrice);
      var two = floatObj.multiply(one,rentRate)
      data.rentMoney = toFixed(floatObj.divide(two,12.00),2);
      return data.rentMoney
    } else if (data.packageName.type == 3){
      //租满即送 灵活租 是官网价*总价系数-买断尾款 除以最低租期
      var one = floatObj.multiply(totalPricesRate,websitePrice);
      var two = floatObj.subtract(one,buyoutBalancePayment)
      var three = floatObj.multiply(two,rentRate)
      console.log("租满即送 计算每一期租金",totalPricesRate,websitePrice,buyoutBalancePayment,one,two)
      data.rentMoney = toFixed(floatObj.divide(three,12.00),2);
      return data.rentMoney
    }
  }
  return ""
}

//高级版，租金算法 前6期是（合约价 * 0.838 / 6），后6期就是（合约价 - 前面6个月的总价）/6
export const calculateVipPerRentMoney  = (data,index) => {
  if (checkNumber(data.totalPricesRate)&&checkNumber(data.websitePrice)&&checkNumber(data.rentRate)&&checkNumber(data.buyoutBalancePayment)){
    var totalPricesRate = toFixed(parseFloat(data.totalPricesRate),2);
    var websitePrice = toFixed(parseFloat(data.websitePrice),2);
    var rentRate = toFixed(parseFloat(data.rentRate),2);
    var buyoutBalancePayment = toFixed(parseFloat(data.buyoutBalancePayment),2);
    if (data.packageName.type == 1){
      //租满即送 租满归还 是官网价*总价系数除以最低租期
      var one = floatObj.multiply(totalPricesRate,websitePrice);
      var two = floatObj.multiply(one,rentRate)
      if (index<=6){
        data.rentMoney = toFixed(floatObj.divide(floatObj.multiply(two,parseFloat("0.838")),6),2);
      }
      if (index>6 && index < 12){
        var rentMoney = toFixed(floatObj.divide(floatObj.multiply(two,parseFloat("0.838")),6),2);
        var sixMonthMoney = toFixed(floatObj.multiply(parseFloat(rentMoney),6),2);
        data.rentMoney = toFixed(floatObj.divide(floatObj.subtract(two,sixMonthMoney),6),2);
      }

      if (index == 12){
        var rentMoney = toFixed(floatObj.divide(floatObj.multiply(two,parseFloat("0.838")),6),2);
        var sixMonthMoney = toFixed(floatObj.multiply(parseFloat(rentMoney),6),2);
        var rentMoney2 = toFixed(floatObj.divide(floatObj.subtract(two,sixMonthMoney),6),2);
        data.rentMoney = toFixed(floatObj.subtract(floatObj.subtract(two,sixMonthMoney),floatObj.multiply(rentMoney2,5)),2);
      }
      console.log("租满归还 计算每一期租金",totalPricesRate,websitePrice,two,data.rentMoney)
      return data.rentMoney
    } else if (data.packageName.type == 2){
      //租满即送 租满归还 是官网价*总价系数除以最低租期
      var one = floatObj.multiply(totalPricesRate,websitePrice);
      var two = floatObj.multiply(one,rentRate)
      if (index<=6){
        data.rentMoney = toFixed(floatObj.divide(floatObj.multiply(two,parseFloat("0.838")),6),2);
      }
      if (index>6 && index < 12){
        var rentMoney = toFixed(floatObj.divide(floatObj.multiply(two,parseFloat("0.838")),6),2);
        var sixMonthMoney = toFixed(floatObj.multiply(parseFloat(rentMoney),6),2);
        data.rentMoney = toFixed(floatObj.divide(floatObj.subtract(two,sixMonthMoney),6),2);
      }

      if (index == 12){
        var rentMoney = toFixed(floatObj.divide(floatObj.multiply(two,parseFloat("0.838")),6),2);
        var sixMonthMoney = toFixed(floatObj.multiply(parseFloat(rentMoney),6),2);
        var rentMoney2 = toFixed(floatObj.divide(floatObj.subtract(two,sixMonthMoney),6),2);
        data.rentMoney = toFixed(floatObj.subtract(floatObj.subtract(two,sixMonthMoney),floatObj.multiply(rentMoney2,5)),2);
      }
      return data.rentMoney
    } else if (data.packageName.type == 3){
      //租满即送 灵活租 是官网价*总价系数-买断尾款 除以最低租期
      var one = floatObj.multiply(totalPricesRate,websitePrice);
      var two = floatObj.subtract(one,buyoutBalancePayment)
      var three = floatObj.multiply(two,rentRate)
      console.log("租满即送 计算每一期租金",totalPricesRate,websitePrice,buyoutBalancePayment,one,two)

      if (index<=6){
        data.rentMoney = toFixed(floatObj.divide(floatObj.multiply(three,parseFloat("0.838")),6),2);
      }
      if (index>6 && index < 12){
        var rentMoney = toFixed(floatObj.divide(floatObj.multiply(three,parseFloat("0.838")),6),2);
        var sixMonthMoney = toFixed(floatObj.multiply(parseFloat(rentMoney),6),2);
        data.rentMoney = toFixed(floatObj.divide(floatObj.subtract(three,sixMonthMoney),6),2);
      }

      if (index == 12){
        var rentMoney = toFixed(floatObj.divide(floatObj.multiply(three,parseFloat("0.838")),6),2);
        var sixMonthMoney = toFixed(floatObj.multiply(parseFloat(rentMoney),6),2);
        var rentMoney2 = toFixed(floatObj.divide(floatObj.subtract(three,sixMonthMoney),6),2);
        data.rentMoney = toFixed(floatObj.subtract(floatObj.subtract(three,sixMonthMoney),floatObj.multiply(rentMoney2,5)),2);
      }


      // data.rentMoney = toFixed(floatObj.divide(three,12.00),2);
      return data.rentMoney
    }
  }
  return ""
}

//计算总价 官网价*总价系数
export const calculateAllMoney  = (data) => {
  if (checkNumber(data.totalPricesRate)&&checkNumber(data.websitePrice)){
    var totalPricesRate = toFixed(parseFloat(data.totalPricesRate),2);
    var websitePrice = toFixed(parseFloat(data.websitePrice),2);
    var one = floatObj.multiply(totalPricesRate,websitePrice);
    return toFixed(one,2);
  }
  return ""
}

//计算总租金 官网价*总价系数*租金系数
export const calculateRentMoney  = (data) => {
  if (checkNumber(data.totalPricesRate)&&checkNumber(data.websitePrice)){
    var totalPricesRate = toFixed(parseFloat(data.totalPricesRate),2);
    var websitePrice = toFixed(parseFloat(data.websitePrice),2);
    var rentRate = toFixed(parseFloat(data.rentRate),2);
    var one = floatObj.multiply(totalPricesRate,websitePrice);
    var two = floatObj.multiply(one,rentRate);
    return toFixed(two,2);
  }
  return ""
}

//租满即送，计算租期内总租金 (官网价*总价系数 - 买断价) * 租期 / 12
export const calculateRentLimitMoney  = (data,lease) => {
  console.log(data)
  if (checkNumber(data.totalPricesRate)&&checkNumber(data.websitePrice)&&checkNumber(data.buyoutBalancePayment)){
    var totalPricesRate = toFixed(parseFloat(data.totalPricesRate),2);
    var websitePrice = toFixed(parseFloat(data.websitePrice),2);
    var buyoutBalancePayment = toFixed(parseFloat(data.buyoutBalancePayment),2);
    buyoutBalancePayment = buyoutBalancePayment<0?0:buyoutBalancePayment;

    var one = toFixed(floatObj.multiply(totalPricesRate,websitePrice),2);
    var two = toFixed(floatObj.subtract(one,buyoutBalancePayment),2);
    var three = toFixed(floatObj.multiply(two,lease),2);
    console.log("totalPricesRate",totalPricesRate,"websitePrice",websitePrice,"buyoutBalancePayment",buyoutBalancePayment,"one",one,"two",two,"three",three,"rent",toFixed(floatObj.divide(three,12.00),2))
    return toFixed(floatObj.divide(three,12.00),2);
  }
  return ""
}

export const toFixed = (num, digit) =>{
  if(Object.is(parseFloat(num), NaN)) {
    return console.log(`传入的值：${num}不是一个数字`);
  }
  num = parseFloat(num);
  return (Math.round((num + Number.EPSILON) * Math.pow(10, digit)) / Math.pow(10, digit)).toFixed(digit);
}

//计算第一期租金
export const calculateFirstPerRentMoney  = (data,lease) => {
  var  rentPerMoney = calculatePerRentMoney(data);
  console.log("calculateFirstPerRentMoney 每一期租金",rentPerMoney)
  var rentMoney = 0;
  if (data.packageName.type == 3){
    rentMoney = calculateRentLimitMoney(data,lease)
  }else{
    rentMoney = calculateRentMoney(data);
  }

  console.log("calculateFirstPerRentMoney 总租金",rentPerMoney)

  // var rentRate = toFixed(parseFloat(data.rentRate),2);
  // rentMoney = floatObj.multiply(rentMoney,rentRate)

  if (checkNumber(rentMoney)&&checkNumber(rentPerMoney)&&checkNumber(lease)){
    var rentMoneyf = toFixed(parseFloat(rentMoney),2);
    var rentPerMoneyf = toFixed(parseFloat(rentPerMoney),2);
    var leasef = toFixed(parseFloat(lease),2);
    var one = floatObj.multiply(rentPerMoneyf,leasef - 1);
    return toFixed(floatObj.subtract(rentMoneyf,one),2);
  }
  return ""
}

//计算买断尾款
export const calculateBuyoutMoney  = (data) => {
  if (checkNumber(data.totalPricesRate)&&checkNumber(data.websitePrice)&&checkNumber(data.rentRate)&&checkNumber(data.miniLease)&&checkNumber(data.buyoutBalancePayment)){
    var totalPricesRate = toFixed(parseFloat(data.totalPricesRate),2);//总价系数
    var websitePrice = toFixed(parseFloat(data.websitePrice),2);//官网价
    var rentRate = toFixed(parseFloat(data.rentRate),2);//租金系数
    var miniLease = toFixed(parseFloat(data.miniLease),2);//最低租期
    var buyoutBalancePayment = toFixed(parseFloat(data.buyoutBalancePayment),2);
    if (data.packageName.type == 1){
      var one = floatObj.multiply(totalPricesRate,websitePrice);
      var two = floatObj.subtract(1.00,rentRate)
      var three = floatObj.multiply(one,two)
      data.buyoutMoney = toFixed(three,2);
      // data.buyoutMoney = (totalPricesRate*websitePrice - (totalPricesRate*websitePrice*rentRate)),2);
      return data.buyoutMoney
    } else if (data.packageName.type == 2){
      var one = floatObj.multiply(totalPricesRate,websitePrice);
      var two = floatObj.subtract(1.00,rentRate)
      var three = floatObj.multiply(one,two)
      data.buyoutMoney = toFixed(three,2);
      // data.buyoutMoney = (totalPricesRate*websitePrice - (totalPricesRate*websitePrice*rentRate)),2);
      return data.buyoutMoney
    } else if (data.packageName.type == 3){
      var one = floatObj.multiply(totalPricesRate,websitePrice);
      var two = floatObj.subtract(one,buyoutBalancePayment)
      var three = floatObj.multiply(two,rentRate)
      var four = floatObj.divide(three,12.00)
      var five = floatObj.multiply(four,miniLease)
      var six = floatObj.subtract(one,five)
      data.buyoutMoney = toFixed(floatObj.add(six,buyoutBalancePayment),2);
      console.log("totalPricesRate:",totalPricesRate,"websitePrice:",websitePrice,"buyoutBalancePayment",buyoutBalancePayment,"six:",six,"miniLease:",miniLease)
      // data.buyoutMoney = (totalPricesRate*websitePrice-((totalPricesRate*websitePrice-buyoutBalancePayment)*rentRate/12*miniLease)+buyoutBalancePayment),2);
      return data.buyoutMoney
    }
  }
  return ""
}
//计算滞纳金
export const calculateLateFeeMoney = (data) => {
  if (checkNumber(data.totalPricesRate)&&checkNumber(data.websitePrice)&&checkNumber(data.rentRate)&&checkNumber(data.buyoutBalancePayment)&&checkNumber(data.lateFeeMoney)){
    var totalPricesRate = toFixed(parseFloat(data.totalPricesRate),2);
    var websitePrice = toFixed(parseFloat(data.websitePrice),2);
    var rentRate = toFixed(parseFloat(data.rentRate),2);
    var lateFeeMoney = toFixed(parseFloat(data.lateFeeMoney),2);
    var buyoutBalancePayment = toFixed(parseFloat(data.buyoutBalancePayment),2);
    if (data.packageName.type == 1){
      return toFixed((totalPricesRate*websitePrice*rentRate/12/30*lateFeeMoney),2);
    } else if (data.packageName.type == 2){
      return toFixed((totalPricesRate*websitePrice*rentRate/12/30*lateFeeMoney),2);
    } else if (data.packageName.type == 3){
      return toFixed(((totalPricesRate*websitePrice-buyoutBalancePayment)*rentRate/12/30*lateFeeMoney),2);
    }
  }
}

export const isVip = () => {
  return process.env.VUE_APP_VERSION == "vip"
}

//返回待付已付信息
export const calculateMoneyStats = (bills) => {
  var money= 0.0;//账单总金额
  var real_money= 0.0;//账单实际总金额
  var fact_pay_money = 0.0;//已付
  var reduction_money = 0.0;//减免金额
  var coupon_money = 0.0;//优惠券抵消金额
  var deposit_money = 0.0;//押金抵消
  var first_money = 0.0;//首期
  var real_pay = 0.0;//实付
  for (const bill of bills) {
      money = floatObj.add(money,parseFloat(bill.money?bill.money:0));
      fact_pay_money = floatObj.add(fact_pay_money,parseFloat((bill.status == 2|| bill.status == 3)?(bill.money?bill.money:0):0.0));
      reduction_money = floatObj.add(reduction_money,parseFloat(bill.reductionMoney?bill.reductionMoney:0));
      coupon_money = floatObj.add(coupon_money,parseFloat(bill.couponMoney?bill.couponMoney:0));
      deposit_money = floatObj.add(deposit_money,parseFloat(bill.depositMoney?bill.depositMoney:0));
      first_money = floatObj.add(first_money,parseFloat((bill.firstBill == 2|| bill.first)?(bill.money?bill.money:0):0.0));
      if (bill.type != 2)
        real_money = floatObj.add(real_money,parseFloat(bill.money?bill.money:0));
  }
  real_pay = floatObj.subtract(fact_pay_money,reduction_money);
  return {
    money:money,
    firstMoney:first_money,
    factPayMoney:fact_pay_money,
    reductionMoney:reduction_money,
    couponMoney:coupon_money,
    depositMoney:deposit_money,
    realPay:real_pay,
    realMoney:real_money,
  }
}

//生成订单
export const newOrderBills = (goodsInfo,goodsSombination,lease) => {
  //根据商品信息和套餐，生成订单
  // var lease;
  var totalPricesRate;//总价系数
  var rentMoney;//租金
  var rentPerMoney;//每一期租金
  var extraServiceId;//增值服务
  const bills = [];
  //添加押金

  const  data = Object.assign({totalPricesRate:goodsInfo.totalPricesRate},goodsSombination);
  const firstRentMoney = calculateFirstPerRentMoney(data,lease);

  const  money = calculatePerRentMoney(data);
  console.log("第一期租金：",money)
  for (let i = 1; i <= lease; i++) {
    var rentBill = {};
    rentBill.money = (i == 1?firstRentMoney:money);//租金
    rentBill.type = 5
    rentBill.typeName = "租金"
    rentBill.orderNumber = i;
    rentBill.first = false;
    bills.push(rentBill)
  }

  return bills;
}

//生成订单 高级版
export const newVipOrderBills = (goodsInfo,goodsSombination,lease) => {
  //根据商品信息和套餐，生成订单
  // var lease;
  var totalPricesRate;//总价系数
  var rentMoney;//租金
  var rentPerMoney;//每一期租金
  var extraServiceId;//增值服务
  const bills = [];
  //添加押金

  const  data = Object.assign({totalPricesRate:goodsInfo.totalPricesRate},goodsSombination);

  for (let i = 1; i <= lease; i++) {
    var rentBill = {};
    rentBill.money = calculateVipPerRentMoney(data,i);
    rentBill.type = 5
    rentBill.typeName = "租金"
    rentBill.orderNumber = i;
    rentBill.first = false;
    bills.push(rentBill)
  }

  return bills;
}

export const goodsPlanInfo = {
  defaultCycle : "2", //默认期数单位 1是天 2时月
  defaultTotalPricesRate : 1.5, //默认总价系数
  maxTotalPricesRate : 1.5, //默认总价系数
  billing_cycle_day : "7", //默认
  billing_cycle_month : "1", //默认
  miniIndex:function getMiniIndex(type,cycle,value){
    var data = defaultPlanInfo[type].miniLeaseList[cycle-1];
    for (const index in data) {
      if (data[index]==value){
        console.log(index)
        return index;
      }
    }
  }
}
