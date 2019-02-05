// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';

export default class Task extends PureComponent {
    state = {
        message: '',
    }

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

        _updateTask = (event) => {
            this.setState({
                message: event.target.value,
            });
        }

        render () {
            return (<li className = { Styles.task }>
                <div className = { Styles.content }>
                    <input maxLength = '50' type = 'text' onChange = { this._updateTask } defaultValue = { this.props.message } disabled />
                </div>

            </li>);
        }
}
