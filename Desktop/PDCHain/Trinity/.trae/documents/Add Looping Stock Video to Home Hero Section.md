I will add a cinematic looping background video to the "Welcome" section of the Home page. This will enhance the "Mappa" aesthetic while keeping the "Lost & Found" connection theme.

### **Implementation Plan**

1. **Target File:** `frontend/src/dashboard/Home.tsx`
2. **Action:**

   * Locate the "Welcome" hero section (the top container with `py-20`).

   * Insert a `<video>` element positioned absolutely in the background of this section.

   * Use a "Digital Connections/Network" stock video (Source: Mixkit) to symbolize the connection between lost items and their owners.

   * **Video URL:** `https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-lines-2771-large.mp4` (Blue/Dark tech lines, fits the dark theme perfectly).
3. **Styling:**

   * **Positioning:** `absolute inset-0 w-full h-full object-cover` to fill the banner.

   * **Layering:** `-z-10` to sit behind the text but in front of the page background.

   * **Visuals:** `opacity-40` and `mix-blend-overlay` (if needed) to ensure the white text remains readable.

   * **Behavior:** `autoPlay`, `loop`, `muted`, `playsInline`.
4. **Safeguards:**

   * Add a dark gradient overlay on top of the video to ensure maximum text contrast.

   * The video will only exist in the `Home` component, so it won't affect other pages.

### **Preview of Changes**

```tsx
<div className="relative py-20 border-b-2 border-white overflow-hidden"> {/* Added overflow-hidden */}
  {/* Video Background */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute top-0 left-0 w-full h-full object-cover -z-10 opacity-30"
  >
    <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-lines-2771-large.mp4" type="video/mp4" />
  </video>
  
  {/* Gradient Overlay for Text Readability */}
  <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50 -z-10"></div>

  {/* Existing Content... */}
  <div className="absolute top-0 left-0 ...">LOST & FOUND</div>
  ...
</div>
```

