 <template>
	<div class="loading_container" @touchmove.prevent>
		<div class="alert-box-wrap">
	  		<div class="alert-box">
	  			<div class="alert-box-top">
	  				<img src="../assets/icon-alert.png" alt="">
	  			</div>
	  			<div class="alert-box-bottom">
	  				<p>你确定通过{{childMsg}}的物品采购申请吗？</p>
	  				<div class="btn-wrap">
						<a href="javascript:;" class="btn-cancel" v-on:click.stop="cancel()">取消</a>
						<a href="javascript:;" class="btn-comfirm" v-on:click.stop="comfirm()">确定</a>
	  				</div>
	  			</div>
	  		</div>
  		</div>
	</div>
</template>

<script>
    export default {
    	props: {
		    childMsg: String
		},
    	data(){
            return{
              
            }
        },
        methods:{
			cancel(){
				this.$emit("toparentevent")
			},
			comfirm(){
				this.$emit("toparenteventcomfirm")
			}

        }
        
    }
</script>

<style scoped>
	.loading_container{
		position: fixed;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		line-height: 100%;
		z-index: 9991;
		/*background: rgba(0,0,0,0.3);*/
	    display: table-cell;
	    vertical-align: middle;
	    text-align: center;
	    background: rgba(0,0,0,0.4)
	}
	 .loading_container svg{
	
	 }
	  .alert-box{

	  	width:5.2rem;
	  	margin:0 auto;
	  	border-bottom-right-radius: 0.25rem;
		border-bottom-left-radius: 0.25rem;
		overflow: hidden;
	  }
	   .alert-box-wrap{
	 	position: absolute;
	 	top:50%;
	 	width:100%;
	 	margin-top: -3rem;
	 }
	 .alert-box-top img{
		width:5.2rem;
		height: 2.16rem;
		display: block;
	 }
	  .alert-box-bottom{
	  	background-color: #fff;

	  }
	 .alert-box-bottom p{
	 	color: #636363;
	 	font-size: 0.26rem;
	 	word-wrap: break-word; 
		word-break: normal; 
		line-height: 0.32rem;
		padding: 0.30rem;
		text-align:left;
		border-bottom: 1px solid #cfcfcf;
	 }
 	 .btn-wrap {
 	 	overflow: hidden;
 	 }
	 .btn-wrap a{
			font-size: 0.26rem;
			text-decoration: none;
			display: inline-block;
			width: 50%;
			float: left;
			box-sizing: border-box;
	 }
	.btn-wrap a:first-child{
		border-right: 1px solid #cfcfcf;
	}
	.btn-cancel{
		color:#636363;
	}
	.btn-comfirm{
		color:#5687ea;
	}
</style>
