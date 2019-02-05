import React, { Component } from 'react';
import Task from 'components/Task';

export default class TaskList extends Component {
    render () {
        const { value, filter } = this.props;

        console.log(value);

        const filteredTasks = value.filter((task) => task.message.includes(filter));

        console.log(filteredTasks);

        return (
            <section >
                <form>
                    <input maxLength="50" placeholder="Описaние моей новой задачи" type="text" />
                    <button>Добавить задачу</button>
                </form>
                <ul>
                    <div>
                        {filteredTasks.map((element) => {
                            return (
                                <Task { ...element } />
                            )
                        })}
                    </div>

                </ul>
            </section>
        );
    }
}
