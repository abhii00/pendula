import React from 'react';
import ReactDOM from 'react-dom';

import './index.css'

class DoublePendulum extends React.Component
//component for double pendulum
{
    constructor(props){
        super(props);

        this.consts = {
            intervalTime: 0.001,
            dt: 0.1,
            xpiv: 500,
            ypiv: 200,
            l1: 200,
            l2: 200,
            m1: 10000,
            m2: 10000,
            g: 9.81
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
            x1: 0,
            y1: this.consts.l1,
            x2: 0,
            y2: this.consts.l1+this.consts.l2
        }
        
        this.updatePosition = this.updatePosition.bind(this);
    }

    componentDidMount(){
        this.interval = setInterval(this.updatePosition, this.consts.intervalTime*1000);
    }

    updatePosition(){
        this.vVerlet();
        this.setCartesian();
    }

    updateAcceleration(){
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
        this.updateAcceleration();
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
            <React.Fragment>
                <line x1={this.consts.xpiv} y1={this.consts.ypiv} x2={this.consts.xpiv+this.state.x1} y2={this.consts.ypiv+this.state.y1} className="rod" style={{stroke: this.props.color}}/>
                <line x1={this.consts.xpiv+this.state.x1} y1={this.consts.ypiv+this.state.y1} x2={this.consts.xpiv+this.state.x2} y2={this.consts.ypiv+this.state.y2} className="rod" style={{stroke: this.props.color}}/>
            </React.Fragment>
        );
    }
}

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

    renderDoublePendulum(theta1, theta1dot, theta1ddot, theta2, theta2dot, theta2ddot, color){
        return <DoublePendulum theta1={theta1} theta1dot={theta1dot} theta1ddot={theta1ddot} theta2={theta2} theta2dot={theta2dot} theta2ddot={theta2ddot} color={color}/>;
    }

    render(){
        var num = 75;
        var pendula = Array(num);
        for (var i = 0; i < num; i++){
            pendula[i] = this.renderDoublePendulum(0,0,0,i*Math.PI/num,0,0,"white");
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