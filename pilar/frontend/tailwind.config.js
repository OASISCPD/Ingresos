/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        backgroundBlack: "#291036",
        backgroundRed: "#F50D1D",
        textWhiteShadow: "#E1CECE",
        backgroundForm: "#81526F",
        backgroundButtonRose: "#FF00FF",
        backgroundButtonRed: "#FC0D1B",
        backgroundButtonGreen: "#06DE0E",
        backgroundButtonGreenDark: "#1D9D22",
        buttonSend: "#AA80F9",
        iconOrange: "#EE4444",
        backgroundSideBarDesktop: "#430F32",
        buttonSideBar: "#FF0008",
        backgroundSideBarUser: "#530F31",
        backgroundGray: "#2D2A2A",
        backgroundGrayBlack: "#2F2C2C",
        colorLine: "#696464",
        greenText: "#29FD2F",
        buttonGreen: "#136515",
        buttonGreenDark: "#0E450F",
        buttonRed: "#FF0000",
        buttonRedDark: "#BF0000",
        navbarColor: "#271036",
        backgroundModalGray: "#3E3838",
        backgroundButtonGreen: "#03CB0A",
        backgroundButtonIngresoManualGradient: "#0D6811",
        backgroundButtonOraenge: "#FF4200",
        backgroundButtonOraengeGradient: "#AD010C",
        scrollbar_bg: "#2D2D2D", // Background color of the scrollbar
        scrollbar_thumb: "#E5E5E5", // Thumb color of the scrollbar
        scrollbar_thumb_hover: "#B3B3B3", // Hover color of the thumb
        //nuevos colores
        waterGreenAllBlack:"#012527",
        waterGreenBlack:"#004C51",
        waterGreenShadow:"#036066",
        waterGreenMedium:"#8FB7BA",
        waterGreenMediumWhite:"#ADC3C5",
        waterGreenWhite:"#D9D9D9",
        blueColor:"#183DFF"
      },
    },
  },
  variants: {
    extend: {
      scrollbar: ["rounded"], // Optionally add variants
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          ".scrollbar-none": {
            "::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          },
          ".scrollbar": {
            "::-webkit-scrollbar": {
              width: "16px",
              height: "16px",
            },
            "::-webkit-scrollbar-thumb": {
              background: "var(--tw-scrollbar-thumb)",
              borderRadius: "8px",
            },
            "::-webkit-scrollbar-thumb:hover": {
              background: "var(--tw-scrollbar-thumb-hover)",
            },
            "::-webkit-scrollbar-track": {
              background: "var(--tw-scrollbar-bg)",
            },
          },
        },
        ["responsive"]
      );
    },
  ],
};
