"use client";

import React, { useEffect, useState } from "react";
import ChartTrain from "@/components/chart-candle-train/chart";

export interface Response {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  tick_volume: number;
  spread: number;
  real_volume: number;
}

interface Data {
  rates: {
    x: Date;
    y: number[];
  }[];
  volumes: {
    x: Date;
    y: number;
  }[];
}

export default function Home() {
  const [data, setData] = useState<Response[]>([]);
  const getRates = async () => {
    const payload = {
      symbol: "AUDUSD",
      start_time: "2024-01-25 00:00:00",
      end_time: "2025-02-01 00:00:00",
    };
    const response = await fetch("/api/get_ticks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Fetch rate error");
    }

    const resp: Response[] = await response.json();
    // let data: Data = { rates: [], volumes: [] };
    // await resp.forEach((item) => {
    //   const date = new Date(item.time * 1000);
    //   data.rates.push({
    //     x: date,
    //     y: [item.open, item.high, item.low, item.close],
    //   });
    //   data.volumes.push({ x: date, y: item.tick_volume });
    // });
    // console.log(dataRates);
    return resp;
  };

  useEffect(() => {
    getRates().then((res) => {
      // console.log("res", res);
      setData(res);
    });
  }, []);

  return (
    <div className="p-2">
      {data.length > 0 && (
        // <ChartTrain data={data} type="candlestick" height={500} width={1500} />
        <ChartTrain data={data} />
      )}
    </div>
  );
}
