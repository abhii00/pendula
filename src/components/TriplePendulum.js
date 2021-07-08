import React from 'react';

class TriplePendulum extends React.Component
//component for triple pendulum
{
    constructor(props){
        super(props);

        this.consts = {
            intervalTime: 0.00001,
            dt: 0.1,
            maxpathLength: 500,
            xpiv: 500,
            ypiv: 400,
            l1: 150,
            l2: 150,
            l3: 150,
            m1: 10000,
            m2: 10000,
            m3: 10000,
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
            theta3: this.props.theta3,
            theta3dot: this.props.theta3dot,
            theta3ddot: this.props.theta3ddot,
            theta3ddotnew: 0,
            x1: 0,
            y1: this.consts.l1,
            x2: 0,
            y2: this.consts.l1+this.consts.l2,
            x3: 0,
            y3: this.consts.l1+this.consts.l2+this.consts.l3,
            path: "",
            pathLength: 0,
        }
        
        this.updatePosition = this.updatePosition.bind(this);
    }

    componentDidMount(){
        this.interval = setInterval(this.updatePosition, this.consts.intervalTime*1000);
    }

    updatePosition(){
        this.vVerlet();
        this.setCartesian();
        this.updatePath();
    }

    updateAcceleration(){
        var m1 = this.consts.m1;
        var m2 = this.consts.m2;
        var m3 = this.consts.m3;
        var l1 = this.consts.l1;
        var l2 = this.consts.l2;
        var l3 = this.consts.l3;
        var g = this.consts.g;
        var w1 = this.state.theta1dot;
        var w2 = this.state.theta2dot;
        var w3 = this.state.theta3dot;
        var delta = this.state.theta2 - this.state.theta1;

        this.setState({
            theta1ddotnew: (m2*l1*(w1**2)*Math.sin(delta)*Math.cos(delta)+m2*g*Math.sin(this.state.theta2)*Math.cos(delta)+m2*l2*(w2**2)*Math.sin(delta)-(m1+m2)*g*Math.sin(this.state.theta1))/((m1+m2)*l1-m2*l1*(Math.cos(delta)**2)),
            theta2ddotnew: (-m2*l2*(w2**2)*Math.sin(delta)*Math.cos(delta) + (m1+m2)*(g*Math.sin(this.state.theta1)*Math.cos(delta)-l1*(w1**2)*Math.sin(delta)-g*Math.sin(this.state.theta2)))/((m1+m2)*l2-m2*l2*(Math.cos(delta)**2))
        })
    }

    vVerlet(){
        this.setState({
            theta1: this.state.theta1 + this.state.theta1dot*this.consts.dt + 0.5*this.state.theta1ddot*(this.consts.dt**2),
            theta2: this.state.theta2 + this.state.theta2dot*this.consts.dt + 0.5*this.state.theta2ddot*(this.consts.dt**2),
            theta3: this.state.theta3 + this.state.theta3dot*this.consts.dt + 0.5*this.state.theta3ddot*(this.consts.dt**2)
        })
        this.updateAcceleration();
        this.setState({
            theta1dot: this.state.theta1dot + 0.5*(this.state.theta1ddot+this.state.theta1ddotnew)*this.consts.dt,
            theta2dot: this.state.theta2dot + 0.5*(this.state.theta2ddot+this.state.theta2ddotnew)*this.consts.dt,
            theta3dot: this.state.theta3dot + 0.5*(this.state.theta3ddot+this.state.theta3ddotnew)*this.consts.dt,
            theta1ddot: this.state.theta1ddotnew,
            theta2ddot: this.state.theta2ddotnew,
            theta3ddot: this.state.theta3ddotnew,
        })
    }

    setCartesian(){
        this.setState({
            x1: this.consts.l1*Math.sin(this.state.theta1),
            y1: this.consts.l1*Math.cos(this.state.theta1),
            x2: this.consts.l1*Math.sin(this.state.theta1) + this.consts.l2*Math.sin(this.state.theta2),
            y2: this.consts.l1*Math.cos(this.state.theta1) + this.consts.l2*Math.cos(this.state.theta2),
            x3: this.consts.l1*Math.sin(this.state.theta1) + this.consts.l2*Math.sin(this.state.theta2) + this.consts.l3*Math.sin(this.state.theta3),
            y3: this.consts.l1*Math.cos(this.state.theta1) + this.consts.l2*Math.cos(this.state.theta2) + this.consts.l3*Math.cos(this.state.theta3),
        });
    }    

    updatePath(){
        var newpath = this.state.path;
        var newpathLength = this.state.pathLength + 1;

        newpath += (this.state.x3+this.consts.xpiv).toString() + "," + (this.state.y3+this.consts.ypiv).toString() + " ";

        if (newpathLength > this.consts.maxpathLength){
            while (newpath.charAt(0) !== " "){
                newpath = newpath.substring(1);
            }
            newpath = newpath.substring(1);
            newpathLength -= 1;
        }

        this.setState({
            path: newpath,
            pathLength: newpathLength
        })
    }

    renderPath(){
        return <polyline points={this.state.path} className="path" style={{stroke: this.props.pcolor}}></polyline>;
    }

    renderRods(){
        return (
            <React.Fragment>
                <line x1={this.consts.xpiv} y1={this.consts.ypiv} x2={this.consts.xpiv+this.state.x1} y2={this.consts.ypiv+this.state.y1} className="rod"/>
                <line x1={this.consts.xpiv+this.state.x1} y1={this.consts.ypiv+this.state.y1} x2={this.consts.xpiv+this.state.x2} y2={this.consts.ypiv+this.state.y2} className="rod"/>
                <line x1={this.consts.xpiv+this.state.x2} y1={this.consts.ypiv+this.state.y2} x2={this.consts.xpiv+this.state.x3} y2={this.consts.ypiv+this.state.y3} className="rod"/>
            </React.Fragment>
        );
    }

    render(){
        switch(this.props.display){
            case 0:
                var pendulum = Array(2);
                pendulum[0] = this.renderRods();
                pendulum[1] = this.renderPath();
                break;
            case 1:
                pendulum = this.renderRods();
                break;
            case 2:
                pendulum = this.renderPath();
                break;
            default:
                break;
        }
        return (
            <React.Fragment>
                {pendulum}
            </React.Fragment>
        );
    }
}

export default TriplePendulum