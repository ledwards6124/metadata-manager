import React from "react";
import Item from "./Item";

class Files extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            contents: []
        }
    }

    clear = () => {
        this.setState({contents: []});
    }

    handleFolderSelect = (e) => {
        const files = e.target.files;
        this.clear();
        this.setState({contents: files});
        console.log(files);
    }

    render() {
        return (
            <div>
                 <input 
                type='file'
                webkitdirectory='true'
                onChange={this.handleFolderSelect}/>
                <h1>Items:</h1>
                {this.state.contents.length > 0 && Array.from(this.state.contents).map((file, index) => {
                    return (
                        <div key={index}>
                            <Item path={file.path} name={file.name}/>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default Files;