// import { ApexOptions } from "apexcharts";
// import { ChartProps } from "./chart";

// export interface Options {
//     series: ApexOptions["series"];
//     options: ApexOptions;
//     seriesBar: ApexOptions["series"];
//     optionsBar: ApexOptions;
// }

// export const OptionValues = (data: ChartProps) => {
//     const volumsSelect = data.data.volumes.slice(-20);
//     const options: Options = {
//         series: [
//             {
//                 data: data.data.rates,
//             },
//         ],
//         options: {
//             annotations: {
//                 xaxis: [],
//             },
//             chart: {
//                 type: "candlestick",
//                 height: data.height,
//                 id: "candles",
//                 toolbar: {
//                     autoSelected: "pan",
//                     show: false,
//                 },
//                 zoom: {
//                     enabled: false,
//                 },
//             },
//             plotOptions: {
//                 candlestick: {
//                     colors: {
//                         upward: "#3C90EB",
//                         downward: "#DF7D46",
//                     },
//                 },
//             },
//             xaxis: {
//                 type: "datetime",
//             },
//         },
//         optionsBar: {
//             annotations: {
//                 xaxis: [],
//             },
//             chart: {
//                 height: 160,
//                 type: "bar",
//                 brush: {
//                     enabled: true,
//                     target: "candles",
//                 },
//                 selection: {
//                     enabled: true,
//                     xaxis: {
//                         min: volumsSelect[0].x.getTime(),
//                         max: volumsSelect[volumsSelect.length - 1].x.getTime(),
//                     },
//                     fill: {
//                         color: "#ccc",
//                         opacity: 0.4,
//                     },
//                     stroke: {
//                         color: "#0D47A1",
//                     },
//                 },
//             },
//             dataLabels: {
//                 enabled: false,
//             },
//             plotOptions: {
//                 bar: {
//                     columnWidth: "80%",
//                     colors: {
//                         ranges: [
//                             {
//                                 from: -1000,
//                                 to: 0,
//                                 color: "#F15B46",
//                             },
//                             {
//                                 from: 1,
//                                 to: 10000,
//                                 color: "#FEB019",
//                             },
//                         ],
//                     },
//                 },
//             },
//             stroke: {
//                 width: 0,
//             },
//             xaxis: {
//                 type: "datetime",
//                 axisBorder: {
//                     offsetX: 13,
//                 },
//             },
//             yaxis: {
//                 labels: {
//                     show: false,
//                 },
//             },
//         },
//         seriesBar: [
//             {
//                 name: "volume",
//                 data: data.data.volumes,
//             },
//         ],
//     };
//     return options;
// };
