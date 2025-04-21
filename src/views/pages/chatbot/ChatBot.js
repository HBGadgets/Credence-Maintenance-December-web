
import { useState } from 'react'
import './ChatBot.css'

export default function Component() {
  const [activeChats, setActiveChats] = useState([
    {
      id: '1',
      name: 'John Doe',
      role: 'Salesman',
      lastMessage: 'Thank you for your help',
      date: '08/15/2024',
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Manager',
      lastMessage: 'How can I assist you?',
      date: '08/14/2024',
    },
  ])

  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'John Doe',
      content: 'Hello, I need some assistance with a client.',
      timestamp: '10:30 AM',
    },
    { id: '2', sender: 'You', content: 'Sure, what can I help you with?', timestamp: '10:32 AM' },
  ])

  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return
    const newMsg = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages([...messages, newMsg])
    setNewMessage('')
  }

  return (
    <>
      <div className="container fs-5">
        <div className="row">
          <div className="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
            <div className="p-3">
              <div className="input-group rounded mb-3">
                <input
                  type="search"
                  className="form-control rounded"
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="search-addon"
                />
                <span className="input-group-text border-0" id="search-addon">
                  search
                </span>
              </div>
              <div
                data-mdb-perfect-scrollbar-init
                className="overflow-y-scroll"
                style={{ height: '70vh' }}
              >
                <ul className="list-unstyled mb-0">
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-success badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Marie Horwitz</p>
                          <p className="small text-muted">Hello, Are you there?</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Just now</p>
                        <span className="badge bg-danger rounded-pill float-end">3</span>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Alexa Chung</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">5 mins ago</p>
                        <span className="badge bg-danger rounded-pill float-end">2</span>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-success badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Danny McChain</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-danger badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Ashley Olsen</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>

                  <li className="p-2">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-success badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Ben Smith</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-7 col-xl-8">
            <div className="flex flex-column ">
              <div className="d-flex flex-row bg-body-tertiary p-3">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                  alt="avatar 1"
                  style={{ width: 45, height: '100%' }}
                />
                <div>
                  <p className="fw-bold p-2 ms-3 mb-1 ">Lorem ipsum dolor</p>
                </div>
              </div>
              <div
                className="pt-3 px-3 overflow-y-scroll"
                data-mdb-perfect-scrollbar-init
                style={{ height: '60vh' }}
              >
                <div className="d-flex flex-row justify-content-start">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                    alt="avatar 1"
                    style={{ width: 45, height: '100%' }}
                  />
                  <div>
                    <p className="small p-2 ms-3 mb-1 rounded-3 bg-body-tertiary">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua.
                    </p>
                    <p className=" fs-6 ms-3 mb-3 rounded-3 text-muted float-end">
                      12:00 PM | Aug 13
                    </p>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-end">
                  <div>
                    <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                      aliquip ex ea commodo consequat.
                    </p>
                    <p className="fs-6 me-3 mb-3 rounded-3 text-muted">12:00 PM | Aug 13</p>
                  </div>
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="avatar 1"
                    style={{ width: 45, height: '100%' }}
                  />
                </div>
                <div className="d-flex flex-row justify-content-start">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                    alt="avatar 1"
                    style={{ width: 45, height: '100%' }}
                  />
                  <div>
                    <p className="small p-2 ms-3 mb-1 rounded-3 bg-body-tertiary">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                      eu fugiat nulla pariatur.
                    </p>
                    <p className="fs-6 ms-3 mb-3 rounded-3 text-muted float-end">
                      12:00 PM | Aug 13
                    </p>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-end">
                  <div>
                    <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                      deserunt mollit anim id est laborum.
                    </p>
                    <p className="small me-3 mb-3 rounded-3 text-muted">12:00 PM | Aug 13</p>
                  </div>
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="avatar 1"
                    style={{ width: 45, height: '100%' }}
                  />
                </div>
                <div className="d-flex flex-row justify-content-start">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                    alt="avatar 1"
                    style={{ width: 45, height: '100%' }}
                  />
                  <div>
                    <p className="small p-2 ms-3 mb-1 rounded-3 bg-body-tertiary">
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                      doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                      veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                    <p className="fs-6 ms-3 mb-3 rounded-3 text-muted float-end">
                      12:00 PM | Aug 13
                    </p>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-end">
                  <div>
                    <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                      Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
                      sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                    </p>
                    <p className="fs-6 me-3 mb-3 rounded-3 text-muted">12:00 PM | Aug 13</p>
                  </div>
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="avatar 1"
                    style={{ width: 45, height: '100%' }}
                  />
                </div>
                <div className="d-flex flex-row justify-content-start">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                    alt="avatar 1"
                    style={{ width: 45, height: '100%' }}
                  />
                  <div>
                    <p className="small p-2 ms-3 mb-1 rounded-3 bg-body-tertiary">
                      Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                      adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
                      dolore magnam aliquam quaerat voluptatem.
                    </p>
                    <p className="fs-6 ms-3 mb-3 rounded-3 text-muted float-end">
                      12:00 PM | Aug 13
                    </p>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-end">
                  <div>
                    <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                      Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
                      laboriosam, nisi ut aliquid ex ea commodi consequatur?
                    </p>
                    <p className="fs-6 me-3 mb-3 rounded-3 text-muted">12:00 PM | Aug 13</p>
                  </div>
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="avatar 1"
                    style={{ width: 45, height: '100%' }}
                  />
                </div>
              </div>
              <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                  alt="avatar 3"
                  style={{ width: 40, height: '100%' }}
                />
                <input
                  type="text"
                  className="form-control form-control-lg ms-2"
                  id="exampleFormControlInput2"
                  placeholder="Type message"
                />
                <a className="ms-1 text-muted" href="#!">
                  <i className="fas fa-paperclip" />
                </a>
                <a className="ms-3 text-muted" href="#!">
                  <i className="fas fa-smile" />
                </a>
                <a className="ms-3" href="#!">
                  <i className="fas fa-paper-plane" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


// ################################## New code ###################################################

// import { useState, useEffect, useRef } from 'react';
// import OpenAI from 'openai';
// import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CFormInput, CButton, CListGroup, CListGroupItem } from '@coreui/react';

// // Initialize OpenAI client
// // const openai = new OpenAI({
// //   apiKey: import.meta.env.VITE_OPENAI_API_KEY,
// //   dangerouslyAllowBrowser: true
// // });

// const ChatBot = () => {
//   const [activeChats, setActiveChats] = useState([
//     {
//       id: '1',
//       name: 'AI Assistant',
//       role: 'Assistant',
//       lastMessage: 'How can I help you today?',
//       date: new Date().toLocaleDateString(),
//     }
//   ]);

//   const [messages, setMessages] = useState([
//     {
//       id: '1',
//       sender: 'AI Assistant',
//       content: 'Hello! How can I assist you today?',
//       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//     }
//   ]);

//   const [newMessage, setNewMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     const userMessage = {
//       id: Date.now().toString(),
//       sender: 'You',
//       content: newMessage,
//       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setNewMessage('');
//     setIsTyping(true);

//     try {
//       const completion = await openai.chat.completions.create({
//         messages: [{ role: 'user', content: newMessage }],
//         model: 'gpt-3.5-turbo',
//       });

//       const aiResponse = {
//         id: Date.now().toString(),
//         sender: 'AI Assistant',
//         content: completion.choices[0].message.content,
//         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       };

//       setMessages(prev => [...prev, aiResponse]);
//       setActiveChats(prev => [{
//         ...prev[0],
//         lastMessage: newMessage,
//         date: new Date().toLocaleDateString()
//       }, ...prev.slice(1)]);
//     } catch (error) {
//       console.error('Error:', error);
//       setMessages(prev => [...prev, {
//         id: Date.now().toString(),
//         sender: 'System',
//         content: 'Sorry, there was an error processing your request.',
//         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       }]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   return (
//     <CContainer fluid className="py-4">
//       <CRow className="justify-content-center">
//         <CCol md={4}>
//           <CCard>
//             <CCardHeader>
//               <CFormInput type="search" placeholder="Search conversations..." />
//             </CCardHeader>
//             <CCardBody className="overflow-auto" style={{ maxHeight: '70vh' }}>
//               <CListGroup flush>
//                 {activeChats.map(chat => (
//                   <CListGroupItem key={chat.id} className="d-flex align-items-center">
//                     <img
//                       src={`https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=random`}
//                       alt={chat.name}
//                       className="rounded-circle me-3"
//                       width="40"
//                       height="40"
//                     />
//                     <div className="flex-grow-1">
//                       <div className="fw-bold">{chat.name}</div>
//                       <small className="text-muted">{chat.lastMessage}</small>
//                     </div>
//                     <small className="text-muted">{chat.date}</small>
//                   </CListGroupItem>
//                 ))}
//               </CListGroup>
//             </CCardBody>
//           </CCard>
//         </CCol>

//         <CCol md={8}>
//           <CCard>
//             <CCardHeader className="d-flex align-items-center">
//               <img
//                 src={`https://ui-avatars.com/api/?name=AI+Assistant&background=random`}
//                 alt="AI Assistant"
//                 className="rounded-circle me-3"
//                 width="40"
//                 height="40"
//               />
//               <div>
//                 <h6 className="mb-0">AI Assistant</h6>
//                 <small className="text-muted">Always here to help</small>
//               </div>
//             </CCardHeader>
//             <CCardBody className="overflow-auto p-3" style={{ maxHeight: '60vh' }}>
//               {messages.map(message => (
//                 <div key={message.id} className={`d-flex ${message.sender === 'You' ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
//                   {message.sender !== 'You' && (
//                     <img
//                       src={`https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender)}&background=random`}
//                       alt={message.sender}
//                       className="rounded-circle me-2"
//                       width="30"
//                       height="30"
//                     />
//                   )}
//                   <div className={`p-2 rounded ${message.sender === 'You' ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '70%' }}>
//                     <p className="mb-1">{message.content}</p>
//                     <small className="text-muted">{message.timestamp}</small>
//                   </div>
//                   {message.sender === 'You' && (
//                     <img
//                       src={`https://ui-avatars.com/api/?name=You&background=random`}
//                       alt="You"
//                       className="rounded-circle ms-2"
//                       width="30"
//                       height="30"
//                     />
//                   )}
//                 </div>
//               ))}
//               {isTyping && (
//                 <div className="d-flex align-items-center text-muted">
//                   <div className="spinner-grow spinner-grow-sm me-1"></div>
//                   <div className="spinner-grow spinner-grow-sm me-1"></div>
//                   <div className="spinner-grow spinner-grow-sm"></div>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </CCardBody>
//             <CCardBody>
//               <form onSubmit={handleSendMessage} className="d-flex">
//                 <CFormInput
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   placeholder="Type your message..."
//                   className="me-2"
//                   disabled={isTyping}
//                 />
//                 <CButton type="submit" color="primary" disabled={isTyping}>
//                   Send
//                 </CButton>
//               </form>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//     </CContainer>
//   );
// };

// export default ChatBot;
