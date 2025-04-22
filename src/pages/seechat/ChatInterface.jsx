import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatInterface.scss';
import {useIndexedDB} from "react-indexed-db-hook";
import { nanoid } from 'nanoid'

import { CopyToClipboard } from 'react-copy-to-clipboard';
import Code from "./code";

import LogoImg from '../../assets/Imgs/creditLogo2.svg';

import {Copy,CopyCheck,Trash2,RefreshCcw,ArrowUp,Square,Eraser} from "lucide-react";
import { useTranslation } from "react-i18next";
import {chatCompletions, loginChat} from "../../api/chatAI";
import {estimateTokenCount, truncateContext} from "../../utils/chatTool";
import useToast from "../../hooks/useToast";
import {useSelector} from "react-redux";
import Avatar from "../../components/common/avatar";
import {useNavigate} from "react-router-dom";


export const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCopied, setCopied] = useState(false);
  const messagesEndRef = useRef(null);
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState("");

  const [controller, setController] = useState(null);

  const { add,getAll ,deleteRecord} = useIndexedDB("list");
  const { Toast, toast } = useToast();
  const account = useSelector((state) => state.account);
  const userToken = useSelector((state) => state.userToken);
  const navigate = useNavigate();

  useEffect(() => {
    scrollToBottom();
  }, [messages,isLoading]);


  useEffect(() => {
    if(!account)return;
    getApiKey()
    getMessage()
  }, [account]);

  const getApiKey = async () => {
    try{
      let rt = await loginChat();
      setApiKey(rt.data.apiKey)
    }catch(error){
      console.log(error);
      toast.danger(`${error?.data?.msg || error?.code || error}`);
    }
  }

  const getMessage = async () => {
    let rt = await getAll()
    const newMessages = rt.filter((item) => item.address?.toLowerCase() === account?.toLowerCase())
    console.log(newMessages)
    setMessages(newMessages)
  }


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  const handleUserMsg = async() =>{

    if (!account) {
      navigate("/login");
      return;
    }
    if (!inputMessage.trim()) return;

    let uId = nanoid();
    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      uniqueId:uId,
      questionId:uId,
      timestamp: Date.now(),
      address:account
    };


    setMessages(prev => {
      return  [...prev, userMessage]
    });
    setInputMessage('');
    await sendMessage(userMessage)
  }

  const sendMessage = async (userMessage) => {

    await add({...userMessage})
    let rt = await getAll()
    const newMessages = rt.filter((item) => item.address?.toLowerCase() === account?.toLowerCase())

    setIsLoading(true);
    const abortController = new AbortController();
    setController(abortController);

    const systemRoleObj = {
      role: "system",
      content: "你是一个有帮助的AI助手。请用中文回答。请务必每次回答前按照如下格式\n<think>思考内容</think>\n生成",
    }
    let content = "";
    let thinkContent = "";
    let init = false;
    let currentId = "";

    try {

      const newMsg = [...newMessages].filter((item)=> !!item.content && item.type!=="thinking").map(({role, content})=>({role,content}));
      const truncatedMessages = truncateContext(newMsg, 40*1024);

      let obj = JSON.stringify({
        model:"deepseek-reasoner",
        messages:[systemRoleObj,...truncatedMessages],
        "stream": true
      });


    let response = await chatCompletions(obj,abortController,apiKey);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;
      let isThinkingMessage = false;

      const readChunk = async () => {
        const { done, value } = await reader?.read();

        if (done) {
          setIsLoading(false);
          return;
        }
        const chunkText = decoder.decode(value);
        const lines = chunkText.split('\n');

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const jsonStr = line.slice(5);
            if (jsonStr === '[DONE]') {
              setMessages((old)=>{

                let msgArr = [...old]
                const arr = msgArr.filter((msg)=>msg.isNew);

                for (let i = 0; i < arr.length; i++) {
                  let item = arr[i];
                  add(item)
                }


                msgArr.map((item)=> {
                  delete item.isNew;
                  return item;
                })
                return msgArr;

              })
            }
            try {

              const data = JSON.parse(jsonStr);
              currentId = data.id;
              let text = data.choices[0]?.delta?.content || '';
              if(!init){
                setMessages(prev => [...prev, {
                  id: "",
                  content: "",
                  role: 'assistant',
                  type: 'thinking',
                  uniqueId:nanoid(),
                  questionId:userMessage.uniqueId,
                  timestamp: Date.now(),
                  address:account,
                  isNew:true
              }])
                init = true;
              }


              if(text === "<think>"){
                isThinkingMessage = true;
              }
              if (text === "</think>" && isThinkingMessage){

                isThinkingMessage = false;
                setMessages(prev => [...prev, {
                  id: "",
                  content: "",
                  role: 'assistant',
                  type: 'response',
                  uniqueId:nanoid(),
                  questionId:userMessage.uniqueId,
                  timestamp: Date.now(),
                  address:account,
                  isNew:true
              }])
              }

              text =( text === "</think>"||text === "<think>") ? "" :text;

              for (const char of text) {
                if(isThinkingMessage){

                  thinkContent+=char;
                  setMessages((old)=> {
                    let msg = [...old]
                    msg[msg.length-1].content = thinkContent;
                    msg[msg.length-1].id = data.id;
                    msg[msg.length-1].type = "thinking";
                    return msg;
                  });
                }else{
                  content+=char;
                  setMessages((old)=> {
                    let msg = [...old]
                    msg[msg.length-1].content = content;
                    msg[msg.length-1].id = data.id;
                    msg[msg.length-1].type = "response";
                    return msg;
                  });
                }
                await new Promise(resolve => setTimeout(resolve, 50));
              }
            } catch (error) {
              console.log('解析 JSON 时出错:', error);
            }
          }
        }

        await readChunk();
      };
      await readChunk();
    } catch (error) {
      if (error.name === 'AbortError') {
        const errorSystemMessage = {
          id: Date.now().toString(),
          content:content?content:"...",
          role: 'assistant',
          type:"response",
          uniqueId:nanoid(),
          questionId:userMessage.uniqueId,
          timestamp: Date.now(),
          address:account
        };
        setMessages(prev => [...prev, errorSystemMessage]);

        await add(errorSystemMessage)
      } else {
        console.error('Error sending message:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
        setError(errorMessage);
        const errorSystemMessage = {
          id: Date.now().toString(),
          content: `Error: ${errorMessage}. Please try again.`,
          role: 'assistant',
          timestamp: Date.now(),
          uniqueId:nanoid(),
          questionId:userMessage.uniqueId,
          address:account

        };
        setMessages(prev => [...prev, errorSystemMessage]);
        toast.danger(`${error?.data?.msg || error?.code || error}`);
      }

    } finally {
      setIsLoading(false);
      setError(null);
    }
  };

  const handleStop = ()=>{
    if (controller) {
      controller.abort();
      setController(null);
      setIsLoading(false);
    }
  }

  const handleKeyPress = async(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await handleUserMsg();
    }
  };

  const handleReSend = async(qid) =>{
    let rt = await getAll()

    const newMessages = rt.filter((item) => item.address?.toLowerCase() === account?.toLowerCase())
    const needResend = newMessages.find(msg=>msg.uniqueId === qid);
    if(!needResend)return;
    const findIdx = needResend.messageId;
    let arr = []

    for(let i = 0; i < newMessages.length; i++) {
      if(newMessages[i].messageId >= findIdx){
        await deleteRecord(newMessages[i].messageId)
      }else{
        arr.push(newMessages[i]);
      }

    }
    setMessages(arr)
    delete needResend.messageId;

    setMessages(prev => {
      return  [...prev, needResend]
    });

    await sendMessage(needResend);


  }
 const handleDelete = async(qid) =>{

   let rt = await getAll()
   const newMessages = rt.filter((item) => item.address?.toLowerCase() === account?.toLowerCase())

   const needDelete = newMessages.filter(msg=>msg.questionId === qid);
   if(!needDelete)return;

   for(let i = 0; i < needDelete.length; i++) {
     await deleteRecord(needDelete[i].messageId)

   }
   const needDisplay = newMessages.filter(msg=>msg.questionId !== qid);

   setMessages(needDisplay);

  }
  const handleCopy = () =>{
    // console.log(content);
    setCopied(true)
    setTimeout(()=>{
      setCopied(false)
    },1000)
  }

  const handleClear = async() =>{
    let rt = await getAll()

    const newMessages = rt.filter((item) => item.address?.toLowerCase() === account?.toLowerCase())
    for(let i = 0; i < newMessages.length; i++) {
      await deleteRecord(newMessages[i].messageId)
    }

    setMessages([])
  }



  return (<div className="chat-container">
      <div className="top-header">
        <span onClick={()=>handleClear()}>
                <Eraser size={18} /> {t("clearTips")}
        </span>

      </div>
      <div className="chat-box">
        <div className="messageBox">
          <div className="chat-messages">
            {messages.map((message) => (
              <div  key={nanoid()} className={`${message.role === 'user'?"flexBox flexEnd":"flexBox flexStart"}`}>

                {
                  message.role === 'user' && <div className="logoBox frht">
                      <Avatar src={userToken?.user?.avatar} size="30px" />

                  </div>
                }
                {
                  message.role !== 'user'&&  <div className="logoBox">
                    <img src={LogoImg} alt="" />
                  </div>
                }
                <div className="flexTB">
                <div

                  className={`${message.role === 'user' ? 'user-message' :
                    message.type === 'thinking' ? 'assistant-thinking' : 'assistant-response'}`}
                >
                  <div className="msgFlex">

                    {message?.type === 'thinking' ? (
                      <div className="message thinking-content">
                        <div className="thinking-icon">🤔</div>
                        <div className="thinking-text">{message.content}</div>
                      </div>
                    ) : (
                      <div className="message message-content">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ node, inline, className, children, ...props }) {
                              return <Code node={node} inline={inline} className={className} children={children} />
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>

                  {
                    (  message.type !== 'thinking'  && !isLoading ) &&   <div className="flexLine">
  <span onClick={()=>handleReSend(message.questionId)}>
                          <RefreshCcw size={18} />
                    </span>
                      <span onClick={()=>handleDelete(message.questionId)}>
                    <Trash2 size={18} />
                  </span>
                      <span>
                  {
                    !isCopied && <CopyToClipboard text={message.content} onCopy={handleCopy}>
                      <Copy size={18} />
                    </CopyToClipboard>
                  }
                        {
                          isCopied && <CopyCheck size={18} color="#5200FF" />
                        }
                </span>

                    </div>
                  }


              </div>
              </div>

            ))}
            {isLoading && (
              <div className="message assistant-message">
                <div className="loading-indicator">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="chat-input">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t("aiTips")}
          rows={1}
        />

          {
            !isLoading &&<button
            onClick={handleUserMsg}
            disabled={isLoading || !inputMessage.trim()|| estimateTokenCount(inputMessage)>8000}
            >
            <ArrowUp size={18} />
            </button>
          }
          {
            isLoading && <button
              className="stop"
              onClick={()=>handleStop()}
              disabled={!isLoading}>
              <Square size={18} />
            </button>
          }


        </div>
      </div>

    </div>
  );
};
