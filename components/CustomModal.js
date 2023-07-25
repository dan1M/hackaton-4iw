// components/Modal.js

import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");

function CustomModal({ isOpen, onRequestClose, children, styles }) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={styles}>
      {children}
    </Modal>
  );
}

export default CustomModal;
