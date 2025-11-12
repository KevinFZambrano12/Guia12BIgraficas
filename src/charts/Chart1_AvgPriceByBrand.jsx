import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import useMobileData from "./useMobileData";

export default function Chart1_AvgPriceByBrand() {
    const data = useMobileData();
    const ref = useRef();

    useEffect(() => {
        if (data.length === 0) return;

        const grouped = d3.rollup(data, v => d3.mean(v, d => d.price), d => d.brand);
        const dataset = Array.from(grouped, ([brand, avg_price]) => ({ brand, avg_price }));

        const width = 600;
        const height = 350;
        const margin = { top: 40, right: 20, bottom: 60, left: 60 };

        d3.select(ref.current).selectAll("*").remove();
        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height);

        const x = d3.scaleBand()
            .domain(dataset.map(d => d.brand))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.avg_price)])
            .range([height - margin.bottom, margin.top]);

        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", d => x(d.brand))
            .attr("y", d => y(d.avg_price))
            .attr("width", x.bandwidth())
            .attr("height", d => height - margin.bottom - y(d.avg_price))
            .attr("fill", "#4A90E2");

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

    }, [data]);

    return (
        <div>
            <h3>Precio Promedio por Marca</h3>
            <svg ref={ref}></svg>
        </div>
    );
}