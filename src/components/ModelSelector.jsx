import React from "react";

export default function ModelSelector({ models, selectedA, selectedB, setA, setB }) {
    return (
        <div style={{ display: "flex", gap: "20px", marginBottom: "12px", alignItems: "flex-end" }}>
            <div>
                <label style={{ display: "block", marginBottom: "6px" }}>Modelo A</label>
                <select value={selectedA} onChange={e => setA(e.target.value)}>
                    <option value="">-- Selecciona --</option>
                    {models.map((m, i) => (
                        <option key={i} value={m.id}>{m.label}</option>
                    ))}
                </select>
            </div>

            <div>
                <label style={{ display: "block", marginBottom: "6px" }}>Modelo B</label>
                <select value={selectedB} onChange={e => setB(e.target.value)}>
                    <option value="">-- Selecciona --</option>
                    {models.map((m, i) => (
                        <option key={i} value={m.id}>{m.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

