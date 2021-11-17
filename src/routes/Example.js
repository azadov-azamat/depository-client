import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export const Example = () => {
    //Public API that will echo messages sent to it back to the client
    const [socketUrl, setSocketUrl] = useState('wss://echo.websocket.org');
    const [messageHistory, setMessageHistory] = useState([]);

    const {
        sendMessage,
        lastMessage,
        readyState,
    } = useWebSocket(socketUrl);

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory(prev => prev.concat(lastMessage));
        }
    }, [lastMessage, setMessageHistory]);

    const handleClickChangeSocketUrl = useCallback(() =>
        setSocketUrl('wss://demos.kaazing.com/echo'), []);

    const handleClickSendMessage = useCallback(() =>
        sendMessage('Hello'), []);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return (
        <div>
            <button
                onClick={handleClickChangeSocketUrl}
            >
                Click Me to change Socket Url
            </button><br/>
            <button
                onClick={handleClickSendMessage}
                disabled={readyState !== ReadyState.OPEN}
            >
                Click Me to send 'Hello'
            </button>
            <span>The WebSocket is currently {connectionStatus}</span>
            {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
            <ul>
                {messageHistory
                    .map((message, idx) => <span key={idx}>{message ? message.data : null}</span>)}
            </ul>
        </div>
    );
};

