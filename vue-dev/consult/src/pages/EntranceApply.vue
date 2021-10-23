<template>
  <div>
    <van-nav-bar title="入学申请"  left-text="返回" @click-left="onClickLeft" left-arrow />
    <van-collapse v-model="activeNames" class="collapse">
      <van-collapse-item name="1" class='collapse-item'>
        <template #title>
          <div class="title">
            <span>基础资料</span>
            <span class="english">Basic information</span>
          </div>
        </template>
        <van-form>
          <van-field
            v-model="detail.childName"
            name="childName"
            placeholder="请输入"
            input-align="right"
            maxlength="30"
            required
            :rules="[{ required: true, message: '请填写幼儿姓名' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">幼儿姓名</span>
                <span class="english lable-eg">Child's Name</span>
              </div>
            </template>
          </van-field>
          <van-field
            v-model="detail.nickName"
            name="nickName"
            placeholder="请输入"
            input-align="right"
            maxlength="30"
            required
            :rules="[{ required: true, message: '请填写昵称/英文名' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">昵称/英文名</span>
                <span class="english lable-eg">Nick Name/English Name</span>
              </div>
            </template>
          </van-field>
          <van-field
            readonly
            clickable
            name="sex"
            :value="detail.sex == 1 ? '男' : detail.sex == 2 ? '女' : ''"
            placeholder="请选择"
            input-align="right"
            @click="showPicker = true"
            required
            :rules="[{ required: true, message: '请选择性别' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">性别</span>
                <span class="english lable-eg">Gender</span>
              </div>
            </template>
          </van-field>
          <van-field
            readonly
            clickable
            name="birthday"
            :value="detail.birthday"
            placeholder="请选择"
            input-align="right"
            @click="showPicker1 = true"
            required
            :rules="[{ required: true, message: '请选择出生日期' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">出生日期</span>
                <span class="english lable-eg">Date of Birth</span>
              </div>
            </template>
          </van-field>
          <van-field
            v-model="detail.nationality"
            name="nationality"
            placeholder="请输入"
            input-align="right"
            maxlength="30"
            required
            :rules="[{ required: true, message: '请填写国籍' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">国籍</span>
                <span class="english lable-eg">Nationality</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.motherTongue"
            name="motherTongue"
            placeholder="请输入"
            input-align="right"
            maxlength="30"
            required
            :rules="[{ required: true, message: '请填写母语' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">母语</span>
                <span class="english lable-eg">Mother Tongue</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.homeAddress"
            autosize
            name="homeAddress"
            rows="2"
            type="textarea"
            maxlength="500"
            placeholder="请输入"
            show-word-limit
            input-align="right"
            required
            :rules="[{ required: true, message: '请填写家庭住址' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">家庭住址</span>
                <span class="english lable-eg">Address</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.idCardNo"
            name="idCardNo"
            placeholder="请输入"
            input-align="right"
            maxlength="18"
            required
            :rules="[{ required: true, message: '请填写身份证或护照号码' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">身份证或护照号码</span>
                <span class="english lable-eg">ID/Passport Number</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.contactPhone"
            name="contactPhone"
            placeholder="请输入"
            input-align="right"
            maxlength="11"
            type="number"
            required
            :rules="[{ required: true, message: '请填写联系电话' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">联系电话</span>
                <span class="english lable-eg">Telephone Number</span>
              </div>
            </template>
          </van-field>

          <van-field
            readonly
            clickable
            name="householdRegisterType"
            :value="detail.householdRegisterType==1?'本市户籍':detail.householdRegisterType==2?'非本市户籍':''"
            placeholder="请选择"
            input-align="right"
            @click="showPicker10 = true"
            required
            :rules="[{ required: true, message: '请选择户籍类型' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">户籍类型</span>
                <span class="english lable-eg">Registered residence type</span>
              </div>
            </template>
          </van-field>
        

          <van-field
            v-if="detail.householdRegisterType==2"
            v-model="detail.residencePermitNo"
            name="residencePermitNo"
            placeholder="请输入"
            input-align="right"
            maxlength="30"
            required
            :rules="[{ required: true, message: '请填写居住证号码' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">居住证号码（含临时）</span>
                <span class="english lable-eg">Residence permit number</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.householdRegisterAddress"
            autosize
            name="householdRegisterAddress"
            rows="2"
            type="textarea"
            maxlength="500"
            placeholder="请输入"
            show-word-limit
            input-align="right"
            required
            :rules="[{ required: true, message: '请填写户籍住址' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">户籍住址</span>
                <span class="english lable-eg">Permanent address</span>
              </div>
            </template>
          </van-field>

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

          <van-popup v-model="showPicker10" position="bottom">
            <van-picker
              show-toolbar
              :columns="columns4"
              @confirm="onConfirm10"
              @cancel="showPicker10 = false"
            />
          </van-popup>
        </van-form>
      </van-collapse-item>
      <van-collapse-item name="2" class='collapse-item'>
        <template #title>
          <div class="title">
            <span>父亲</span>
            <span class="english">Father/Guardian</span>
          </div>
        </template>
        <van-form>
          <van-field
            v-model="detail.fatherInfo.name"
            name="name"
            placeholder="请输入"
            input-align="right"
            maxlength="30"
            required
            :rules="[{ required: true, message: '请填写姓名' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">姓名</span>
                <span class="english lable-eg">Name</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.fatherInfo.nationality"
            name="nationality"
            placeholder="请输入"
            input-align="right"
            maxlength="30"
            required
            :rules="[{ required: true, message: '请填写国籍' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">国籍</span>
                <span class="english lable-eg">Nationality</span>
              </div>
            </template>
          </van-field>

          <van-field
            readonly
            clickable
            name="birthday"
            :value="detail.fatherInfo.birthday"
            placeholder="请选择"
            input-align="right"
            @click="showPicker2 = true"
            required
            :rules="[{ required: true, message: '请选择出生日期' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">出生日期</span>
                <span class="english lable-eg">Date of Birth</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.fatherInfo.phone"
            name="phone"
            placeholder="请输入"
            input-align="right"
            maxlength="11"
            type="number"
            required
            :rules="[{ required: true, message: '请填写联系电话' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">联系电话</span>
                <span class="english lable-eg">Mobile Phone</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.fatherInfo.motherTongue"
            name="motherTongue"
            placeholder="请输入"
            input-align="right"
            maxlength="30"
            required
            :rules="[{ required: true, message: '请填写母语' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">母语</span>
                <span class="english lable-eg">Mother Tongue</span>
              </div>
            </template>
          </van-field>

          <van-field
            readonly
            clickable
            name="homeLanguage"
            :value="detail.fatherInfo.homeLanguage"
            placeholder="请选择"
            input-align="right"
            @click="showPicker3 = true"
            required
            :rules="[{ required: true, message: '请选择语种' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">在家惯用语种</span>
                <span class="english lable-eg">Language Spoken at Home</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.fatherInfo.email"
            name="email"
            placeholder="请输入"
            input-align="right"
            maxlength="30"
            required
            :rules="[{ required: true, message: '请填写电子邮箱' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">电子邮箱</span>
                <span class="english lable-eg">Email Address</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.fatherInfo.idCardNo"
            name="idCardNo"
            placeholder="请输入"
            input-align="right"
            maxlength="18"
            required
            :rules="[{ required: true, message: '请填写身份证号' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">身份证号</span>
                <span class="english lable-eg">ID/Passport Number</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.fatherInfo.currentWork"
            autosize
            name="currentWork"
            rows="2"
            type="textarea"
            maxlength="500"
            placeholder="请输入"
            show-word-limit
            input-align="right"
            required
            :rules="[{ required: true, message: '请填写在职单位与职位' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">在职单位与职位</span>
                <span class="english lable-eg">Current Work and Position</span>
              </div>
            </template>
          </van-field>

          <van-popup v-model="showPicker2" position="bottom">
            <van-datetime-picker
              v-model="currentDate1"
              @confirm="onConfirm2"
              @cancel="showPicker2 = false"
              type="date"
              title="选择出生年月日"
              :min-date="minDate1"
              :max-date="maxDate"
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
        </van-form>
      </van-collapse-item>
      <van-collapse-item name="3" class='collapse-item'>
        <template #title>
          <div class="title">
            <span>母亲</span>
            <span class="english">Mather/Guardian</span>
          </div>
        </template>
        <van-form validate-first @failed="onFailed">
          <van-field
            v-model="detail.motherInfo.name"
            name="name"
            placeholder="请输入"
            input-align="right"
            maxlength="30"
            required
            :rules="[{ required: true, message: '请填写姓名' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">姓名</span>
                <span class="english lable-eg">Name</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.motherInfo.nationality"
            name="nationality"
            placeholder="请输入"
            input-align="right"
            maxlength="30"
            required
            :rules="[{ required: true, message: '请填写国籍' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">国籍</span>
                <span class="english lable-eg">Nationality</span>
              </div>
            </template>
          </van-field>

          <van-field
            readonly
            clickable
            name="birthday"
            :value="detail.motherInfo.birthday"
            placeholder="请选择"
            input-align="right"
            @click="showPicker4 = true"
            required
            :rules="[{ required: true, message: '请选择出生日期' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">出生日期</span>
                <span class="english lable-eg">Date of Birth</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.motherInfo.phone"
            name="nationality"
            placeholder="请输入"
            input-align="right"
            maxlength="11"
            type="number"
            required
            :rules="[{ required: true, message: '请填写联系电话' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">联系电话</span>
                <span class="english lable-eg">Mobile Phone</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.motherInfo.motherTongue"
            name="motherTongue"
            placeholder="请输入"
            input-align="right"
            maxlength="30"
            required
            :rules="[{ required: true, message: '请填写母语' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">母语</span>
                <span class="english lable-eg">Mother Tongue</span>
              </div>
            </template>
          </van-field>

          <van-field
            readonly
            clickable
            name="homeLanguage"
            :value="detail.motherInfo.homeLanguage"
            placeholder="请选择"
            input-align="right"
            @click="showPicker5 = true"
            required
            :rules="[{ required: true, message: '请选择语种' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">在家惯用语种</span>
                <span class="english lable-eg">Language Spoken at Home</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.motherInfo.email"
            name="email"
            placeholder="请输入"
            input-align="right"
            maxlength="30"
            required
            :rules="[{ required: true, message: '请填写电子邮箱' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">电子邮箱</span>
                <span class="english lable-eg">Email Address</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.motherInfo.idCardNo"
            name="idCardNo"
            placeholder="请输入"
            input-align="right"
            maxlength="18"
            required
            :rules="[{ required: true, message: '请填写身份证号' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">身份证号</span>
                <span class="english lable-eg">ID/Passport Number</span>
              </div>
            </template>
          </van-field>

          <van-field
            v-model="detail.motherInfo.currentWork"
            autosize
            name="currentWork"
            rows="2"
            type="textarea"
            maxlength="500"
            placeholder="请输入"
            show-word-limit
            input-align="right"
            required
            :rules="[{ required: true, message: '请填写在职单位与职位' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">在职单位与职位</span>
                <span class="english lable-eg">Current Work and Position</span>
              </div>
            </template>
          </van-field>

          <van-popup v-model="showPicker" position="bottom">
            <van-picker
              show-toolbar
              :columns="columns"
              @confirm="onConfirm"
              @cancel="showPicker = false"
            />
          </van-popup>

          <van-popup v-model="showPicker4" position="bottom">
            <van-datetime-picker
              v-model="currentDate1"
              @confirm="onConfirm4"
              @cancel="showPicker4 = false"
              type="date"
              title="选择出生年月日"
              :min-date="minDate1"
              :max-date="maxDate"
            />
          </van-popup>

          <van-popup v-model="showPicker5" position="bottom">
            <van-picker
              show-toolbar
              :columns="columns2"
              @confirm="onConfirm5"
              @cancel="showPicker5 = false"
            />
          </van-popup>
        </van-form>
      </van-collapse-item>
      <van-collapse-item name="4" class='collapse-item'>
        <template #title>
          <div class="title">
            <span>兄弟姐妹</span>
            <span class="english">Siblings</span>
          </div>
        </template>
        <van-button plain round type="info" class="addsbling" @click="addsbling"
          >增加兄弟姐妹数量</van-button
        >
        <van-form validate-first @failed="onFailed">
          <div v-for="(item, index) in detail.siblingsInfo" :key="index">
            <div class="head">
              <div class="head-left">兄弟姐妹</div>
              <div class="head-right" @click="del(index)">删除</div>
            </div>
            <div>
              <van-field
                v-model="item.name"
                name="name"
                placeholder="请输入"
                input-align="right"
                maxlength="30"
                required
                :rules="[{ required: true, message: '请填写姓名' }]"
              >
                <template #label>
                  <div class="title">
                    <span class="chinese">姓名</span>
                    <span class="english lable-eg">Name</span>
                  </div>
                </template>
              </van-field>
              <van-field
                readonly
                clickable
                name="sex"
                :value="item.sex == 1 ? '男' : item.sex == 2 ? '女' : ''"
                placeholder="请选择"
                input-align="right"
                @click="onclick(index)"
                required
                :rules="[{ required: true, message: '请选择性别' }]"
              >
                <template #label>
                  <div class="title">
                    <span class="chinese">性别</span>
                    <span class="english lable-eg">Gender</span>
                  </div>
                </template>
              </van-field>

              <van-field
                readonly
                clickable
                name="age"
                :value="item.age"
                placeholder="请选择(周岁)"
                input-align="right"
                @click="onclick2(index)"
                required
                :rules="[{ required: true, message: '请选择年龄' }]"
              >
                <template #label>
                  <div class="title">
                    <span class="chinese">年龄</span>
                    <span class="english lable-eg">Age</span>
                  </div>
                </template>
              </van-field>

              <van-field
                v-model="item.school"
                name="school"
                placeholder="请输入"
                input-align="right"
                maxlength="30"
                required
                :rules="[{ required: true, message: '请填写就读学校' }]"
              >
                <template #label>
                  <div class="title">
                    <span class="chinese">就读学校</span>
                    <span class="english lable-eg">School</span>
                  </div>
                </template>
              </van-field>

              <van-field
                v-model="item.remark"
                autosize
                name="remark"
                rows="2"
                type="textarea"
                maxlength="500"
                placeholder="请输入"
                show-word-limit
                input-align="right"
              >
                <template #label>
                  <div class="title">
                    <span class="chinese">备注说明</span>
                    <span class="english lable-eg">Remark</span>
                  </div>
                </template>
              </van-field>

              <van-popup v-model="showPicker6" position="bottom">
                <van-picker
                  show-toolbar
                  :columns="columns"
                  @confirm="onConfirm6"
                  @change="onChange"
                  @cancel="showPicker6 = false"
                />
              </van-popup>

              <van-popup v-model="showPicker7" position="bottom">
                <van-picker
                  show-toolbar
                  :columns="columns3"
                  @confirm="onConfirm7"
                  @cancel="showPicker7 = false"
                />
              </van-popup>
            </div>
          </div>
        </van-form>
      </van-collapse-item>
      <van-collapse-item name="5" class='collapse-item'>
        <template #title>
          <div class="title">
            <span>学业背景</span>
            <span class="english">Child Academic Background</span>
          </div>
        </template>
        <van-button plain round type="info" class="addsbling" @click="addStudy"
          >增加学业背景</van-button
        >
        <van-form validate-first @failed="onFailed">
          <div v-for="(item, index) in detail.academicBackground" :key="index">
            <div class="head">
              <div class="head-left">学业背景</div>
              <div class="head-right" @click="del2(index)">删除</div>
            </div>
            <div>
            <van-field
            readonly
            clickable
            name="startDate"
            :value="item.startDate"
            placeholder="请选择"
            input-align="right"
            @click="onclick5(index)"
            required
            :rules="[{ required: true, message: '请选择入学时间' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">入学时间</span>
                <span class="english lable-eg">Admission time</span>
              </div>
            </template>
          </van-field>

          <van-field
            readonly
            clickable
            name="endDate"
            :value="item.endDate"
            placeholder="请选择"
            input-align="right"
            @click="onclick6(index)"
            required
            :rules="[{ required: true, message: '请选择毕业时间' }]"
          >
            <template #label>
              <div class="title">
                <span class="chinese">毕业时间</span>
                <span class="english lable-eg">Graduation time</span>
              </div>
            </template>
          </van-field>

              
              <van-field
                v-model="item.school"
                name="school"
                placeholder="请输入"
                input-align="right"
                maxlength="30"
                required
                :rules="[{ required: true, message: '请填写就读早教/学校' }]"
              >
                <template #label>
                  <div class="title">
                    <span class="chinese">就读早教/学校</span>
                    <span class="english lable-eg">Nursery/School Attended</span>
                  </div>
                </template>
              </van-field>

              <van-field
                v-model="item.teachingInfo"
                name="teachingInfo"
                placeholder="请输入"
                input-align="right"
                maxlength="30"
                required
                :rules="[{ required: true, message: '请填写班级及授课语言' }]"
              >
                <template #label>
                  <div class="title">
                    <span class="chinese">班级及授课语言</span>
                    <span class="english lable-eg">Class Level&Language of Instruction</span>
                  </div>
                </template>
              </van-field>

          <van-popup v-model="showPicker11" position="bottom">
            <van-datetime-picker
              v-model="currentDate1"
              @confirm="onConfirm11"
              @cancel="showPicker11 = false"
              type="date"
              title="选择入学年月日"
              :min-date="minDate"
              :max-date="maxDate"
            />
          </van-popup>

          <van-popup v-model="showPicker12" position="bottom">
            <van-datetime-picker
              v-model="currentDate1"
              @confirm="onConfirm12"
              @cancel="showPicker12 = false"
              type="date"
              title="选择毕业年月日"
              :min-date="minDate"
              :max-date="maxDate"
            />
          </van-popup>


            </div>
          </div>
        </van-form>
      </van-collapse-item>
      <van-collapse-item v-if="questList.length" name="6" class='collapse-item-last'>
        <template #title>
          <div class="title">
            <span>相关信息</span>
            <!-- <span class="english">sblings</span> -->
          </div>
        </template>
        <div class="questionDetail">
          <div v-for="(item, index) in questList" :key="index" class="question">
            <!-- 简答题（10个字） -->
            <div v-if="item.type == 1" class="type-1">
              <p class="subject">
                <span>{{ index + 1 }}、</span>{{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <van-cell-group>
                <van-field
                  v-model="item.answer"
                  type="text"
                  maxlength="10"
                  placeholder="最多10个汉字"
                />
              </van-cell-group>
            </div>
            <!-- 简答题（50个字） -->
            <div v-if="item.type == 2" class="type-2">
              <p class="subject">
                <span>{{ index + 1 }}、</span>{{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <van-cell-group>
                <van-field
                  v-model="item.answer"
                  maxlength="50"
                  type="textarea"
                  placeholder="最多50个汉字"
                  class="text"
                />
              </van-cell-group>
            </div>
            <!--手机号  -->
            <div v-if="item.type == 3" class="type-3">
              <p class="subject">
                <span>{{ index + 1 }}、</span>{{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <van-cell-group>
                <van-field
                  v-model="item.answer"
                  type="number"
                  maxlength="11"
                  placeholder="请输入有效的手机号"
                />
              </van-cell-group>
            </div>
            <!-- 单选 -->
            <div v-if="item.type == 4" class="type-4">
              <p class="subject">
                <span>{{ index + 1 }}、</span>{{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <van-radio-group
                v-model="item.answer"
                @change="changeradio(index)"
              >
                <!-- <van-cell-group>
                  <van-cell
                    v-for="(answer, index) in item.answerOptions"
                    :key="index"
                    clickable
                  >
                    <template #title>
                      <span>{{ answer.val }}.&emsp;{{ answer.item }}</span>
                    </template>
                    <template #right-icon>
                      <van-radio :name="answer.val" />
                    </template>
                    <div class="prompt">
                      <van-field
                        v-model="answer.prompt"
                        maxlength="100"
                        type="textarea"
                        :placeholder="answer.prompt"
                        class="text"
                      />
                    </div>
                  </van-cell>
                </van-cell-group> -->
                <div
                  v-for="(answer, index1) in item.answerOptions"
                  :key="index1"
                >
                  <van-radio
                    class="v-radio"
                    :name="answer.item"
                    @click="radioclick(answer.isNeedFill, index1, index)"
                    >{{ answer.item }}.&emsp;{{ answer.val }}</van-radio
                  >
                  <van-field
                    v-model="answer.remark"
                    maxlength="100"
                    type="textarea"
                    :placeholder="answer.prompt"
                    v-if="answer.radioflag"
                    class="v-textarea"
                  />
                </div>
              </van-radio-group>
            </div>
            <!-- 多选题 -->
            <div v-if="item.type == 5" class="type-5">
              <p class="subject">
                <span>{{ index + 1 }}、</span>{{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <van-checkbox-group v-model="item.answer">
                <!-- <van-cell-group>
                  <van-cell
                    v-for="(answer, index) in item.answerOptions"
                    :key="index"
                    clickable
                  >
                    <template #title>
                      <span>{{ answer.val }}.&emsp;{{ answer.item }}</span>
                    </template>

                    <template #right-icon>
                      <van-checkbox :name="answer.val" />
                    </template>
                  </van-cell>
                </van-cell-group> -->
                <div
                  v-for="(answer, index1) in item.answerOptions"
                  :key="index1"
                >
                  <van-checkbox
                    class="v-radio"
                    :name="answer.item"
                    ref="checkbox"
                    @click="radioclick2(answer.isNeedFill, index1, index)"
                    >{{ answer.item }}.&emsp;{{ answer.val }}</van-checkbox
                  >
                  <van-field
                    v-model="answer.remark"
                    maxlength="100"
                    type="textarea"
                    :placeholder="answer.prompt"
                    v-if="answer.radioflag"
                    class="v-textarea"
                  />
                </div>
              </van-checkbox-group>
            </div>
            <!-- 图片上传 -->
            <div v-if="item.type == 6" class="type-6">
              <p class="subject">
                <span>{{ index + 1 }}、</span>
               {{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <div class="uploader">
                <van-uploader
                  v-model="item.answer"
                  :accept="'image/*'"
                  :max-size="2 * 1024 * 1024"
                  result-type="file"
                  :before-read="beforeRead(index)"
                  :max-count="1"
                />
              </div>
            </div>
            <!-- 图片上传 -->
            <div v-if="item.type == 7" class="type-7">
              <p class="subject">
                <span>{{ index + 1 }}、</span>
                {{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <div class="uploader">
                <van-uploader
                  v-model="item.answer"
                  :accept="'image/*'"
                  :max-size="2 * 1024 * 1024"
                  result-type="file"
                  :before-read="beforeRead1(index)"
                  :max-count="3"
                />
              </div>
            </div>

            <!--身份证  -->
            <div v-if="item.type == 8" class="type-8">
              <p class="subject">
                <span>{{ index + 1 }}、</span>{{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <van-cell-group>
                <van-field
                  v-model="item.answer"
                  type="number"
                  maxlength="18"
                  placeholder="请输入有效的身份证号"
                />
              </van-cell-group>
            </div>

            <!--日期与时间  -->
            <div v-if="item.type == 9" class="type-9">
              <p class="subject">
                <span>{{ index + 1 }}、</span>{{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <van-form>
                <van-field
                  readonly
                  clickable
                  name="date"
                  :value="item.answer"
                  placeholder="请选择"
                  @click="onclick3(index)"
                  :rules="[{ required: true, message: '请选择日期' }]"
                />
              </van-form>
              <van-popup v-model="showPicker8" position="bottom">
                <van-datetime-picker
                  v-model="currentDate"
                  @confirm="onConfirm8"
                  @cancel="showPicker8 = false"
                  type="date"
                  title="选择日期与时间"
                  :min-date="minDate1"
                  :max-date="maxDate"
                />
              </van-popup>
            </div>

            <!--时间  -->
            <div v-if="item.type == 10" class="type-10">
              <p class="subject">
                <span>{{ index + 1 }}、</span>{{ item.isMust == 1 ? item.title + "（必答）" : item.title}}{{ item.type == 5 ? "（多选）" : "" }}
              </p>
              <van-form>
                <van-field
                  readonly
                  clickable
                  name="datetimePicker"
                  :value="item.answer"
                  placeholder="请选择"
                  @click="onclick4(index)"
                  :rules="[{ required: true, message: '请选择日期' }]"
                />
              </van-form>
              <van-popup v-model="showPicker9" position="bottom">
                <van-datetime-picker
                  v-model="item.answer"
                  @confirm="onConfirm9"
                  @cancel="showPicker9 = false"
                  type="time"
                  title="选择时间"
                />
              </van-popup>
            </div>

            <!-- 占位内容 -->
            <div v-if="item.type == 11" class="type-1">
              <p class="subject">
                {{ item.title }}
              </p>
              <!-- <input
                v-model="item.answer"
                maxlength="10"
                class="myInput"
                placeholder=" "
                type="text"
                disabled
              /> -->
            </div>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
    <div style="margin: 16px; padding-bottom: 30px">
      <van-button @click="submitinfo" block type="info"> 提交 </van-button>
    </div>
  </div>
</template>

<script>
import {
  getPersonInfo,
  getFromDetail,
  submitDetail,
  login,
  entranceApply,
  getVisitPerson,
  getQiNiuToken,
} from "../api/request";
import { Decrypt, Encrypt } from "../util/secret";
import { upLoaderImg } from "../util/http";
import { getFormatDate, getQueryString, getStr } from "../util/util";
import { Toast } from "vant";
export default {
  data() {
    return {
      imgBase: "http://test.qiniu.lepayedu.com/",
      // imgBase: 'http://qiniu.lepayedu.com/',
      schoolId: "",
      activeNames: [],
      radioflag: false, //单选多选是否选中
      columns: [
        //性别选择
        {
          value: 1,
          text: "男",
        },
        {
          value: 2,
          text: "女",
        },
      ],
      columns4: [
        //性别选择
        {
          value: 1,
          text: "本市户籍",
        },
        {
          value: 2,
          text: "非本市户籍",
        },
      ],
      columns2: ["普通话", "方言", "English", "其他"],
      columns3: [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
      ],
      showPicker: false,
      showPicker1: false,
      showPicker2: false,
      showPicker3: false,
      showPicker4: false,
      showPicker5: false,
      showPicker6: false,
      showPicker7: false,
      showPicker8: false,
      showPicker9: false,
      showPicker10:false,
      showPicker11:false,
      showPicker12:false,
      minDate: new Date(2010, 0, 1),
      minDate1: new Date(1950, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(2015, 0, 1),
      currentDate1: new Date(1990, 0, 1),
      siblingsInfo: [], //兄弟姐妹数据
      detail: {
        childName: "",
        nickName: "",
        sex: "",
        birthday: "",
        nationality: "",
        motherTongue: "",
        homeAddress: "",
        contactPhone:'',
        idCardNo:'',
        householdRegisterType:'',
        residencePermitNo:'',
        householdRegisterAddress:"",
        fatherInfo: {
          name: "",
          nationality: "",
          birthday: "",
          phone: "",
          motherTongue: "",
          homeLanguage: "",
          email: "",
          currentWork: "",
          idCardNo:''
        },
        motherInfo: {
          name: "",
          nationality: "",
          birthday: "",
          phone: "",
          motherTongue: "",
          homeLanguage: "",
          email: "",
          currentWork: "",
          idCardNo:''
        },
        siblingsInfo: [],
        academicBackground:[],
      },
      questList: [], //相关信息
      sblingindex: "", //兄弟姐妹性别所在下标
      sblingindex2: "", //兄弟姐妹年龄所在下标
      answerindex: "", //日期选择 相关信息下标
      answerindex1: "", //时间选择 相关信息下标
      studyindex:'',//学业背景 入学时间下标
      studyindex1:''//学业背景 毕业时间下标

    };
  },

  methods: {
    //获取问题列表
    async getFromDetail() {
      let params = { type: 3 };
      params.token = sessionStorage.getItem("token");
      params.uid = sessionStorage.getItem("uid");
      // let params=''
      let res = await getFromDetail(JSON.stringify(params));
      console.log(res);
      if (res.success) {
        res.detail &&
          res.detail.map((item) => {
            if (item.type === 5 || item.type === 6 || item.type === 7) {
              item.answer = [];
            } else {
              item.answer = "";
            }
            if (item.type === 4 || item.type === 5) {
              item.answerOptions.map((i) => {
                i.radioflag = false;
                i.remark=''
              });
            }
          });
        this.questList = res.detail;
        console.log(this.questList);
      }
    },

    //回显详情数据
    async getDetail(applyId){
      let params={}
      params.token = sessionStorage.getItem("token");
      params.uid = sessionStorage.getItem("uid");
      params.applyId=applyId
      console.log(params);
      let res = await getVisitPerson(JSON.stringify(params));
      console.log(res);
      res.detail.contactPhone='';
      res.detail.idCardNo='';
      res.detail.householdRegisterType='';
      res.detail.residencePermitNo='';
      res.detail.householdRegisterAddress='';
      res.detail.academicBackground=[];
      if(res.success){
        // res.detail.academicBackground=[]
         this.detail=res.detail
        //  this.detail.householdRegisterAddress=''
         this.activeNames=['1']
      }
    },
    //单选
    radioclick(i, index1, index) {
      this.questList[index].answerOptions.map((item) => {
        item.radioflag = false;
      });
      if (i == 1) {
        this.questList[index].answerOptions[index1].radioflag = true;
      }
    },

    //多选
    radioclick2(i, index1, index) {
      let flag=this.$refs.checkbox[index1].checked
      if(!flag){
        if (i == 1) {
          this.questList[index].answerOptions[index1].radioflag = true;
        }
      }else{
        this.questList[index].answerOptions[index1].radioflag = false;
      }
    },

    // 单张上传
    beforeRead(index) {
      return (file) => {
        console.log(file)
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
          let msg = "请上传 jpeg/png 格式图片";
          Toast(msg);
          return false;
        } else {
          upLoaderImg(file).then((res) => {
            console.log(res);
            if (res.success) {
              this.questList.map((item, idx) => {
                if (idx === index) {
                  item.answer = [
                    {
                      url: this.imgBase + res.id,
                      isImage: true,
                    },
                  ];
                }
              });
            }
          });
        }
      };
    },
    // 多张上传
    beforeRead1(index) {
      return (file) => {
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
          let msg = "请上传 jpeg/png 格式图片";
          Toast(msg);
          return false;
        } else {
          upLoaderImg(file).then((res) => {
            if (res.success) {
              this.questList.map((item, idx) => {
                if (idx === index) {
                  item.answer.push({
                    url: this.imgBase + res.id,
                    isImage: true,
                  });
                }
              });
            }
          });
        }
      };
    },
    //基础资料性别选择
    onConfirm(item) {
      this.value = item.text;
      this.detail.sex = item.value;
      this.showPicker = false;
    },
    //基础资料户籍类型选择
    onConfirm10(item) {
      this.detail.householdRegisterType = item.value;
      this.showPicker10 = false;
    },
    //基础资料日期选择
    onConfirm1(item) {
      this.detail.birthday = getFormatDate(item);
      this.showPicker1 = false;
    },
    //父亲 日期选择
    onConfirm2(item) {
      this.detail.fatherInfo.birthday = getFormatDate(item);
      this.showPicker2 = false;
    },
    //父亲 惯用语种选择
    onConfirm3(item) {
      this.detail.fatherInfo.homeLanguage = item;
      this.showPicker3 = false;
    },
    //母亲 日期选择
    onConfirm4(item) {
      this.detail.motherInfo.birthday = getFormatDate(item);
      this.showPicker4 = false;
    },
    //母亲 惯用语种选择
    onConfirm5(item) {
      this.detail.motherInfo.homeLanguage = item;
      this.showPicker5 = false;
    },
    //兄弟姐妹 性别选择
    onConfirm6(item) {
      // console.log(item.value);
      this.showPicker6 = false;
      let index = this.sblingindex;
      let oldData = this.detail.siblingsInfo;
      oldData.forEach((el, i) => {
        if (i == index) {
          el.sex = item.value;
        }
      });
      this.detail.siblingsInfo = oldData;
      // console.log(this.detail.siblingsInfo);
    },
    //兄弟姐妹 年龄选择
    onConfirm7(item) {
      // console.log(item);
      this.showPicker7 = false;
      let index = this.sblingindex2;
      let oldData = this.detail.siblingsInfo;
      oldData.forEach((el, i) => {
        if (i == index) {
          el.age = item;
        }
      });
      this.detail.siblingsInfo = oldData;
      // console.log(this.detail.siblingsInfo);
    },
    //相关信息 日期选择
    onConfirm8(item) {
      let date = getFormatDate(item);
      // console.log(date);
      this.showPicker8 = false;
      let index = this.answerindex;
      let oldData = this.questList;
      oldData.forEach((el, i) => {
        if (i == index) {
          console.log("222222");
          el.answer = date;
        }
      });
      this.questList = oldData;
      // console.log(this.questList);
    },
    //相关信息 时间选择
    onConfirm9(item) {
      let time = item;
      this.showPicker9 = false;
      let index = this.answerindex1;
      let oldData = this.questList;
      oldData.forEach((el, i) => {
        if (i == index) {
          el.answer = time;
        }
      });
      this.questList = oldData;
      // console.log(this.questList);
    },

    //学业背景 入学时间选择
    onConfirm11(item) {
      console.log(item);
      this.showPicker11 = false;
      let index = this.studyindex;
      let oldData = this.detail.academicBackground;
      oldData.forEach((el, i) => {
        if (i == index) {
          el.startDate = getFormatDate(item);
        }
      });
      this.detail.academicBackground = oldData;
      // console.log(this.detail.siblingsInfo);
    },

    //学业背景 毕业时间选择
    onConfirm12(item) {
      // console.log(item.value);
      this.showPicker12 = false;
      let index = this.studyindex1;
      let oldData = this.detail.academicBackground;
      oldData.forEach((el, i) => {
        if (i == index) {
          el.endDate = getFormatDate(item);
        }
      });
      this.detail.academicBackground = oldData;
      // console.log(this.detail.siblingsInfo);
    },

    //获取当前兄弟姐妹 性别下标
    onclick(i) {
      console.log(i);
      this.showPicker6 = true;
      this.sblingindex = i;
    },
    //获取当前兄弟姐妹 年龄下标
    onclick2(i) {
      console.log(i);
      this.showPicker7 = true;
      this.sblingindex2 = i;
    },
    //获取当前相关信息 日期选择
    onclick3(i) {
      console.log(i);
      this.showPicker8 = true;
      this.answerindex = i;
    },
    //获取当前相关信息 时间选择
    onclick4(i) {
      console.log(i);
      this.showPicker9 = true;
      this.answerindex1 = i;
    },
    //获取当前学业背景 入学时间选择
    onclick5(i) {
      console.log(i);
      this.showPicker11 = true;
      this.studyindex = i;
    },

    //获取当前学业背景 毕业时间选择
    onclick6(i) {
      console.log(i);
      this.showPicker12 = true;
      this.studyindex1 = i;
    },

    //添加兄弟姐妹
    addsbling() {
      if (this.detail.siblingsInfo.length < 5) {
        this.detail.siblingsInfo.push({
          name: "",
          sex: "",
          age: "",
          school: "",
          remark: "",
        });
      }
    },
    //添加学业背景
    addStudy(){
      if (this.detail.academicBackground.length < 5) {
        this.detail.academicBackground.push({
          seq: "",
          startDate: "",
          endDate: "",
          school: "",
          teachingInfo: "",
        });
      }
    },
    //删除兄弟姐妹
    del(index) {
      this.$dialog
        .confirm({
          message: "确认删除该条信息？",
        })
        .then(() => {
          let oldData = this.detail.siblingsInfo;
          let newData = oldData.filter((item, index1) => {
            return index1 !== index;
          });
          this.detail.siblingsInfo = newData;
        })
        .catch(() => {
          // on cancel
        });
    },
    //删除学业背景
    del2(index) {
      this.$dialog
        .confirm({
          message: "确认删除该条信息？",
        })
        .then(() => {
          let oldData = this.detail.academicBackground;
          let newData = oldData.filter((item, index1) => {
            return index1 !== index;
          });
          this.detail.academicBackground = newData;
        })
        .catch(() => {
          // on cancel
        });
    },
    //提交
    submitinfo() {

      let reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      let flag = true;
      let err = false;
      let relateInfo = [];

      let obj=this.detail
      let fatherInfo=this.detail.fatherInfo
      let motherInfo=this.detail.motherInfo
      console.log(obj)
      if(!obj.childName||!obj.nickName||!obj.sex||!obj.birthday||!obj.nationality||!obj.motherTongue||!obj.homeAddress||!obj.contactPhone || !obj.idCardNo||!obj.householdRegisterType||!obj.householdRegisterAddress){
         console.log('必填')
         flag=false
      }
      for(let i in fatherInfo){
        console.log(i,fatherInfo[i]);
        if(fatherInfo[i]==''){
          console.log('必填')
          flag=false
        }
      }
      for(let i in motherInfo){
        if(motherInfo[i]==''){
          console.log('必填')
          flag=false
        }
      }

      this.detail.siblingsInfo.map(item=>{
        if(!item.name||!item.sex||!item.age||!item.school){
          if(item.age !==0 ){
            console.log('必填')
            flag=false
          }
        }
      })

      this.detail.academicBackground.map(item=>{
        if(!item.startDate||!item.endDate||!item.teachingInfo||!item.school){
          console.log('必填')
          flag=false
        }
      })

      this.questList.forEach((item) => {
        let imgs = [];
        if (item.answer === "") {
          if (item.type !== 11 && item.isMust==1) {
            flag = false;
          }
        }

        if (Array.isArray(item.answer)) {
          if (item.answer.length == 0 && item.isMust==1) {
            flag = false;
          }
        }

        if (item.type === 3 && item.isMust==1) {
          if (!reg.test(item.answer)) {
            err = true;
          }
        }

        if (item.type == 4) {
          //  console.log(item)
           let param=[]
           item.answerOptions.map(i=>{
              if(i.item==item.answer){
                 param.push({"item":item.answer,"remark":i.remark})
              }
           })
           relateInfo.push({
            seq: item.seq,
            answer: param
          });
        }

        else if (item.type == 5) {
          //  console.log(item)
           let param=[]
           item.answer.map(i=>{
              item.answerOptions.map(j=>{
              if(i==j.item){
                 param.push({"item":i,"remark":j.remark})
              }
           })

          })
             relateInfo.push({
              seq: item.seq,
              answer: param
            });
        }

        else if (item.type == 6) {
          let param=[]
          if(item.answer.length > 0){
            param.push(getStr(item.answer[0].url))
          }
          relateInfo.push({
            seq: item.seq,
            // answer: item.answer.length > 0 ? getStr(item.answer[0].url) : [],
            answer: item.answer.length > 0 ?  param: [],
          });
        } 
        else if (item.type == 7) {
          item.answer.length > 0 &&
            item.answer.map((v) => {
              imgs.push(getStr(v.url));
            });
          relateInfo.push({
            seq: item.seq,
            // answer: imgs.join(","),
             answer: imgs,
          });
        }
        
        else {
          // console.log(item)
          let params=[]
          params.push(item.answer)
          // console.log(params);
          relateInfo.push({
            seq: item.seq,
            answer: params,
          });
        }

      });
      console.log(flag);
      if (!flag) {
        this.$toast("请将内容填写完整!");
        return;
      } else if (err) {
        this.$toast("手机号格式错误");
        return;
      } else {

        let params = this.detail;
        params.relateInfo = relateInfo;
        params.token = sessionStorage.getItem("token");
        params.uid = sessionStorage.getItem("uid");
        console.log(params);
        entranceApply(JSON.stringify(params)).then((res) => {
          // console.log(res);
          if (res.success) {
            this.$toast("提交成功");
            setTimeout(() => {
              this.$router.push({ path: "/welcome" });
            }, 1000);
          } else {
            this.$toast.fail(res.description);
          }
        });
      }
    },
    //返回
    onClickLeft(){
         this.$router.push({"path":'./welcome'})
     },
  },
  async created() {
    let schoolId = sessionStorage.getItem("shoolId");
    console.log(schoolId);
    this.schoolId = schoolId;

    // 获取七牛token
    let tokenRes = await getQiNiuToken({
      schoolId: schoolId,
    });
    console.log(tokenRes);
    sessionStorage.setItem("qiniutoken", tokenRes.detail.token); 

    this.getFromDetail();

    let applyId = this.$route.query.applyId;
    console.log(applyId)
    if(applyId!==undefined){
        this.getDetail(applyId)
    }
  },
  async mounted() {},
};
</script>

<style lang="less" scoped>
.english {
  font-size: 12px;
  margin-top: -8px;
  color: #ccc;
}
.chinese {
  font-size: 13px;
  width: 150px;
}
.lable-eg {
  width: 180px;
}
.title {
  display: flex;
  flex-direction: column;
}
/deep/.van-field__error-message {
  text-align: right !important;
}
.addsbling {
  font-size: 12px;
  height: 30px;
}
/deep/.van-collapse-item__content {
  text-align: right !important;
}
.head {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  padding: 0 10px;
  .head-left {
    border-left: 5px solid #1989fa;
    color: #323233;
  }
  .head-right {
    color: red;
  }
}

.active {
  border-color: red;
}
.show {
  display: none;
}
.titleName {
  width: 100%;
  white-space: normal;
}
.marginLeft {
  margin-left: 1rem;
}
.questionDetail {
  font-size: 0.8rem;
  padding: 0 1rem;
  .van-cell__title {
    text-align: left !important;
  }
  .subject {
    text-align: left !important;
    color: #323233;
  }
  .intro {
    background-color: #fff;
    padding: 8px;
  }
  .listName {
    background-color: #fff;
    margin-top: 0.5rem;
    p {
      font-weight: bold;
      margin: 0;
      padding: 0.5rem;
      &:last-child {
        font-weight: normal;
        font-size: 0.5rem;
        color: #b5b3b3;
      }
    }
  }
  .question {
    p {
      margin: 0.8rem 0;
    }
    .type-1 {
      .myInput {
        width: 100%;
        height: 1.8rem;
        border: none;
        text-indent: 1rem;
      }
    }
    .type-2 {
      .text {
        width: 100%;
        height: 5rem;
        border: none;
      }
    }
  }
  .submit {
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      width: 70%;
      height: 2.5rem;
      background-color: #379bfa;
      margin: 1.5rem auto;
      border-radius: 50px;
      border: none;
      color: #fff;
      font-size: 1rem;
    }
  }
  .uploader {
    text-align: left !important;
  }
}
.input-file {
  display: none;
}
.upload {
  width: 70px;
  height: 70px;
  position: relative;
  img {
    width: 70px;
    height: 70px;
  }
  .up-delete {
    position: absolute;
    width: 20px;
    height: 20px;
    right: -5px;
    top: -5px;
    z-index: 999;
  }
}

/deep/.van-nav-bar__title {
  line-height: 44px !important;
}
.v-radio {
  line-height: 44px !important;
  padding: 10px 0;
  // height: 44px;
}
.v-textarea {
  padding-top: 0px !important;
  border: 1px dashed #ccc;
}
/deep/.van-cell--clickable{
  background-color: rgba(255, 240, 246,.5);
}
/deep/.collapse-item-last .van-field{
  background-color: #fff;
}
/deep/.collapse-item .van-collapse-item__content .van-form .van-field{
  background-color: rgba(186, 231, 255,0)!important;
}
/deep/.collapse-item .van-collapse-item__content{
 background-color: rgba(186, 231, 255,0.3)!important;
}
</style>