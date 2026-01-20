
### **Global App Behavior**
* **Navigation:** No bottom tab bar during activities. Immersive full-screen mode.
* **Colors:** Deep charcoal background (`#121212`) is the default canvas. No pure white (`#FFFFFF`)—use soft gray (`#E0E0E0`) for text to reduce eye strain.
* **Haptics:** Enabled by default on all buttons.
* **Audio:** App mixes with background audio (Spotify/Podcasts) *unless* in Zone 1 (Panic), where it takes exclusive focus (ducks other audio).

---

### **Phase 1: Launch & Triage**

#### **SCR-01: The Splash (Instant Load)**
* **Visual:** Pitch black screen. The app logo (a simple anchor or stylized "A") pulses once in the center with a "heartbeat" double-haptic vibration.
* **Duration:** < 1.5 seconds.
* **Action:** Auto-transition to SCR-02.
* **Tech Note:** Pre-load the "Panic" assets during this splash so they are ready instantly.

#### **SCR-02: The Check-In (Home Screen)**
* **Header:** "How are you feeling right now?" (Font: Sans-serif, Rounded, Large).
* **Central Element (The Blob):**
    * A 3D animated sphere in the center.
    * Default State: Slowly undulating, cool blue color.
* **Controls (The Sliders):**
    * **Slider A (Intensity):** Located below the blob.
        * *Left:* "Calm" | *Right:* "Intense"
        * *Feedback:* As user drags right, the Blob spins faster, turns from Blue -> Purple -> Orange -> Red, and spikes grow on its surface.
    * **Slider B (Location):** Located below Slider A.
        * *Left:* "Mind" | *Right:* "Body"
        * *Feedback:* Dragging left adds "electricity/static" effects to the blob. Dragging right adds a "heavy/liquid" texture.
* **Primary CTA:** A large button labeled **"Anchor Me"** appears only after sliders are touched.
* **Emergency CTA:** A persistent "Floating Action Button" (FAB) in the bottom right corner: Red circle with white "SOS" text. Tapping this bypasses everything and goes to **SCR-03**.

---

### **Phase 2: The Activity Zones (Detailed Workflow)**

#### **Zone 1: Panic Mode (The Rescue)**
*Triggered if: Slider A is High + Slider B is Body OR User taps SOS.*

**SCR-03: The Interrupter**
* **Visual:** Immediate cut to solid black.
* **Haptic:** A sharp, heavy vibration (duration: 0.5s).
* **Text:** White text fades in rapidly: **"YOU ARE SAFE."**
* **Audio:** All background music (Spotify etc.) is paused.
* **Duration:** 3 Seconds fixed. User cannot tap anything.
* **Transition:** Auto-fade to SCR-04.

**SCR-04: The Haptic Pacer**
* **Visual:** A simple glowing ring in the center.
* **Animation:**
    * **Inhale (4s):** Ring expands, fills with light. Phone vibrates with increasing intensity.
    * **Hold (4s):** Ring pulses gently. Vibration stops (silence).
    * **Exhale (4s):** Ring contracts. Phone vibrates with decreasing intensity.
* **Text Instruction:** Large text at top: "Breathe with the vibration."
* **Logic:** Loops for 4 cycles (approx 48 seconds).
* **Controls:** No "Exit" button. Only a faint "I'm Okay Now" button appears after 2 cycles.

**SCR-05: Grounding (5-4-3-2-1)**
* **Visual:** 5 large, empty circular slots at the bottom. Instruction text at the top.
* **Step 1:** "Look around. Tap the button for **5** things you see."
    * *Action:* User taps a large central button labeled "I see one."
    * *Feedback:* A distinct "Pop" sound and haptic tap. One empty slot fills up.
* **Step 2 (Auto-advance):** "Find **4** things you can touch." (4 slots appear).
* **Step 3:** "Listen for **3** sounds." (3 slots).
* **Step 4:** "Smell **2** things." (2 slots).
* **Step 5:** "Name **1** good thing about yourself." (1 slot).
* **Transition:** Upon completing Step 5, screen dissolves to SCR-12 (Post-Check).

---

#### **Zone 2: Focus Lab (Distraction)**
*Triggered if: Slider A is High + Slider B is Mind.*

