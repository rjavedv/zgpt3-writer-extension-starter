chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Inside content.js');
    if (request.message === 'inject') {
      const { content } = request;
      const  cselText  = request.selectionText;
      const  crespText  = request.responseText;        
      console.log(request);

      //console.log(cselText);
      //console.log(crespText);
      // let cresult = crespText.replaceAll('\\n', 'RJV');
      // console.log(cresult)
      
      const elementSele = document.getElementById("zxcq6543");
      elementSele.innerHTML = cselText;

      // const elementResp = document.getElementById("resp3456");
      // elementResp.innerHTML = '<p>' + cresult + '</p>';          // we need to change

      const elementText = document.getElementById("resp0987");
      elementText.innerText = crespText;          // we need to change

      
      sendResponse({ status: 'success' });
    }
  });