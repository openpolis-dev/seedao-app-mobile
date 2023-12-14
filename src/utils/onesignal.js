import OneSignal from "react-onesignal";
import getConfig from "constant/envCofnig";

export default function runOneSignal() {
  if (window.INITIAL_ONESIGNAL) {
    return;
  }
  const app_id = getConfig().REACT_APP_ONESIGNAL_ID;
  console.log("app_id:", app_id);
  try {
    OneSignal.init({ appId: app_id });
    OneSignal.Slidedown.promptPush();
    window.INITIAL_ONESIGNAL = true;
  } catch (error) {
    console.error("init onesignal error:", error);
  }
}
