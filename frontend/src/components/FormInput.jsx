import React from 'react';

const FormInput = ({ label, type = "text", error, ...props }) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input type={type} className="form-input" {...props} />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};
export default FormInput;
