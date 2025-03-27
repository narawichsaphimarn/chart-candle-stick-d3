"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Response } from "@/app/page";
import { getMonthName } from "@/share/month";

export interface ChartProps {
    data: Response[];
    height?: string | number | undefined;
    width?: string | number | undefined;
}

const fullData = Array.from({ length: 100 }, (_, i) => ({
    date: `${i + 1}`,
    open: Math.random() * 100 + 100,
    high: Math.random() * 20 + 120,
    low: Math.random() * 20 + 80,
    close: Math.random() * 100 + 100,
}));

let mousePick: boolean = false;
let mouseClick: React.MouseEvent;

const CandlestickChart: React.FC<ChartProps> = (props: ChartProps) => {
    const [startIndex, setStartIndex] = useState(0);
    // const [mousePick, setMousePick] = useState<boolean>(false);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const visibleCount = 50;
    const data = props.data.slice(startIndex, startIndex + visibleCount);

    const convertDate = (time: number) => {
        const date = new Date(time * 1000);
        const month = date.getUTCMonth() + 1;
        return `${getMonthName(
            month
        )}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}`;
    };

    const convertDateToTime = (time: number) => {
        const date = new Date(time * 1000);
        return `${date.getHours()}:${date.getMinutes()}`;
    };

    const getMin = (...values: number[]) => {
        let min = Math.min(...values);
        min = min - min / 1000;
        return min;
    };

    const getMax = (...values: number[]) => {
        let max = Math.max(...values);
        max = max + max / 1000;
        return max;
    };

    useEffect(() => {
        const h = data.map((item) => item.high);
        const l = data.map((item) => item.low);
        if (!svgRef.current) return;

        const width = 1500,
            height = 700;
        const margin = { top: 20, right: 30, bottom: 30, left: 50 };

        // สร้าง SVG
        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        // สร้าง Scale
        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => convertDate(d.time)))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const yScale = d3
            .scaleLinear()
            .domain([getMin(...l), getMax(...h)])
            .range([height - margin.bottom, margin.top]);

        // สร้าง Grid แนวตั้ง (Vertical Grid)
        const xAxisGrid = d3
            .axisBottom(xScale)
            .tickSize(-height + margin.top + margin.bottom); // ความยาวของเส้น

        // สร้าง Grid แนวนอน (Horizontal Grid)
        const yAxisGrid = d3
            .axisLeft(yScale)
            .tickSize(-width + margin.left + margin.right);

        // ลบข้อมูลเก่า
        svg.selectAll("*").remove();

        // วาดแกน X
        svg
            .append("g")
            .attr("transform", `translate(0,${height - margin.bottom}) rotate(0)`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("text-anchor", "middle")
            .attr("transform", `rotate(45)`)
            .attr("dx", "25px")
            .text((d, i) => {
                let result: string = String(d);
                if (i - 1 >= 0) {
                    const nextMount = convertDate(data[i - 1 < 0 ? i : i - 1].time);
                    if (result.substring(0, 6) === nextMount.substring(0, 6)) {
                        result = convertDateToTime(data[i].time);
                    }
                }
                return result;
            });

        // วาดแกน Y
        svg
            .append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale));

        // ✅ วาดไส้เทียน (Wick)
        svg
            .selectAll("line.wick")
            .data(data)
            .enter()
            .append("line")
            .attr("class", "wick")
            .attr("x1", (d) => xScale(convertDate(d.time))! + xScale.bandwidth() / 2)
            .attr("x2", (d) => xScale(convertDate(d.time))! + xScale.bandwidth() / 2)
            .attr("y1", (d) => yScale(d.high))
            .attr("y2", (d) => yScale(d.low))
            .attr("stroke", (d) => (d.open > d.close ? "red" : "green"))
            .attr("stroke-width", 2); // ✅ เพิ่ม stroke-width

        // วาดแท่งเทียน (Body)
        svg
            .selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d) => xScale(convertDate(d.time))!)
            .attr("y", (d) => yScale(Math.max(d.open, d.close)))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => Math.abs(yScale(d.open) - yScale(d.close)))
            .attr("fill", (d) => (d.open > d.close ? "red" : "green"));

        // เพิ่ม Grid แนวตั้ง
        svg
            .append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(xAxisGrid)
            .selectAll("text")
            .text("");

        // เพิ่ม Grid แนวนอน
        svg
            .append("g")
            .attr("class", "grid")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxisGrid)
            .selectAll("text")
            .text("");

        // สไตล์ให้ Grid
        d3.selectAll(".grid line")
            .style("stroke", "#ddd") // สีเส้น Grid
            .style("stroke-opacity", 0.2) // ความโปร่งแสง
            .style("stroke-dasharray", "2,2"); // ทำให้เส้นชัดขึ้น
    }, [data]);

    const handleScroll = (event: React.WheelEvent) => {
        setStartIndex((prev) => {
            let newIndex = prev + (event.deltaY > 0 ? 1 : -1);
            const result = Math.max(
                0,
                Math.min(newIndex, props.data.length - visibleCount)
            );
            return result;
        });
    };

    const handleMove = (event: React.MouseEvent) => {
        // console.log(
        //     "event.clientX",
        //     event.clientX,
        //     "  mouseClick.clientX",
        //     mouseClick.clientX
        // );
        if (event.clientX > mouseClick.clientX) {
            setStartIndex((prev) => {
                let newIndex = prev - 1;
                const result = Math.max(
                    0,
                    Math.min(newIndex, props.data.length - visibleCount)
                );
                return result;
            });
        } else {
            setStartIndex((prev) => {
                let newIndex = prev + 1;
                const result = Math.max(
                    0,
                    Math.min(newIndex, props.data.length - visibleCount)
                );
                return result;
            });
        }
    };

    return (
        <div
            className="flex flex-col items-center overflow-visible"
            onWheel={handleScroll}
            onMouseDown={(event) => {
                // console.log(event);
                // setMousePick(true);
                mousePick = true;
                mouseClick = event;
            }}
            onMouseUp={(event) => {
                // console.log(event);
                // setMousePick(false);
                mousePick = false;
            }}
            onMouseMoveCapture={(event) => {
                if (mousePick) {
                    handleMove(event);
                    // console.log(event);
                }
            }}
        >
            <svg ref={svgRef} style={{ overflow: "visible" }}></svg>
        </div>
    );
};

export default CandlestickChart;
