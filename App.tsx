import { RealmProvider } from '@realm/react';
import { Exercise } from './src/models/Exercise';
import { Provider } from 'react-redux';
import { store } from './src/app/store';
import AppChild from './src/AppChild';

export default function App() {
    return (
        <RealmProvider schema={[Exercise]}>
            <Provider store={store}>
                <AppChild />
            </Provider>
        </RealmProvider>
    );
}
