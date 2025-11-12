import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useMobileData from "./useMobileData";

export default function Chart4_PriceHistogram() {
    const data = useMobileData();
    const ref = useRef();

    useEffect(() => {
        if (data.length === 0) return;

        const width = 600, height = 350;
        const margin = { top: 40, right: 20, bottom: 60, left: 60 };

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();
        svg.attr("width", width).attr("height", height);

        const values = data.map(d => d.price);

        const x = d3.scaleLinear()
            .domain([0, d3.max(values)])
            .range([margin.left, width - margin.right]);

        const bins = d3.bin().domain(x.domain()).thresholds(12)(values);

        const y = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .range([height - margin.bottom, margin.top]);

        const color = d3.scaleLinear()
            .domain([0, bins.length])
            .range(["#6A5AE0", "#4ADEDE"]);

        svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", d => x(d.x0))
            .attr("y", d => y(d.length))
            .attr("width", d => x(d.x1) - x(d.x0) - 2)
            .attr("height", d => height - margin.bottom - y(d.length))
            .attr("fill", (d,i) => color(i))
            .attr("rx", 4);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(8).tickFormat(d => `$${d}`));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

    }, [data]);

    return (
        <div>
            <h3>Distribución de Precios</h3>
            <svg ref={ref}></svg>
        </div>
    );
}