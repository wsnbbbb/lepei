<template>
  <div>
    <van-swipe class="my-swipe" v-show="showLunbo" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(image, index) in imgs" :key="index">
         <img v-lazy="image" />
      </van-swipe-item>

    </van-swipe>
    <van-form validate-first @failed="onFailed" @submit="onSubmit">
      <van-field
        v-model="childName"
        name="childName"
        label="幼儿姓名"
        placeholder="请输入"
        maxlength="30"
        input-align="right"
        :rules="[{ required: true, message: '请填写姓名' }]"
      />
      <van-field
        readonly
        clickable
        name="sex"
        :value="value"
        label="性别"
        placeholder="请选择"
        input-align="right"
        @click="showPicker = true"
        :rules="[{ required: true, message: '请选择性别' }]"
      />
      <van-field
        readonly
        clickable
        name="birthday"
        :value="birthday"
        label="出生日期"
        placeholder="请选择"
        input-align="right"
        @click="showPicker1 = true"
        :rules="[{ required: true, message: '请选择出生日期' }]"
      />
      <van-field
        v-model="mobile"
        clearable
        maxlength="11"
        name="parentPhone"
        label="家长联系电话"
        placeholder="请填写"
        input-align="right"
        :rules="[{ required: true, message: '请填写电话号码' }]"
      />
      <van-field
        readonly
        clickable
        name="parentRelation"
        :value="parentRelation"
        label="关系"
        placeholder="请选择"
        input-align="right"
        :rules="[{ required: true, message: '请选择关系' }]"
        @click="showPicker2 = true"
      />
      <van-field
        readonly
        clickable
        name="visitWeek"
        :value="visitWeekStr"
        label="期望参观时间"
        placeholder="请选择"
        input-align="right"
        :rules="[{ required: true, message: '请选择参观时间' }]"
        @click="showPicker3 = true"
      />
    
      <van-field
        v-model="address"
        autosize
        name="address"
        rows="2"
        type="textarea"
        label="家庭住址"
        maxlength="500"
        placeholder="请填写"
        show-word-limit
        input-align="right"
        :rules="[{ required: true, message: '请填写家庭住址' }]"

      />

      <van-popup v-model="showPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="columns"
          @confirm="onConfirm"
          @cancel="showPicker = false"
        />
      </van-popup>

      <van-popup v-model="showPicker1" position="bottom">
         <van-datetime-picker
          v-model="currentDate"
          @confirm="onConfirm1"
          @cancel="showPicker1 = false"
          type="date"
          title="选择出生年月日"
          :min-date="minDate"
          :max-date="maxDate"
        />
      </van-popup>

      <van-popup v-model="showPicker2" position="bottom">
        <van-picker
          show-toolbar
          :columns="columns1"
          @confirm="onConfirm2"
          @cancel="showPicker2 = false"
        />
      </van-popup>
      <van-popup v-model="showPicker3" position="bottom">
        <van-picker
          show-toolbar
          :columns="columns2"
          @confirm="onConfirm3"
          @cancel="showPicker3 = false"
        />
      </van-popup>

      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>


import { getConfigs, consultApply } from '../api/request'
import {Decrypt} from '../util/secret'
import {getFormatDate, getQueryString} from '../util/util'
    export default {
        data(){
            return {
              uid:'',
              token:'',
              school:'',
              name:'',
              mobile:'',
              value: '',
              columns: [
                {
                  value: 1,
                  text: '男'
                },
                 {
                  value: 2,
                  text: '女'
                }
              ],
              columns1: ['父亲','母亲','爷爷','奶奶','其他'],
              columns2: [{
                value: 1,
                text: '工作日(周一)'
              },{
                value: 2,
                text: '工作日(周二)'
              },{
                value: 3,
                text: '工作日(周三)'
              },{
                value: 4,
                text: '工作日(周四)'
              },{
                value: 5,
                text: '工作日(周五)'
              },{
                value: 6,
                text: '休息日(周六)'
              },{
                value: 7,
                text: '休息日(周日)'
              }],

              showPicker: false,
              showPicker1: false,
              showPicker2: false,
              showPicker3: false,
              minDate: new Date(2010, 0, 1),
              maxDate: new Date(),
              currentDate: new Date(2015, 0, 1),
              birthday: '',
              parentRelation: '',
              visitWeek: '',
              visitWeekStr: '',
              address:'',
              imgs: [],
              childName: '',
              showLunbo: false
            }
        },
      
        methods:{

        async getConfigs() {
              let res = await getConfigs({"schoolId": Decrypt(this.$route.params.id)})
              console.log(res)
              if(res.success){
                this.imgs = res.detail.imgs
                this.columns2 = this.columns2.filter(i=>{
                  return res.detail.openWeeks.includes(i.value)
                })
                if(res.detail.imgs.length > 0){
                  this.showLunbo = true
                }                
              }else{

                  // Toast.fail(res.description);

              }
          },

          onConfirm(item) {
            this.value = item.text;
            this.sex = item.value;
            this.showPicker = false;
          },
          onConfirm1(item) {
            this.birthday = getFormatDate(item)
            this.showPicker1 = false;
          },
          onConfirm2(item) {
            this.parentRelation = item
            this.showPicker2 = false;
          },
          onConfirm3(item) {
            this.visitWeek = item.value
            this.visitWeekStr = item.text
            this.showPicker3 = false;
          },
           onFailed(errorInfo) {
          },
          onSubmit(value) {
            let reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
            if(!reg.test(this.mobile)){
              return  this.$toast("请输入正确格式的手机号码");
            }

            let params = {
              "schoolId": Decrypt(this.$route.params.id),
              "childName": this.childName,
              "sex": this.sex,
              "birthday": value.birthday,
              "parentPhone": value.parentPhone,
              "parentRelation": value.parentRelation,
              "visitWeek": this.visitWeek,
              "address": value.address,
            }
            consultApply(params).then(res =>{
              if(res.success){
                this.$toast("提交成功")
                setTimeout(() =>{
                  this.$router.push({path:"/success"})
                },1000)
              }else{
                this.$toast.fail(res.description)
              }
            })
            
          }
        },
        mounted() { 
          this.getConfigs()
        } 

    }
</script>

<style lang="less" scoped>
    .my-swipe .van-swipe-item {
      height: 200px!important;
      text-align: center;
      width:100%;
      background-color: #39a9ed;
    }
    .van-swipe-item{
      img{
        height: 100%;
        width:100%;
      }
    }
    
</style>