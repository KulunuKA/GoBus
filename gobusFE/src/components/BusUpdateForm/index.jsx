import React, { useState } from "react";
import { Modal, notification } from "antd";
import MyInput from "../../components/input";
import DropDown from "../../components/Dropdown";
import MyButton from "../../components/button";
// import "./style.css";
import {
  citiesWithDistrict,
  sriLankanDistricts,
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
  const { id } = useSelector(busOwnerData);
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
  });
  const [imgLoading, setImgLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [isImgErr, setIsImgErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (id) => {
    try {
      if (
        !busData.name ||
        !busData.password ||
        !busData.busNumber ||
        !busData.district ||
        !busData.city ||
        !busData.busType ||
        !busData.seatNumber
      ) {
        notification.error({
          message: "Fill all fields",
        });
        return;
      } else if (busData.seatNumber > 60) {
        notification.error({
          message: "Invalid seat numbers",
        });
        return;
      }
      setIsLoading(true);

      const { data, code, msg } = await updateBusAPI(id, busData);
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
  return (
    <>
      <Modal open={isOpen} onCancel={onCancel} footer={null}>
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
