import React, { Component } from 'react';

export default class Header extends Component {
    render () {
        return (
            <header>
                <h1>Планировщик задач</h1>
                <input placeholder = 'Поиск' type = 'search' />
            </header>
        );
    }
}
