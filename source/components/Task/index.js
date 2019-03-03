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

        console.log('Props', props);
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
        console.log('_setTaskEditingState', mode,this.taskInput);
        this.setState({
            isTaskEditing: mode,
        });
        this.taskInput.current.focus();
        if (mode) {
            this.taskInput.current.focus();
        }
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
        } else {
            this._setTaskEditingState(true);
        }

    }

    //based on tests
    _toggleTaskCompletedState = async () => {
        const task = this._getTaskShape(this.props);
        const { _updateTaskAsync } = this.props;

        task.completed = !task.completed;
        const updatedTask = await _updateTaskAsync(task);

        this.setState({ updatedTask });
    }

    //based on tests
    _toggleTaskFavoriteState = async () => {
        const task = this._getTaskShape(this.props);
        const { _updateTaskAsync } = this.props;

        task.favorite = !task.favorite;
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
        if (this.state.newMessage !== this.props.message) {
            _updateTaskAsync(task);
        }
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

        if (!this.state.newMessage) {
            return;
        }

        if (event.key === 'Enter') {
            this._updateTask();
            event.preventDefault();
        }
        if (event.key === 'Esc') {
            this._cancelUpdatingTaskMessage();
            event.preventDefault();
        }
    }

    render () {

        const {
            isTaskEditing,
            newMessage,
        } = this.state;

        const task = this._getTaskShape(this.props);

        return (<li className = { Styles.task }>
            <div className = { Styles.content }>
                <Checkbox checked = { task.completed } className = { Styles.toggleTaskCompletedState } color1 = '#3B8EF3' color2 = '#FFF' inlineBlock onClick = { this._toggleTaskCompletedState } />
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
                <Star checked = { task.favorite } className = { Styles.toggleTaskFavoriteState } color1 = '#3B8EF3' color2 = '#000' inlineBlock onClick = { this._toggleTaskFavoriteState } />
                <Edit checked = { isTaskEditing } className = { Styles.updateTaskMessageOnClick } color1 = '#3B8EF3' color2 = '#000' inlineBlock onClick = { this._updateTaskMessageOnClick } />
                <Remove className = { Styles.removeTask } color1 = '#3B8EF3' color2 = '#000' inlineBlock onClick = { this._removeTask } />
            </div>
        </li>);
    }
}

Task.defaultProps = {
    message:   '1',
    id:        '1',
    completed: false,
    favorite:  false,
};

Task.propTypes = {
    // _remoteTaskAsync: PropTypes.func.isRequired,
    // _updateTaskAsync: PropTypes.func.isRequired,
    completed:        PropTypes.bool.isRequired,
    favorite:         PropTypes.bool.isRequired,
    id:               PropTypes.string.isRequired,
    message:          PropTypes.string.isRequired,
};
