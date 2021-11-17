import React, {Component} from "react";
import SockJsClient from 'react-stomp';
import {Button, TextField} from "@material-ui/core";


export default class socketIo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            typedMessage: "",
            name: "azamat"
        }
    }

    setName = (name) => {
        console.log(name);
        this.setState({name: name});
    };

    sendMessage = () => {
        this.clientRef.sendMessage('/app/user-all', JSON.stringify({
            name: this.state.name,
            message: this.state.typedMessage
        }));
    };

    displayMessages = () => {
        return (
            <div>
                <div className="align-center">
                    <br/><br/>
                    <table>
                        <tr>
                            <td>
                                <TextField id="outlined-basic" label="Enter Message to Send" variant="outlined"
                                           onChange={(event) => {
                                               this.setState({typedMessage: event.target.value});
                                           }}/>
                            </td>
                            <td>
                                <Button variant="contained" color="primary"
                                        onClick={this.sendMessage}>Send</Button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div className="align-center">
                    {this.displayMessages()}
                </div>
                {this.state.messages.map(msg => {
                    return (
                        <div>
                            {this.state.name === msg.name ?
                                <div>
                                    <p className="title1">{msg.name} : </p><br/>
                                    <p>{msg.message}</p>
                                </div> :
                                <div>
                                    <p className="title2">{msg.name} : </p><br/>
                                    <p>{msg.message}</p>
                                </div>
                            }
                        </div>)
                })}
            </div>
        );
    };

    render() {
        return (
            <>
                <SockJsClient url='http://localhost:8080/websocket-chat/'
                              topics={['/topic/user']}
                              onConnect={() => {
                                  console.log("Connected")
                              }}
                              onDisconnect={()=>{
                                  console.log("Disconnected   ")
                              }}
                              onMessage={(msg)=>{
                                  console.log(msg)
                              }}
                              ref={(client) => {
                                  this.clientRef = client
                              }}

                />
            </>
        )
    }
}
