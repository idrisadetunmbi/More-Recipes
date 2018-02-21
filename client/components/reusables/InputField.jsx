import React from 'react';
import PropTypes from 'prop-types';

const InputField = ({
  label, value, type, onChange, required, fieldError,
}) => (
  <div className="input-field">
    <label htmlFor={label}>{label}</label>
    <input
      value={value}
      required={required}
      name={label}
      id={label}
      type={type}
      onChange={onChange}
    />
    {fieldError && <span>{fieldError}</span>}
  </div>
);

InputField.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  fieldError: PropTypes.string,
};

InputField.defaultProps = {
  required: false,
  fieldError: null,
};

export default InputField;