export default Example
// import React, {useEffect, useState} from "react";
// import { css } from '@emotion/css';
// import ScrollToBottom from 'react-scroll-to-bottom';
//
// export default function Example(){
//
//     const ROOT_CSS = css({
//         height: 600,
//         width: 400
//     });
//
//     const [element] = useState([])
//
//     useEffect(()=>{
//
//     },[element])
//     function addElement(){
//         const paragraph = " QoshiladisdvLorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto at, distinctio dolor doloremque fugiat illum incidunt, ipsum itaque iusto labore laboriosam libero magnam maxime, modi nisi nobis officia pariatur perferendis porro possimus praesentium quaerat quas quia quisquam ratione repudiandae rerum sit soluta sunt tempora tempore temporibus ut vel velit veritatis voluptas. Hic labore molestias odio sit? Accusamus aliquam aliquid animi distinctio dolorum earum eligendi exercitationem facilis illo, in incidunt iste, laboriosam magnam, nemo nihil non obcaecati odio pariatur perspiciatis possimus quae quaerat quia soluta suscipit temporibus. Dolore ducimus excepturi labore, laborum nobis optio? Doloribus, nihil perspiciatis praesentium quasi suscipit unde. Doloremque numquam, voluptatem. Animi cum dolor doloremque earum impedit incidunt ipsa ipsum libero nam officiis possimus quae quaerat, quasi quibusdam quisquam quod repellat repellendus rerum ut veniam! Aperiam deleniti, esse incidunt laudantium repellat vel! Amet dicta, eaque eligendi eum, facilis, harum ipsum magnam nisi non possimus provident tempore"
//         element.push(paragraph)
//     }
//     return(
//     <>
//         <ScrollToBottom className={ROOT_CSS}>
//             <button className="btn btn-danger" onClick={addElement}>
//                 click
//             </button>
//             {element}
//
//             <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto at, distinctio dolor doloremque fugiat illum incidunt, ipsum itaque iusto labore laboriosam libero magnam maxime, modi nisi nobis officia pariatur perferendis porro possimus praesentium quaerat quas quia quisquam ratione repudiandae rerum sit soluta sunt tempora tempore temporibus ut vel velit veritatis voluptas. Hic labore molestias odio sit? Accusamus aliquam aliquid animi distinctio dolorum earum eligendi exercitationem facilis illo, in incidunt iste, laboriosam magnam, nemo nihil non obcaecati odio pariatur perspiciatis possimus quae quaerat quia soluta suscipit temporibus. Dolore ducimus excepturi labore, laborum nobis optio? Doloribus, nihil perspiciatis praesentium quasi suscipit unde. Doloremque numquam, voluptatem. Animi cum dolor doloremque earum impedit incidunt ipsa ipsum libero nam officiis possimus quae quaerat, quasi quibusdam quisquam quod repellat repellendus rerum ut veniam! Aperiam deleniti, esse incidunt laudantium repellat vel! Amet dicta, eaque eligendi eum, facilis, harum ipsum magnam nisi non possimus provident tempore <vero className=""></vero></p>
//             <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto at, distinctio dolor doloremque fugiat illum incidunt, ipsum itaque iusto labore laboriosam libero magnam maxime, modi nisi nobis officia pariatur perferendis porro possimus praesentium quaerat quas quia quisquam ratione repudiandae rerum sit soluta sunt tempora tempore temporibus ut vel velit veritatis voluptas. Hic labore molestias odio sit? Accusamus aliquam aliquid animi distinctio dolorum earum eligendi exercitationem facilis illo, in incidunt iste, laboriosam magnam, nemo nihil non obcaecati odio pariatur perspiciatis possimus quae quaerat quia soluta suscipit temporibus. Dolore ducimus excepturi labore, laborum nobis optio? Doloribus, nihil perspiciatis praesentium quasi suscipit unde. Doloremque numquam, voluptatem. Animi cum dolor doloremque earum impedit incidunt ipsa ipsum libero nam officiis possimus quae quaerat, quasi quibusdam quisquam quod repellat repellendus rerum ut veniam! Aperiam deleniti, esse incidunt laudantium repellat vel! Amet dicta, eaque eligendi eum, facilis, harum ipsum magnam nisi non possimus provident tempore <vero className=""></vero></p>
//             <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto at, distinctio dolor doloremque fugiat illum incidunt, ipsum itaque iusto labore laboriosam libero magnam maxime, modi nisi nobis officia pariatur perferendis porro possimus praesentium quaerat quas quia quisquam ratione repudiandae rerum sit soluta sunt tempora tempore temporibus ut vel velit veritatis voluptas. Hic labore molestias odio sit? Accusamus aliquam aliquid animi distinctio dolorum earum eligendi exercitationem facilis illo, in incidunt iste, laboriosam magnam, nemo nihil non obcaecati odio pariatur perspiciatis possimus quae quaerat quia soluta suscipit temporibus. Dolore ducimus excepturi labore, laborum nobis optio? Doloribus, nihil perspiciatis praesentium quasi suscipit unde. Doloremque numquam, voluptatem. Animi cum dolor doloremque earum impedit incidunt ipsa ipsum libero nam officiis possimus quae quaerat, quasi quibusdam quisquam quod repellat repellendus rerum ut veniam! Aperiam deleniti, esse incidunt laudantium repellat vel! Amet dicta, eaque eligendi eum, facilis, harum ipsum magnam nisi non possimus provident tempore <vero className=""></vero></p>
//             <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto at, distinctio dolor doloremque fugiat illum incidunt, ipsum itaque iusto labore laboriosam libero magnam maxime, modi nisi nobis officia pariatur perferendis porro possimus praesentium quaerat quas quia quisquam ratione repudiandae rerum sit soluta sunt tempora tempore temporibus ut vel velit veritatis voluptas. Hic labore molestias odio sit? Accusamus aliquam aliquid animi distinctio dolorum earum eligendi exercitationem facilis illo, in incidunt iste, laboriosam magnam, nemo nihil non obcaecati odio pariatur perspiciatis possimus quae quaerat quia soluta suscipit temporibus. Dolore ducimus excepturi labore, laborum nobis optio? Doloribus, nihil perspiciatis praesentium quasi suscipit unde. Doloremque numquam, voluptatem. Animi cum dolor doloremque earum impedit incidunt ipsa ipsum libero nam officiis possimus quae quaerat, quasi quibusdam quisquam quod repellat repellendus rerum ut veniam! Aperiam deleniti, esse incidunt laudantium repellat vel! Amet dicta, eaque eligendi eum, facilis, harum ipsum magnam nisi non possimus provident tempore <vero className=""></vero></p>
//             <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto at, distinctio dolor doloremque fugiat illum incidunt, ipsum itaque iusto labore laboriosam libero magnam maxime, modi nisi nobis officia pariatur perferendis porro possimus praesentium quaerat quas quia quisquam ratione repudiandae rerum sit soluta sunt tempora tempore temporibus ut vel velit veritatis voluptas. Hic labore molestias odio sit? Accusamus aliquam aliquid animi distinctio dolorum earum eligendi exercitationem facilis illo, in incidunt iste, laboriosam magnam, nemo nihil non obcaecati odio pariatur perspiciatis possimus quae quaerat quia soluta suscipit temporibus. Dolore ducimus excepturi labore, laborum nobis optio? Doloribus, nihil perspiciatis praesentium quasi suscipit unde. Doloremque numquam, voluptatem. Animi cum dolor doloremque earum impedit incidunt ipsa ipsum libero nam officiis possimus quae quaerat, quasi quibusdam quisquam quod repellat repellendus rerum ut veniam! Aperiam deleniti, esse incidunt laudantium repellat vel! Amet dicta, eaque eligendi eum, facilis, harum ipsum magnam nisi non possimus provident tempore <vero className=""></vero></p>
//             <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci cumque delectus eveniet iste natus officia praesentium sapiente! Amet dolor doloribus in, ipsa iusto laudantium molestias perspiciatis, quibusdam sint tempora voluptas.</p>
//         </ScrollToBottom>
//     </>
//     )
// }
// // import React, { useEffect, useRef, useState } from 'react';
// // // import sendIcon from './send.svg';
// // import "./Example.scss"
// //
// // const generateMessage = () => {
// //     const words = ["The sky", "above", "the port", "was", "the color of television", "tuned", "to", "a dead channel", ".", "All", "this happened", "more or less", ".", "I", "had", "the story", "bit by bit", "from various people", "and", "as generally", "happens", "in such cases", "each time", "it", "was", "a different story", ".", "It", "was", "a pleasure", "to", "burn"];
// //     const text = [];
// //     let x = 7;
// //     while (--x) text.push(words[Math.floor(Math.random() * words.length)]);
// //     return text.join(" ");
// // }
// //
// // export default function Example() {
// //
// //     const messageEl = useRef(null);
// //     const [messages, setMessages] = useState([]);
// //
// //     useEffect(() => {
// //         if (messageEl) {
// //             messageEl.current.addEventListener('DOMNodeInserted', event => {
// //                 const { currentTarget: target } = event;
// //                 target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
// //             });
// //         }
// //     }, [])
// //
// //     useEffect(() => {
// //         const generateDummyMessage = () => {
// //             setInterval(() => {
// //                 setMessages(prevMsg => [...prevMsg, generateMessage()]);
// //             }, 2000);
// //         }
// //         generateDummyMessage();
// //     }, []);
// //
// //     return (
// //         <div className="App">
// //             <h3>Auto scroll to bottom in react chat app - <a href="https://www.cluemediator.com" target="_blank" rel="noopener noreferrer">Clue Mediator</a></h3>
// //             <div className="chat">
// //                 <div className="head">ChatBot</div>
// //                 <div className="messages" ref={messageEl}>
// //                     {messages.map((m, i) =>
// //                         <div key={i} className={`msg${i % 2 !== 0 ? ' dark' : ''}`}>
// //                             {m}
// //                         </div>)}
// //                 </div>
// //                 <div className="footer">
// //                     <input type="text" placeholder="Type here..." />
// //                     {/*<img src={sendIcon} />*/}
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }
// //
// // // import React from 'react';
// // // import './Example.scss'
// // //
// // // const options = [
// // //     {value: 'blues', label: 'Blues'},
// // //     {value: 'rock', label: 'Rock'},
// // //     {value: 'jazz', label: 'Jazz'},
// // //     {value: 'orchestra', label: 'Orchestra'}
// // // ];
// // //
// // // export default function Example() {
// // //     return (
// // //         <>
// // //             <div style={{margin: "10px 10px 10px 10px"}}>
// // //                 <div className="br-select">
// // //                     <div className="br-input">
// // //                         <label htmlFor="select-simple">Área de atuação</label>
// // //                         <input id="select-simple" type="text" placeholder="Selecione uma opção"/>
// // //                         <button className="br-button" type="button" aria-label="Exibir lista" tabIndex="-1"
// // //                                 data-trigger="data-trigger"><i className="fas fa-angle-down" aria-hidden="true"/>
// // //                         </button>
// // //                     </div>
// // //                     <div className="br-list" tabIndex="0">
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb0" type="radio" name="estados-simples" value="rb0"/>
// // //                                 <label htmlFor="rb0">Programa</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb1" type="radio" name="estados-simples" value="rb1"/>
// // //                                 <label htmlFor="rb1">Alagoas</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb2" type="radio" name="estados-simples" value="rb2"/>
// // //                                 <label htmlFor="rb2">Amapá</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb3" type="radio" name="estados-simples" value="rb3"/>
// // //                                 <label htmlFor="rb3">Amazonas</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb4" type="radio" name="estados-simples" value="rb4"/>
// // //                                 <label htmlFor="rb4">Bahia</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb5" type="radio" name="estados-simples" value="rb5"/>
// // //                                 <label htmlFor="rb5">Ceará</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb6" type="radio" name="estados-simples" value="rb6"/>
// // //                                 <label htmlFor="rb6">Distrito Federal</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb7" type="radio" name="estados-simples" value="rb7"/>
// // //                                 <label htmlFor="rb7">Espírito Santo</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb8" type="radio" name="estados-simples" value="rb8"/>
// // //                                 <label htmlFor="rb8">Goiás</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb9" type="radio" name="estados-simples" value="rb9"/>
// // //                                 <label htmlFor="rb9">Maranhão</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb10" type="radio" name="estados-simples" value="rb10"/>
// // //                                 <label htmlFor="rb10">Mato Grosso</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb11" type="radio" name="estados-simples" value="rb11"/>
// // //                                 <label htmlFor="rb11">Mato Grosso do Sul</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb12" type="radio" name="estados-simples" value="rb12"/>
// // //                                 <label htmlFor="rb12">Minas Gerais</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb13" type="radio" name="estados-simples" value="rb13"/>
// // //                                 <label htmlFor="rb13">Pará</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb14" type="radio" name="estados-simples" value="rb14"/>
// // //                                 <label htmlFor="rb14">Paraíba</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb15" type="radio" name="estados-simples" value="rb15"/>
// // //                                 <label htmlFor="rb15">Paraná</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb16" type="radio" name="estados-simples" value="rb16"/>
// // //                                 <label htmlFor="rb16">Pernambuco</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb17" type="radio" name="estados-simples" value="rb17"/>
// // //                                 <label htmlFor="rb17">Piauí</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb18" type="radio" name="estados-simples" value="rb18"/>
// // //                                 <label htmlFor="rb18">Rio de Janeiro</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb19" type="radio" name="estados-simples" value="rb19"/>
// // //                                 <label htmlFor="rb19">Rio Grande do Norte</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb20" type="radio" name="estados-simples" value="rb20"/>
// // //                                 <label htmlFor="rb20">Rio Grande do Sul</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb21" type="radio" name="estados-simples" value="rb21"/>
// // //                                 <label htmlFor="rb21">Rondônia</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb22" type="radio" name="estados-simples" value="rb22"/>
// // //                                 <label htmlFor="rb22">Santa Catarina</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb23" type="radio" name="estados-simples" value="rb23"/>
// // //                                 <label htmlFor="rb23">São Paulo</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb24" type="radio" name="estados-simples" value="rb24"/>
// // //                                 <label htmlFor="rb24">Sergipe</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb25" type="radio" name="estados-simples" value="rb25"/>
// // //                                 <label htmlFor="rb25">Tocantins</label>
// // //                             </div>
// // //                         </div>
// // //                         <div className="br-item" tabIndex="-1">
// // //                             <div className="br-radio">
// // //                                 <input id="rb27" type="radio" name="estados-simples" value="rb27"/>
// // //                                 <label htmlFor="rb27">Exterior</label>
// // //                             </div>
// // //                         </div>
// // //                     </div>
// // //                 </div>
// // //                 <span className="feedback warning" role="alert"><i className="fas fa-exclamation-triangle"
// // //                                                                    aria-hidden="true"></i>Texto auxiliar Função de previnir erros.</span>
// // //             </div>
// // //         </>
// // //     );
// // // }
