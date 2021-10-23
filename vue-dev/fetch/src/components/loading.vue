 <template>
	<div class="loading_container" @touchmove.prevent>
	  		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 30 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
              <circle transform="translate(8 0)" cx="0" cy="16" r="0"> 
                <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0" keyTimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline"></animate>
              </circle>
              <circle transform="translate(16 0)" cx="0" cy="16" r="0.178174"> 
                <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0.3" keyTimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline"></animate>
              </circle>
              <circle transform="translate(24 0)" cx="0" cy="16" r="1.32213"> 
                <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0.6" keyTimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline"></animate>
              </circle>
            </svg>
	</div>
</template>

<script>
    export default {
    	data(){
            return{
              
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
	}
	 .loading_container svg{
		width: 1rem;
		height: 1rem;
		fill: #50aedf;
		position: absolute;
		top: 50%;
		margin-top: -0.5rem;
		margin-left: -0.5rem;
	 }

</style>
