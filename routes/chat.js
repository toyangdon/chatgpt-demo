var express = require('express');
var router = express.Router();
var CHATGPT_ACCESSTOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJ0b3lhbmdkb25AMTYzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS9hdXRoIjp7InVzZXJfaWQiOiJ1c2VyLTVaUWdJTmRwRXRFcnZGZlpDTzFzRVhOVCJ9LCJpc3MiOiJodHRwczovL2F1dGgwLm9wZW5haS5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMTY5NDEyMzMyMzY0MDY1MzE5ODYiLCJhdWQiOlsiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MSIsImh0dHBzOi8vb3BlbmFpLm9wZW5haS5hdXRoMGFwcC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjgwMTc1NjA2LCJleHAiOjE2ODEzODUyMDYsImF6cCI6IlRkSkljYmUxNldvVEh0Tjk1bnl5d2g1RTR5T282SXRHIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBtb2RlbC5yZWFkIG1vZGVsLnJlcXVlc3Qgb3JnYW5pemF0aW9uLnJlYWQgb2ZmbGluZV9hY2Nlc3MifQ.DbJGcPRaIKjy3MZe4-q3F8Xa4cD4kuQ07jmLT-Z0QnHo2BYp2aXwI3mtvcbLIAvnBoeqKT-gfzcCxM1NYACTsvX5ukCkNeHwa_-m9Nv-oORWa0e5O9W1s5Tat95qpM2Xr8KoOOptec-rX2TMJXRmZndGSOdHchZZUMpIVrGmm3Xi7VCCbxfhkSZulkJ8mjgvsm2uM0X-zGU9-d_-LRQBEzcrA-ZFsfATKG9-jAvcpCVdD537us4txUnEyf11lRgtvuiNUQwaGXvb0mCtoYu4bRAmnhmfWFMpw_wBAA2RXdAAUYFFtJgksNGgN_HRK8dmm6glsQAvePqaxR1ySEgPdw"
var chatgptAccessToken=CHATGPT_ACCESSTOKEN
/* GET users listing. */
router.get('/', async function(req, res, next) {

    res.render('chat', { output: "欢迎访问！" });
  }
);

router.get('/send', async function(req, res, next) {

  let input=req.query["input"]
  let systemMessage=req.query["systemMessage"]
  let result;
  try{
    result=await send(input,systemMessage,req.session);
  }catch(e){
    console.error(e)
    result="服务器报错，"+e.message;
  }
  res.send(result);
}
);

router.get('/setAccessToken',  function(req, res, next) {

  let accessToken=req.query["accessToken"]
  if(accessToken==null||accessToken==""){
    chatgptAccessToken=CHATGPT_ACCESSTOKEN
  }else{
    chatgptAccessToken=accessToken
  }
  res.send("true")
}
);

async function send(input,systemMessage,session) {
  console.log(session)
  if(input==null||input==''){
    console.log("Input为空")
    return ""
  }

  // To use ESM in CommonJS, you can use a dynamic import
  const { ChatGPTUnofficialProxyAPI } = await import('chatgpt')
  const api = new ChatGPTUnofficialProxyAPI({ 
    accessToken: chatgptAccessToken,
    apiReverseProxyUrl: 'https://api.pawan.krd/backend-api/conversation'
  })
  console.log("send:"+input)
  console.log("parentMessageId:"+session.parentMessageId);
  let parentMessageId=session.parentMessageId;
  const res = await api.sendMessage(input
    ,{parentMessageId: parentMessageId
      ,conversationId:session.conversationId,systemMessage:systemMessage
      ,timeoutMs: 2 * 60 * 1000
    });
  session.parentMessageId=res.id;
  session.conversationId=res.conversationId;
  console.log("recieve:"+res.text);
  return res.text;

}


module.exports = router;
