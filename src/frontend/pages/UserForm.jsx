import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./UserForm.css";

// Define UserForm component
const UserForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    wardNo: "",
    houseNo: "",
    residentName: "",
    mobileNo: "",
    address: "",
    totalHouseholds: "",
    propertyType: "",
    propertyTypeDetails: "",
    industryType: "",
    hasWaterConnection: null,
    authorizedConnections: 0,
    authorizedDiameters: [],
    propertyPhoto: null,
    pipelinePhoto: null,
    waterTaxBill: null,
    noConnectionReason: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : null,
    }));
  };

  const handleLogout = () => {
    navigate('/');
  };

  const WaterConnectionSelection = ({ formData, setFormData }) => {
    const authorizedConnections = formData.authorizedConnections || 0;
    const authorizedDiameters = formData.authorizedDiameters || [];
    const noConnectionReason = formData.noConnectionReason || "";
    const hasWaterConnection = formData.hasWaterConnection;

    const handleDiameterChange = (connIndex, size) => {
      const updated = [...Array(authorizedConnections)].map((_, i) =>
        authorizedDiameters[i] ? [...authorizedDiameters[i]] : []
      );

      if (updated[connIndex].includes(size)) {
        updated[connIndex] = updated[connIndex].filter((d) => d !== size);
      } else {
        updated[connIndex].push(size);
      }

      setFormData((prev) => ({
        ...prev,
        authorizedDiameters: updated,
      }));
    };

    const handleAuthorizedConnectionsChange = (value) => {
      const updated = Array.from({ length: value }, (_, i) => authorizedDiameters[i] || []);
      setFormData((prev) => ({
        ...prev,
        authorizedConnections: value,
        authorizedDiameters: updated,
      }));
    };

    return (
      <div>
        <label className="block font-medium">
          Is there a Municipal Water Connection?
        </label>
        <div className="flex items-center space-x-4 mt-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="hasWaterConnection"
              checked={hasWaterConnection === true}
              onChange={() =>
                setFormData((prev) => ({
                  ...prev,
                  hasWaterConnection: true,
                  noConnectionReason: ""
                }))
              }
            />
            <span>Yes</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="hasWaterConnection"
              checked={hasWaterConnection === false}
              onChange={() =>
                setFormData((prev) => ({
                  ...prev,
                  hasWaterConnection: false,
                  authorizedConnections: 0,
                  authorizedDiameters: []
                }))
              }
            />
            <span>No</span>
          </label>
        </div>

        {hasWaterConnection === true && (
          <div className="mt-4">
            <label className="block font-medium mb-1">
              No of Authorized Water Connections:
            </label>
            <select
              className="w-full border border-gray-300 rounded-full p-3"
              value={authorizedConnections}
              onChange={(e) =>
                handleAuthorizedConnectionsChange(Number(e.target.value))
              }
            >
              {[...Array(9).keys()].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            {authorizedConnections > 0 && (
              <div className="mt-4">
                <label className="block font-medium mb-2">
                  Diameter of Authorized Connections:
                </label>
                {Array.from({ length: authorizedConnections }).map((_, idx) => (
                  <div key={idx} className="mb-2 border rounded p-2">
                    <div className="font-semibold mb-1">Connection {idx + 1}</div>
                    <div className="flex flex-wrap gap-3">
                      {['0.5"', '0.75"', '1.0"', '1.25"', '1.5"', '2"'].map((size) => (
                        <label key={`${idx}-${size}`} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={authorizedDiameters[idx]?.includes(size) || false}
                            onChange={() => handleDiameterChange(idx, size)}
                          />
                          <span>{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {hasWaterConnection === false && (
          <div className="mt-4">
            <label className="block font-medium mb-1">
              Reason for No Water Connection:
            </label>
            <select
              className="w-full border border-gray-300 rounded-full p-3"
              value={noConnectionReason}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  noConnectionReason: e.target.value
                }))
              }
            >
              <option value="">Select</option>
              <option value="Unauthorized water connection">
                Unauthorized water connection
              </option>
              <option value="Municipal water line not passed near the property">
                Municipal water line not passed near the property
              </option>
            </select>
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();

    // Basic fields
    formDataToSubmit.append("wardNo", formData.wardNo);
    formDataToSubmit.append("houseNo", formData.houseNo);
    formDataToSubmit.append("residentName", formData.residentName);
    formDataToSubmit.append("mobileNo", formData.mobileNo);
    formDataToSubmit.append("address", formData.address);
    formDataToSubmit.append("totalHouseholds", formData.totalHouseholds);
    formDataToSubmit.append("propertyType", formData.propertyType);
    formDataToSubmit.append("propertyTypeDetails", formData.propertyTypeDetails);
    formDataToSubmit.append("industryType", formData.industryType);

    // Fixed fields
    formDataToSubmit.append(
      "municipalWaterConnection",
      formData.hasWaterConnection ? "Yes" : "No"
    );
    formDataToSubmit.append(
      "authorizedWaterConnections",
      formData.authorizedConnections.toString()
    );
    formDataToSubmit.append(
      "authorizedConnectionDiameter",
      formData.authorizedDiameters.flat().join(",")
    );

    if (!formData.hasWaterConnection) {
      formDataToSubmit.append("noConnectionReason", formData.noConnectionReason);
    }

    // Files
    if (formData.propertyPhoto) {
      formDataToSubmit.append("propertyPhoto", formData.propertyPhoto);
    }
    if (formData.pipelinePhoto) {
      formDataToSubmit.append("pipelinePhoto", formData.pipelinePhoto);
    }
    if (formData.waterTaxBill) {
      formDataToSubmit.append("waterTaxBill", formData.waterTaxBill);
    }

    try {
      const response = await fetch("http://localhost:5000/api/submit-form", {
        method: "POST",
        body: formDataToSubmit,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Form submitted successfully!");
      } else {
        alert(`Failed to submit form: ${result.message}`);
      }
    } catch (error) {
      alert("Error submitting form");
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="user-form-container">
      <h2>आळंदी नगरपरषद - आळंदी</h2>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>वॉड मांक (Ward No):</label>
          <input type="text" name="wardNo" value={formData.wardNo} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label>घर मांक (House No):</label>
          <input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label>निवासीचे नाव (Name of Resident):</label>
          <input type="text" name="residentName" value={formData.residentName} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label>मोबाईल नंबर (Mobile No):</label>
          <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label>पत्ता (Address):</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label>कुटुंबांची संख्या (Total Households):</label>
          <input type="number" name="totalHouseholds" value={formData.totalHouseholds} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label>प्रॉपर्टी प्रकार (Property Type):</label>
          <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full border border-gray-300 rounded-full p-3">
            <option value="">Select</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>
        {formData.propertyType === "Residential" && (
          <div>
            <label className="block">Residential Options</label>
            <select name="propertyTypeDetails" value={formData.propertyTypeDetails} onChange={handleChange} className="w-full border border-gray-300 rounded-full p-3">
              <option value="Apartment">Apartment</option>
              <option value="Bungalow">Bungalow</option>
            </select>
          </div>
        )}
        {formData.propertyType === "Commercial" && (
          <div>
            <label className="block">Commercial Options</label>
            <select name="propertyTypeDetails" value={formData.propertyTypeDetails} onChange={handleChange} className="w-full border border-gray-300 rounded-full p-3">
              <option value="School">School</option>
              <option value="Shop">Shop</option>
              <option value="Office">Office</option>
              <option value="Bank">Bank</option>
              <option value="Hotel">Hotel</option>
            </select>
          </div>
        )}
        {formData.propertyType === "Industrial" && (
          <div>
            <label className="block">Type of Industry</label>
            <input type="text" name="industryType" value={formData.industryType} onChange={handleChange} className="w-full border border-gray-300 rounded-full p-3" />
          </div>
        )}

        {/* Water Connection */}
        <WaterConnectionSelection formData={formData} setFormData={setFormData} />

        {/* File Uploads */}
        <div className="form-row">
          <label>Attach Photo of the Property:</label>
          <input type="file" name="propertyPhoto" onChange={handleFileChange} accept="image/*" />
        </div>
        <div className="form-row">
          <label>Attach Photo of Pipeline:</label>
          <input type="file" name="pipelinePhoto" onChange={handleFileChange} accept="image/*" />
        </div>
        <div className="form-row">
          <label>Upload Water Tax Bill:</label>
          <input type="file" name="waterTaxBill" onChange={handleFileChange} accept="image/*" />
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default UserForm;
