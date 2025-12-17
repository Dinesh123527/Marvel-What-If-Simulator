# 🌌 MCU What If Simulator

> "Time. Space. Reality. It's more than a linear path. It's a prism of endless possibility."

The **MCU What If Simulator** is an interactive web application that allows users to explore alternate timelines of the Marvel Cinematic Universe. By identifying "Nexus Events" and choosing different outcomes, users can generate unique divergent realities, visualized with T.V.A. style aesthetics.

![TVA Interface](public/icon.svg)

## ✨ Features

### 🔮 Rule-Based Simulation Engine
- **Deterministic Logic**: A robust Phase 3 engine that calculates timeline outcomes based on specific canon divergence rules.
- **Multiverse Scenarios**: Explore key moments like *The Snap*, *Battle of NY*, and *Civil War*.
- **Legacy Compatibility**: Automatically maps legacy divergence IDs to the new engine logic.

### 📈 Interactive Timeline Visualization
- **Bezier Curve Graphs**: Realistic, flowing timeline branches that mimic the "Sacred Timeline" aesthetic.
- **Dynamic Branch Points**: Graph nodes are generated in real-time based on simulation events.
- **Character Injection**: Automatically detects and tags key characters (Iron Man, Thanos, etc.) on the timeline nodes.

### 📺 TVA Datapad Interface
- **Immersive UI**: Glassmorphism alerts and panels styled after Time Variance Authority (T.V.A.) technology.
- **Animated Alerts**: Holographic "Datapad" notifications with CRT scanline effects.
- **Phase Filtering**: Filter scenarios by MCU Phase (1-4) with instant client-side updates.

### 🦸 Character Database
- **SuperHero API Integration**: Fetches and caches character stats (Power, Speed, Intelligence) to influence simulation stability (Coming Soon).
- **A-Z Filtering**: Browse the Marvel roster efficiently.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Animations**: Framer Motion
- **Database**: MySQL (via `mysql2`)
- **Icons**: Heroicons & Custom SVG

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Dinesh123527/Marvel-What-If-Simulator.git
    cd Marvel-What-If-Simulator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Database:**
    - Ensure you have a MySQL instance running.
    - Create a `.env.local` file with your credentials:
      ```env
      DB_HOST=localhost
      DB_USER=root
      DB_PASSWORD=yourpassword
      DB_NAME=mcu_what_if
      ```
    - Run the seed script to populate data:
      ```bash
      npx ts-node app/lib/seed.ts
      ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000) to start your watch.

## 🤝 Contributing

The Multiverse is vast. If you have ideas for new specialized simulation rules or UI upgrades, feel free to open a Pull Request!

---

*Verified by the Time Variance Authority.*