**SCR-06: The Sorter Game**
* **Visual:** A minimal canvas.
* **Setup:**
    * Top of screen: 3 "Buckets" (Red, Blue, Yellow).
    * Center of screen: A chaotic pile of colored balls (physics-enabled).
* **Interaction:** User flicks balls into the matching bucket.
* **Audio:** ASMR-style "clack" sounds when balls hit the bucket.
* **Gamification (The Hook):**
    * No timer. No score.
    * If a ball is put in the wrong bucket, it just bounces out gently (no failure punishment).
    * Once cleared, a new pile drops with a satisfying "whoosh."
* **Exit:** A subtle "Pause" icon in top right. Tapping it shows: "Keep Playing" or "I feel better."

---

#### **Zone 3: The Sanctuary (Comfort)**
*Triggered if: Slider A is Low + Slider B is Mind.*

**SCR-07: The Fractal Zoom**
* **Visual:** Full screen artwork (e.g., a watercolor galaxy or geometric forest).
* **Interaction:**
    * User places two fingers on screen and spreads to zoom (Pinch-to-zoom).
    * The image never pixelates; it endlessly reveals new layers of the same pattern.
* **Goal:** Hidden Object.
    * A small toast notification appears: "Can you find the golden star?"
    * User zooms until they spot it. Tapping it releases a soft chime sound.
* **Exit:** User can swipe down to exit at any time.

---

#### **Zone 4: Decompression (Relaxation)**
*Triggered if: Slider A is Low + Slider B is Body.*

**SCR-08: Audio Mixer**
* **Visual:** Dark background. 4 Vertical Sliders.
* **Slider Labels:**
    1.  Brown Noise (Deep Rumble)
    2.  Pink Noise (Rain-like)
    3.  Fan Drone (Mechanical)
    4.  Heartbeat (Slow rhythm)
* **Interaction:**
    * User drags sliders up/down to create a mix.
    * **Toggle Switch:** "Timer" (15m, 30m, 60m).
    * **Toggle Switch:** "Play in Background" (Allows user to lock phone and sleep).
* **Visual Feedback:** Subtle sound waves at the bottom move according to the mix intensity.

**SCR-09: Body Scan (Optional Tab in Zone 4)**
* **Visual:** An outline of a human body.
* **Interaction:**
    * Audio guide plays: "Focus on your feet."
    * The "Feet" area of the outline glows warm orange.
    * "Tense them..." (Feet glow bright red).
    * "Release..." (Feet turn cool blue and "melt" visually).
* **Progress:** The glow moves up the body (Legs -> Stomach -> Hands -> Shoulders -> Face).

---

### **Phase 3: The Exit & Dashboard**

#### **SCR-10: Post-Session Check (The Loop Closer)**
* **Trigger:** User taps "I feel better" or completes a Panic cycle.
* **Visual:** The same "Blob" from SCR-02 appears.
* **Question:** "Update your shape?"
* **Interaction:** User adjusts sliders again.
    * *Logic:* If the "Intensity" slider is lower than before -> **Success State.**
    * *Logic:* If unchanged -> **Prompt:** "Would you like to try a different exercise?"

#### **SCR-11: Success Screen**
* **Visual:** The Blob transforms into a smooth, glowing pearl.
* **Text:** "You did it. You took control."
* **Button:** "Back to Dashboard."

#### **SCR-12: The Dashboard (Safe Mode)**
* **Content:**
    * **Greeting:** "Good evening, [Name]."
    * **Stat Card:** "Current Streak: 3 Days."
    * **Quick Actions:** Large square cards for direct access to tools (e.g., "Open Mixer," "Start Sorter").
    * **Panic FAB:** The Red SOS button is always here.
    * **Settings Gear:** Top right (Profile, Dark Mode toggle, Haptic Strength adjustments).

---

### **Tech Stack Recommendations for Developer**
1.  **Framework:** Flutter or React Native (Cross-platform is fine, but Flutter handles complex animations/haptics better).
2.  **Animation Engine:** Rive (for the Blob and Fluid simulations) or Lottie.
3.  **Haptics:**
    * *iOS:* CoreHaptics API (Critical for the "Breathing Pacer").
    * *Android:* Vibrator API / HapticFeedbackConstants.
4.  **Local Storage:** Hive or SQLite (Store user stats and audio preferences locally—privacy first).

**Would you like me to write the "Copy Script" (the exact text content) for the Guided Body Scan audio so you can record it?**