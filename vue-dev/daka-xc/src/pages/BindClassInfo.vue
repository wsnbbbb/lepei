<template>
  <div class="bind-class-info">
    <van-field
      label="学业阶段" 
      clickable
      v-model="gradeType"
      is-link
      disabled
      placeholder="请选择"
      input-align="right"
      @click="showTypePicker = true"
    />
   <van-cell class="grade" title="年级" label="例：2017年入学，则选择2017级，以入学年份为准">
    <van-field
      clickable
      :value="grade"
      is-link
      disabled
      placeholder="请选择"
      input-align="right"
       @click="showGradePicker = true"
    />
    </van-cell>
    <van-field
      clickable
      name="picker"
      :value="className"
      label="班级"
      placeholder="请选择"
      input-align="right"
      is-link
      disabled
      @click="showClassPicker = true"
    />
    <div class="btn-box" >
      <van-button round type="info" block @click="save">保存</van-button>
    </div>
     <van-popup v-model="showTypePicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="arr1"
          @confirm="onConfirmGradeType"
          @cancel="showTypePicker = false"
        />
      </van-popup>
      <van-popup v-model="showGradePicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="arr2"
          @confirm="onConfirmGrade"
          @cancel="showGradePicker = false"
        />
      </van-popup>
      <van-popup v-model="showClassPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="arr3"
          @confirm="onConfirmClass"
          @cancel="showClassPicker = false"
        />
      </van-popup>


  </div>
  
</template>

<script>
import { dirverList , getGradeClass, bindClass} from '../api/request'
import { stringCheck} from '../util/util'
import { Toast } from 'vant';
  export default {
    data(){
      return {
        gradeType:'',
        showTypePicker: false,
        showGradePicker: false,
        showClassPicker: false,
        grade: '',
        className: '',
        arr1:[],
        arr2:[],
        arr3:[],
        grades: [],
        classes: [],
        classId: ''
      }
    },
    async created() {
        let data = JSON.parse(localStorage.getItem("detailList"))
        if(data){
          this.personId = data.personId;
          this.token = data.token;
        }
        let params = {
           "personId": this.personId,
           "token":this.token,
        }
        let res = await getGradeClass(params)
          if(res.success){
            let gradeTypes = []
            res.detail.gradeTypes.map(item=>{
              gradeTypes.push({
                keyId: item.gradeType,
                text: item.name
              })
            })
            this.arr1 = gradeTypes

            this.grades = res.detail.grades
            this.classes = res.detail.classes
          }else{

            Toast.fail(res.description);
            this.finished = true;
          }


    },
    methods:{
      onConfirmGradeType(value){

          this.gradeType = value.text;
          this.showTypePicker = false
  
          let arr2 = []
          this.grades.map(item=>{
            if(item.gradeType == value.keyId){
              arr2.push({
                keyId: item.gradeId,
                text: item.name
              })
            }
          })

        this.arr2 = arr2

        this.grade = ''
        this.className = ''
        this.classId = ''

      },
      onConfirmGrade(value){
          this.grade = value.text;
          this.showGradePicker = false
         let arr3 = []
          this.classes.map(item=>{
            if(item.gradeId == value.keyId){
              arr3.push({
                keyId: item.classId,
                text: item.name
              })
            }
          })
          this.arr3 = arr3
          this.className = ''
          this.classId = ''
      },
      onConfirmClass(value){
   
          this.className = value.text
          this.showClassPicker = false
          this.classId = value.keyId
      },
  
      async save() {
          if(stringCheck(this.classId)){
                Toast('请选择具体的班级');
                return
            }
          let params = {
           "personId": this.personId,
           "token":this.token,
           "classId": this.classId
          }
        let res = await bindClass(params)
          if(res.success){
            Toast('绑定成功');
            setTimeout(() => {
              window.history.go(-1)
            }, 2000);
          }else{

            Toast.fail(res.description);
            this.finished = true;
          }
      }
      
    },

  }
</script>

<style lang="less">
.bind-class-info{
  .grade{
    .van-cell__title{
      .van-cell__label{
        width:12.5rem;
      }
    }
    .van-cell__value{
      .van-cell--clickable{
        padding-right: 0;
      }
    }
  }
  .btn-box{
    width:100%;
    margin-top: 1.875rem;
    button{
      width:80%;
      margin:0 auto;
    }
  }
 
}
</style>