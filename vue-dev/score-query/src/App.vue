<template>
  <div id="app">
        <img src="./assets/bg.png">
        <el-form :inline="true" :model="formInline" :rules="rules" ref="ruleForm" class="form">
          <el-form-item label="姓名"  prop="userName">
            <el-input v-model="formInline.userName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="中考报名号" prop="number" class="item2">
            <el-input v-model="formInline.number" placeholder="请输入中考报名号"></el-input>
          </el-form-item>
          <el-form-item class="item3">
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="tabel-box">
          <table class="table" border="1" cellspacing="0" cellpadding="0">
            <tr>
              <th v-for="(item, index) in formData" :key="index">{{item.subjectName}}</th>
            </tr>
            <tr>
              <td v-for="(item, index) in formData" :key="index">{{item.val}}</td>
            </tr>
          </table>
        </div>
  </div>
</template>

<script>
import axios from "axios";
const config = require("./config")
export default {
  data() {
    return {
      formInline: {
          userName: '',
          number: ''
      },
      formData:[],
      rules: {
          userName: [
            { required: true, message: '请输入姓名', trigger: 'change' },
          ],
          number: [
            { required: true, message: '请输入中考报名号', trigger: 'change' }
          ]
      },
      
    }
  },
  methods: {
    onSubmit() {
        console.log('submit!');
        this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            this.formData = []
            this.getData();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    getData() {
        let params={
          schoolId: config.schoolId,
          code: this.formInline.number,
          name: this.formInline.userName,
        }
        axios.post(config.baseUrl + '/web/person/achievement', params).then(response => {
            console.log(response.data);
            if(response.data.success){
              if(response.data.detail.list.length==0){
                this.$message.error("未查询到相关数据，请核对考生姓名和中考报名号！")
                return
              }
              //  this.formData = [{subjectName: "姓名",val: this.formInline.userName}, {subjectName: "中考报名号",val: this.formInline.number},...response.data.detail.list]
              
              this.formData = [...response.data.detail.list]
              this.$refs["ruleForm"].resetFields();
            }else{
              // this.$refs["ruleForm"].resetFields();
              this.$message.error(response.data.description);
            }
        }, response => {
            console.log("error");
        });
    },
   
  }
}
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
  width: 700px;
  margin: 0 auto;
}
.form{
  padding-top: 20px;
  text-align: left;
}
.item2{
  margin-left: 40px;
}
.item3{
  margin-left: 40px;
}
.el-table__body tbody{
  text-align: left;
}
.table th,.table td{
  padding: 5px;
}
table{
  border-collapse:collapse;
  white-space: nowrap;
}
.tabel-box{
  width: 100%;
  overflow: auto;
}
</style>
