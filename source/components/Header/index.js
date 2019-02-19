import React, { Component } from 'react';

export default class Header extends Component {
    render () {
        const { value, onChange } = this.props;

        return (
            <header>
                <h1>Планировщик задач</h1>
                <input
                    placeholder='Поиск'
                    type='search'
                    value={ value }
                    onChange={ onChange } />
            </header>
        );
    }
}
