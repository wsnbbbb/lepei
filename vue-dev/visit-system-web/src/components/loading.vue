 <template>
	<div class="loading_container" @touchmove.prevent>
	  		<!-- <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 30 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
              <circle transform="translate(8 0)" cx="0" cy="16" r="0"> 
                <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0" keyTimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline"></animate>
              </circle>
              <circle transform="translate(16 0)" cx="0" cy="16" r="0.178174"> 
                <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0.3" keyTimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline"></animate>
              </circle>
              <circle transform="translate(24 0)" cx="0" cy="16" r="1.32213"> 
                <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0.6" keyTimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline"></animate>
              </circle>
            </svg> -->

            <svg class="lds-spinner" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><g transform="rotate(0 50 50)">
  <rect x="48" y="22" rx="7.68" ry="3.52" width="4" height="12" fill="#c5c5c5">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.2s" begin="-1.1142857142857143s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(25.714285714285715 50 50)">
  <rect x="48" y="22" rx="7.68" ry="3.52" width="4" height="12" fill="#c5c5c5">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.2s" begin="-1.0285714285714285s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(51.42857142857143 50 50)">
  <rect x="48" y="22" rx="7.68" ry="3.52" width="4" height="12" fill="#c5c5c5">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.2s" begin="-0.9428571428571428s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(77.14285714285714 50 50)">
  <rect x="48" y="22" rx="7.68" ry="3.52" width="4" height="12" fill="#c5c5c5">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.2s" begin="-0.8571428571428571s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(102.85714285714286 50 50)">
  <rect x="48" y="22" rx="7.68" ry="3.52" width="4" height="12" fill="#c5c5c5">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.2s" begin="-0.7714285714285714s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(128.57142857142858 50 50)">
  <rect x="48" y="22" rx="7.68" ry="3.52" width="4" height="12" fill="#c5c5c5">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.2s" begin="-0.6857142857142857s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(154.28571428571428 50 50)">
  <rect x="48" y="22" rx="7.68" ry="3.52" width="4" height="12" fill="#c5c5c5">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.2s" begin="-0.6s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(180 50 50)">
  <rect x="48" y="22" rx="7.68" ry="3.52" width="4" height="12" fill="#c5c5c5">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.2s" begin="-0.5142857142857142s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(205.71428571428572 50 50)">
  <rect x="48" y="22" rx="7.68" ry="3.52" width="4" height="12" fill="#c5c5c5">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.2s" begin="-0.42857142857142855s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(231.42857142857142 50 50)">
  <rect x="48" y="22" rx="7.68" ry="3.52" width="4" height="12" fill="#c5c5c5">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.2s" begin="-0.34285714285714286s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(257.14285714285717 50 50)">
  <rect x="48" y="22" rx="7.68" ry="3.52" width="4" height="12" fill="#c5c5c5">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.2s" begin="-0.2571428571428571s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(282.85714285714283 50 50)">
  <rect x="48" y="22" rx="7.68" ry="3.52" width="4" height="12" fill="#c5c5c5">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.2s" begin="-0.17142857142857143s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(308.57142857142856 50 50)">
  <rect x="48" y="22" rx="7.68" ry="3.52" width="4" height="12" fill="#c5c5c5">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.2s" begin="-0.08571428571428572s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(334.2857142857143 50 50)">
  <rect x="48" y="22" rx="7.68" ry="3.52" width="4" height="12" fill="#c5c5c5">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1.2s" begin="0s" repeatCount="indefinite"></animate>
  </rect>
</g></svg>
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
		width: 1.2rem;
		height: 1.2rem;
		fill: #50aedf;
		position: absolute;
		top: 50%;
		margin-top: -0.6rem;
		margin-left: -0.6rem;
		background: rgba(0,0,0,0.8);
		border-radius: 0.1rem;
	 }

</style>
