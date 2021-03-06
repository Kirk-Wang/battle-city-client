import identity from "lodash/identity";
import React from "react";
import { connect, Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import createSgaMiddleware, { Task } from "redux-saga";

export default function saga(sagaFn: any, reducerFn: any, preloadedState?: any): any {
    return function(Component: any) {
        const Connected = connect(identity)(Component);
        return class extends React.PureComponent {
            public task: Task;
            public store: any;

            constructor(props: any) {
                super(props);
                const sagaMiddleware = createSgaMiddleware();
                this.store = createStore(reducerFn, preloadedState, applyMiddleware(sagaMiddleware));
                this.task = sagaMiddleware.run(sagaFn);
            }

            public componentWillUnmount() {
                this.task.cancel();
            }

            public render() {
                return (
                    <Provider store={this.store}>
                        <Connected />
                    </Provider>
                );
            }
        };
    };
}
