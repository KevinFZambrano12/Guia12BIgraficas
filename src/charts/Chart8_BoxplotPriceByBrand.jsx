import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useMobileData from "./useMobileData";

export default function Chart8_BoxplotPriceByBrand() {
    const data = useMobileData();
    const ref = useRef();

    useEffect(() => {
        if (data.length === 0) return;

        const brands = [...new Set(data.map(d => d.brand))];

        const grouped = brands.map(brand => {
            const prices = data.filter(d => d.brand === brand).map(d => d.price).sort(d3.ascending);
            const q1 = d3.quantile(prices, 0.25);
            const median = d3.quantile(prices, 0.5);
            const q3 = d3.quantile(prices, 0.75);
            const min = prices[0];
            const max = prices[prices.length - 1];
            return { brand, min, q1, median, q3, max };
        });

        const width = 600, height = 350;
        const margin = { top: 40, right: 20, bottom: 80, left: 60 };

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();
        svg.attr("width", width).attr("height", height);

        const x = d3.scaleBand()
            .domain(brands)
            .range([margin.left, width - margin.right])
            .padding(0.4);

        const y = d3.scaleLinear()
            .domain([0, d3.max(grouped, d => d.max)])
            .range([height - margin.bottom, margin.top]);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickFormat(d => `$${d}`));

        svg.selectAll("line.min-max")
            .data(grouped)
            .enter()
            .append("line")
            .attr("x1", d => x(d.brand) + x.bandwidth() / 2)
            .attr("x2", d => x(d.brand) + x.bandwidth() / 2)
            .attr("y1", d => y(d.min))
            .attr("y2", d => y(d.max))
            .attr("stroke", "#777");

        svg.selectAll("rect.box")
            .data(grouped)
            .enter()
            .append("rect")
            .attr("x", d => x(d.brand))
            .attr("y", d => y(d.q3))
            .attr("height", d => y(d.q1) - y(d.q3))
            .attr("width", x.bandwidth())
            .attr("rx", 6)
            .attr("fill", "#6A5AE0");

        svg.selectAll("line.median")
            .data(grouped)
            .enter()
            .append("line")
            .attr("x1", d => x(d.brand))
            .attr("x2", d => x(d.brand) + x.bandwidth())
            .attr("y1", d => y(d.median))
            .attr("y2", d => y(d.median))
            .attr("stroke", "#fff")
            .attr("stroke-width", 2);

    }, [data]);

    return (
        <div>
            <h3>Distribución de Precios por Marca</h3>
            <svg ref={ref}></svg>
        </div>
    );
}