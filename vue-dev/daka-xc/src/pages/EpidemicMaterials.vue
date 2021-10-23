<template>
  <div class="materials-detail">
    <van-notice-bar text="系统提示：本表所有内容都为必填项，无实际物资请填写“0”，抗疫物资为消耗性产品，物资数量发生变更时，请及时更新本表内容" left-icon="volume-o" />
    <van-field
      class="school"
      disabled
      :value="school"
      label="所属学校"
      input-align="right"
    />
    <div class="hintTitle bgColor1">基础信息</div>
    <van-field
      v-model="teacherNum"
      clearable
      name="teacherNum"
      label="教职工总人数"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <van-field
      v-model="studentNum"
      clearable
      name="studentNum"
      label="学生总人数"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <van-field
      v-model="classNum"
      clearable
      name="教学班个数"
      label="教学班个数"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <div class="hintTitle bgColor2">基础物资</div>
    <p class="pd10">体温安检门<span class="ftColor">（建议标准：小于800人配一个，大于800人配2个）</span></p>
    <van-field
      v-model="hasTemperatureSecurityDoorNum"
      clearable
      name="hasTemperatureSecurityDoorNum"
      label="现有数量（个）"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <van-field
      v-model="needTemperatureSecurityDoorNum"
      clearable
      name="needTemperatureSecurityDoorNum"
      label="需求数量（个）"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <p class="pd10">额温枪<span class="ftColor">（建议标准：每班1支，校门配备不少于5支）</span></p>
    <van-field
      v-model="hasForeheadThermometerNum"
      clearable
      name="hasForeheadThermometerNum"
      label="现有数量（支）"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <van-field
      v-model="needForeheadThermometerNum"
      clearable
      name="needForeheadThermometerNum"
      label="需求数量（支）"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <p class="pd10">口罩<span class="ftColor">（建议标准：每位师生员工储备1-2个，重点人员储备5个）</span></p>
    <van-field
      v-model="hasMaskNum"
      clearable
      name="hasMaskNum"
      label="现有数量（个）"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <van-field
      v-model="needMaskNum"
      clearable
      name="needMaskNum"
      label="需求数量（个）"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <p class="pd10">空气消毒<span class="ftColor">（建议标准：储备5天用量过氧化氢或二氧化氯）</span></p>
    <van-field
      v-model="hasAirDisinfectionNum"
      clearable
      name="hasAirDisinfectionNum"
      label="现有数量（升）"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <van-field
      v-model="needAirDisinfectionNum"
      clearable
      name="needAirDisinfectionNum"
      label="需求数量（升）"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <p class="pd10">物体表面消毒<span class="ftColor">（建议标准：储备14天用量消毒片，根据100片/瓶规格填报）</span></p>
    <van-field
      v-model="hasObjectDisinfectionNum"
      clearable
      name="hasObjectDisinfectionNum"
      label="现有数量（瓶）"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <van-field
      v-model="needObjectDisinfectionNum"
      clearable
      name="needObjectDisinfectionNum"
      label="需求数量（瓶）"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <p class="pd10">临时隔离场所设置<span class="ftColor">（建议标准：设计1处）</span></p>
    <van-field
      v-model="hasTemporaryIsolationPlaceNum"
      clearable
      name="hasTemporaryIsolationPlaceNum"
      label="现有数量（处）"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <van-field
      v-model="needTemporaryIsolationPlaceNum"
      clearable
      name="needTemporaryIsolationPlaceNum"
      label="需求数量（处）"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <div class="hintTitle bgColor2">隔离场所物资</div>
    <p class="ftColor pd10">临时隔离场所物资为专物专用，请不要和基础物资一同填报</p>
    <p class="pd10">体温计<span class="ftColor">（建议标准：适量）</span></p>
    <van-field
      v-model="hasThermometerNum"
      clearable
      name="hasThermometerNum"
      label="现有数量（只）"
      placeholder="请填写"
      type="number"
      input-align="right"
    /> 
    <van-field
      v-model="needThermometerNum"
      clearable
      name="needThermometerNum"
      label="需求数量（只）"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <p class="pd10">一次性手套<span class="ftColor">（建议标准：100副）</span></p>
    <van-field
      v-model="hasDisposableGlovesNum"
      clearable
      name="hasDisposableGlovesNum"
      label="现有数量（副）"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <van-field
      v-model="needDisposableGlovesNum"
      clearable
      name="needDisposableGlovesNum"
      label="需求数量（副）"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <p class="pd10">一次性口罩<span class="ftColor">（建议标准：100个）</span></p>
    <van-field
      v-model="hasDisposableFaceMaskNum"
      clearable
      name="hasDisposableFaceMaskNum"
      label="现有数量（个）"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <van-field
      v-model="needDisposableFaceMaskNum"
      clearable
      name="needDisposableFaceMaskNum"
      label="需求数量（个）"
      placeholder="请填写"
      type="number"
      input-align="right"
    />
    <div class="hintTitle bgColor2">联系人信息</div>
    <van-field
      v-model="name"
      clearable
      name="name"
      label="填报联系人姓名"
      placeholder="请填写"
      input-align="right"
    />
    <van-field
      v-model="mobile"
      clearable
      name="mobile"
      label="电话"
      placeholder="请填写"
      type="number"
      maxlength="11"
      input-align="right"
    />
    <div style="margin: 30px;">
      <van-button round block type="info" native-type="submit" @click="save">提交</van-button>
    </div>
  
  
  </div>
