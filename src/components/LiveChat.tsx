import React, { useEffect } from 'react';
import { toast } from "sonner";

declare global {
  interface Window {
    Comm100API?: any;
  }
}

export const LiveChat = () => {
  useEffect(() => {
    try {
      // Create the button div
      const buttonDiv = document.createElement('div');
      buttonDiv.id = 'comm100-button-95a8c67f-e571-44e4-9fe7-91314f222ed3';
      document.body.appendChild(buttonDiv);

      // Initialize Comm100API with CORS handling
      window.Comm100API = window.Comm100API || {};
      
      // Create and append the script with error handling
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true; // Add async loading
      script.crossOrigin = 'anonymous'; // Add CORS support
      script.innerHTML = `
        var Comm100API=Comm100API||{};(function(t){function e(e){var a=document.createElement("script"),c=document.getElementsByTagName("script")[0];a.type="text/javascript",a.async=!0,a.crossOrigin="anonymous",a.src=e+t.site_id,c.parentNode.insertBefore(a,c)}t.chat_buttons=t.chat_buttons||[],t.chat_buttons.push({code_plan:"95a8c67f-e571-44e4-9fe7-91314f222ed3",div_id:"comm100-button-95a8c67f-e571-44e4-9fe7-91314f222ed3"}),t.site_id=90005231,t.main_code_plan="95a8c67f-e571-44e4-9fe7-91314f222ed3",e("https://vue.comm100.com/livechat.ashx?siteId="),setTimeout(function(){t.loaded||e("https://standby.comm100vue.com/livechat.ashx?siteId=")},5e3)})(Comm100API||{})
      `.trim(); // Trim whitespace

      // Add error handling for script loading
      script.onerror = (error) => {
        console.error('LiveChat script loading error:', error);
        toast.error('Canlı destek yüklenirken bir hata oluştu');
      };

      document.body.appendChild(script);

      // Cleanup function
      return () => {
        try {
          if (buttonDiv.parentNode) {
            buttonDiv.parentNode.removeChild(buttonDiv);
          }
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        } catch (cleanupError) {
          console.error('LiveChat cleanup error:', cleanupError);
        }
      };
    } catch (error) {
      console.error('LiveChat initialization error:', error);
      toast.error('Canlı destek başlatılırken bir hata oluştu');
    }
  }, []);

  return null;
};