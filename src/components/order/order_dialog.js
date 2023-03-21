/**
 * 订单统一弹框处理类
 */

import vue from '@/main'
import Vue from 'vue'
import {Loading} from 'element-ui';
import dialogNote from './dialog_note'
import dialogNoteList from './dialog_note_list'
import dialogrefuse from './dialog_order_refuse'
import dialogaddcollection from './dialog_add_collection'
import dialogcollection from './dialog_collection'
import dialogfirsttrial from './dialog_first_trial'
import dialogsecondtrial from './dialog_second_trial'
import dialogsmstemplate from './dialog_sms_template'
import dialogsetsalesman from './dialog_set_salesman'
import dialogorderupdate from './dialog_order_update'
import dialogorderreturn from './dialog_order_return'
import dialogorderbuyout from './dialog_order_buyout'
import dialogorderentryform from './dialog_entry_form'
import dialogorderexpress from './dialog_order_express'
import dialogsendconfirmation from './dialog_send_confirmation'
import dialogreceivegoods from './dialog_receive_goods'
import dialogorderreturnapprove from './dialog_order_return_approve'
import dialogviewvoucher from './dialog_view_voucher'
import {
  audit,
  auditBuyout,
  auditReturn,
  buyoutRefused,
  cancle,
  changeBt,
  received,
  returnRefused
} from "../../api/order/order";
import {update} from "../../api/express/sendgoods";
import {getList, overdueList, deductMoney} from "../../api/order/orderbill";
function getComponent(component){
  return  Vue.extend(component)
}


/**
 * 取消订单
 */
export const order_cancel = ({data,key,fn}) => {
  vue.$confirm('此操作将取消该订单，请确认是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    cancle(data.id).then(res => {
      vue.$message({
        type: 'success',
        message: '取消成功!'
      });
      if (fn)fn.end(key);
    }).catch(res => {
      if (fn)fn.end(key);
    });
  }).catch(() => {

  });
}
/**
 *
 * @param data
 * @param key
 * @param fn
 */
export const order_send_to = ({data,key,fn}) => {
  vue.$confirm('此操作标记该快递已经等待签收，24小时内未签收则自动收货。是否确认？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    update(data).then(res => {
      vue.$message({
        type: 'success',
        message: '操作成功!'
      });
      if (fn)fn.end(key);
    }).catch(res => {
      if (fn)fn.end(key);
    });
  }).catch(() => {

  });
}

/**
 *
 * @param data
 * @param key
 * @param fn
 */
export const order_receive = ({data,key,fn}) => {
  vue.$confirm('此操将立即确认收货。是否确认？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    received(data.orderId,data.clientId).then(res => {
      vue.$message({
        type: 'success',
        message: '操作成功!'
      });
      if (fn)fn.end(key);
    }).catch(res => {
      if (fn)fn.end(key);
    });
  }).catch(() => {

  });
}

/**
 * 拉黑客户
 */
export const shielding_user = ({data,key,fn}) => {
  vue.$confirm('拉黑用户会同时取消订单，你确定要拉黑这个用户吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    vue.$message({
      type: 'info',
      message: '放弃拉黑'
    });
  }).catch(() => {

  });
}

/**
 * 滞纳金减免
 * @param data
 * @param key
 * @param fn
 */
