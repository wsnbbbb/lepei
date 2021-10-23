    interface Config {
        imgUrl: string;
        baseUrl: string;
       
    }
    const config: Config = {
        // imgUrl: "http://test.qiniu.lepayedu.com/",
        imgUrl: "http://qiniu.lepayedu.com/",
        baseUrl:''
    };
  
    if (process.env.NODE_ENV === "development") { // 开发环境
        // config.baseUrl = "http://39.108.73.183:7017/"
        config.baseUrl = "http://yeyapp.lepayedu.com/app/api"

    }else { //生产环境
        config.baseUrl = "http://yeyapp.lepayedu.com/app/api"
    }
    export default config;