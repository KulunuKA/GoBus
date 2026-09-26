import React, { useState } from "react";
import { Modal, notification } from "antd";
import MyInput from "../../components/input";
import DropDown from "../../components/Dropdown";
import MyButton from "../../components/button";
import "./style.css";
import {
  citiesWithDistrict,
  onlyCities,
  sriLankanDistricts,
} from "../../assets/district_city";
import { Upload } from "antd";
import Loading from "../../components/Loading";
import image from "../../assets/images/image.png";
import closeRed from "../../assets/images/close_red.png";
import { addBus } from "../../apis/busOwner";
import UseOneImgUpload from "../../hooks/UseOneImgUpload";
import { busOwnerData, updateBusId } from "../../store/busOwnerSlice";
import { useDispatch, useSelector } from "react-redux";

export default function BusForm({ isOpen, onCancel, refresh }) {
  const { id, routesId, employeesId } = useSelector(busOwnerData);
  const busTypes = ["Public transport", "Special service", "Both"];
  const [busData, setBusData] = useState({
    ownerID: id,
    name: "",
    password: "",
    busNumber: "",
    seatNumber: "",
    busType: "",
    ac: false,
    district: "",
    city: "",
    fuel_consumption: "",
    max_fuel_level: "",
    current_fuel_level: "",
    pictures: ["", "", ""],
    timetable: [],
    route_id: null,
    driverID: null,
  });
  const [errors, setErrors] = useState({});
  const [imgLoading, setImgLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [isImgErr, setIsImgErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timetableRounds, setTimetableRounds] = useState([
    {
      round: "1",
      startPlace: "",
      startTime: "",
      endPlace: "",
      endTime: "",
    },
  ]);
  const dispatch = useDispatch();

  const inputHandle = (field) => (e) => {
    setBusData({ ...busData, [field]: e.target.value });
  };

  const handleCoverFile = async ({ file, index }) => {
    setLoadingIndex(index);
    setImgLoading(true);

    try {
      const imageUrl = await UseOneImgUpload({ file });

      const updatedCoverImages = [...busData.pictures];
      updatedCoverImages[index] = imageUrl;

      setBusData({
        ...busData,
        pictures: updatedCoverImages,
      });
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
    } finally {
      setImgLoading(false);
    }
  };

  const clearImg = (index) => {
    const updatedCoverImages = [...busData.pictures];
    updatedCoverImages[index] = "";
    setBusData({
      ...busData,
      pictures: updatedCoverImages,
    });
  };

  const uploadComponents = [];
  for (let i = 0; i < 3; i++) {
    uploadComponents.push(
      <Upload
        customRequest={({ file }) => handleCoverFile({ file, index: i })}
        showUploadList={false}
        key={i}
        accept="image/*"
      >
        <section className="redClose">
          {busData.pictures[i] !== "" && (
            <img
              src={closeRed}
              alt="close"
              onClick={(e) => {
                e.stopPropagation();
                clearImg(i);
              }}
            />
          )}
        </section>
        <div className="ps-cm-image-preview" key={i}>
          {imgLoading && loadingIndex === i ? (
            <Loading size={34} />
          ) : (
            <img
              src={busData.pictures[i] === "" ? image : busData.pictures[i]}
              className={busData.pictures[i] === "" ? "addIcon" : "addedImg"}
              alt={`bus-image-${i}`}
            />
          )}
          {busData.pictures[i] === "" && (
            <p>Click here to add an image {i + 1}</p>
          )}
        </div>
      </Upload>
    );
  }

  const handleTimetableChange = (index, field, value) => {
    const updatedTimetable = [...timetableRounds];
    updatedTimetable[index] = {
      ...updatedTimetable[index],
      [field]: value,
    };
    setTimetableRounds(updatedTimetable);
  };

  const addNewRound = (round) => {
    setTimetableRounds([
      ...timetableRounds,
      {
        round: round,
        startPlace: "",
        startTime: "",
        endPlace: "",
        endTime: "",
      },
    ]);
  };

  const validateForm = (values) => {
    const newErrors = {};

    // Name validation
    if (!values.name) {
      newErrors.name = "Name is required";
    }

    // Password validation
    if (!values.password) {
      newErrors.password = "Password is required";
    } else if (values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    // Bus Number validation
    if (!values.busNumber) {
      newErrors.busNumber = "Bus Number is required";
    } else if (!/^[A-Z]{2,3}-\d{4}$/.test(values.busNumber)) {
      newErrors.busNumber =
        "Bus Number must be in format like NC-1227 or ACC-1276";
    }

    // District validation
    if (!values.district) {
      newErrors.district = "District is required";
    } else if (values.district.length < 2) {
      newErrors.district = "District name must be at least 2 characters long";
    }

    // City validation
    if (!values.city) {
      newErrors.city = "City is required";
    } else if (values.city.length < 2) {
      newErrors.city = "City name must be at least 2 characters long";
    }

    if (!values.fuel_consumption) {
      newErrors.fuel_consumption = "Average Fuel Consumption is required";
    } else if (values.fuel_consumption < 1) {
      newErrors.fuel_consumption =
        "Average Fuel Consumption must be a positive value";
    }

    if (!values.max_fuel_level) {
      newErrors.max_fuel_level = "Max Fuel Level is required";
    } else if (values.max_fuel_level < 1) {
      newErrors.max_fuel_level = "Max Fuel Level must be a positive value";
    }

    if (!values.current_fuel_level) {
      newErrors.current_fuel_level = "Current Fuel Level is required";
    } else if (values.current_fuel_level < 1) {
      newErrors.current_fuel_level =
        "Current Fuel Level must be a positive value";
    }

    if (values.current_fuel_level > values.max_fuel_level) {
      newErrors.current_fuel_level =
        "Current level must be equal or lower than the Max level";
    }

    // Bus Type validation
    console.log(values.busType);
    if (!values.busType) {
      newErrors.busType = "Bus Type is required";
    } else if (
      !["public transport", "special service"].includes(values.busType)
    ) {
      newErrors.busType = "Invalid bus type selected";
    }

    // Seat Number validation
    if (!values.seatNumber) {
      newErrors.seatNumber = "Seat Number is required";
    } else if (isNaN(values.seatNumber)) {
      newErrors.seatNumber = "Seat Number must be a number";
    } else if (values.seatNumber < 1 || values.seatNumber > 60) {
      newErrors.seatNumber = "Seat Number must be between 1 and 60";
    }

    // Timetable validation for public transport
    if (values.busType === "public transport") {
      const validTimetable = timetableRounds.filter(
        (round) =>
          round.round &&
          round.startPlace &&
          round.startTime &&
          round.endPlace &&
          round.endTime
      );

      if (validTimetable.length === 0) {
        newErrors.timetable =
          "At least one complete timetable entry is required for public transport";
      }
    }

    if (values.pictures.some((pic) => pic === "")) {
      setIsImgErr("All images must be uploaded");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      // Use the comprehensive validation function
      const isValid = validateForm(busData);

      if (!isValid) {
        return;
      }

      setIsLoading(true);

      const submissionData = {
        ...busData,
        timetable:
          busData.busType === "public transport" ? timetableRounds : [],
      };

      const { data, code, msg } = await addBus(submissionData);

      if (code === 0) {
        dispatch(updateBusId(data._id));
        notification.success({
          message: "Bus Added Successfully",
        });
        onCancel();
        refresh();
      } else {
        notification.error({
          message: "Submission Failed",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      notification.error({
        message: "Submission Error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderTimetableFields = () => {
    return timetableRounds.map((round, index) => (
      <div className="timetable-round" key={index}>
        <h4 className="round-title">Round {index + 1}</h4>
        <div className="timetable-grid">
          <div className="timetable-field">
            <label>Start Place</label>
            <DropDown
              placeholder={"Select trip start"}
              value={round.startPlace}
              onChange={(value) =>
                handleTimetableChange(index, "startPlace", value)
              }
              options={onlyCities.map((e) => ({
                label: e,
                value: e,
              }))}
            />
          </div>

          <div className="timetable-field">
            <label>Start Time</label>
            <MyInput
              type="time"
              value={round.startTime}
              onChange={(e) =>
                handleTimetableChange(index, "startTime", e.target.value)
              }
            />
          </div>

          <div className="timetable-field">
            <label>End Place</label>
            <DropDown
              placeholder={"Select trip end"}
              value={round.endPlace}
              onChange={(value) =>
                handleTimetableChange(index, "endPlace", value)
              }
              options={onlyCities.map((e) => ({
                label: e,
                value: e,
              }))}
            />
          </div>

          <div className="timetable-field">
            <label>End Time</label>
            <MyInput
              type="time"
              value={round.endTime}
              onChange={(e) => {
                console.log(e.target.value);
                handleTimetableChange(index, "endTime", e.target.value);
              }}
            />
          </div>
        </div>
        {index === timetableRounds.length - 1 && (
          <div className="timetable-actions">
            {index > 0 && (
              <MyButton
                name="Remove"
                width={120}
                color="#EE5252"
                onClick={() => {
                  const updated = [...timetableRounds];
                  updated.pop();
                  setTimetableRounds(updated);
                }}
              />
            )}
            <MyButton
              name="Add Round"
              width={120}
              color="#2D3436"
              onClick={() => addNewRound(index + 1)}
            />
          </div>
        )}
      </div>
    ));
  };

  return (
    <>
      <Modal open={isOpen} onCancel={onCancel} footer={null} width={850}>
        <div className="bus-add">
          <div className="ab-header">
            <p>Add Bus</p>
          </div>
          <div className="ab-content">
            <div>
              <MyInput
                label={"Name"}
                placeholder="ex : DSD"
                onChange={inputHandle("name")}
                value={busData.name}
                error={errors.name}
                errorMessage={errors.name}
              />
              <MyInput
                label={"Password"}
                type="password"
                placeholder="min length 6"
                onChange={inputHandle("password")}
                value={busData.password}
                error={errors.password}
                errorMessage={errors.password}
              />
              <div className="bt-select">
                <label>
                  <p>Bus Photos</p>
                  <span>(1072px × 369px)</span>
                </label>
                {isImgErr && (
                  <p style={{ color: "rgba(238, 82, 82, 1)" }}>{isImgErr}</p>
                )}
                <div className="ps-image-set">{uploadComponents}</div>
              </div>
              <MyInput
                label={"Bus Number"}
                placeholder="ex : province code - number"
                onChange={inputHandle("busNumber")}
                value={busData.busNumber}
                error={errors.busNumber}
                errorMessage={errors.busNumber}
              />
              <MyInput
                label={"Seat Number"}
                type="number"
                onChange={inputHandle("seatNumber")}
                value={busData.seatNumber}
                error={errors.seatNumber}
                errorMessage={errors.seatNumber}
              />
              <MyInput
                label={"Average Fuel Consumption"}
                type="number"
                onChange={inputHandle("fuel_consumption")}
                value={busData.fuel_consumption}
                error={errors.fuel_consumption}
                errorMessage={errors.fuel_consumption}
                placeholder={"Kilometers per liter (km/L)"}
              />
              <MyInput
                label={"Maximum Fuel Level"}
                type="number"
                onChange={inputHandle("max_fuel_level")}
                value={busData.max_fuel_level}
                error={errors.max_fuel_level}
                errorMessage={errors.max_fuel_level}
                placeholder={"Liter (L)"}
              />

              <MyInput
                label={"Current Fuel Level"}
                type="number"
                onChange={inputHandle("current_fuel_level")}
                value={busData.current_fuel_level}
                error={errors.current_fuel_level}
                errorMessage={errors.current_fuel_level}
                placeholder={"Liter (L)"}
              />

              <div className="bt-select">
                <label>District</label>
                <DropDown
                  placeholder={"Select District"}
                  onChange={(value) => {
                    setBusData({ ...busData, district: value });
                  }}
                  options={sriLankanDistricts
                    .filter((dis) => dis !== "All District")
                    .map((dis) => ({
                      label: dis,
                      value: dis,
                    }))}
                  errorMessage={errors.district}
                  error={errors.district}
                />
              </div>
              <div className="bt-select">
                <label>City</label>
                <DropDown
                  placeholder={"Select City"}
                  onChange={(value) => {
                    setBusData({ ...busData, city: value });
                  }}
                  options={(citiesWithDistrict[busData.district] || [])
                    .filter((cit) => cit !== "All City")
                    .map((c) => ({
                      label: c,
                      value: c,
                    }))}
                  errorMessage={errors.city}
                  error={errors.city}
                />
              </div>

              <div className="bt-select">
                <label>AC/NON-AC</label>
                <DropDown
                  options={["A/C", "NON-A/C"].map((e) => ({
                    label: e,
                    value: e === "A/C" ? true : false,
                  }))}
                  value={"NON-A/C"}
                  onChange={(value) => {
                    setBusData({
                      ...busData,
                      ac: value,
                    });
                  }}
                />
              </div>

              <div className="bt-select">
                <label>Bus Type</label>
                <DropDown
                  options={busTypes.map((e) => ({
                    label: e,
                    value: e.toLowerCase(),
                  }))}
                  placeholder={"Select bus type"}
                  onChange={(value) => {
                    setBusData({ ...busData, busType: value.toLowerCase() });
                  }}
                  error={errors.busType}
                  errorMessage={errors.busType}
                />
              </div>

              {busData.busType == "public transport" && (
                <div className="timetable-container">
                  <h3 className="timetable-header">Bus Timetable</h3>
                  {renderTimetableFields()}
                </div>
              )}

              {busData.busType === "public transport" && (
                <div className="bt-select">
                  <label>Route</label>
                  <DropDown
                    options={routesId.map((e) => ({
                      label: e.start + " - " + e.end,
                      value: e._id,
                    }))}
                    placeholder={"Select route"}
                    onChange={(value) => {
                      setBusData({ ...busData, route_id: value });
                    }}
                  />
                </div>
              )}

              {busData.busType === "public transport" && (
                <div className="bt-select">
                  <label>Driver</label>
                  <DropDown
                    options={employeesId.map((e) => ({
                      label: e.name,
                      value: e._id,
                    }))}
                    placeholder={"Select driver"}
                    onChange={(value) => {
                      setBusData({ ...busData, driverID: value });
                    }}
                  />
                </div>
              )}
            </div>

            <div className="ab-btn">
              <MyButton
                name="Add"
                width={150}
                color={"#2D3436"}
                onClick={handleSubmit}
                loading={isLoading}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
