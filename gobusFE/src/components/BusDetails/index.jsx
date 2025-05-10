// import React from "react";
// import { Modal } from "antd";
// import "./style.css";
// import MyButton from "../button";
// import FuelGauge from "../FuelGauge";

// export default function BusDetails({ isOpen, onClose, bus }) {
//   const key_values = [
//     { key: "Bus Number", value: bus.busNumber },
//     { key: "Bus Type", value: bus.busType },
//     { key: "Seat Number", value: bus.seatNumber },
//     { key: "Fuel Consumption", value: `${bus.fuel_consumption} (km/L)` },
//     { key: "City", value: bus.city },
//     { key: "District", value: bus.district },
//     { key: "AC", value: bus.ac ? "Yes" : "No" },
//     {
//       key: "Driver Name",
//       value: bus.driverID == null ? "Not Assign" : bus.driverID.name,
//     },
//     { key: "Password", value: bus.password },
//   ];

//   const maxLevel = bus.max_fuel_level;
//   const currentLevel = bus.current_fuel_level;

//   return (
//     <>
//       <Modal open={isOpen} onCancel={onClose} footer={null}>
//         <div className="bus-details">
//           <div className="bd-header">
//             <p>Bus Details</p>
//           </div>
//           <div className="bd-content">
//             <div>
//               <div className="bus-pictures-container">
//                 {bus?.pictures
//                   .filter((e) => e != "")
//                   .map((pic, index) => (
//                     <img src={pic} key={index} />
//                   ))}
//               </div>
//               {key_values.map((item, index) => (
//                 <div key={index} className="bd-content-item">
//                   <p>{item.key} : </p>
//                   <p>{item.value}</p>
//                 </div>
//               ))}
//               <FuelGauge currentFuel={currentLevel} maxFuel={maxLevel} />
//             </div>
//             {bus.start_trip && <MyButton name="View on map" />}
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// }


import React from "react";
import { Modal } from "antd";
import "./style.css";
import MyButton from "../button";
import FuelGauge from "../FuelGauge";

export default function BusDetails({ isOpen, onClose, bus }) {
  const key_values = [
    { key: "Bus Number", value: bus.busNumber },
    { key: "Bus Type", value: bus.busType },
    { key: "Seat Number", value: bus.seatNumber },
    { key: "Fuel Consumption", value: `${bus.fuel_consumption} (km/L)` },
    { key: "City", value: bus.city },
    { key: "District", value: bus.district },
    { key: "AC", value: bus.ac ? "Yes" : "No" },
    {
      key: "Driver Name",
      value: bus.driverID == null ? "Not Assign" : bus.driverID.name,
    },
    { key: "Password", value: bus.password },
  ];

  const maxLevel = bus.max_fuel_level;
  const currentLevel = bus.current_fuel_level;

  return (
    <>
      <Modal open={isOpen} onCancel={onClose} footer={null}>
        <div className="bus-details-s">
          <div className="bd-header-s">
            <p>Bus Details</p>
          </div>
          <div className="bd-content-s">
            <div>
              <div className="bus-pictures-container-s">
                {bus?.pictures
                  .filter((e) => e != "")
                  .map((pic, index) => (
                    <img src={pic} key={index} alt={`Bus Image ${index}`} />
                  ))}
              </div>
              {key_values.map((item, index) => (
                <div key={index} className="bd-content-item-s">
                  <p>{item.key} : </p>
                  <p>{item.value}</p>
                </div>
              ))}

              <div className="fuel-gauge-container">
                <p className="fuel-label">Fuel Level</p>
                <FuelGauge currentFuel={currentLevel} maxFuel={maxLevel} />
              </div>
            </div>
            {bus.start_trip && <MyButton name="View on map" />}
          </div>
        </div>
      </Modal>
    </>
  );
}