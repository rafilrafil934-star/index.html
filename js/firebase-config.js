// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLTNMaDrmkCBCDIPl_gqJlLJzgAPLL__k",
  authDomain: "his-ai-66e8e.firebaseapp.com",
  projectId: "his-ai-66e8e",
  storageBucket: "his-ai-66e8e.firebasestorage.app",
  messagingSenderId: "1018367782084",
  appId: "1:1018367782084:web:54f72e10ae4c73906ced91"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export for other files
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
