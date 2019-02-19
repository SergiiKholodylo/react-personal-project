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

    state = {
        task: {
            completed: false,
            message:   '',
        },
        isEditing: false,
    }

    componentDidMount = () => {
        // console.log(this.props);

        const task = this._getTaskShape(
            this.props.id,
            this.props.completed,
            this.props.favorite,
            this.props.message,
        );

        this.setState({
            task,
        });
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

    _updateTaskContent = (event) => {

        const task = { ...this.state.task };

        task.message = event.target.value;
        this.setState({ task });
    }

    _finishTask = async (event) => {
        const task = { ...this.state.task };
        const { _updateTask } = this.props;

        task.completed = !task.completed;
        this.setState({ task });
        console.log(task);
        await _updateTask(task);
    }

    _updateTask = async () => {
        const { _updateTask } = this.props;
        const { task } = this.state;

        await _updateTask(task);
    }

    _setTaskEditingState = async () => {
        // console.log('isEditing', this.state.isEditing);
        if (this.state.isEditing) {
            await this._updateTask();
        }

        this.setState({
            isEditing: !this.state.isEditing,
        });

    }

    _onEraserIconClick = () => {
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

    render () {

        const {
            isEditing,
            task,
        } = this.state;

        const divStyle = {
            width:   '19px',
            height:  '19px',
            display: 'inline-block',
        };

        return (<li className = { Styles.task }>
            <div className = { Styles.content }>
                <div className = { Styles.toggleTaskCompletedState }>
                    <Checkbox checked = { task.completed } color1 = '#3B8EF3' color2 = '#FFF' onClick = { this._finishTask } />
                </div>
                <input
                    disabled = { !isEditing }
                    maxLength = '50'
                    type = 'text'
                    value = { task.message }
                    onChange = { this._updateTaskContent }
                    onKeyPress = { this._submitOnEnter }
                />
            </div>
            <div className = { Styles.actions } >
                <div className = { Styles.toggleTaskFavoriteState } style = { divStyle } >
                    <Star inlineBlock color1 = '#3B8EF3' color2 = '#000'/>
                </div>
                <div className = { Styles.updateTaskMessageOnClick } style = { divStyle }>
                    <Edit inlineBlock color1 = '#3B8EF3' color2 = '#000' onClick = { this._setTaskEditingState } /> 
                </div>
                <div style = { divStyle }>
                    <Remove inlineBlock color1 = '#3B8EF3' color2 = '#000' onClick = { this._onEraserIconClick } />
                </div>
                
            </div>
        </li>);
    }
}

Task.defaultProps = {
    message: '',
    id:      '',
};

Task.propTypes = {
    id:      PropTypes.string,
    message: PropTypes.string,
};
