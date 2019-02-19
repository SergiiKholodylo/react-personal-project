// Core
import React, { Component } from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Task from 'components/Task';
import { sortTasksByGroup } from '../../instruments/helpers';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
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

    _updateTasksFilter = () => {

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

    _submitOnEnter = (event) => {
        const enterKey = event.key === 'Enter';

        if (enterKey) {
            event.preventDefault();
            this._submitTask();
        }
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

    _toggleCheckbox = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    };







    // CRUD Opps

    _fetchTasks = async () => {
        this._setIsLoadingState(true);

        const tasks = sortTasksByGroup(await api.fetchTasks());

        this.setState({
            tasks,
            isLoading: false,
        });
    }    

    _updateTask = async (task) => {

        this._setIsLoadingState(true);
        const updatedTask = await api.updateTask([task]);

        this.setState(({ tasks }) => ({
            tasks:     sortTasksByGroup([...updatedTask, ...tasks.filter((taskInt) => taskInt.id !== task.id)]),
            isLoading: false,
        }));
    }

    _removeTask = async (id) => {
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

    _finishTask = async (id) => {
        try {
            await this.state.tasks.filter((task) => task.id === id).map(async (task) => {
                task.completed = !task.completed;
                await this._updateTask(task);
            });
        } catch (exception) {
            console.log(exception);
        }
    };

    render () {
        const { isLoading, searchString, tasks, newTaskName } = this.state;

        const tasksJSX = (this._isEmptyOrSpaces(searchString) ? tasks : tasks.filter((task) => task.message.includes(searchString))).map((task) => {

            return (
                <Task
                    key = { task.id }
                    { ...task }
                    _finishTask = { this._finishTask }
                    _removeTask = { this._removeTask }
                    _toggleCheckbox = { this._toggleCheckbox }
                    _updateTask = { this._updateTask }
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
                    <Footer />
                </main>
            </section>
        );
    }
}
