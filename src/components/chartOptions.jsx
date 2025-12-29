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
    colors: ["#60A5FA"], // blue stroke
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "vertical",
      shadeIntensity: 0.7,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 100],
      colorStops: [
        { offset: 0, color: "#6366F1", opacity: 0.5 }, // purple
        { offset: 100, color: "#2563EB", opacity: 0 }, // blue
      ],
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
    colors: ["#A78BFA"], // purple stroke
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "vertical",
      shadeIntensity: 0.7,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 100],
      colorStops: [
        { offset: 0, color: "#7C3AED", opacity: 0.5 }, // purple
        { offset: 100, color: "#3B82F6", opacity: 0 }, // blue
      ],
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
