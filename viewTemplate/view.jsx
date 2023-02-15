/* eslint-disable react/react-in-jsx-scope */
// import React from 'react';
import { createRoot } from 'react-dom/client';
// import deepEqual from 'react-deep-equal';
import {
  saveRootElement,
  saveRootModelPropsSet,
  isUseReduxStore,
  saveReduxStore,
  View,
  Scope,
  Text,
  RouteScope,
} from 'focus-center';
/*******************************/
$focus_import_statement;

// check model is store or pure model
function checkModelIsStore(model) {
  const checkList = ['getState', 'subscribe', 'dispatch', 'replaceReducer'];
  return checkList.every((checkEl) => {
    return typeof model[checkEl] === 'function';
  });
}

class FocusView extends React.Component {
  constructor(props) {
    super(props);
    const isApplicationUseRedux = checkModelIsStore(model);
    isUseReduxStore(isApplicationUseRedux);
    if (isApplicationUseRedux) {
      this.state = model.getState();
      this.isStoreModel = true;
      saveReduxStore(model);
      if (window.$focus_data_from_server) {
        console.warn(
          'if you use redux store,you may not need modelFromServerKey,please check your *.view file'
        );
      }
    } else {
      this.state = Object.assign(
        model || {},
        window.$focus_data_from_server || {}
      );
    }
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //     return true;
  //     return !deepEqual(this.props, nextProps) && !deepEqual(this.state, nextState);
  // }
  UNSAFE_componentWillMount() {
    saveRootElement(this);
    saveRootModelPropsSet($focus_save_root_model_props_set);
  }
  componentDidMount() {
    if (this.isStoreModel) {
      model.subscribe(() => {
        this.forceUpdate();
      });
    }
  }
  render() {
    return $focus_view;
  }
}
/**
 * dataSource="@module.myTodoList.dataSource"
 * dataSource={this.state.myTodoList.dataSource}
 *
 * **/

if (document.getElementById($focus_root)) {
  createRoot(document.getElementById($focus_root)).render(<FocusView />);
} else {
  throw new Error(
    'no root container found,please check your *.view file! @focus-loader'
  );
}
