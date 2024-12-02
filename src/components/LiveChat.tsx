import React, { useEffect } from 'react';

declare global {
  interface Window {
    Comm100API?: any;
  }
}

export const LiveChat = () => {
  useEffect(() => {
    // Create the button div
    const buttonDiv = document.createElement('div');
    buttonDiv.id = 'comm100-button-95a8c67f-e571-44e4-9fe7-91314f222ed3';
    document.body.appendChild(buttonDiv);

    // Initialize Comm100API
    window.Comm100API = window.Comm100API || {};
    
    // Create and append the script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      var Comm100API=Comm100API||{};(function(t){function e(e){var a=document.createElement("script"),c=document.getElementsByTagName("script")[0];a.type="text/javascript",a.async=!0,a.src=e+t.site_id,c.parentNode.insertBefore(a,c)}t.chat_buttons=t.chat_buttons||[],t.chat_buttons.push({code_plan:"95a8c67f-e571-44e4-9fe7-91314f222ed3",div_id:"comm100-button-95a8c67f-e571-44e4-9fe7-91314f222ed3"}),t.site_id=90005231,t.main_code_plan="95a8c67f-e571-44e4-9fe7-91314f222ed3",e("https://vue.comm100.com/livechat.ashx?siteId="),setTimeout(function(){t.loaded||e("https://standby.comm100vue.com/livechat.ashx?siteId=")},5e3)})(Comm100API||{})
    `;
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      document.body.removeChild(buttonDiv);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
};