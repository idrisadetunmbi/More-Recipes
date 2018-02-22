import React from 'react';
import PropTypes from 'prop-types';

const LoaderWithComponent = ({ showLoader, component: Component }) => {
  return showLoader ? (
    <div className="preloader">
      <div className="preloader-wrapper big active">
        <div className="spinner-layer">
          <div className="circle-clipper left">
            <div className="circle" />
          </div>
          <div className="gap-patch">
            <div className="circle" />
          </div>
          <div className="circle-clipper right">
            <div className="circle" />
          </div>
        </div>
      </div>
    </div>
  ) : Component;
};

LoaderWithComponent.propTypes = {
  showLoader: PropTypes.bool.isRequired,
  component: PropTypes.element.isRequired,
};

export default LoaderWithComponent;
