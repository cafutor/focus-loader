/* eslint-disable react/react-in-jsx-scope */
// import React from 'react';
import ReactDOM from 'react-dom';
import deepEqual from 'react-deep-equal';
import { saveRootElement,View,Scope,Text,saveRootModelPropsSet} from 'focus-center';
/*******************************/
$focus_import_statement

class FocusView extends React.Component {
    constructor(props) {
        super(props);
        this.state=Object.assign(model||{},window.$focus_data_from_server||{});
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     return true;
    //     return !deepEqual(this.props, nextProps) && !deepEqual(this.state, nextState);
    // }
    componentWillMount() {
        saveRootElement(this);
        saveRootModelPropsSet($focus_save_root_model_props_set);
    }
    render() {
        return ($focus_view);
    }
};
/**
 * dataSource="@module.myTodoList.dataSource"
 * dataSource={this.state.myTodoList.dataSource}
 * 
 * **/
ReactDOM.render(<FocusView />, document.getElementById($focus_root));