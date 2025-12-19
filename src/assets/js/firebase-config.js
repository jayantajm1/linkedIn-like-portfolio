// ===========================================
// FIREBASE CONFIGURATION
// Backend for Visitor Tracking
// ===========================================

/*
 * SETUP INSTRUCTIONS:
 *
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project or use existing one
 * 3. Add a Web App to your project
 * 4. Copy the Firebase configuration
 * 5. Replace the firebaseConfig below with your config
 * 6. Enable Firestore Database in Firebase Console
 * 7. Set up Firestore Security Rules (see below)
 */

// Your Firebase Configuration (REPLACE WITH YOUR OWN)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};

// ===========================================
// FIREBASE INITIALIZATION
// ===========================================

// Check if Firebase is available
if (typeof firebase !== "undefined") {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Initialize Firestore
  const db = firebase.firestore();

  // Collection references
  const visitorsCollection = db.collection("visitors");
  const interactionsCollection = db.collection("interactions");

  console.log("✅ Firebase initialized successfully");
} else {
  console.warn("⚠️ Firebase SDK not loaded. Using localStorage fallback.");
}

// ===========================================
// FIRESTORE OPERATIONS
// ===========================================

const FirebaseService = {
  // Save visitor data
  async saveVisitor(visitorData) {
    try {
      if (typeof firebase === "undefined") {
        throw new Error("Firebase not available");
      }

      const docRef = await visitorsCollection.add({
        ...visitorData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      console.log("✅ Visitor saved to Firebase:", docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("❌ Error saving visitor to Firebase:", error);
      return { success: false, error: error.message };
    }
  },

  // Save interaction data
  async saveInteraction(interactionData) {
    try {
      if (typeof firebase === "undefined") {
        throw new Error("Firebase not available");
      }

      const docRef = await interactionsCollection.add({
        ...interactionData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      console.log("✅ Interaction saved to Firebase:", docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("❌ Error saving interaction to Firebase:", error);
      return { success: false, error: error.message };
    }
  },

  // Get all visitors
  async getAllVisitors(limit = 1000) {
    try {
      if (typeof firebase === "undefined") {
        throw new Error("Firebase not available");
      }

      const snapshot = await visitorsCollection
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();

      const visitors = [];
      snapshot.forEach((doc) => {
        visitors.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(`✅ Retrieved ${visitors.length} visitors from Firebase`);
      return visitors;
    } catch (error) {
      console.error("❌ Error fetching visitors from Firebase:", error);
      return [];
    }
  },

  // Get visitors by date range
  async getVisitorsByDateRange(startDate, endDate) {
    try {
      if (typeof firebase === "undefined") {
        throw new Error("Firebase not available");
      }

      const snapshot = await visitorsCollection
        .where("createdAt", ">=", startDate)
        .where("createdAt", "<=", endDate)
        .orderBy("createdAt", "desc")
        .get();

      const visitors = [];
      snapshot.forEach((doc) => {
        visitors.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return visitors;
    } catch (error) {
      console.error("❌ Error fetching visitors by date range:", error);
      return [];
    }
  },

  // Get visitor count
  async getVisitorCount() {
    try {
      if (typeof firebase === "undefined") {
        throw new Error("Firebase not available");
      }

      const snapshot = await visitorsCollection.get();
      return snapshot.size;
    } catch (error) {
      console.error("❌ Error getting visitor count:", error);
      return 0;
    }
  },

  // Delete old visitors (cleanup)
  async deleteOldVisitors(daysOld = 90) {
    try {
      if (typeof firebase === "undefined") {
        throw new Error("Firebase not available");
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const snapshot = await visitorsCollection
        .where("createdAt", "<", cutoffDate)
        .get();

      const batch = db.batch();
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`✅ Deleted ${snapshot.size} old visitor records`);
      return snapshot.size;
    } catch (error) {
      console.error("❌ Error deleting old visitors:", error);
      return 0;
    }
  },
};

// ===========================================
// ENHANCED VISITOR TRACKER WITH FIREBASE
// ===========================================

if (typeof VisitorTracker !== "undefined") {
  // Override the sendToBackend method to use Firebase
  VisitorTracker.prototype.sendToBackend = async function (data) {
    const result = await FirebaseService.saveVisitor(data);
    return result.success;
  };

  // Override the sendInteractionData method to use Firebase
  VisitorTracker.prototype.sendInteractionData = async function (data) {
    const result = await FirebaseService.saveInteraction({
      sessionId: this.sessionId,
      interactions: data,
      logs: JSON.parse(sessionStorage.getItem("interaction_logs") || "[]"),
    });
    return result.success;
  };
}

// ===========================================
// DASHBOARD DATA FETCHING WITH FIREBASE
// ===========================================

if (typeof window.fetchFromBackend !== "undefined") {
  window.fetchFromBackend = async function () {
    try {
      const visitors = await FirebaseService.getAllVisitors();
      return visitors.length > 0 ? visitors : null;
    } catch (error) {
      console.error("Error fetching from Firebase:", error);
      return null;
    }
  };
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = { firebaseConfig, FirebaseService };
}

/*
 * ===========================================
 * FIRESTORE SECURITY RULES
 * ===========================================
 *
 * Add these rules to your Firestore Database:
 *
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *
 *     // Visitors collection - Anyone can write, only owner can read
 *     match /visitors/{document=**} {
 *       allow read: if request.auth != null; // Only authenticated users (you)
 *       allow write: if true; // Anyone can track visits
 *     }
 *
 *     // Interactions collection - Anyone can write, only owner can read
 *     match /interactions/{document=**} {
 *       allow read: if request.auth != null; // Only authenticated users (you)
 *       allow write: if true; // Anyone can track interactions
 *     }
 *   }
 * }
 *
 * ===========================================
 * ALTERNATIVE: SUPABASE CONFIGURATION
 * ===========================================
 *
 * If you prefer Supabase over Firebase:
 *
 * 1. Go to https://supabase.com/
 * 2. Create a new project
 * 3. Create tables:
 *    - visitors (id, session_id, timestamp, url, referrer, user_agent, location, etc.)
 *    - interactions (id, session_id, clicks, time_on_page, scroll_depth, etc.)
 * 4. Get your API URL and anon key
 * 5. Use the Supabase JavaScript client
 *
 * Example:
 *
 * import { createClient } from '@supabase/supabase-js'
 *
 * const supabaseUrl = 'YOUR_SUPABASE_URL'
 * const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
 * const supabase = createClient(supabaseUrl, supabaseKey)
 *
 * // Insert visitor
 * const { data, error } = await supabase
 *   .from('visitors')
 *   .insert([visitorData])
 *
 * // Query visitors
 * const { data, error } = await supabase
 *   .from('visitors')
 *   .select('*')
 *   .order('created_at', { ascending: false })
 *   .limit(1000)
 */
