import React from "react";
import GaugeChart from "react-gauge-chart";

const FuelGauge = ({ currentFuel, maxFuel }) => {
  const percent = currentFuel / maxFuel;

  return (
    <div style={{ width: "200px" }}>
      <GaugeChart
        id="fuel-gauge"
        nrOfLevels={20}
        colors={["#FF5F6D", "#FFC371", "#00C853"]}
        arcWidth={0.3}
        percent={percent}
        textColor="#000000"
        formatTextValue={() => `${currentFuel} / ${maxFuel} L`}
      />
    </div>
  );
};

export default FuelGauge;
