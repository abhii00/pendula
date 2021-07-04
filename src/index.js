import React from 'react';
import ReactDOM from 'react-dom';

import './index.css'

class DoublePendulum extends React.Component
//component for double pendulum
{
    constructor(props){
        super(props);

        this.consts = {
            canvWidth: 1000,
            canvHeight: 800,
            xpiv: 500,
            ypiv: 300,
            l1: 100,
            l2: 100,
            m1: 1,
            m2: 1,
            g: 9.8
        }

        this.state = {
            theta1: this.props.theta1,
            theta1dot: this.props.theta1dot,
            theta1ddot: this.props.theta1ddot,
            theta1ddotnew: 0,
            theta2: this.props.theta2,
            theta2dot: this.props.theta2dot,
            theta2ddot: this.props.theta2ddot,
            theta2ddotnew: 0,
            dt: 0.0001,
            x1: 0,
            y1: this.consts.l1,
            x2: 0,
            y2: this.consts.l1+this.consts.l2
        }
        
        this.updatePosition = this.updatePosition.bind(this);
        this.vVerlet = this.vVerlet.bind(this);
        this.updateAccelerations = this.updateAccelerations.bind(this);
        this.setCartesian = this.setCartesian.bind(this);
    }

    componentDidMount(){
        this.interval = setInterval(this.updatePosition, this.consts.dt*1000);
    }

    updatePosition(){
        this.vVerlet();
        this.setCartesian();
            console.log(this.state.theta1, this.state.theta2)
    }

    updateAccelerations(){
        var m1 = this.consts.m1;
        var m2 = this.consts.m2;
        var l1 = this.consts.l1;
        var l2 = this.consts.l2;
        var g = this.consts.g;
        var w1 = this.state.theta1dot;
        var w2 = this.state.theta2dot;
        var delta = this.state.theta2 - this.state.theta1;

        this.setState({
            theta1ddotnew: (m2*l1*(w1**2)*Math.sin(delta)*Math.cos(delta)+m2*g*Math.sin(this.state.theta2)*Math.cos(delta)+m2*l2*(w2**2)*Math.sin(delta)-(m1+m2)*g*Math.sin(this.state.theta1))/((m1+m2)*l1-m2*l1*(Math.cos(delta)**2)),
            theta2ddotnew: (-m2*l2*(w2**2)*Math.sin(delta)*Math.cos(delta) + (m1+m2)*(g*Math.sin(this.state.theta1)*Math.cos(delta)-l1*(w1**2)*Math.sin(delta)-g*Math.sin(this.state.theta2)))/((m1+m2)*l2-m2*l2*(Math.cos(delta)**2))
        })
    }

    vVerlet(){
        this.setState({
            theta1: this.state.theta1 + this.state.theta1dot*this.consts.dt + 0.5*this.state.theta1ddot*(this.consts.dt**2),
            theta2: this.state.theta2 + this.state.theta2dot*this.consts.dt + 0.5*this.state.theta2ddot*(this.consts.dt**2)
        })
        this.updateAccelerations();
        this.setState({
            theta1dot: this.state.theta1dot + 0.5*(this.state.theta1ddot+this.state.theta1ddotnew)*this.consts.dt,
            theta2dot: this.state.theta2dot + 0.5*(this.state.theta2ddot+this.state.theta2ddotnew)*this.consts.dt,
            theta1ddot: this.state.theta1ddotnew,
            theta2ddot: this.state.theta2ddotnew
        })
    }

    swing(){
        this.setState({
            theta1: this.state.theta1 + 0.001,
            theta2: this.state.theta2 + 0.005,
        })
    }

    setCartesian(){
        this.setState({
            x1: this.consts.l1*Math.sin(this.state.theta1),
            y1: this.consts.l1*Math.cos(this.state.theta1),
            x2: this.consts.l1*Math.sin(this.state.theta1) + this.consts.l2*Math.sin(this.state.theta2),
            y2: this.consts.l1*Math.cos(this.state.theta1) + this.consts.l2*Math.cos(this.state.theta2),
        });
    }    

    render(){
        return (
            <svg width={this.consts.canvWidth} height={this.consts.canvHeight} className="canvas">
                <line x1={this.consts.xpiv} y1={this.consts.ypiv} x2={this.consts.xpiv+this.state.x1} y2={this.consts.ypiv+this.state.y1} className="rod"/>
                <line x1={this.consts.xpiv+this.state.x1} y1={this.consts.ypiv+this.state.y1} x2={this.consts.xpiv+this.state.x2} y2={this.consts.ypiv+this.state.y2} className="rod"/>
            </svg>
        );
    }
}

class PendulumContainer extends React.Component
//component to contain pendula
{
    renderDoublePendula(theta1, theta1dot, theta1ddot, theta2, theta2dot, theta2ddot){
        return <DoublePendulum theta1={theta1} theta1dot={theta1dot} theta1ddot={theta1ddot} theta2={theta2} theta2dot={theta2dot} theta2ddot={theta2ddot} />;
    }

    render(){
        return(
            <div>
                {this.renderDoublePendula(Math.PI/6,0,0,0,0,0)}
            </div> 
        );
    }
}

ReactDOM.render(
    <PendulumContainer />,
    document.getElementById('root')
);