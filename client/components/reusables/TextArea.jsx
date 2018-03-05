import React from 'react';
import PropTypes from 'prop-types';

const TextArea = ({
  name, defaultValue, value, onBlur, onFocus, fieldError,
}) => (
  <div>
    <i className="material-icons prefix">mode_edit</i>
    <label
      htmlFor={name}
    >
      {name}
    </label>
    <textarea
      required
      onBlur={onBlur}
      onFocus={onFocus}
      defaultValue={defaultValue}
      name={name}
      value={value}
      className="materialize-textarea"
    />
    <span style={{ color: 'red' }}>{fieldError}</span>
  </div>
);

TextArea.propTypes = {
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  value: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  fieldError: PropTypes.string,
};

TextArea.defaultProps = {
  defaultValue: '',
  fieldError: null,
};

export default TextArea;