</template>

<script>
import {materialsDetail,setMaterials  } from '../api/request'
import {isPositiveInteger} from '../util/util'
import { Toast } from 'vant';
  export default {
    data(){
      return {
        uid:'',
        token:'', 
        school:'', 
        teacherNum:'', 
        studentNum:'', 
        classNum:'', 
        hasTemperatureSecurityDoorNum:'', 
        needTemperatureSecurityDoorNum:'', 
        hasForeheadThermometerNum:'', 
        needForeheadThermometerNum:'', 
        hasMaskNum:'', 
        needMaskNum:'', 
        hasAirDisinfectionNum:'', 
        needAirDisinfectionNum:'', 
        hasObjectDisinfectionNum:'', 
        needObjectDisinfectionNum:'', 
        hasTemporaryIsolationPlaceNum:'', 
        needTemporaryIsolationPlaceNum:'', 
        hasThermometerNum:'', 
        needThermometerNum:'', 
        hasDisposableGlovesNum:'', 
        needDisposableGlovesNum:'', 
        hasDisposableFaceMaskNum:'', 
        needDisposableFaceMaskNum:'', 
        name:'', 
        mobile:'', 
      }
    },
    async created() {
      let data = JSON.parse(localStorage.getItem("userInfo"))
      if(data){
        this.uid = data.uid;
        this.token = data.token;
        this.school = data.schoolName
      }
     
    },
    methods:{
      async save() {
        if(!isPositiveInteger(this.studentNum) || !isPositiveInteger(this.classNum) || !isPositiveInteger(this.teacherNum)){
          Toast.fail('请正确填写完基础信息');
          return
        }
        if(!isPositiveInteger(this.hasTemperatureSecurityDoorNum) || !isPositiveInteger(this.needTemperatureSecurityDoorNum)){
          Toast.fail('请正确填写完安检门数量');
          return
        }
        if(!isPositiveInteger(this.hasForeheadThermometerNum) || !isPositiveInteger(this.needForeheadThermometerNum)){
          Toast.fail('请正确填写完额温枪数量');
          return
        }
        if(!isPositiveInteger(this.hasMaskNum) || !isPositiveInteger(this.needMaskNum)){
          Toast.fail('请正确填写完口罩数量');
          return
        }
        if(!isPositiveInteger(this.hasAirDisinfectionNum) || !isPositiveInteger(this.needAirDisinfectionNum)){
          Toast.fail('请正确填写完空气消毒数量');
          return
        }
        if(!isPositiveInteger(this.hasObjectDisinfectionNum) || !isPositiveInteger(this.needObjectDisinfectionNum)){
          Toast.fail('请正确填写完物体表面消毒数量');
          return
        }
        if(!isPositiveInteger(this.hasTemporaryIsolationPlaceNum) || !isPositiveInteger(this.needTemporaryIsolationPlaceNum)){
          Toast.fail('请正确填写完临时隔离场所数量');
          return
        }
        if(!isPositiveInteger(this.hasThermometerNum) || !isPositiveInteger(this.needThermometerNum) || 
        !isPositiveInteger(this.hasDisposableGlovesNum) || !isPositiveInteger(this.needDisposableGlovesNum) || 
        !isPositiveInteger(this.hasDisposableFaceMaskNum) || !isPositiveInteger(this.needDisposableFaceMaskNum)){
          Toast.fail('请正确填写完隔离场所物资数量');
          return
        }
        if(this.name == ''){
          Toast.fail('联系人姓名不能为空');
          return
        }
        if(this.mobile == ''){
          Toast.fail('电话不能为空');
          return
        }
        let params = {
          uid:this.uid,
          token:this.token, 
          teacherNum:this.teacherNum, 
          studentNum:this.studentNum, 
          classNum:this.classNum, 
          hasTemperatureSecurityDoorNum:this.hasTemperatureSecurityDoorNum, 
          needTemperatureSecurityDoorNum:this.needTemperatureSecurityDoorNum, 
          hasForeheadThermometerNum:this.hasForeheadThermometerNum, 
          needForeheadThermometerNum:this.needForeheadThermometerNum, 
          hasMaskNum:this.hasMaskNum, 
          needMaskNum:this.needMaskNum, 
          hasAirDisinfectionNum:this.hasAirDisinfectionNum, 
          needAirDisinfectionNum:this.needAirDisinfectionNum, 
          hasObjectDisinfectionNum:this.hasObjectDisinfectionNum, 
          needObjectDisinfectionNum:this.needObjectDisinfectionNum, 
          hasTemporaryIsolationPlaceNum:this.hasTemporaryIsolationPlaceNum, 
          needTemporaryIsolationPlaceNum:this.needTemporaryIsolationPlaceNum, 
          hasThermometerNum:this.hasThermometerNum, 
          needThermometerNum:this.needThermometerNum, 
          hasDisposableGlovesNum:this.hasDisposableGlovesNum, 
          needDisposableGlovesNum:this.needDisposableGlovesNum, 
          hasDisposableFaceMaskNum:this.hasDisposableFaceMaskNum, 
          needDisposableFaceMaskNum:this.needDisposableFaceMaskNum, 
          name:this.name, 
          mobile:this.mobile, 
        }
        let res = await setMaterials(params)
        if(res.success){
          Toast.success('提交成功');
          setTimeout(() =>{
              this.$router.go(-1)
          },1000)
        }else{
          Toast.fail(res.description);
        }

      },
      materialsDetail () {
        let params = {
          "uid":this.uid,
          "token":this.token,
        }
        materialsDetail(params).then(res =>{
          if(res.success){
            this.name = res.detail.name
            this.mobile = res.detail.mobile
            this.teacherNum = res.detail.teacherNum
            this.studentNum = res.detail.studentNum
            this.classNum = res.detail.classNum
            this.hasTemperatureSecurityDoorNum = res.detail.hasTemperatureSecurityDoorNum
            this.needTemperatureSecurityDoorNum = res.detail.needTemperatureSecurityDoorNum
            this.hasForeheadThermometerNum = res.detail.hasForeheadThermometerNum
            this.needForeheadThermometerNum = res.detail.needForeheadThermometerNum
            this.hasMaskNum = res.detail.hasMaskNum
            this.needMaskNum = res.detail.needMaskNum
            this.hasAirDisinfectionNum = res.detail.hasAirDisinfectionNum
            this.needAirDisinfectionNum = res.detail.needAirDisinfectionNum
            this.hasObjectDisinfectionNum = res.detail.hasObjectDisinfectionNum
            this.needObjectDisinfectionNum = res.detail.needObjectDisinfectionNum
            this.hasTemporaryIsolationPlaceNum = res.detail.hasTemporaryIsolationPlaceNum
            this.needTemporaryIsolationPlaceNum = res.detail.needTemporaryIsolationPlaceNum
            this.hasThermometerNum = res.detail.hasThermometerNum
            this.needThermometerNum = res.detail.needThermometerNum
            this.hasDisposableGlovesNum = res.detail.hasDisposableGlovesNum
            this.needDisposableGlovesNum = res.detail.needDisposableGlovesNum
            this.hasDisposableFaceMaskNum = res.detail.hasDisposableFaceMaskNum
            this.needDisposableFaceMaskNum = res.detail.needDisposableFaceMaskNum
          }
        })
      }
     
    },
    mounted() { 
      let isFill = localStorage.getItem("isFill")
      if(isFill != undefined){
        this.materialsDetail()
      }
    } 

  }
</script>

<style lang="less">
.materials-detail{
  font-size: 14px;
  .pd10{
    padding:15px 10px 10px 10px;
  }
  .ftColor{
    color: red;
  }
  .school{
    background-color: #f8f8f8;
    margin:10px 0;
  }
  .hintTitle{
    height:2.1875rem;
    line-height:2.1875rem;
    text-align: center;
    color:#fff;
    margin:10px 0;
  }
  .bgColor1{
    width:6.25rem;
    background-color: #F07930;
  }
  .bgColor2{
    width:6.25rem;
    background-color: #00CA42;
  }
  .van-field__label{
    width:100px;
  }
  
 
}

</style>