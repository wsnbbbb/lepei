<template>
	<div id="app">
		
		
			<!-- <keep-alive v-if="$route.meta && $route.meta.keepAlive" max="99"> -->
				<!-- <transition name="fade" mode="out-in"> -->
					<!-- <router-view :key="$route.meta.path"> -->
						<!-- 这里是会被缓存的视图组件，比如 Home！ -->
					<!-- </router-view> -->
				<!-- </transition> -->
			<!-- </keep-alive> -->

			<!-- <keep-alive> -->
				<!-- <transition name="fade" mode="out-in"> -->
					<router-view ></router-view>
				<!-- </transition> -->
			<!-- </keep-alive> -->

		
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {
	},
}

</script>

<style lang="scss">
body {
	margin: 0px;
	padding: 0px;
	/*background: url(assets/bg1.jpg) center !important;
		background-size: cover;*/
	// background: #1F2D3D;
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
}

#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
}

.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.toolbar {
	background: #f2f2f2;
	padding: 10px;
	//border:1px solid #dfe6ec;
	margin: 10px 0px;
	.el-form-item {
		margin-bottom: 10px;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}

// 面包屑
.breadcrumb-box {
	position: absolute;
	top:0;
	left:0;
	width:100%;
	display: flex;
	justify-content: space-between;
	justify-items: center;
	padding:20px;
	.title {
		width: 200px;
		color: #475669;
		font-size: 16px;
	}
}
// 展开/收起
.el-dropdown-link {
	cursor: pointer;
	color: #409EFF;
}
// 导入
.importForm{
	.el-input__inner{
		border:none !important;
	}
	.downLoad{
		color: #1890ff;
		cursor: pointer;
	}
	.import-erro-table{
		border-collapse:collapse;
		text-align: center;
		width:96%;
		margin:15px auto;
		th{
			color: #4a4a4a;
			background-color: #eee;
		}
		th,td{
			padding:4px 6px;
			white-space: nowrap;
		}
	}
}
</style>