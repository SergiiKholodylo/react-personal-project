// Core
import React, { Component } from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Task from 'components/Task';
import Checkbox from 'theme/assets/Checkbox';

import { sortTasksByGroup } from '../../instruments/helpers';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST';
import Spinner from '../Spinner';

export default class Scheduler extends Component {
    state = {
        searchString: '',
        tasks:        [],
        isLoading:    false,
        newTaskName:  '',
    }

    componentDidMount () {
        this._fetchTasks();
    }

    _setIsLoadingState = (state) => {
        this.setState({
            isLoading: state,
        });
    }

    _handleFormSubmit = (event) => {
        event.preventDefault();
        this._submitTask();
    }

    _submitTask = () => {
        const { newTaskName } = this.state;

        if (!newTaskName) {
            return null;
        }
        this._createTask(newTaskName);
        this.setState({
            newTaskName: '',
        });
    }

    _isEmptyOrSpaces = (str) => {
        return str === null || str.match(/^ *$/) !== null;
    }

    _updateSearchString = (event) => {
        this.setState({
            searchString: event.target.value,
        });
    }

    _newTaskNameChange= (event) => {
        this.setState({
            newTaskName: event.target.value,
        });
    }

    _getActiveTasks = () => {
        const { searchString, tasks } = this.state;

        return this._isEmptyOrSpaces(searchString)
            ? tasks : tasks.filter((task) => task.message.includes(searchString));

    }

    // CRUD Operations

    _fetchTasks = async () => {
        this._setIsLoadingState(true);

        this.setState({
            tasks:     sortTasksByGroup(await api.fetchTasks()),
            isLoading: false,
        });
    }

    _updateTaskAsync = async (task) => {

        this._setIsLoadingState(true);
        const updatedTask = await api.updateTask([task]);

        this.setState(({ tasks }) => ({
            tasks:     sortTasksByGroup([...updatedTask, ...tasks.filter((taskInt) => taskInt.id !== task.id)]),
            isLoading: false,
        }));
    }

    _removeTaskAsync = async (id) => {
        this._setIsLoadingState(true);

        await api.removeTask(id);

        this.setState(({ tasks }) => ({
            tasks:     tasks.filter((task) => task.id !== id),
            isLoading: false,
        }));

    }

    _createTask = async (message) => {
        this._setIsLoadingState(true);
        const task = await api.createTask(message);

        this.setState(({ tasks }) => ({
            tasks:     sortTasksByGroup([task, ...tasks]),
            isLoading: false,
        }));
    }
;

    _finishAllTask = async () => {
        const selectedTasks = this._getActiveTasks();

        this._setIsLoadingState(true);

        await api.completeAllTasks(selectedTasks);

        this.setState(({ tasks }) => ({
            tasks:     sortTasksByGroup(tasks),
            isLoading: false,
        }));
    };

    render () {
        const { isLoading, searchString, newTaskName } = this.state;

        let allTasksDone = true;

        const tasksJSX = this._getActiveTasks().map((task) => {
            if (!task.completed) {
                allTasksDone = false;
            }

            return (
                <Task
                    key = { task.id }
                    { ...task }
                    _removeTaskAsync = { this._removeTaskAsync }
                    _updateTaskAsync = { this._updateTaskAsync }
                />
            );
        });

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner isSpinning = { isLoading } />
                    <Header
                        value = { searchString }
                        onChange = { this._updateSearchString }
                    />
                    <section >
                        <form onSubmit = { this._handleFormSubmit }>
                            <input
                                maxLength = '50'
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = { newTaskName }
                                onChange = { this._newTaskNameChange }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <ul>
                            <div>
                                { tasksJSX }
                            </div>
                        </ul>
                    </section>
                    <Footer>
                        <Checkbox checked = { allTasksDone } color1 = '#000' color2 = '#FFF' onClick = { this._finishAllTask } />
                        <span className = { Styles.completeAllTasks }>Все задачи выполнены</span>
                    </Footer>
                </main>
            </section>
        );
    }
}
