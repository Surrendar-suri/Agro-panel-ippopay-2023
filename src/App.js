import MainRouter from "./routes/MainRouter";
import { BrowserRouter as Router } from "react-router-dom";
import MainRouters from './routes/routers';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store,persistor} from '../src/store/actions/store';
import allReducer from './store/reducers/index';
import thunk from 'redux-thunk';
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const store = createStore(allReducer, composeEnhancers(applyMiddleware(thunk)))
function App() {
  return (
    <Provider store={store} >
      <PersistGate persistor={persistor}>
      <Router>
        <MainRouters />
      </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
