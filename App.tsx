import 'react-native-gesture-handler';
import 'react-native-get-random-values'
import { RealmProvider } from '@realm/react';
import { Exercise } from './src/models/Exercise';
import { Provider } from 'react-redux';
import { store } from './src/app/store';
import AppChild from './src/AppChild';
import { Program } from './src/models/Program';

export default function App() {
    return (
        // Remove "deleteRealmIfMigrationNeeded" option when the app is released
        <RealmProvider schema={[Program, Exercise]} deleteRealmIfMigrationNeeded={true}>
            <Provider store={store}>
                <AppChild />
            </Provider>
        </RealmProvider>
    );
}
