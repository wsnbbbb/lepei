import md5 from 'md5';
import Logo from '../assets/logo.png';
import portraitGirl from '../assets/portrait-girl.png';
import portraitBoy from '../assets/portrait-boy.png';
import StyleDefault from '../assets/styleDefault.png';
import {imgUrl, baseUrl, key, uploadUrl, questionnaireUrl} from '../config'

export const portUrl=(path)=>{
    return `${baseUrl}${path}`;
}
export const questionUrl = questionnaireUrl


export const getImg = (path) => {
    if(path){
        return `${imgUrl}${path}`;
    }else{
        return Logo;
    }
};

export const getPortrait = (path, sex) => {
    if(path){
        return `${imgUrl}${path}`;
    }else{
        return sex == 1 ? portraitBoy : (sex == 2 ? portraitGirl : Logo);
    }
};
export const getImgOfStyle = (path) => {
    if(path){
        return `${imgUrl}${path}`;
    }else{
        return StyleDefault;
    }
};
export const getUpload=(path)=>{
    return `${uploadUrl}${path}`;
}
export const getSign = (data,path) => { //获取签名
    const keys=Object.keys(data).sort()
    let stringA="";
    let newObj = {};
    for (var i = 0; i < keys.length; i++) {//遍历newkey数组
      newObj[keys[i]] = data[keys[i]];//向新创建的对象中按照排好的顺序依次增加键值对
    }
    for(var p in newObj){ 
        stringA+= p+"="+newObj[p]+"&"
    }
    const sign=stringA+"key="+key;
    const signData=md5(sign).toUpperCase();
    const url=baseUrl+path+stringA+"sign="+signData
    return url
};