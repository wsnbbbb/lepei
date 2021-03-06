import dva from 'dva';
import './index.css';
import createLoading from 'dva-loading';
import { message } from 'antd';
// 1. Initialize
const app = dva({
    onError(e) {
        message.error(e.message, /* duration */3);
    }
});

// 2. Plugins
// app.use({});
app.use(createLoading());

// 3. Model
app.model(require('./models/common').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

// 6. 将App挂载在window上
window.app = app;