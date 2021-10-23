import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.less';

const IndexPage=({dispatch,user})=> {
  const click=()=>{
    dispatch({
      type:'user/getUserInfo',
      payload: {
        type:1
      }
    })
  }
  const clickPost=()=>{
    dispatch({
      type:'user/getPostInfo',
      payload: {
        id:1
      }
    })
  }
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Hello!! Welcome to dva!</h1>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li><button onClick={click}>点击get</button></li>
        <li><button onClick={clickPost}>点击post</button></li>
        <li>{user.data&&user.data.nickName}</li>
        <li>To get started, edit <code>src/index.js</code> and save to reload.</li>
        <li><a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">Getting Started</a></li>
      </ul>
    </div>
  );
}

IndexPage.propTypes = {
};
const mapStateToProps = (state) => {
  return {
     user:state.user
  }
}

export default connect(mapStateToProps)(IndexPage);
