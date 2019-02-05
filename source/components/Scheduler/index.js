// Core
import React, { Component } from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import TaskList from 'components/TaskList';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
//import { Provider } from 'components/HOC/withProfile';

import dataSource from 'stub/data.js';

export default class Scheduler extends Component {
    state = {
        searchString: '',
        tasks:        [],
        isLoading:    false,
        newTaskName:  '',
    }

    render() {
        const { isLoading, searchString, tasks, newTaskName } = this.state;

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Header />
                    <TaskList  />
                    <Footer />
                </main>
            </section>
        );
    }
}
