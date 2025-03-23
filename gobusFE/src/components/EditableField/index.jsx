import React from "react";
import "./style.css";
import edit from "../../assets/images/edit.png";
import save from "../../assets/images/save.png";

export default function EditableField({
  label,
  data,
  isEditing,
  onChange,
  onSave,
  onEdit,
}) {
  return (
    <>
      <div className="passenger-profile-account-datafield">
        <div className="passenger-profile-account-data-filed">
          <p className="passenger-profile-account-data-title">{label}</p>

          {isEditing ? (
            <input
              type="text"
              value={data}
              onChange={onChange}
              className="passenger-profile-account-data-input"
            />
          ) : (
            <p className="passenger-profile-account-data">{data}</p>
          )}
        </div>
        <img
          src={isEditing ? save : edit}
          alt=""
          onClick={isEditing ? onSave : onEdit}
          className={
            isEditing
              ? "passenger-profile-account-data-save"
              : "passenger-profile-account-data-edit"
          }
        />
      </div>
    </>
  );
}
