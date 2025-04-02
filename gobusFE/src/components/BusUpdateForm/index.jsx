import React, { useState } from "react";
import { Modal, notification } from "antd";
import MyInput from "../../components/input";
import DropDown from "../../components/Dropdown";
import MyButton from "../../components/button";
// import "./style.css";
import {
  citiesWithDistrict,
  sriLankanDistricts,
  onlyCities,
} from "../../assets/district_city";
import { Upload } from "antd";
import Loading from "../../components/Loading";
import image from "../../assets/images/image.png";
import closeRed from "../../assets/images/close_red.png";
import { addBus, updateBusAPI } from "../../apis/busOwner";
import UseOneImgUpload from "../../hooks/UseOneImgUpload";
import { busOwnerData } from "../../store/busOwnerSlice";
import { useSelector } from "react-redux";

export default function BusUpdateForm({ isOpen, onCancel, refresh, data }) {
  const { id, routesId, employeesId } = useSelector(busOwnerData);
  const busTypes = ["Public transport", "Special service", "Both"];
  const [busData, setBusData] = useState({
    ownerID: id,
    name: data.name,
    password: data.password,
    busNumber: data.busNumber,
    seatNumber: data.seatNumber,
    busType: data.busType,
    ac: data.ac,
    district: data.district,
    city: data.city,
    pictures: data.pictures,
    timetable: data.timetable,
    route_id: data.route_id,
    driverID: data.driverID,
  });

  const [imgLoading, setImgLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [isImgErr, setIsImgErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [timetableRounds, setTimetableRounds] = useState(
    data.timetable.length > 0
      ? data.timetable
      : [{ startPlace: "", endPlace: "", startTime: "", endTime: "" }]
  );

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

    if (values.pictures.some((pic) => pic === "")) {
      setIsImgErr("All images must be uploaded");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
          {busData.pictures[i] != "" && (
            <img src={closeRed} alt="close" onClick={() => clearImg(i)} />
          )}
        </section>
        <div className="ps-cm-image-preview" key={i}>
          {imgLoading && loadingIndex == i ? (
            <Loading size={34} />
          ) : (
            <img
              src={busData.pictures[i] == "" ? image : busData.pictures[i]}
              className={busData.pictures[i] == "" ? "addIcon" : "addedImg"}
              alt={i}
            />
          )}
          {busData.pictures[i] == "" && (
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

  const handleSubmit = async (id) => {
    try {
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


      const { data, code, msg } = await updateBusAPI(id, submissionData);
      if (code === 0) {
        notification.success({
          message: msg,
        });
        onCancel();
        refresh();
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      notification.error({
        message: "Something went wrong!",
      });
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
            <p>Update Bus</p>
          </div>
          <div className="ab-content">
            <div>
              <MyInput
                label={"Name"}
                placeholder="ex : DSD"
                onChange={inputHandle("name")}
                value={busData.name}
              />
              <MyInput
                label={"Password"}
                type="password"
                placeholder="min length 6"
                onChange={inputHandle("password")}
                value={busData.password}
              />
              <div className="bt-select">
                <label>
                  <p>Bus Photos</p>
                  <span>(1072px × 369px)</span>
                </label>
                {isImgErr ? (
                  <p style={{ color: "rgba(238, 82, 82, 1)" }}>{isImgErr}</p>
                ) : (
                  <div className="ps-image-set">{uploadComponents}</div>
                )}
              </div>
              <MyInput
                label={"Bus Number"}
                placeholder="ex : province code - number"
                onChange={inputHandle("busNumber")}
                value={busData.busNumber}
              />
              <MyInput
                label={"Seat Number"}
                type="number"
                onChange={inputHandle("seatNumber")}
                value={busData.seatNumber}
              />
              <div className="bt-select">
                <label>District</label>
                <DropDown
                  placeholder={"Select District"}
                  defaultValue={busData.district}
                  onChange={(value) => {
                    setBusData({ ...busData, district: value });
                  }}
                  options={sriLankanDistricts
                    .filter((dis) => dis != "All District")
                    .map((dis) => ({
                      label: dis,
                      value: dis,
                    }))}
                />
              </div>
              <div className="bt-select">
                <label>City</label>
                <DropDown
                  placeholder={"Select City"}
                  defaultValue={busData.city}
                  onChange={(value) => {
                    setBusData({ ...busData, city: value });
                  }}
                  options={(citiesWithDistrict[busData.district] || [])
                    .filter((cit) => cit != "All City")
                    .map((c) => ({
                      label: c,
                      value: c,
                    }))}
                />
              </div>
              <div className="bt-select">
                <label>Bus Type</label>
                <DropDown
                  options={busTypes.map((e) => ({
                    label: e,
                    value: e.toLocaleLowerCase(),
                  }))}
                  defaultValue={busData.busType}
                  placeholder={"Select bus type"}
                  onChange={(value) => {
                    setBusData({ ...busData, busType: value });
                  }}
                />
              </div>
              <div className="bt-select">
                <label>AC/NON-AC</label>
                <DropDown
                  options={["A/C", "NON-A/C"].map((e) => ({
                    label: e,
                    value: e.toLocaleLowerCase(),
                  }))}
                  defaultValue={busData.ac ? "A/C" : "NON-A/C"}
                  placeholder={"Select A/C / Non-A/C"}
                  onChange={(value) => {
                    setBusData({
                      ...busData,
                      ac: value == "A/C" ? true : false,
                    });
                  }}
                />
              </div>
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
                  value={busData.route_id.route_number}
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
                  value={busData.driverID.name}
                  placeholder={"Select driver"}
                  onChange={(value) => {
                    setBusData({ ...busData, driverID: value });
                  }}
                />
              </div>
            )}

            <div className="ab-btn">
              <MyButton
                name="Update"
                width={150}
                color={" #2D3436"}
                onClick={() => handleSubmit(data._id)}
                loading={isLoading}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
