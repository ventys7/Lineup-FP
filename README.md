# 📋 Lineup-FP — Fantacalcio Manager

Lineup-FP is a modern, client-side web application designed to manage and compose Fantasy Football (Fantacalcio) lineups with ease. 

Forget manual lists: this tool connects directly to a **Google Sheet (CSV)** to fetch your league's data and lets you build your team (starters + bench) while respecting all role constraints and tactical formations.

---

### ✨ Key Features
* **Dynamic Data Loading:** Fetches player data in real-time from a public Google Sheets CSV.
* **Manager Selection:** Switch between different managers to see their specific rosters instantly.
* **Smart Roster Management:** Visual cards with role badges (P, D, C, A) and selection states.
* **Tactical Lineup Builder:** * Choose your module (3-4-3, 3-5-2, 4-4-2, etc.).
    * Automatic validation of role limits for both starters and bench.
    * Intelligent goalkeeper block management.
* **Advanced Interaction:** Full **Drag & Drop** support to assign players to slots.
* **Export & Feedback:** Export your final formation via modal and receive real-time feedback via toasts for any invalid moves.
* **Fully Responsive:** Optimized for both desktop strategists and mobile "last-minute" changes.

---

### 🛠 Technical Overview
* **Frontend:** Vanilla HTML5, CSS3 (with glassmorphism and modern UI effects), and JavaScript.
* **Data:** Uses `fetch` and a robust CSV parsing logic to turn a simple spreadsheet into a functioning database.
* **Logic:** The app handles complex role-filtering and formation-validation strictly on the client side.

---

### 🌟 Credits & Acknowledgments
I built this because managing a Fantacalcio roster shouldn't feel like a chore. It's a tool made by a fan, for fans.

* **AI Refactoring:** Since I'm a "non-developer," I heavily relied on AI to handle the complex CSV parsing, the Drag & Drop API integration, and the logic behind formation constraints.

