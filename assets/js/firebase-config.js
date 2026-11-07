// Firebase Realtime Database Configuration
const FIREBASE_CONFIG = {
  databaseURL: "https://right-assets-properties-default-rtdb.firebaseio.com"
};

const isFirebaseConfigured = () => {
  return !!FIREBASE_CONFIG.databaseURL;
};
