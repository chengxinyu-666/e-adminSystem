<template>
  <basic-container>
    <avue-form :option="option"
               v-model="form"
               ref="form">
    </avue-form>
  </basic-container>
</template>

<script>
  import {getDetail} from "@/api/client/clientauth";

  export default {
    props: ["clientId"],
    data() {
      return {
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
          detail: true,
          height: 'auto',
          calcHeight: 210,
          searchShow: true,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          labelWidth: 120,
          column: [
            {
              label: "姓名",
              prop: "name"
            },
            {
              label: "手机号",
              prop: "clientPhone",
              bind: "client.phone"
            },
            {
              label: "实名认证",
              prop: "clientIsAuth",
              bind: "client.isAuth",
              type: "select",
              search: true,
              dicData: [
                {
                  label: "未认证",
                  value: 0
                },
                {
                  label: "已认证",
                  value: 1
                }
              ],
            },
            {
              label: "人脸认证",
              prop: "clientFaceAuth",
              bind: "client.faceAuth",
              type: "select",
              search: true,
              dicData: [
                {
                  label: "未认证",
                  value: 0
                },
                {
                  label: "已认证",
                  value: 1
                }
              ],
            },
            {
              label: "性别",
              prop: "sex"
            },
            {
              label: "生日",
              prop: "birthday"
            },
            {
              label: "身份证",
              prop: "idCard"
            },
            {
              label: "到期时间",
              prop: "endDate"
            },
            {
              label: "身份证正面",
              prop: "idCardFrontUrl",
              type: 'upload',
              listType: 'picture-img',
            },
            {
              label: "身份证背面",
              prop: "idCardBackUrl",
              type: 'upload',
              listType: 'picture-img',
            },
          ]
        },
        data: []
      };
    },
    mounted() {
      this.onLoad();
    },
    methods: {
      onLoad(){
        getDetail(this.clientId).then(res => {
          this.form = res.data.data;

        });
      }
    },
    watch: {
      clientId: function () {
        this.onLoad();
      }
    }
  };
</script>

<style>
</style>
