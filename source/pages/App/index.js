// Core
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

import Scheduler from 'components/Scheduler';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenSquare,faEraser } from '@fortawesome/free-solid-svg-icons'

library.add(faPenSquare)
library.add(faEraser)


@hot(module)
export default class App extends Component {
    render () {
        return (
            <Scheduler  />
        );
    }
}
