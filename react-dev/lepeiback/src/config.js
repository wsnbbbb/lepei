const env=process.env.currentEnv;

let _baseUrl='';
let _imgUrl='';
let _key="";
let _uploadUrl='';
let _questionnaireUrl='';
let _qrUrl = ''
let _previewUrl = ''
let _xiaopingtaiUrl = ''
let _outsideApplyUrl = ''
let _consultRegisterUrl=''
let _visitRegisterUrl=''
if(env==='development'){//开发环境
    //  _baseUrl='http://192.168.10.8:8090/api' //彭兵电脑
    //  _baseUrl='http://192.168.31.6:8090/api' //jt电脑
    //  _baseUrl='http://192.168.31.254:8080/api' //jt电脑
     
     _baseUrl='https://139.155.92.226:7011/api' //外网
    
    _imgUrl='http://test.qiniu.lepayedu.com/';
    _key="12345678";
    _uploadUrl="https://139.155.92.226:7011/lepeiback/template/"
    _questionnaireUrl='http://test.lepayedu.com:9303/questionnaire-survey/index.html#/login'
    _qrUrl = 'http://html5.lepayedu.com/fetch-web/index.html#/index/rateWeb'
    _previewUrl = 'http://html5.lepayedu.com/evaluation-pc/template/index.html'
    _xiaopingtaiUrl = 'http://html5.lepayedu.com/xiaopingtai/index.html'
    _outsideApplyUrl = 'http://test.lepayedu.com:7023/outside-apply/index.html#/login'
    _consultRegisterUrl='http://test.lepayedu.com:7023/consult/index.html#/main/'
    _visitRegisterUrl='http://test.lepayedu.com:7023/consult/index.html#/login/'
}else if(env==='preProduction'){//准生产环境
    _baseUrl='https://139.155.92.226:7011/api'
    _imgUrl='http://test.qiniu.lepayedu.com/';
    _key="12345678";
    _uploadUrl="https://139.155.92.226:7011/lepeiback/template/"
    _questionnaireUrl='http://test.lepayedu.com:9303/questionnaire-survey/index.html#/login'
    _qrUrl = 'http://html5.lepayedu.com/fetch-web/index.html#/index/rateWeb'
    _previewUrl = 'http://html5.lepayedu.com/evaluation-pc/template/index.html'
    _xiaopingtaiUrl = 'http://html5.lepayedu.com/xiaopingtai/index.html'
    _outsideApplyUrl = 'http://html5.lepayedu.com/outside-apply/index.html#/login'
    _consultRegisterUrl='http://test.lepayedu.com:7023/consult/index.html#/main/'
    _visitRegisterUrl='http://test.lepayedu.com:7023/consult/index.html#/login/'
}else{//正式环境
    _baseUrl='https://cloud.lepayedu.com/api'
    _imgUrl='http://qiniu.lepayedu.com/';
    _key="84CAC9E7";
    _uploadUrl="http://cloud.lepayedu.com/template/"
    _questionnaireUrl='http://html5.lepayedu.com/questionnaire-survey/index.html#/login'
    _qrUrl = 'http://html5.lepayedu.com/fetch-web/index.html#/index/rateWeb'
    _previewUrl = 'http://html5.lepayedu.com/evaluation-pc/template/index.html'
    _xiaopingtaiUrl = 'http://html5.lepayedu.com/xiaopingtai/index.html'
    _outsideApplyUrl = 'http://html5.lepayedu.com/outside-apply/index.html#/login'
    _consultRegisterUrl='http://html5.lepayedu.com/consult/index.html#/main/'
    _visitRegisterUrl='http://html5.lepayedu.com/consult/index.html#/login/'
}

export const baseUrl = _baseUrl
export const imgUrl = _imgUrl
export const key = _key
export const uploadUrl = _uploadUrl
export const questionnaireUrl = _questionnaireUrl
export const qrUrl = _qrUrl
export const previewUrl = _previewUrl
export const xiaopingtaiUrl = _xiaopingtaiUrl
export const outsideApplyUrl = _outsideApplyUrl
export const consultRegisterUrl = _consultRegisterUrl
export const visitRegisterUrl =  _visitRegisterUrl
