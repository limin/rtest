/**
 * @file
 * 
 * @copyright 2018 {@link https://limin.github.io Min Li}
 * 
 * @license Licensed under {@link https://www.apache.org/licenses/LICENSE-2.0.html Apache License 2.0}
 * 
 */

import React from 'react'
import JSONTree from 'react-json-tree'
import update from 'immutability-helper'
import {STRINGS,TEXT_SEND,TEXT_ADD,TEXT_NEW_REQUEST, TEXT_QUERY_STRING, TEXT_REQUEST_BODY,TEXT_REQUEST_HEADERS,MESSAGE_INVALID_URL} from '../glocalization'
const methods=["GET","POST","PUT","DELETE"]
const defaultHeaders={
  "Content-Type":["application/json; charset=utf-8"],
  "Authorization":[],
}
export default class RequestComposer extends React.Component{
  state={
    messages:{},
    request:{
      url:"https://limin.herokuapp.com/lmppd/api",
      method:"GET",
      query:"",
      headers:{},
      body:""
    },
    header:{key:"",value:""},
    response:null

  }

  validateUrl(value) {
    return /^(?:(?:(?:https?):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  }

  send(){    
    const {url,method,query,body,headers}=this.state.request
    const messages={}
    if(!this.validateUrl(url)){
      messages['url']={"name":MESSAGE_INVALID_URL, "level":"danger"}
    }
    if(Object.keys(messages).length>0){
      this.setState(update(this.state,{messages:{$set:messages}}))
    }else{
      const init={method,headers:new Headers(headers)}
      let input=url
      if(query){
        input=`${url}?${query}`
      }
      if(method!=="GET" && method!=="header"){
        init.body=body
      }
      fetch(input,init).then(resp=>{
        const response={url:decodeURI(resp.url),status:resp.status,statusText:resp.statusText,headers:resp.headers}
        resp.text().then(text=>{
          response.text=text
          this.setState(update(this.state,{response:{$set:response}}))
        })
      },reason=>{
        this.setState(update(this.state,{response:{$set:reason}}))
      })

    }    
  }

  addHeader(){
    const headers=this.state.request.headers
    const header=this.state.header
    headers[header.key]=header.value
    this.setState(update(this.state,{request:{headers:{$set:headers}}}))
  }

  removeHeader(key){
    const headers=this.state.request.headers
    delete headers[key]
    this.setState(update(this.state,{request:{headers:{$set:headers}}}))    
  }

  updateRequestField(field,value){
    this.setState(update(this.state,{request:{[field]:{$set:value}}}))
  }

  updateHeaderField(field,value){
    if(field==='key'){
      const defaultValues=defaultHeaders[value]
      const defaultValue=(defaultValues && defaultValues.length>0)?defaultValues[0]:""
      this.setState(update(this.state,{header:{[field]:{$set:value},value:{$set:defaultValue}}}))        
    }else{
      this.setState(update(this.state,{header:{[field]:{$set:value}}}))
    }
  }

  Field({label="",value, type, datalist=null, message, onChange}){
    return(
    <div className="field">
      {label && <label className="label">{label}</label>}
      <div className={message?"control has-icons-right":"control"}>
        {type==='textarea' && <textarea className={message?"textarea is-danger":"textarea"} value={value} type={type} onChange={onChange}></textarea>}
        {type!=='textarea' && <input list={datalist?datalist.id:""} className={message?"input is-danger":"input"} value={value} type={type} onChange={onChange}/>}
        {datalist && datalist.values && <datalist id={datalist.id}>
          {
          datalist.values.map((value)=>{
            return <option key={value} value={value}>{value}</option>
          })
          }
        </datalist>
        }
        {
          message &&
            <span className="icon is-small is-right">
              <i className="fa fa-warning"></i>
            </span>
        }
      </div>
      {            
        message && <p className="help is-{message.level}">{STRINGS.messages[message.name]}</p>
      }
    </div>)
  }

  Headers({headers,removeHeader}){
    return(
      <div className="field">
      <label className="label">{STRINGS.texts[TEXT_REQUEST_HEADERS]}:</label>      
      {
        Object.keys(headers).map(key=>{
          return(
          <div class="media">
            <div class="media-left">
              <p>
                {key}:
              </p>
            </div>
            <div class="media-content">
              <div class="content">
                <p>
                  {headers[key]}
                </p>
              </div>
            </div>
            <div class="media-right">
              <button class="delete" onClick={e=>removeHeader(key)}></button>
            </div>
          </div>)
        })
      }
    </div>)
  }

  render(){
    const {messages,request,header,response}=this.state
    const {url,method, query, body, headers}=request
    const {key,value}=header
    const urlMsg=messages["url"]
    const queryMsg=messages["query"]
    const bodyMsg=messages["body"]    
    return(
      <div>
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <h2 className="title">{STRINGS.texts[TEXT_NEW_REQUEST]}</h2>
            </div>
          </div>
          <div className="level-right">
            <p className="level-item"><a className="button is-success" onClick={e=>this.send()}>{STRINGS.texts[TEXT_SEND]}</a></p>
          </div>
        </div>        
        <div className="media">
          <div className="media-left">
            <div className="select">
              <select value={method} onChange={e=>this.updateRequestField("method",e.target.value)}>
              {
                methods.map(m=>{
                  return <option key={m} value={m}>{m}</option>
                })
              }
              </select>
            </div>
          </div>
          <div className="media-content">
            <this.Field value={url} type="url" message={urlMsg} onChange={e=>this.updateRequestField("url",e.target.value)}/>
          </div>
        </div>
        <br/>
        {method==='GET' && 
        <this.Field label={`${STRINGS.texts[TEXT_QUERY_STRING]}:`} value={query} type="textarea" message={queryMsg} onChange={e=>this.updateRequestField("query",e.target.value)}/>        
        }
        <this.Headers headers={headers} removeHeader={key=>this.removeHeader(key)}/>                
        <br/>
        <div className="media">
          <div className="media-left">
            <this.Field datalist={{id:"hkeys",values:Object.keys(defaultHeaders)}}  value={key} onChange={e=>this.updateHeaderField("key",e.target.value)}/>
          </div>
          <div className="media-content">
            <this.Field datalist={{id:"hvalues",values:defaultHeaders[key]}}  value={value} onChange={e=>this.updateHeaderField("value",e.target.value)}/>
          </div>
          <div className="media-right">
            <a className="button is-success" onClick={e=>this.addHeader()}>{STRINGS.texts[TEXT_ADD]}</a>            
          </div>          
        </div>
        <br/>
        {method!=='GET' && 
        <this.Field label={`${STRINGS.texts[TEXT_REQUEST_BODY]}:`} value={body} type="textarea" message={bodyMsg} onChange={e=>this.updateRequestField("body",e.target.value)}/>                
        }
        <br/>
        {response && <div className="field">
        <label className="label">Response:</label>      
        <JSONTree data={response}/>
        </div>
        }
      </div>
    )
  }
}