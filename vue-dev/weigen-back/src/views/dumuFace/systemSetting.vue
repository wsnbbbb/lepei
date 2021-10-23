<template>
 <section>
	  <!-- 面包屑 -->
    <el-col :span="24" class="breadcrumb-box">
      <strong class="title">{{ $route.name }}</strong>
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
		<el-tabs v-model="activeName" @tab-click="clickTab">
			<el-tab-pane label="屏保设置" name="first">
				<SetScreenSaver></SetScreenSaver>
			</el-tab-pane>
			<el-tab-pane label="提示设置" name="second">
				<TipsSetting></TipsSetting>
			</el-tab-pane>
			<el-tab-pane label="LOGO设置" name="third">
				<LogoSetting></LogoSetting>
			</el-tab-pane>
			<el-tab-pane label="安全配置" name="fourth">
				<SafetyConfig></SafetyConfig>
			</el-tab-pane>
			<el-tab-pane label="数据配置" name="fifth">
				<DataConfig></DataConfig>
			</el-tab-pane>
		</el-tabs>
	</section>
</template>

<script>
	import SetScreenSaver from "./setScreenSaver"
	import TipsSetting from "./tipsSetting"
	import DataConfig from "./dataConfig"
	import SafetyConfig from "./safetyConfig"
	import LogoSetting from "./logoSetting"
	export default {
		components: {
    	SetScreenSaver,
    	TipsSetting,
    	DataConfig,
    	SafetyConfig,
    	LogoSetting,
  	},
		data() {
			return {
				activeName: 'first', // tab选项
			}
		},
		methods: { 
			// tab选项切换
			clickTab(tab, event) {
        this.activeName = tab.name;
      }
		},

		mounted() {
			let type = sessionStorage.getItem("itemType")
			console.log({type});
			if(type){
				if(type == 1){
					this.activeName = 'first'
				}else if(type == 2){
					this.activeName = 'second'
				}else if(type == 3){
					this.activeName = 'third'
				}else if(type == 4){
					this.activeName = 'fourth'
				}else if(type == 5){
					this.activeName = 'fifth'
				}
			}else{
				this.activeName = 'first'
			}
			sessionStorage.removeItem("itemType")
		}
	}

</script>

<style scoped lang="scss">
	
</style>