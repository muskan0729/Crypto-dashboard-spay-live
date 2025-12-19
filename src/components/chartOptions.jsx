export const areaOptions1 = {
    chart: {
      type: "area",
      height: 80,
      sparkline: { enabled: true },
      toolbar: { show: false },
      background: "transparent",
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#D4AF37"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.5,
        opacityFrom: 0.35,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    series: [
      {
        name: "Collection",
        data: [15, 35, 20, 45, 30, 55, 25],
      },
    ],
    tooltip: { theme: "dark", x: { show: false } },
};

export const areaOptions2 = {
    chart: {
      type: "area",
      height: 80,
      sparkline: { enabled: true },
      toolbar: { show: false },
      background: "transparent",
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#D4AF37"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.5,
        opacityFrom: 0.35,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    series: [
      {
        name: "Collection",
        data: [25, 45, 15, 35, 20, 50, 30],
      },
    ],
    tooltip: { theme: "dark", x: { show: false } },
  };
