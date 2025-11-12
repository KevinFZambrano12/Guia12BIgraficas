import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useMobileData from "./useMobileData";


export default function Chart7_PriceVsBattery() {
    const data = useMobileData();
    const ref = useRef();

    useEffect(() => {
        if (data.length === 0) return;

        const width = 600, height = 350;
        const margin = { top: 40, right: 20, bottom: 60, left: 60 };

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();
        svg.attr("width", width).attr("height", height);

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.battery)])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.price)])
            .range([height - margin.bottom, margin.top]);

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.battery))
            .attr("cy", d => y(d.price))
            .attr("r", 6)
            .attr("fill", "#A266FF")
            .attr("class", "neon-dot")
            .attr("opacity", 0.75);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(6).tickFormat(d => d + " mAh"));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickFormat(d => `$${d}`));

    }, [data]);

    return (
        <div>
            <h3>Relación Precio vs Batería</h3>
            <svg ref={ref}></svg>
        </div>
    );
}