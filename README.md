<div align="center">
  <h1>🧭 KCET Compass</h1>
  <p><strong>Analyze 3 years of KCET cutoff data and discover your best engineering college admission opportunities in Karnataka instantly.</strong></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Vite-5.4.0-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/Framer%20Motion-11.0.0-f01ed6?style=for-the-badge&logo=framer" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
  </p>
</div>

<br />

## 🌟 Overview

**KCET Compass** is an advanced, interactive web application designed to help students navigate the Karnataka Common Entrance Test (KCET) engineering counseling process. By leveraging 3 years of historical cutoff data, it provides an intelligent prediction of the best available engineering colleges based on a student's rank, category, and preferred courses.

---

## ✨ Key Features

- **🎯 Accurate College Predictor**: Input your KCET rank and category to instantly see which colleges you are most likely to get into.
- **📊 3-Year Data Analysis**: We analyze cutoffs across multiple previous years to give you a more realistic and reliable prediction.
- **📈 Interactive Visualizations**: Explore cutoffs and trends visually using beautifully crafted charts powered by Recharts.
- **📥 Export Options**: Generate and download personalized, detailed PDF reports of your college predictions using jsPDF.
- **✨ Fluid Animations**: Enjoy a modern, responsive, and seamless user experience with Framer Motion animations.
- **🐍 Data Processing Pipeline**: Includes a Python script (`convert_pdfs.py`) to systematically parse and convert official KCET raw PDF data into structured, ready-to-use datasets.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Vite for lightning-fast HMR and building.
- **Routing**: React Router DOM for seamless Single Page Application (SPA) navigation.
- **Animations**: Framer Motion for sophisticated UI transitions and micro-interactions.
- **Data Visualization**: Recharts for dynamic and responsive charts.
- **Icons**: React Icons for scalable vector graphics.

### Utilities & Processing
- **CSV Parsing**: PapaParse for rapid and reliable in-browser data processing.
- **PDF Generation**: jsPDF & jsPDF-AutoTable for client-side document creation.
- **Data Conversion**: Python (used offline for parsing original KCET PDFs).

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16 or higher recommended) and `npm` installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/kcet-compass.git
   cd kcet-compass
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open the app:**
   Open your browser and navigate to `http://localhost:5173`.

---

## 📂 Project Structure

```text
kcet-compass/
├── public/                 # Static assets (favicons, etc.)
├── data/                   # Processed KCET cutoff CSV datasets
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Application views/routes
│   ├── sections/           # Large page sections (e.g., Hero, Predictor)
│   ├── utils/              # Helper functions and hooks
│   ├── App.jsx             # Main application component & routing
│   ├── index.css           # Global vanilla CSS styles & design system
│   └── main.jsx            # React entry point
├── convert_pdfs.py         # Python script for raw data extraction
├── package.json            # Dependencies and npm scripts
└── vite.config.js          # Vite build configuration
```

---

## 🎨 Design Philosophy

We believe that tools for students should not only be highly functional but also beautiful. KCET Compass features a **modern, rich aesthetic** with:
- Carefully curated color palettes and smooth gradients.
- Micro-animations to enhance user engagement.
- Clean typography using Google Fonts (Inter & Outfit).
- A fully responsive layout for perfect viewing on mobile, tablet, and desktop.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check the [issues page](../../issues) if you want to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>Built with ❤️ for Karnataka's future engineers.</p>
</div>
