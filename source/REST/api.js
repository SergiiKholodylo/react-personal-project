import { MAIN_URL, TOKEN } from './config';

export const api = {

    createTask: async (message) => {
        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message }),
        });

        const { data: task } = await response.json();

        return task;
    },

    fetchTasks: async () => {
        // console.log('fetchTasks');
        const response = await fetch(MAIN_URL, {
            method:  'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
        });

        const { data: tasks } = await response.json();

        return tasks;
    },

    updateTask: async (task) => {
        // console.log('API request', JSON.stringify(task));
        const response = await fetch(MAIN_URL, {
            method:  'PUT',
            headers: {
                Authorization:  TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });

        const { data: newTasks } = await response.json();

        // console.log('API response', newTasks);

        return newTasks;
    },

    removeTask: async (id) => {

        await fetch(`${MAIN_URL}/${id}`, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });
    },

    completeAllTasks: async (tasks) => {

        const completedTasks = tasks.map((task) => {
            task.completed = true;

            return task;
        });

        await this.updateTask(completedTasks);
    },

};