export const deduction = ({data,key,fn}) => {
  var type = data.openType;
  var hasBill = data.hasBill;
  let deductType;
  let voucherShow;
  if("online" === type){
    deductType = "线上";
    voucherShow = false;
  }else{
    deductType = "线下";
    voucherShow = true;
  }
  var id = data.id;
  //下拉方法
  var change = ({value,column}) => {
    if (value){
      let loadingInstance = Loading.service({ fullscreen: true });
      overdueList(id,value).then(res => {
        const list = res.data.data;
        var dialogData = vue.$DialogForm.$root.data;
        dialogData.noPayRentMoney = list[0].noPayRentMoney;
        dialogData.noPayOverdueMoney = list[0].noPayOverdueMoney;
        id = list[0].id;
        vue.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      }).catch(res => {
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      })
    }
  };
  var columns = [];
  const labelName = "需支付"+(data.typeName?data.typeName:"金额");
  vue.$DialogForm.show({
    title: deductType+'扣款',
    width: '50%',
    menuPosition:'right',
    data: data,
    ref:"deductDiglog",
    option: {
      submitText: '提交',
      span:24,
      labelWidth: 160,
      column: [   {
        label: "选择未付款的账单",
        prop: "name1",
        type: 'select',
        display: !hasBill,
        change:change,
        props: {
          label: 'typeName',
          desc: 'rentDesc',
          value: 'id'
        },
        dicUrl: '/api/blade-order/orderbill/overdueList?orderId='+data.id
      },{
        label: labelName,
        type:'title',
        prop: "noPayRentMoney",
        span:24,
      },{
        label: "需支付滞纳金",
        type:'title',
        prop: "noPayOverdueMoney",
        span:24,
      },
        {
          label: "减免滞纳金",
          prop: "reduction",
          rules: [{
            required: true,
            message: "请输入减免滞纳金",
            trigger: "blur"
          }],
        },
        {
          label: deductType+"收款",
          prop: "receipt",
          rules: [{
            required: true,
            message: "请输入收款金额",
            trigger: "blur"
          }]
        },
        {
          label: "收款方式",
          prop: "payType",
          type: "select",
          display: voucherShow,
          dicData: [
            {
              label: "银行转帐",
              value: 3
            },
            {
              label: "微信转帐",
              value: 4
            },
            {
              label: "支付宝转账",
              value: 5
            }
          ],
          rules: [{
            required: true,
            message: "请选择收款方式",
            trigger: "blur"
          }]
        },
        {
          label: "上传凭证",
          prop: "voucher",
          display: voucherShow,
          type: "upload",
          dataType: 'string',
          listType: 'picture-card',
          propsHttp: {
            home: vue.$store.state.common.cloudDomain,
            res: "data",
            url: 'name',
            name: 'originalName'
          },
          action: '/api/blade-resource/oss/endpoint/put-file',
          rules: [{
            required: true,
            message: "请上传凭证",
            trigger: "blur"
          }]
        }
      ]
    },
    beforeClose: (done) => {
      done()
    },
    callback:(form)=>{
      const formData = form.data;
      if (formData.reduction > formData.noPayOverdueMoney) {
        vue.$message.error("减免金额不能大于滞纳金");
        form.done()
        return;
      }
      if (formData.receipt > (formData.noPayOverdueMoney + formData.noPayRentMoney - formData.reduction)) {
        vue.$message.error("收款金额不能大于未支付金额");
        form.done()
        return;
      }
      if(formData.voucher.length == 0){
        delete formData.voucher;
      }
      const row ={
        billId: id,
        reduction: formData.reduction,
        receipt: formData.receipt,
        type: type,
        payType: formData.payType,
        voucher: formData.voucher
      }
      deductMoney(row).then(res => {
        vue.$message.success(res.data.msg);
        form.close()
        if (fn)fn.end(key);
      }).catch(res => {
        if (fn)fn.end(key);
      }).finally(res =>{
        form.done()
      });
    }
  })
}

/**
 * 审核同意
 */
export const order_check_pass = ({data,key,fn}) => {
  vue.$confirm('是否同意用户的申请？', '审核同意', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    audit(data.id).then(res => {
      vue.$message({
        type: 'success',
        message: '审核成功!'
      });
      if (fn)fn.end(key);
    }).catch(res => {
      if (fn)fn.end(key);
    });
  }).catch(() => {

  });
}


/**
 * 审核同意
 */
export const buyout_check = ({data,key,fn}) => {
  vue.$confirm('是否同意用户的申请？', '审核同意', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    auditBuyout(data.id).then(res => {
      vue.$message({
        type: 'success',
        message: '审核成功!'
      });
      if (fn)fn.end(key);
    }).catch(res => {
      if (fn)fn.end(key);
    });
  }).catch(() => {

  });
}

/**
 * 审核归还
 */
export const return_approve = ({data,key,fn}) => {
  var param = {
    component:getComponent(dialogorderreturnapprove),
    data:data,
    key:key,
    fn:fn
  }
  vue.$showPop(param)
}


/**
 * 审核同意
 */
export const return_check = ({data,key,fn}) => {
  vue.$confirm('是否同意用户的申请？', '审核同意', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    auditReturn(data.id).then(res => {
      vue.$message({
        type: 'success',
        message: '审核成功!'
      });
      if (fn)fn.end(key);
    }).catch(res => {
      if (fn)fn.end(key);
    });
  }).catch(() => {

  });
}

/**
 * 审核拒绝
 */
export const return_refused = ({data,key,fn}) => {
  vue.$confirm('拒绝用户的归还申请？', '是否拒绝', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    returnRefused(data.id).then(res => {
      vue.$message({
        type: 'success',
        message: '审核成功!'
      });
      if (fn)fn.end(key);
    }).catch(res => {
      if (fn)fn.end(key);
    });
  }).catch(() => {

  });
}

/**
 * 审核拒绝
 */
export const buyout_refused = ({data,key,fn}) => {
  vue.$confirm('拒绝用户的买断申请？', '是否拒绝', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    buyoutRefused(data.id).then(res => {
      vue.$message({
        type: 'success',
        message: '审核成功!'
      });
      if (fn)fn.end(key);
    }).catch(res => {
      if (fn)fn.end(key);
    });
  }).catch(() => {

  });
}

/**
 * 切换按钮
 */
