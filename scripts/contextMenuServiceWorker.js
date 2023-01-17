const getKey = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['openai-key'], (result) => {
            if (result['openai-key']) {
                const decodedKey = atob(result['openai-key']);
                resolve(decodedKey);
            }
        });
    });
}

const sendMessage = (selText, respText, tabid) => {
    /*     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0].id;
    
        });
     */
    const activeTab = tabid;
    console.log(activeTab);
    console.log(selText, respText);
    chrome.tabs.onUpdated.addListener((activeTab, changeInfo, tab) => {
        if (changeInfo.status === 'complete') {
            chrome.tabs.sendMessage(activeTab, {
                message: 'inject', selectionText: selText, responseText: respText,  
            });
        }
    });

    /*     (async () => {
        const response = await chrome.tabs.sendMessage(activeTab, { message: 'inject', content });
        console.log(response);
    })(); */

    /*    chrome.tabs.sendMessage(
        activeTab,
        { message: 'inject', content },
        (response) => {
          if (response.status === 'failed') {
            console.log('injection failed.');
          }
        }
      );  */
};

const generate = async (prompt) => {
    // Get your API key from storage
    const key = await getKey();
    const url = 'https://api.openai.com/v1/completions';

    // Call completions endpoint
    const completionResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 1250,
            temperature: 0.7,
        }),
    });

    // Select the top choice and send back
    const completion = await completionResponse.json();
    return completion.choices.pop();
}

const generateCompletionAction = async (info) => {
    try {
        const { selectionText } = info;
                 const basePromptPrefix = `
              Write a detailed note on the following topic.
          
              Topic:
              `;
                const baseCompletion = await generate(`${basePromptPrefix}${selectionText}`);
                console.log(baseCompletion.text) 
        const gptText = 'A sample Response';
        var newURL = 'output_nfohfa.html';
        //var newURL = 'https://www.google.com';
        let tab = await chrome.tabs.create({ url: newURL });
        //sendMessage(secondPromptCompletion.text);
        console.log('creating a new tab')
        console.log(tab)
        sendMessage(selectionText, baseCompletion.text, tab.id);    
        //sendMessage(selectionText, gptText, tab.id);             
    } catch (error) {
        console.log("in catch section")
        console.log(error);
    }
};

// Add this in scripts/contextMenuServiceWorker.js
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'context-run',
        title: 'Explain with GPT3',
        contexts: ['selection'],
    });
});

// Add listener
chrome.contextMenus.onClicked.addListener(generateCompletionAction);