// Core
import React, { Component } from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Task from 'components/Task';

// Instruments
import Styles from './styles.m.css';
import { api, MAIN_URL, TOKEN } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

export default class Scheduler extends Component {
    state = {
        searchString: '',
        tasks:        [],
        isLoading:    false,
        newTaskName:  'Create a new task stub)',
    }

    componentDidMount() { 
        this._fetchTasks();
    }

    _fetchTasks = async () => {
        this._setIsLoadingState(true);

        const response = await fetch(MAIN_URL, {
            method:  'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
        });

        const { data: tasks } = await response.json();
        
        console.log(tasks);

        this.setState({
            tasks,
            isLoading: false,
        });
    }

    _setIsLoadingState = (state) => {
        this.setState({
            isLoading: state,
        });
    }

    _createTask = async (message) => {
        this._setIsLoadingState(true);
        console.log('Creating task');
        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message }),
        });

        const { data: task } = await response.json();

        this.setState(({ tasks }) => ({
            tasks:     [task, ...tasks],
            isLoading: false,
        }));
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

    render () {
        const { isLoading, searchString, tasks, newTaskName } = this.state;

        const tasksJSX = tasks.map((task) => {

            return (
                <Task
                    key = { task.id }
                    { ...task }
                    _likePost = { this._likePost }
                    _removePost = { this._removePost }
                />
            );
        });

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Header />
                    <section >
                        <form onSubmit = { this._handleFormSubmit }>
                            <input maxLength = '50' placeholder = 'Описaние моей новой задачи' type = 'text' />
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
