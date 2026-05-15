import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, increment, update } from "firebase/database";
import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAFC7pdhy-eFXw3_xP15kAEGTtequtVKNU",
  authDomain: "personal-portfolio-aad7a.firebaseapp.com",
  databaseURL: "https://personal-portfolio-aad7a-default-rtdb.firebaseio.com",
  projectId: "personal-portfolio-aad7a",
  storageBucket: "personal-portfolio-aad7a.firebasestorage.app",
  messagingSenderId: "243937097077",
  appId: "1:243937097077:web:17ed683605eb5a03b9cf3c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const analytics = getAnalytics(app);

// Track event with both Analytics and Database
const trackEvent = (eventName, data = {}) => {
  try {
    logEvent(analytics, eventName, data);
  } catch (e) {
    console.error('Analytics error:', e);
  }
};

export { db, ref, onValue, set, increment, update, analytics, logEvent, trackEvent };
