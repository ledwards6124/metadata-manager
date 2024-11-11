import React from "react";

const { electron } = window;

class Item extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            name: props.name,
            
        }
    }

    submit = async (e) => {
        e.preventDefault();
        const data = {
            name: this.state.name,
        }
        try {
            const res = await electron.invoke('submit-change', this.props.path ,data);
            console.log(res);
        } catch (error) {
            console.error('Error submitting data change: ' + error);
        }

        
    }

    handleInputChange = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.submit}>
                    <input
                    type='text'
                    name="name"
                    placeholder='Name'
                    value={this.state.name}
                    onChange={this.handleInputChange}
                    />

                </form>
            </div>
        )
    }
}

export default Item;