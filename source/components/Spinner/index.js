// Core
import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { bool } from 'prop-types';

// Instruments
import Styles from './styles.m.css';

export default class Spinner extends Component {

    render () {
        const { isSpinning } = this.props;
        const portal = document.getElementById('spinner');

        return (
            createPortal(isSpinning ? <div className = { Styles.spinner } /> : null, portal)
        );

    }
}

Spinner.defaultProps = {
    isSpinning: false,
};

Spinner.propTypes = {
    isSpinning: bool.isRequired,
};