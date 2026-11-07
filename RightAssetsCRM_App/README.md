# Right Assets CRM — Android Mobile Executive Application

Native Android Mobile CRM Application for **Right Asset's Property Consultants** (MahaRERA: `A51800000620`, REAAK: `RM No. 204`).
Built for **Master of Computer Applications (MCA) Mini Project** at **K. J. Somaiya Institute of Management (KJSIM), Mumbai**.

---

## 🏗️ Architecture & Technology Stack
* **IDE:** Android Studio (Ladybug / Hedgehog)
* **Languages:** Kotlin 1.9+ & Java 17
* **Design System:** Material 3 Dark & Luxury Gold (`#D4AF37`) Theme
* **Architecture Pattern:** MVVM (Model-View-ViewModel) with Kotlin Coroutines & Flow
* **Cloud Backend:** Google Firebase Realtime Database
* **Device APIs:** Android Telephony Intents (`Intent.ACTION_DIAL`), WhatsApp API Intent

---

## 🚀 How to Open & Run in Android Studio

### Step 1: Open in Android Studio
1. Launch **Android Studio**.
2. Select **File** -> **Open...**
3. Browse and select this folder:
   `C:\Users\aryan\OneDrive\Desktop\MCA KJSIM\SECOND YEAR\MINI PROJECT\RightAssetsCRM_App`
4. Click **OK**. Gradle will automatically sync project dependencies.

### Step 2: Connect Firebase Realtime Database
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a project named **"Right Assets CRM"** (or use your existing project).
3. Under **Build**, select **Realtime Database** -> **Create Database** (choose Singapore or US region, start in test mode).
4. Click the three dots menu (top right of DB) -> **Import JSON**.
5. Select the pre-generated seed file located at:
   `..\firebase_export\firebase_db_seed.json`
   *(This immediately populates all 500 categorized leads, 100 verified properties, and 4 advisors).*
6. In Project Settings in Firebase, add an Android App with package name:
   `com.rightassets.crm`
7. Download `google-services.json` and place it inside the `app/` folder:
   `RightAssetsCRM_App\app\google-services.json`

### Step 3: Run on Emulator or Physical Smartphone
1. Select any Android Virtual Device (AVD) running **API 26 to 34** (or connect your phone with USB debugging enabled).
2. Click the green **Run (Shift + F10)** button.

---

## 📱 Core Application Modules
1. **Role-Based Authentication (`ui/auth/`):**
   * **Admin (Owner):** Sanjeev Mehta (full pipeline access, high-value project negotiations).
   * **Associates:** Nutan Madam (Resale), Roshan (Rentals), Krutika (Digital Marketing).
2. **Pipeline Dashboard (`ui/dashboard/`):**
   * Segmented tabs: `New Leads`, `Site Visits`, `Negotiation`, `Closed`.
   * Live KPI Counters: Total Leads (500), Active Visits, Closed Deals.
3. **One-Touch Field Actions (`util/IntentHelper.java`):**
   * Tap to launch native phone dialer.
   * Tap to launch pre-filled personalized WhatsApp greeting.
4. **AI Smart Matcher (`ui/matcher/`):**
   * Instant algorithmic matching of client budget & corridor with the 100 verified inventory properties.
