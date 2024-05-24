// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFG5Y9vWfQFOl30V5tpvwA2TlexkjPA4g",
  authDomain: "rent-a-car-70a13.firebaseapp.com",
  projectId: "rent-a-car-70a13",
  storageBucket: "rent-a-car-70a13.appspot.com",
  messagingSenderId: "897978063642",
  appId: "1:897978063642:web:e3d3a26b2c35b391536aa3",
  measurementId: "G-H4T2FMC0VF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Realtime Database and Storage
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, storage };
