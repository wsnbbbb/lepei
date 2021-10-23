
import  {assetsType, assetList, propertyUnit, assetsDetail,addAssetsInfo, editAssetsInfo, delAssetsInfo, importAssetsName, propertyType,addPropertyType,applyRuleSet,
  propertyTypeName, editPropertyType, delAssetType, importAssetTypes, getUnitList, addUnit, unitDetail, editUnit, delUnit, assetQueryList, goodsApply, batchesDelApply,
  delApply,getAssetsDetail, getHandlerDetail, saveHandlerSet, goodsPurchase, delPurchase, batchesDelPurchase, getPurchaseDetail, getAuditorDetail,saveAuditorSet, assetManageList,
  getStockRecord, delStockRecord,stockDetail, allotRecord, delAllotRecord,takeStock,takeStockRecord,getAssetByTypes,getAssetUser,setAssetTransfer,allcatedAsset,getAssetIncrease,
  delAssetsIncrease,saveAddIncrease,editAddIncrease,batchImportAsset}  from 'services/index';
export default {

    namespace: 'assetsManage',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
    effects: {
      
      * assetsType({ payload, callback }, { call, put }) {  //获取资产类型列表
        let res=yield call(assetsType, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * assetList({ payload, callback }, { call, put }) {  //获取资产信息列表
        let res=yield call(assetList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * propertyUnit({ payload, callback }, { call, put }) {  //获取计量单位列表
        let res=yield call(propertyUnit, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * assetsDetail({ payload, callback }, { call, put }) {  //获取资产详情
        let res=yield call(assetsDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addAssetsInfo({ payload, callback }, { call, put }) {  // 新增
        let res=yield call(addAssetsInfo, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * editAssetsInfo({ payload, callback }, { call, put }) {  // 修改
        let res=yield call(editAssetsInfo, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delAssetsInfo({ payload, callback }, { call, put }) {  // 删除
        let res=yield call(delAssetsInfo, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * importAssetsName({ payload, callback }, { call, put }) {  // 导入资产名称模板
        let res=yield call(importAssetsName, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * propertyType({ payload, callback }, { call, put }) {  // 资产类型管理
        let res=yield call(propertyType, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addPropertyType({ payload, callback }, { call, put }) {  // 添加资产类型
        let res=yield call(addPropertyType, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * propertyTypeName({ payload, callback }, { call, put }) {  // 获取资产类型名称
        let res=yield call(propertyTypeName, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * editPropertyType({ payload, callback }, { call, put }) {  // 修改资产类型名称
        let res=yield call(editPropertyType, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delAssetType({ payload, callback }, { call, put }) {  // 删除资产类型
        let res=yield call(delAssetType, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * importAssetTypes({ payload, callback }, { call, put }) {  // 导入资产类型模板
        let res=yield call(importAssetTypes, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getUnitList({ payload, callback }, { call, put }) {  // 获取计量单位列表
        let res=yield call(getUnitList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addUnit({ payload, callback }, { call, put }) {  // 添加计量单位
        let res=yield call(addUnit, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * unitDetail({ payload, callback }, { call, put }) {  // 获取计量单位详情
        let res=yield call(unitDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * editUnit({ payload, callback }, { call, put }) {  // 修改计量单位
        let res=yield call(editUnit, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delUnit({ payload, callback }, { call, put }) {  // 删除计量单位
        let res=yield call(delUnit, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * assetQueryList({ payload, callback }, { call, put }) {  // 资产查询列表
        let res=yield call(assetQueryList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * goodsApply({ payload, callback }, { call, put }) {  // 资产申领列表
        let res=yield call(goodsApply, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * batchesDelApply({ payload, callback }, { call, put }) {  // 资产申领-批量删除
        let res=yield call(batchesDelApply, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delApply({ payload, callback }, { call, put }) {  // 资产申领-删除
        let res=yield call(delApply, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getAssetsDetail({ payload, callback }, { call, put }) {  // 资产申领-详情
        let res=yield call(getAssetsDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getHandlerDetail({ payload, callback }, { call, put }) {  // 获取处理人详情
        let res=yield call(getHandlerDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * saveHandlerSet({ payload, callback }, { call, put }) {  // 保存处理人设置
        let res=yield call(saveHandlerSet, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * goodsPurchase({ payload, callback }, { call, put }) {  // 物品申购列表
        let res=yield call(goodsPurchase, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delPurchase({ payload, callback }, { call, put }) {  // 物品申购-删除
        let res=yield call(delPurchase, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * batchesDelPurchase({ payload, callback }, { call, put }) {  // 物品申购-批量删除
        let res=yield call(batchesDelPurchase, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getPurchaseDetail({ payload, callback }, { call, put }) {  // 物品申购-详情
        let res=yield call(getPurchaseDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getAuditorDetail({ payload, callback }, { call, put }) {  // 物品申购-审核人详情
        let res=yield call(getAuditorDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * saveAuditorSet({ payload, callback }, { call, put }) {  // 物品申购-审核人设置
        let res=yield call(saveAuditorSet, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * assetManageList({ payload, callback }, { call, put }) {  // 资产管理-列表
        let res=yield call(assetManageList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },    
      * applyRuleSet({ payload, callback }, { call, put }) {  // 资产管理-申领规则设置
        let res=yield call(applyRuleSet, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getStockRecord({ payload, callback }, { call, put }) {  // 资产管理-入库记录列表
        let res=yield call(getStockRecord, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delStockRecord({ payload, callback }, { call, put }) {  // 资产管理-入库记录删除
        let res=yield call(delStockRecord, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * stockDetail({ payload, callback }, { call, put }) {  // 资产管理-入库记录详情
        let res=yield call(stockDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * allotRecord({ payload, callback }, { call, put }) {  // 资产管理-分配记录
        let res=yield call(allotRecord, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * delAllotRecord({ payload, callback }, { call, put }) {  // 资产管理-分配记录删除
        let res=yield call(delAllotRecord, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * takeStock({ payload, callback }, { call, put }) {  // 资产管理-盘点
        let res=yield call(takeStock, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * takeStockRecord({ payload, callback }, { call, put }) {  // 资产管理-盘点记录
        let res=yield call(takeStockRecord, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getAssetByTypes({ payload, callback }, { call, put }) {  // 获取指定类型下的资产
        let res=yield call(getAssetByTypes, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getAssetUser({ payload, callback }, { call, put }) {  // 获取资产使用者
        let res=yield call(getAssetUser, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * setAssetTransfer({ payload, callback }, { call, put }) {  // 资产转移
        let res=yield call(setAssetTransfer, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * allcatedAsset({ payload, callback }, { call, put }) {  // 资产分配
        let res=yield call(allcatedAsset, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getAssetIncrease({ payload, callback }, { call, put }) {  // 资产增提
        let res=yield call(getAssetIncrease, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },    
      * delAssetsIncrease({ payload, callback }, { call, put }) {  // 资产增提-删除
        let res=yield call(delAssetsIncrease, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * batchImportAsset({ payload, callback }, { call, put }) {  // 资产增提-批量增提
        let res=yield call(batchImportAsset, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * saveAddIncrease({ payload, callback }, { call, put }) {  // 资产增提-添加
        let res=yield call(saveAddIncrease, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * editAddIncrease({ payload, callback }, { call, put }) {  // 资产增提-编辑
        let res=yield call(editAddIncrease, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
     
              
      
      
      
     



    },
  
    reducers: {
      save(state,action){
        return{...state,...action.payload}
      }
      
     
     
    },
  
  }