export const change_bt = ({data,key,fn}) => {
  var title = "";
  if (data.status == 0){
    title = "关闭"
  }else{
    title = "打开"
  }
  if (data.typeId == 1){
    title = title + "续租"
  }
  if (data.typeId == 2){
    title = title + "买断"
  }
  if (data.typeId == 3){
    title = title + "归还"
  }
  vue.$confirm('是否确认'+title+'？', '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    changeBt(data.id,data.typeId,data.status).then(res => {
      vue.$message({
        type: 'success',
        message: '操作成功!'
      });
      if (fn)fn.end(key);
    }).catch(res => {
      if (fn)fn.end(key);
    });
  }).catch(() => {

  });
}


/**
 * 审核拒绝
 */
export const order_check_refuse = ({data,key,fn}) => {
  var param = {
    component:getComponent(dialogrefuse),
    data:data,
    key:key,
    fn:fn
  }
  vue.$showPop(param)
}

/**
 * 进件单
 */
export const order_entry_form = ({data,key,fn}) => {
  var param = {
    component:getComponent(dialogorderentryform),
    data:data,
    key:key,
    fn:fn
  }
  vue.$showPop(param)
}

/**
 * 短信发送
 */
export const order_sms_send = ({data,key,fn}) => {
  var param = {
    component:getComponent(dialogsmstemplate),
    data:data,
    key:key,
    fn:fn
  }
  vue.$showPop(param)
}


/**
 * 催款分配
 */
export const order_collection = ({data,key,fn}) => {
  var param = {
    component:getComponent(dialogcollection),
    data:data,
    key:key,
    fn:fn
  }
  vue.$showPop(param)
}

/**
 * 一审
 */
export const order_first_trial = ({data,key,fn}) => {
  var param = {
    component:getComponent(dialogfirsttrial),
    data:data,
    key:key,
    fn:fn
  }
  vue.$showPop(param)
}

/**
 * 二审
 */
export const order_second_trial = ({data,key,fn}) => {
  var param = {
    component:getComponent(dialogsecondtrial),
    data:data,
    key:key,
    fn:fn
  }
  vue.$showPop(param)
}


/**
 * 分配业务员
 */
export const order_set_salesman = ({data,key,fn}) => {
  var param = {
    component:getComponent(dialogsetsalesman),
    data:data,
    key:key,
    fn:fn
  }
  vue.$showPop(param)
}

/**
 * 分配业务员
 */
export const dialog_add_collection = ({data,key,fn}) => {
  var param = {
    component:getComponent(dialogaddcollection),
    data:data,
    key:key,
    fn:fn
  }
  vue.$showPop(param)
}


/**
 * 修改订单
 */
export const order_update = ({data,key,fn}) => {
  var param = {
    component:getComponent(dialogorderupdate),
    data:data,
    key:key,
    fn:fn
  }
  vue.$showPop(param)
}

/**
 * 归还结算
 */
export const order_return = ({data,key,fn}) => {
  var param = {
    component:getComponent(dialogorderreturn),
    data:data,
    key:key,
    fn:fn
  }
  vue.$showPop(param)
}

/**
 * 买断结算
 */
export const order_buyout = ({data,key,fn}) => {
  var param = {
    component:getComponent(dialogorderbuyout),
    data:data,
    key:key,
    fn:fn
  }
  vue.$showPop(param)
}

/**
 * 添加备注
 */
export const order_note = ({data,key,fn}) => {
  var param = {
    component:getComponent(dialogNote),
    data:data,
    key:key,
    fn:fn
    }
  vue.$showPop(param)
}

/**
 * 查看发货凭证
 */
export const view_voucher = ({data,key,fn}) => {
  var param = {
    component:getComponent(dialogviewvoucher),
    data:data,
    key:key,
    fn:fn
  }
  vue.$showPop(param)
}


/**
 * 添加备注
 */
export const order_note_list = ({data,key,fn}) => {
  var param = {
    component:getComponent(dialogNoteList),
    data:data,
    key:key,
    fn:fn
  }
  vue.$showPop(param)
}

/**
 * 物流单号
 */
export const order_express = ({data,key,fn}) => {
  var param = {
    component:getComponent(dialogorderexpress),
    data:data,
    key:key,
    fn:fn
  }
  vue.$showPop(param)
}

/**
 * 发货确认
 */
export const send_confirmation = ({data,key,fn}) => {
  var param = {
    component:getComponent(dialogsendconfirmation),
    data:data,
    key:key,
    fn:fn
  }
  vue.$showPop(param)
}

/**
 * 收确认
 */
export const receive_goods = ({data,key,fn}) => {
  var param = {
    component:getComponent(dialogreceivegoods),
    data:data,
    key:key,
    fn:fn
  }
  vue.$showPop(param)
}

/**
 * 上传凭证
 */
export const order_info = ({data,key,fn}) => {
  console.log(vue)
  vue.$showPop({
    component:getComponent(dialogNote),
    fn:fn,
    key:key,
    data:{seePicUrl:""
    }})
}

