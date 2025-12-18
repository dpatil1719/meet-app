import React from 'react';

export const InfoAlert = ({ text }) =>
  text ? <div className="alert info" role="status">{text}</div> : null;

export const ErrorAlert = ({ text }) =>
  text ? <div className="alert error" role="alert">{text}</div> : null;

export const WarningAlert = ({ text }) =>
  text ? <div className="alert warning" role="status">{text}</div> : null;

export default { InfoAlert, ErrorAlert, WarningAlert };
