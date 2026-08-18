import React from 'react';

const SelectInput = ({ label, options, error, valueKey="id", labelKey="name", ...props }) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <select className="form-select" {...props}>
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt[valueKey]} value={opt[valueKey]}>{opt[labelKey]}</option>
        ))}
      </select>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};
export default SelectInput;
