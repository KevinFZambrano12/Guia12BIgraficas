import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import useMobileData from "./useMobileData";

export default function Chart3_AvgBatteryByBrand() {
    const data = useMobileData();
    const ref = useRef();

    useEffect(() => {
        if (data.length === 0) return;

        const grouped = d3.rollup(data, v => d3.mean(v, d => d.battery), d => d.brand);
        const dataset = Array.from(grouped, ([brand, avg_battery]) => ({ brand, avg_battery }));

        const width = 600, height = 350;
        const margin = { top: 40, right: 20, bottom: 60, left: 60 };

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();
        svg.attr("width", width).attr("height", height);

        const x = d3.scaleBand()
            .domain(dataset.map(d => d.brand))
            .range([margin.left, width - margin.right])
            .padding(0.25);

        const y = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.avg_battery)])
            .range([height - margin.bottom, margin.top]);

        const color = d3.scaleLinear()
            .domain([4000, 6000]) // rango común de batería
            .range(["#4ADEDE", "#6A5AE0"]);

        // Tooltip Moderno
        const tooltip = d3.select("body").append("div")
            .style("position", "fixed")
            .style("padding", "8px 12px")
            .style("background", "white")
            .style("border-radius", "8px")
            .style("box-shadow", "0px 2px 10px rgba(0,0,0,0.15)")
            .style("opacity", 0)
            .style("pointer-events", "none");

        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", d => x(d.brand))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.avg_battery))
            .attr("height", d => height - margin.bottom - y(d.avg_battery))
            .attr("fill", d => color(d.avg_battery))
            .on("mousemove", (event, d) => {
                tooltip.style("opacity", 1)
                    .html(`<strong>${d.brand}</strong><br>Batería: ${d.avg_battery.toFixed(0)} mAh`)
                    .style("top", event.clientY - 40 + "px")
                    .style("left", event.clientX + 15 + "px");
            })
            .on("mouseleave", () => tooltip.style("opacity", 0));

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

    }, [data]);

    return (
        <div>
            <h3 style={{ textAlign: "center" }}>Batería Promedio por Marca</h3>
            <svg ref={ref}></svg>
        </div>
    );
}