import React from "react";
import "./style.css";
import Loading from "../Loading";
import ErrorMessage from "../ErrorMessage";
import EmptyDataMessage from "../EmptyDataMessage";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import MyButton from "../button";

export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  loading,
  onView,
  isDelete = true,
}) {
  return (
    <>
      <table>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.title}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="center-content">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={(e) => {
                  e.stopPropagation();
                  onView(row);
                }}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.type === "image" ? (
                      <>
                        <img
                          src={row.pictures?.[0]}
                          alt="Item"
                          className="table-image"
                        />
                      </>
                    ) : col.type === "boolean" ? (
                      row[col.key] ? (
                        "True"
                      ) : (
                        "False"
                      )
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
                <td>
                  <div className="table-actions">
                    <MyButton
                      size="small"
                      name="Edit"
                      color={"rgba(5, 148, 79, 1)"}
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(row);
                      }}
                    />
                    {isDelete && (
                      <MyButton
                        size="small"
                        name="Delete"
                        color={"#e74c3c"}
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(row);
                        }}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
