module.exports = {
  bar: {
    chart: {
            type:'column'//指定图表的类型，默认是折线图（line）
            },
            style: {
                fontFamily: "",
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#006cee',
                spacingLeft:50
            },
            credits: {
              enabled:false
            },//去掉地址
            title: {
                text: '' //指定图表标题
            },
            colors: ['#6cb3ef'],
            xAxis: {
                    tickWidth:0,
                    gridLineWidth:0,
                    categories: [], //指定x轴分组,
                    lineWidth:1,
                    lineColor: "#cccccc",
                },
            yAxis: {
                    max:100,
                    tickWidth:0,
                    gridLineWidth:0,
                    title: {
                        text: '分数', //指定y轴的标题
                        style:{ "color": "transparent" }
                    },
                    enabled:true,
                    lineWidth:1,
                    lineColor: "#cccccc",
                    labels: {
                        formatter:function(){
                            return "-";
                        },
                        style:{ "color": "transparent" }
                      }
            },
            scrollbar: {
                enabled: true
            },
             tooltip : {
                enabled :false 
             },
            plotOptions: {
                    column: {
                            colorByPoint:true,
                            // pointWidth:25//设置柱状图宽度
                             maxPointWidth:20
                        },
                    },

            series: [{ //指定数据列
                   
                    data: [], //数据
                    showInLegend: false 
                }]
  },
 
    
}

