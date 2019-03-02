// Core
import React, { PureComponent } from 'react';
import Checkbox from 'theme/assets/Checkbox';
import Edit from 'theme/assets/Edit';
import Remove from 'theme/assets/Remove';
import Star from 'theme/assets/Star';
import PropTypes from 'prop-types';

// Instruments
import Styles from './styles.m.css';

export default class Task extends PureComponent {

    constructor (props) {
        super(props);

        this.textInput = null;

        this.setTextInputRef = (element) => {
            this.textInput = element;
        };

        this.focusTextInput = () => {
            // Focus the text input using the raw DOM API
            
            if (this.textInput) {
                console.log('focusTextInput', this.textInput);
                this.textInput.focus();
                this.textInput.select();
            }
        };
    }

    state = {
        isEditing: false,
        message:   "",
    }

    componentDidMount = () => {
        this.setState({
            message: this.props.message,
        });
    }

    _getTaskShape = (
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    ) => ({
        id,
        completed,
        favorite,
        message,
    });

    _updateNewTaskMessage = () => {

    }

    _updateTaskMessageOnClick = () => {

    }

    _toggleTaskCompletedState = () => {

    }

    _toggleTaskFavoriteState = () => {

    }

    _cancelUpdatingTaskMessage = () => {

    }

    _updateTaskMessageOnKeyDown = () => {

    }

    _updateTaskContent = (event) => {
        this.setState({
            message: event.target.value,
        });
    }

    _finishTask = async () => {
        const task = this._getTaskShape();
        const { _updateTask } = this.props;

        task.completed = !task.completed;
        this.setState({ task });

        await _updateTask(task);
    }

    _toggleFavoriteTask = async () => {
        const task = this._getTaskShape();
        const { _updateTask } = this.props;

        task.favorite = !task.favorite;
        this.setState({ task });

        await _updateTask(task);
    }

    _updateTask = async () => {
        const { _updateTask } = this.props;
        const task = this._getTaskShape();

        await _updateTask(task);
    }

    _setTaskEditingState = async (event) => {
        
        console.log('Ref', this.textInput);
        
        if (this.state.isEditing) {
            await this._updateTask();
        } else {
            
        }

        this.setState({
            isEditing: !this.state.isEditing,
        });
        //event.preventDefault();
        this.focusTextInput();
    }

    _removeTask = () => {
        const {
            id,
            _removeTask,
        } = this.props;

        _removeTask(id);
    }

    _submitOnEnter = (event) => {
        if (event.key === 'Enter') {
            this._setTaskEditingState();
            event.preventDefault();
        }
    }

    _onFocus = () => {
        console.log('onFocus');
}

    render () {

        const {
            isEditing,
            message,
        } = this.state;

        const divStyle = {
            width:   '19px',
            height:  '19px',
            display: 'inline-block',
        };

        console.log('Render', this.props.id);

        const task = this._getTaskShape();

        return (<li className = { Styles.task }>
            <div className = { Styles.content }>
                <div className = { Styles.toggleTaskCompletedState }>
                    <Checkbox checked = { task.completed } color1 = '#3B8EF3' color2 = '#FFF' onClick = { this._finishTask } />
                </div>
                <input
                    autoFocus
                    disabled = { !isEditing }
                    maxLength = '50'
                    ref = { this.setTextInputRef }
                    type = 'text'
                    value = { message }
                    onChange = { this._updateTaskContent }
                    onFocus = { this._onFocus }
                    onKeyPress = { this._submitOnEnter }
                />
            </div>
            <div className = { Styles.actions } >
                <div className = { Styles.toggleTaskFavoriteState } style = { divStyle } >
                    <Star inlineBlock checked = { task.favorite } color1 = '#3B8EF3' color2 = '#000' onClick = { this._toggleFavoriteTask } />
                </div>
                <div className = { Styles.updateTaskMessageOnClick } style = { divStyle }>
                    <Edit inlineBlock checked = { isEditing } color1 = '#3B8EF3' color2 = '#000' onClick = { this._setTaskEditingState } />
                </div>
                <div style = { divStyle }>
                    <Remove inlineBlock color1 = '#3B8EF3' color2 = '#000' onClick = { this._removeTask } />
                </div>

            </div>
        </li>);
    }
}

Task.defaultProps = {
    message:   '',
    id:        '',
    completed: false,
    favorite:  false,
};

Task.propTypes = {
    completed: PropTypes.bool,
    favorite:  PropTypes.bool,
    id:        PropTypes.string,
    message:   PropTypes.string,
};
