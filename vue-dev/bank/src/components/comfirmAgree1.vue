 <template>
	<div class="loading_container" @touchmove.prevent>
		<div class="alert-box-wrap">
			<div class="alert-box">
		  			<div class="alert-box-top">
		  				<img src="../assets/icon-alert.png" alt="">
		  			</div>
		  			<div class="alert-box-bottom">
		  				<textarea placeholder="输入后续流程，以便申请人知晓（必填）" v-model="message" maxlength="100"></textarea>
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

    	data(){
            return{
	            message:""
            }
        },
        methods:{
        	cancel(){
        		this.$emit('toparentevent',this.message);
        	},
        	comfirm(){
        		this.$emit('toparenteventcomfirm',this.message);
        	}
        }
    }
</script>

<style scoped>
input,button,select,textarea{outline:none}
textarea{resize:none}
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
	 .alert-box-wrap{
	 	position: absolute;
	 	top:50%;
	 	width:100%;
	 	margin-top: -3rem;
	 }
	  .alert-box{

	  	width:5.2rem;
	  	margin:0 auto;
	  	/*margin-top: 3.0rem;*/
	  	border-bottom-right-radius: 0.25rem;
		border-bottom-left-radius: 0.25rem;
		overflow: hidden;
	  }
	 .alert-box-top img{
		width:5.2rem;
		height: 2.16rem;
		display: block;
	 }
	  .alert-box-bottom{
	  	background-color: #fff;
	  	padding-top: 0.15rem;

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
 	 	border-top: 1px solid #cfcfcf;
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
	.alert-box-bottom textarea{
		width:4.7rem;
		height: 1.0rem;
		border-radius: 0.05rem;
		border-color: #dedede;
		padding: 0.05rem;
		color: #a8a8a8;
	}
</style>
