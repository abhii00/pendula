import React from 'react';
import ReactDOM from 'react-dom';

import './index.css'
import DoublePendulum from './components/DoublePendulum.js'

class PendulumContainer extends React.Component
//component to contain pendula
{   
    constructor(props){
        super(props);
        this.consts = {
            canvWidth: 1000,
            canvHeight: 800,
        }
        this.renderDoublePendulum = this.renderDoublePendulum.bind(this);
    }

    renderDoublePendulum(theta1, theta1dot, theta1ddot, theta2, theta2dot, theta2ddot, pcolor, display){
        return <DoublePendulum theta1={theta1} theta1dot={theta1dot} theta1ddot={theta1ddot} theta2={theta2} theta2dot={theta2dot} theta2ddot={theta2ddot} pcolor={pcolor} display={display}/>;
        //display: 0: rod&path, 1: rod, 2: path
    }

    pickRandomColor(){
        return "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ")";
    }

    render(){
        var num = 5;
        var pendula = Array(num);
        for (var i = 0; i < num; i++){
            pendula[i] = this.renderDoublePendulum(Math.PI/2+i*0.1,0,0,0,0,0, this.pickRandomColor(), 0);
        }
        return(
            <div>
                <svg width={this.consts.canvWidth} height={this.consts.canvHeight} className="canvas">
                    {pendula}
                </svg>
            </div> 
        );
    }
}

ReactDOM.render(
    <PendulumContainer />,
    document.getElementById('root')
);