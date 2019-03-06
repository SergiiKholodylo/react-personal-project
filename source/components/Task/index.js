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
        this.taskInput = React.createRef();

        this.setTextInputRef = (element) => {
            this.textInput = element;
        };
    }

    state = {
        isTaskEditing: false,
        newMessage:    "",
    }

    componentDidMount = () => {
        this.setState({
            newMessage: this.props.message,
        });
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.isTaskEditing && !prevState.isTaskEditing) {
            this._taskInputFocus();
        }
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
    })

    //based on tests
    _setTaskEditingState = (mode) => {

        this.setState({
            isTaskEditing: mode,
        });
    }

    _taskInputFocus = () => {
        if (this.taskInput) {
            this.taskInput.current.focus();
        }
    }

    //based on tests
    _updateNewTaskMessage = (event) => {
        this.setState({
            newMessage: event.target.value,
        });
    }

    //based on tests
    _updateTaskMessageOnClick = () => {
        if (this.state.isTaskEditing) {
            this._updateTask();

            return null;
        }
        this._setTaskEditingState(true);
    }

    //based on tests
    _toggleTaskCompletedState = async () => {
        const task = this._getTaskShape({
            completed: !this.props.completed,
        });
        const { _updateTaskAsync } = this.props;

        const updatedTask = await _updateTaskAsync(task);

        this.setState({ updatedTask });
    }

    //based on tests
    _toggleTaskFavoriteState = async () => {
        const task = this._getTaskShape({
            favorite: !this.props.favorite,
        });
        const { _updateTaskAsync } = this.props;

        const updatedTask = await _updateTaskAsync(task);

        this.setState({ updatedTask });
    }

    //based on tests
    _cancelUpdatingTaskMessage = () => {
        this._setTaskEditingState(false);
        this.setState({
            newMessage: this.props.message,
        });
    }

    //based on test
    _updateTask = () => {
        const { _updateTaskAsync } = this.props;
        const task = this._getTaskShape(this.props);

        this._setTaskEditingState(false);
        if (this.state.newMessage === this.props.message) {
            return null;
        }
        _updateTaskAsync(task);
    }

    _removeTask = () => {
        const {
            id,
            _removeTaskAsync,
        } = this.props;

        _removeTaskAsync(id);
    }

    //based on tests
    _updateTaskMessageOnKeyDown = (event) => {
        if (this.state.newMessage === '') {
            return null;
        }

        if (event.key === 'Enter') {
            this._updateTask();

            return null;
        }
        if (event.key === 'Escape') {
            this._cancelUpdatingTaskMessage();
        }
    }

    render () {

        const {
            isTaskEditing,
            newMessage,
        } = this.state;

        const task = this._getTaskShape(this.props);

        const {completed, favorite} = task;

        return (<li className = { `${Styles.task} ${completed && Styles.completed}` }>
            <div className = { Styles.content }>
                <Checkbox checked = { completed } className = { Styles.toggleTaskCompletedState } color1 = '#3B8EF3' color2 = '#FFF' inlineBlock onClick = { this._toggleTaskCompletedState } />
                <input
                    disabled = { !isTaskEditing }
                    maxLength = { 50 }
                    ref = { this.taskInput }
                    type = 'text'
                    value = { newMessage }
                    onChange = { this._updateNewTaskMessage }
                    onKeyDown = { this._updateTaskMessageOnKeyDown }
                />
            </div>
            <div className = { Styles.actions } >
                <Star checked = { favorite } className = { Styles.toggleTaskFavoriteState } color1 = '#3B8EF3' color2 = '#000' inlineBlock onClick = { this._toggleTaskFavoriteState } />
                <Edit checked = { isTaskEditing } className = { Styles.updateTaskMessageOnClick } color1 = '#3B8EF3' color2 = '#000' inlineBlock onClick = { this._updateTaskMessageOnClick } />
                <Remove className = { Styles.removeTask } color1 = '#3B8EF3' color2 = '#000' inlineBlock onClick = { this._removeTask } />
            </div>
        </li>);
    }
}

Task.defaultProps = {
    message:          'The new message',
    id:               '1',
    completed:        false,
    favorite:         false,
};

Task.propTypes = {
    completed:        PropTypes.bool.isRequired,
    favorite:         PropTypes.bool.isRequired,
    id:               PropTypes.string.isRequired,
    message:          PropTypes.string.isRequired,
};
